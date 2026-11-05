import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LogoLoop (React Bits) — marquee continuo de nodos React, restyleado a AR.
 */
export function LogoLoop({
  logos,
  speed = 40,
  direction = "left",
  gap = 12,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = "var(--background)",
  className = "",
}: {
  logos: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  // Arranca oculto: recién mostramos el marquee (y largamos la animación)
  // una vez que el ancho real ya está resuelto. Antes de eso, cada imagen
  // suelta que termina de cargar (más notorio en un host/CDN más lento)
  // cambia el ancho del track a mitad de la animación, y el navegador
  // reinterpreta cuánto recorrido lleva con la nueva duración: se ve como
  // un salto o traba. Mostrar recién cuando ya está estable evita eso.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let lastWidth = 0;
    const measure = () => {
      const w = el.scrollWidth / 2;
      if (w <= 0) return;
      if (Math.abs(w - lastWidth) < 1) return;
      lastWidth = w;
      setDuration(w / Math.max(speed, 1));
    };

    const imgs = Array.from(el.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);
    const waits = pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    );

    let active = true;
    const show = () => {
      if (!active) return;
      measure();
      setReady(true);
    };
    measure();
    // Una imagen lenta no debe mantener el carrusel invisible indefinidamente.
    const timeout = window.setTimeout(show, 2000);
    Promise.all(waits).then(show);

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      ro.disconnect();
    };
  }, [speed, logos.length]);

  const items = [...logos, ...logos];

  return (
    <div className={`logo-loop relative overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className={`logo-loop-track flex w-max ${pauseOnHover ? "logo-loop-pausable" : ""}`}
        style={{
          gap: `${gap}px`,
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          // Solo forzamos "paused" mientras carga; una vez lista se lo
          // dejamos a la regla CSS de :hover (si fijáramos "running" acá,
          // por especificidad ganaría siempre a la pausa por hover).
          animationPlayState: ready ? undefined : "paused",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      >
        {items.map((node, i) => (
          <div key={i} className="shrink-0" aria-hidden={i >= logos.length ? true : undefined}>
            {node}
          </div>
        ))}
      </div>
      {fadeOut && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20"
            style={{ background: `linear-gradient(to right, ${fadeOutColor}, transparent)` }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20"
            style={{ background: `linear-gradient(to left, ${fadeOutColor}, transparent)` }}
          />
        </>
      )}
    </div>
  );
}
