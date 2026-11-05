import { useEffect, useId, useRef, useState } from "react";

/**
 * Robotito de IA de la navbar (marca de "Soluciones"): cuerpo redondeado con
 * degradé en tonos de rojo (que se destaque contra el fondo oscuro de la
 * barra) y ojos que brillan. Flota todo el tiempo y, seguido, hace un gesto
 * al azar: parpadea, guiña un ojo, mira a un lado, salta (a veces dos veces),
 * gira, da una vuelta, tiembla, baila, se inclina o se sorprende. Nunca repite
 * el mismo gesto dos veces seguidas.
 *
 * Además reacciona a la persona: los ojos siguen al cursor (mientras más cerca,
 * más gira la mirada), al pasarle el mouse se alegra (salta, se agranda un poco
 * y brilla más) y con un clic da una vuelta. Los movimientos son CSS (ver
 * `.robot-*` en styles.css); acá solo se elige cuál y cuándo. Con "reducir
 * movimiento" queda quieto. `label` es el texto para lectores de pantalla.
 */

const GESTOS = [
  { name: "parpadeo", ms: 420 },
  { name: "parpadeo-doble", ms: 800 },
  { name: "guino-izq", ms: 800 },
  { name: "guino-der", ms: 800 },
  { name: "mira-izq", ms: 1000 },
  { name: "mira-der", ms: 1000 },
  { name: "salto", ms: 750 },
  { name: "salto-doble", ms: 1300 },
  { name: "giro", ms: 900 },
  { name: "vuelta", ms: 800 },
  { name: "tiembla", ms: 650 },
  { name: "baila", ms: 1500 },
  { name: "inclina", ms: 1000 },
  { name: "sorpresa", ms: 900 },
] as const;

export function RobotBadge({ label, className = "" }: { label: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [gesto, setGesto] = useState<string | null>(null);
  const [alegre, setAlegre] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Los ojos siguen al cursor: se escribe en variables CSS (sin re-renderizar) y a lo sumo una vez por cuadro.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = svgRef.current;
    if (!svg) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const aplicar = () => {
      raf = 0;
      const r = svg.getBoundingClientRect();
      if (r.width === 0) return; // oculto (p. ej. el menú del celular cerrado)
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 240); // lejos mira de lleno; cerca, apenas
      svg.style.setProperty("--ox", ((dx / dist) * k * 5).toFixed(2));
      svg.style.setProperty("--oy", ((dy / dist) * k * 3.5).toFixed(2));
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(aplicar);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    let last = "";
    const siguiente = () => {
      // Pausa al azar entre gestos; el primero llega pronto para que se note.
      timer = setTimeout(
        () => {
          let g = GESTOS[Math.floor(Math.random() * GESTOS.length)]!;
          while (g.name === last) g = GESTOS[Math.floor(Math.random() * GESTOS.length)]!;
          last = g.name;
          setGesto(g.name);
          timer = setTimeout(() => {
            setGesto(null);
            siguiente();
          }, g.ms);
        },
        last === "" ? 400 : 350 + Math.random() * 1250,
      );
    };
    siguiente();
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={`inline-flex items-center ${className}`}
      onPointerEnter={() => {
        setAlegre(true);
        setGesto((g) => g ?? "salto");
      }}
      onPointerLeave={() => setAlegre(false)}
      onClick={() => {
        setGesto("giro");
        clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => setGesto(null), 900);
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        aria-hidden="true"
        data-gesto={gesto ?? undefined}
        data-alegre={alegre}
        className="robot h-6 w-6 overflow-visible"
      >
        <defs>
          <linearGradient id={`${id}-body`} x1="0.05" y1="0.05" x2="0.95" y2="0.95">
            <stop offset="0" stopColor="#ff6b57" />
            <stop offset="0.35" stopColor="#ff1f2d" />
            <stop offset="0.7" stopColor="#e00012" />
            <stop offset="1" stopColor="#b8000f" />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-80%" y="-60%" width="260%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <g className="robot-cuerpo">
          <g className="robot-gesto">
            {/* Antena con foco que late */}
            <line
              x1="50"
              y1="12"
              x2="50"
              y2="3"
              stroke="#ffffff"
              strokeOpacity="0.75"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <g className="robot-bulbo">
              <circle cx="50" cy="1.5" r="7" fill="#ff1a2a" filter={`url(#${id}-glow)`} />
              <circle cx="50" cy="1.5" r="4.2" fill="#ffffff" />
            </g>
            <rect
              x="8"
              y="10"
              width="84"
              height="82"
              rx="30"
              fill={`url(#${id}-body)`}
              stroke="#ffffff"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            <path
              d="M16 38C16 22 28 13 44 13H58C40 22 28 36 22 58C18 52 16 46 16 38Z"
              fill={`url(#${id}-shine)`}
            />
            <g className="robot-mirada">
              <g className="robot-ojos">
                <g className="robot-ojo robot-ojo-izq">
                  <rect
                    x="30"
                    y="38"
                    width="10"
                    height="23"
                    rx="5"
                    fill="#ff1a2a"
                    filter={`url(#${id}-glow)`}
                  />
                  <rect x="30" y="38" width="10" height="23" rx="5" fill="#ffffff" />
                </g>
                <g className="robot-ojo robot-ojo-der">
                  <rect
                    x="60"
                    y="38"
                    width="10"
                    height="23"
                    rx="5"
                    fill="#ff1a2a"
                    filter={`url(#${id}-glow)`}
                  />
                  <rect x="60" y="38" width="10" height="23" rx="5" fill="#ffffff" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
