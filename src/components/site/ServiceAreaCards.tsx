import { useEffect, useRef, useState } from "react";
import { Bot, Database, Code2, Users2, ChevronDown, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import type { ServiceGroup } from "@/i18n/content";

/**
 * "Qué hacemos" en 2 niveles, todo con cards (pedido puntual de gerencia):
 *  1. 4 cards grandes, una por área — es todo lo que se ve al entrar.
 *  2. Al clickear una de esas cards, se despliega un panel horizontal
 *     ocupando el ancho completo, debajo de la fila de las 4 cards, con los
 *     servicios de esa área en columnas.
 *
 * Las cards y el panel quedan como piezas SEPARADAS: la card activa tiene
 * una "ficha" triangular que sobresale de su propio borde inferior
 * apuntando hacia abajo (como una llave/plug), y el panel tiene la ranura
 * complementaria cortada en su borde superior (apuntando hacia adentro,
 * como un enchufe) a la misma posición horizontal — dan la sensación de
 * un posible encastre sin llegar a tocarse (boceto de gerencia).
 *
 * La ranura del panel es un `clip-path: polygon(...)` real (no un dibujo
 * encima de un rectángulo sólido — eso fue el primer intento y no
 * servía, quedaba flotando como un agregado). Como clip-path no dibuja
 * borde a lo largo del corte, se traza aparte con un <svg> (solo el
 * trazo, sin relleno) sobre las mismas coordenadas.
 *
 * La ficha de la card, en cambio, tiene que sobresalir MÁS ALLÁ del
 * rectángulo (no un corte hacia adentro), así que no puede vivir dentro
 * de la propia card sin agrandar su caja y romper el alto de la fila del
 * grid. Se resuelve con un elemento aparte (mismo relleno y borde que la
 * card, para que se vea como continuación de su contorno) posicionado
 * justo debajo, con "overflow visible" en el contenedor.
 *
 * La posición horizontal de la ranura del panel se mide a mano (con
 * getBoundingClientRect) porque la columna de la card activa cambia según
 * breakpoint (1/2/4 columnas); la ficha de la card en cambio va siempre
 * centrada en su propio ancho.
 */

const NOTCH_HALF = 14;
// Menor al gap entre cards (gap-4 = 16px) para que la ficha no invada la
// fila de abajo cuando la grilla tiene 2 o más filas (breakpoint "sm").
const NOTCH_DEPTH = 12;

const GROUP_ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  data: Database,
  engineering: Code2,
  teams: Users2,
};

function panelNotchGeometry(width: number, height: number, cx: number) {
  const apexY = NOTCH_DEPTH;
  const clipPath = `polygon(0 0, ${cx - NOTCH_HALF}px 0, ${cx}px ${apexY}px, ${cx + NOTCH_HALF}px 0, 100% 0, 100% 100%, 0 100%)`;
  const strokeD = `M${cx - NOTCH_HALF},0 L${cx},${apexY} L${cx + NOTCH_HALF},0`;
  return { clipPath, strokeD, width, height };
}

function NotchStroke({
  width,
  height,
  strokeD,
}: {
  width: number;
  height: number;
  strokeD: string;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={strokeD}
        fill="none"
        stroke="var(--color-primary)"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Se solapa unos px hacia arriba, tapando ese tramo del borde inferior de
// la card (mismo color de relleno) para que no quede una línea horizontal
// "cerrando" la ficha por arriba — el trazo rojo solo marca los dos lados
// diagonales, arrancando justo en el borde real de la card.
const TAB_OVERLAP = 3;

/** Ficha triangular que sobresale del borde inferior de la card activa. */
function CardTab() {
  const w = NOTCH_HALF * 2;
  const h = NOTCH_DEPTH + TAB_OVERLAP;
  return (
    <svg
      // Sin pointer-events-none: necesita poder recibir hover (para heredar
      // el :hover del botón contenedor y encender el group-hover de abajo).
      // No tiene onClick propio, así que sigue sin interferir con el click
      // de la card.
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: `calc(100% - ${TAB_OVERLAP}px)` }}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <path d={`M0,0 L${w},0 L${NOTCH_HALF},${h} Z`} fill="var(--color-card)" />
      {/* Mismo tono que el glow de SpotlightCard; sin seguir el cursor
          (evita el desacople entre elementos separados que ya dio
          problemas antes), solo se enciende con el :hover heredado del
          botón contenedor — así no queda "apagada" al pasar el mouse. */}
      <path
        d={`M0,0 L${w},0 L${NOTCH_HALF},${h} Z`}
        fill="rgba(255, 0, 13, 0.12)"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <path
        d={`M0,${TAB_OVERLAP} L${NOTCH_HALF},${h} L${w},${TAB_OVERLAP}`}
        fill="none"
        stroke="var(--color-primary)"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function ServiceAreaCards({ groups }: { groups: ServiceGroup[] }) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [panelMetrics, setPanelMetrics] = useState<{
    width: number;
    height: number;
    notchX: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = (id: string) => setActiveGroupId((cur) => (cur === id ? null : id));
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  useEffect(() => {
    const updateMetrics = () => {
      const grid = gridRef.current;
      const card = activeGroupId ? cardRefs.current[activeGroupId] : null;
      const panel = panelRef.current;
      if (!grid || !card || !panel) {
        setPanelMetrics(null);
        return;
      }
      const gridRect = grid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      setPanelMetrics({
        width: panelRect.width,
        height: panelRect.height,
        notchX: cardRect.left - gridRect.left + cardRect.width / 2,
      });
    };
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [activeGroupId]);

  return (
    <div>
      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.id] ?? Bot;
          const isActive = activeGroupId === group.id;
          return (
            <button
              key={group.id}
              ref={(el) => {
                cardRefs.current[group.id] = el;
              }}
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={isActive}
              aria-controls="service-panel"
              className="group relative overflow-visible text-left"
            >
              <SpotlightCard
                as="div"
                className={`h-full rounded-2xl border p-6 transition-colors duration-300 ease-out ${
                  isActive
                    ? "border-primary/40 bg-card"
                    : "border-border bg-card hover:border-white/25"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <Icon
                    className={`h-7 w-7 ${isActive ? "text-primary/70" : "text-muted-foreground"}`}
                    strokeWidth={1.75}
                  />
                  <ChevronDown
                    className={`h-6 w-6 shrink-0 transition-transform duration-300 ${
                      isActive ? "rotate-180 text-primary/70" : "text-muted-foreground"
                    }`}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
              </SpotlightCard>
              {isActive && <CardTab />}
            </button>
          );
        })}
      </div>

      <div
        id="service-panel"
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          activeGroup ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {activeGroup &&
            (() => {
              const panelNotch = panelMetrics
                ? panelNotchGeometry(panelMetrics.width, panelMetrics.height, panelMetrics.notchX)
                : null;
              return (
                <div ref={panelRef} className="relative">
                  <SpotlightCard
                    key={activeGroup.id}
                    as="div"
                    className="animate-in fade-in-0 slide-in-from-top-8 rounded-2xl border border-primary/40 bg-card p-6 duration-700 motion-reduce:animate-none sm:p-8"
                    style={panelNotch ? { clipPath: panelNotch.clipPath } : undefined}
                  >
                    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      {activeGroup.items.map((item) => (
                        <div key={item.title}>
                          <h4 className="font-semibold text-primary">{item.title}</h4>
                          <p className="mt-1.5 leading-relaxed text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {activeGroup.items[0] && (
                      <a
                        href={activeGroup.items[0].href}
                        className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                      >
                        {activeGroup.items[0].cta} →
                      </a>
                    )}
                  </SpotlightCard>
                  {panelNotch && (
                    <NotchStroke
                      width={panelNotch.width}
                      height={panelNotch.height}
                      strokeD={panelNotch.strokeD}
                    />
                  )}
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
