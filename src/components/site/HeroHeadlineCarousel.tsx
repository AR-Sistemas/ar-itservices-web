import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * Titular del hero rotando entre varias frases: autoplay + swipe lateral
 * (drag con mouse/touch) + puntos de navegación. Todas las frases se montan
 * apiladas en la misma celda de grid (grid-area 1/1) para que el contenedor
 * quede del alto de la más larga sin saltos de layout al cambiar.
 *
 * Cada frase puede marcar la parte a resaltar en rojo envolviéndola entre
 * `**dobles asteriscos**`, ej: "somos **empresas nativas de IA** de verdad".
 *
 * Interacciones:
 *  - Autoplay + swipe lateral (arrastrando con mouse/touch) + puntos.
 *  - Rueda del mouse sobre el titular: cambia de frase. Cuando ya está en la
 *    primera/última frase, deja pasar el scroll para que la página siga bajando.
 *  - El texto no es seleccionable, para que el arrastre no marque las palabras.
 */
function renderHighlighted(phrase: string) {
  const parts = phrase.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = /^\*\*([^*]+)\*\*$/.exec(part);
    if (!match) return <span key={i}>{part}</span>;
    return (
      <span key={i} className="text-primary">
        {match[1]}
      </span>
    );
  });
}
export function HeroHeadlineCarousel({
  phrases,
  intervalMs = 5500,
  className = "",
}: {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const dragRef = useRef<{ x: number; dragging: boolean } | null>(null);
  const reducedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(0);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const n = phrases.length;
      const wrapped = ((next % n) + n) % n;
      setDir(wrapped >= index || index === n - 1 ? 1 : -1);
      setIndex(wrapped);
    },
    [index, phrases.length],
  );

  useEffect(() => {
    if (reducedRef.current || paused || phrases.length < 2) return;
    const id = setInterval(() => goTo(index + 1), intervalMs);
    return () => clearInterval(id);
  }, [index, paused, intervalMs, phrases.length, goTo]);

  // Rueda del mouse: navega entre frases mientras haya una en esa dirección.
  // En la primera/última frase no intercepta, así el scroll de la página fluye.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || phrases.length < 2) return;

    const onWheel = (e: WheelEvent) => {
      // Ignoramos gestos horizontales (trackpad) y deltas mínimos.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = index === 0;
      const atEnd = index === phrases.length - 1;
      if ((e.deltaY > 0 && atEnd) || (e.deltaY < 0 && atStart)) return;

      e.preventDefault();

      const now = Date.now();
      if (now - wheelLockRef.current < 650) return;
      wheelLockRef.current = now;
      goTo(index + (e.deltaY > 0 ? 1 : -1));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [index, goTo, phrases.length]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, dragging: true };
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) < 40) return;
    goTo(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      ref={containerRef}
      className={`relative touch-pan-y select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragRef.current = null)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Frases destacadas"
    >
      <div className="grid cursor-grab active:cursor-grabbing">
        {phrases.map((phrase, i) => (
          <h1
            key={phrase}
            className="col-start-1 row-start-1 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance transition-all duration-500 ease-out sm:text-6xl"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "translateX(0)" : `translateX(${dir * 24}px)`,
              pointerEvents: i === index ? "auto" : "none",
            }}
            aria-hidden={i !== index}
          >
            {renderHighlighted(phrase)}
          </h1>
        ))}
      </div>

      {phrases.length > 1 && (
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Elegir frase"
        >
          {phrases.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-label={`Frase ${i + 1} de ${phrases.length}`}
              onClick={() => goTo(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-300 ${
                index === i ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
