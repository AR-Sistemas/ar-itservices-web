import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

/**
 * Animación del framework ARIA: los 9 bloques se encienden de a uno, en el
 * mismo orden que los pasos de "Cómo se articulan los 9 bloques" (1 = núcleo EA,
 * 2 a 9 = anillo en sentido horario). Al terminar queda el sistema completo con
 * pulsos de datos fluyendo y vuelve a empezar.
 *
 * `step` va de 0 (vacío) a 9 (último bloque) y 10 = sistema completo. Si el
 * padre no lo controla, la animación avanza sola mientras está a la vista.
 */

export const ARIA_BLOCKS = 9;
const SYSTEM_STEP = ARIA_BLOCKS + 1;

type Block = { sig: string; x: number; y: number; color: string };

// Orden = número de paso (1 = núcleo EA, 2 a 9 = anillo en sentido horario).
const BLOCKS: Block[] = [
  { sig: "EA", x: 600, y: 450, color: "#ff3b43" },
  { sig: "GL", x: 600, y: 150, color: "#e6e8ec" },
  { sig: "PR", x: 812, y: 238, color: "#e6e8ec" },
  { sig: "DA", x: 900, y: 450, color: "#e6e8ec" },
  { sig: "IN", x: 812, y: 662, color: "#e6e8ec" },
  { sig: "KS", x: 600, y: 750, color: "#e6e8ec" },
  { sig: "IC", x: 388, y: 662, color: "#e6e8ec" },
  { sig: "GC", x: 300, y: 450, color: "#e6e8ec" },
  { sig: "PM", x: 388, y: 238, color: "#e6e8ec" },
];

const RING = BLOCKS.slice(1);
const RING_PATH = `M ${RING.map((b) => `${b.x} ${b.y}`).join(" L ")} Z`;

const LABEL = {
  ES: "Framework ARIA: nueve bloques que se encienden uno a uno y terminan operando como un sistema integrado alrededor de un núcleo estratégico",
  EN: "ARIA framework: nine blocks that light up one by one and end up working as an integrated system around a strategic core",
};

const STEP_MS = 1500;
const START_MS = 700;
const SYSTEM_MS = 5000;

/**
 * Avanza solo 0 → 1…9 → 10 mientras `active`; `hold` fija un paso (hover en la lista).
 * - `loop` (por defecto sí): al llegar al sistema completo vuelve a empezar. Sin loop se
 *   queda en el cuadro final y solo se repite cuando la persona sale de la sección y vuelve.
 * - `durationFor`: cuánto dura cada paso (p. ej. según el largo del texto, para dar
 *   tiempo de lectura).
 */
export function useAriaStep(
  active: boolean,
  hold: number | null = null,
  options: { loop?: boolean; durationFor?: (step: number) => number } = {},
) {
  const { loop = true, durationFor } = options;
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sin loop, al salir de la sección se rebobina: al volver se ve de nuevo desde el principio.
    if (!active && !loop) setStep(0);
  }, [active, loop]);

  useEffect(() => {
    if (!active || hold !== null) return;
    if (!loop && step >= SYSTEM_STEP) return;
    const wait =
      step === 0 ? START_MS : step === SYSTEM_STEP ? SYSTEM_MS : (durationFor?.(step) ?? STEP_MS);
    const id = window.setTimeout(() => setStep((s) => (s >= SYSTEM_STEP ? 0 : s + 1)), wait);
    return () => window.clearTimeout(id);
  }, [active, hold, step, loop, durationFor]);

  return hold ?? step;
}

/** Detecta si el elemento está a la vista y si la persona pidió reducir el movimiento. */
export function useAriaPlayback() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pestaña en segundo plano: no se avanza ni se hace scroll.
  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState !== "hidden");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      // La lista completa puede ser más alta que el viewport; exigir 20 % de
      // intersección la pausaba justamente mientras el auto-scroll avanzaba.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, active: visible && tabVisible && !reduceMotion, reduceMotion };
}

export function AriaFramework({
  step: controlledStep,
  className = "",
}: {
  /** 0 a 10 (10 = sistema completo). Sin valor, se anima sola. */
  step?: number;
  className?: string;
}) {
  const { lang } = useLang();
  const { ref, active, reduceMotion } = useAriaPlayback();
  const autoStep = useAriaStep(active && controlledStep === undefined);
  const step = reduceMotion ? SYSTEM_STEP : (controlledStep ?? autoStep);
  const system = step >= SYSTEM_STEP;

  // Nombre completo del bloque en pantalla: las siglas solas no dicen qué es cada uno.
  // Los títulos de las funcionalidades de ARIA ("EA · Estrategia + IA") siguen el mismo orden.
  const names =
    getContent(lang)
      .solutions.products.find((p) => p.id === "aria")
      ?.features.map((f) => f.title) ?? [];
  const caption = system
    ? lang === "EN"
      ? "ARIA · the 9 blocks working as one system"
      : "ARIA · los 9 bloques funcionando como un sistema"
    : step >= 1
      ? names[step - 1]
      : "";

  return (
    <div ref={ref} className={`mx-auto w-full ${className}`}>
      <svg
        viewBox="0 0 820 820"
        role="img"
        aria-label={LABEL[lang === "EN" ? "EN" : "ES"]}
        className="arf-root block h-auto w-full"
      >
        <style>{CSS}</style>
        <defs>
          <linearGradient id="arf-grad-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6e8ec" />
            <stop offset="0.5" stopColor="#9aa0a9" />
            <stop offset="1" stopColor="#4a4d57" />
          </linearGradient>
          <linearGradient id="arf-grad-nucleo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3b43" />
            <stop offset="0.5" stopColor="#ff000d" />
            <stop offset="1" stopColor="#990f1b" />
          </linearGradient>
          <radialGradient id="arf-grad-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff000d" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ff000d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform="translate(-190 -40)">
          {/* Resplandor del núcleo: crece a medida que se suman bloques */}
          <circle
            cx="600"
            cy="450"
            r="430"
            fill="url(#arf-grad-glow)"
            className="arf-glow"
            style={{ opacity: step === 0 ? 0 : 0.25 + Math.min(step, 9) * 0.075 }}
          />

          {/* Anillo que cierra el sistema */}
          <path d={RING_PATH} className="arf-ring" pathLength={1} data-on={system} />
          <path d={RING_PATH} className="arf-ring-flow" pathLength={1} data-on={system} />

          {/* Fantasmas: se ve de entrada que son 9 bloques */}
          {RING.map((b) => (
            <rect
              key={`g-${b.sig}`}
              x={b.x - 75}
              y={b.y - 75}
              width="150"
              height="150"
              rx="34"
              className="arf-ghost"
            />
          ))}

          {/* Conexiones núcleo → bloque */}
          {RING.map((b, i) => {
            const on = step >= i + 2;
            return (
              <g key={`c-${b.sig}`}>
                <line
                  x1="600"
                  y1="450"
                  x2={b.x}
                  y2={b.y}
                  pathLength={1}
                  stroke={b.color}
                  className="arf-conn"
                  data-on={on}
                />
                <line
                  x1="600"
                  y1="450"
                  x2={b.x}
                  y2={b.y}
                  pathLength={1}
                  className="arf-pulso"
                  style={{ animationDelay: `${(i % 4) * -0.5}s` }}
                  data-on={system}
                />
              </g>
            );
          })}

          {/* Bloques del anillo */}
          {RING.map((b, i) => {
            const n = i + 2;
            const on = step >= n;
            const current = step === n;
            return (
              <g
                key={b.sig}
                className="arf-bloque"
                data-on={on}
                data-current={current}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              >
                <rect
                  x={b.x - 75}
                  y={b.y - 75}
                  width="150"
                  height="150"
                  rx="34"
                  fill="url(#arf-grad-metal)"
                  stroke={b.color}
                  strokeWidth="6"
                />
                <rect
                  x={b.x - 75}
                  y={b.y - 75}
                  width="150"
                  height="150"
                  rx="34"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="6"
                  className="arf-actual"
                />
                <text x={b.x} y={b.y} className="arf-sig">
                  {b.sig}
                </text>
                <Badge n={n} cx={b.x + 70} cy={b.y - 70} />
              </g>
            );
          })}

          {/* Núcleo estratégico EA (paso 1) */}
          <g
            className="arf-bloque arf-nucleo"
            data-on={step >= 1}
            data-current={step === 1}
            style={{ transformOrigin: "600px 450px" }}
          >
            <rect x="485" y="335" width="230" height="230" rx="62" fill="#990f1b" opacity="0.35" />
            <g
              className={system ? "arf-latido" : undefined}
              style={{ transformOrigin: "600px 450px" }}
            >
              <rect x="515" y="365" width="170" height="170" rx="40" fill="url(#arf-grad-nucleo)" />
              <rect
                x="515"
                y="365"
                width="170"
                height="170"
                rx="40"
                fill="none"
                stroke="#ffffff"
                strokeWidth="6"
                className="arf-actual"
              />
              <text x="600" y="450" className="arf-sig arf-sig-nucleo">
                EA
              </text>
            </g>
            <Badge n={1} cx={684} cy={366} />
          </g>
        </g>
      </svg>
      <p
        aria-hidden="true"
        className="mt-3 min-h-7 text-center font-mono text-sm tracking-wide text-brand-text"
      >
        {caption}
      </p>
    </div>
  );
}

function Badge({ n, cx, cy }: { n: number; cx: number; cy: number }) {
  return (
    <g className="arf-badge">
      <circle cx={cx} cy={cy} r="24" />
      <text x={cx} y={cy}>
        {n}
      </text>
    </g>
  );
}

const CSS = `
.arf-sig { font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 44px; fill: #14131c; text-anchor: middle; dominant-baseline: central; }
.arf-sig-nucleo { font-size: 56px; fill: #ffffff; }
.arf-ghost { fill: none; stroke: #ffffff; stroke-opacity: .14; stroke-width: 3; stroke-dasharray: 10 12; }
.arf-glow { transition: opacity .8s ease; }

.arf-conn { fill: none; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset .7s ease-out, opacity .3s ease; }
.arf-conn[data-on="true"] { stroke-dashoffset: 0; opacity: 1; }

.arf-pulso { fill: none; stroke: #ffffff; stroke-width: 6; stroke-linecap: round; stroke-dasharray: .09 .91; opacity: 0; transition: opacity .6s ease; }
.arf-pulso[data-on="true"] { opacity: 1; animation: arf-flow 2.4s linear infinite; }

.arf-ring { fill: none; stroke: #ffffff; stroke-opacity: .22; stroke-width: 4; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-out; }
.arf-ring[data-on="true"] { stroke-dashoffset: 0; }
.arf-ring-flow { fill: none; stroke: #ff6b72; stroke-width: 5; stroke-linecap: round; stroke-dasharray: .05 .95; opacity: 0; transition: opacity .6s ease; }
.arf-ring-flow[data-on="true"] { opacity: .9; animation: arf-flow 6s linear infinite; }

.arf-bloque { opacity: 0; transform: scale(.55); transition: opacity .35s ease, transform .6s cubic-bezier(.34, 1.56, .64, 1); }
.arf-bloque[data-on="true"] { opacity: 1; transform: scale(1); }
.arf-bloque[data-current="true"] { transform: scale(1.1); }

.arf-actual { opacity: 0; transition: opacity .3s ease; }
.arf-bloque[data-current="true"] .arf-actual { opacity: 1; animation: arf-actual 1.2s ease-in-out infinite; }

.arf-badge circle { fill: #14131c; stroke: #ffffff; stroke-opacity: .85; stroke-width: 3; }
.arf-badge text { font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 26px; fill: #ffffff; text-anchor: middle; dominant-baseline: central; }

.arf-latido { animation: arf-latido 2.5s ease-in-out infinite; }

@keyframes arf-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1; } }
@keyframes arf-latido { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes arf-actual { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .arf-root * { animation: none !important; transition: none !important; }
  .arf-pulso, .arf-ring-flow { display: none; }
}
`;
