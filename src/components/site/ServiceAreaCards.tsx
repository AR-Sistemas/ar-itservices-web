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
 * Reemplaza el modal "a pantalla completa" (card despegándose al frente)
 * por este desplegable horizontal, a pedido de gerencia.
 *
 * El "bridge" (puente) que fusiona visualmente la card activa con el panel
 * se posiciona a mano (mide la card con getBoundingClientRect) porque su
 * columna cambia según breakpoint (1/2/4 columnas) y no hay forma de
 * expresar eso solo con CSS. La card activa pierde el borde/redondeo
 * inferior y el puente (mismo ancho, mismo borde lateral rojo, mismo
 * fondo) tapa el hueco, dando la sensación de una sola pieza continua.
 * Cuando la card activa queda pegada al borde izq/der de la grilla, el
 * puente redondea esa esquina inferior con el mismo radio del panel para
 * no generar un "diente" contra la esquina redondeada de este último.
 *
 * Ojo con el glow: `SpotlightCard` sigue al cursor DENTRO de un solo
 * elemento. Card activa + puente + panel son 3 elementos separados, así
 * que si cada uno tiene su propio glow "independiente" (cada uno con su
 * propio listener de mouse), al cruzar la costura se ven como 3 luces que
 * reaccionan de forma descoordinada entre sí — peor que no tener nada.
 * Los patrones de accordion/tabs reales resuelven esto sin intentar
 * sincronizar un spotlight interactivo entre elementos: una vez que el
 * elemento pasa a estado "activo/expandido" dejan de perseguir el
 * cursor y muestran un tinte fijo y parejo. Por eso acá el spotlight que
 * sigue al mouse queda solo para las cards SIN abrir (invita a hacer
 * click); la card activa + el puente + el panel comparten en cambio un
 * tinte rojo parejo y estático (`STATIC_TINT`), sin JS ni listeners, así
 * no hay nada que sincronizar ni que pueda quedar desalineado.
 */

const GAP_PX = 16; // debe coincidir con el `mt-4` del panel
const BRIDGE_OVERLAP_PX = 2;
const EDGE_EPSILON_PX = 1;
const STATIC_TINT = "pointer-events-none absolute inset-0 bg-primary/[0.06]";

const GROUP_ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  data: Database,
  engineering: Code2,
  teams: Users2,
};

export function ServiceAreaCards({ groups }: { groups: ServiceGroup[] }) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [bridge, setBridge] = useState<{
    left: number;
    width: number;
    top: number;
    atLeftEdge: boolean;
    atRightEdge: boolean;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = (id: string) => setActiveGroupId((cur) => (cur === id ? null : id));
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  useEffect(() => {
    const updateBridge = () => {
      const wrapper = wrapperRef.current;
      const grid = gridRef.current;
      const card = activeGroupId ? cardRefs.current[activeGroupId] : null;
      if (!wrapper || !grid || !card) {
        setBridge(null);
        return;
      }
      const wrapperRect = wrapper.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      setBridge({
        left: cardRect.left - wrapperRect.left,
        width: cardRect.width,
        top: gridRect.bottom - wrapperRect.top,
        atLeftEdge: cardRect.left - gridRect.left <= EDGE_EPSILON_PX,
        atRightEdge: gridRect.right - cardRect.right <= EDGE_EPSILON_PX,
      });
    };
    updateBridge();
    window.addEventListener("resize", updateBridge);
    return () => window.removeEventListener("resize", updateBridge);
  }, [activeGroupId]);

  return (
    <div ref={wrapperRef} className="relative">
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
              className="text-left"
            >
              {isActive ? (
                <div className="relative h-full overflow-hidden rounded-2xl rounded-b-none border border-b-0 border-primary/40 bg-card p-6">
                  <span className={STATIC_TINT} aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-3">
                    <Icon className="h-7 w-7 text-primary/70" strokeWidth={1.75} />
                    <ChevronDown
                      className="h-6 w-6 shrink-0 rotate-180 text-primary/70 transition-transform duration-300"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="relative mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
                </div>
              ) : (
                <SpotlightCard
                  as="div"
                  className="h-full rounded-2xl border border-border bg-card p-6 transition-colors duration-300 ease-out hover:border-white/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.75} />
                    <ChevronDown
                      className="h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-300"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
                </SpotlightCard>
              )}
            </button>
          );
        })}
      </div>

      {bridge && (
        <div
          className="absolute z-10 overflow-hidden border-x border-primary/40 bg-card transition-[left,width,top] duration-300 ease-out"
          style={{
            left: bridge.left,
            width: bridge.width,
            top: bridge.top - BRIDGE_OVERLAP_PX,
            height: GAP_PX + BRIDGE_OVERLAP_PX * 2,
            borderBottomLeftRadius: bridge.atLeftEdge ? "var(--radius-2xl)" : 0,
            borderBottomRightRadius: bridge.atRightEdge ? "var(--radius-2xl)" : 0,
          }}
          aria-hidden="true"
        >
          <span className={STATIC_TINT} aria-hidden="true" />
        </div>
      )}

      <div
        id="service-panel"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          activeGroup ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {activeGroup && (
            <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-6 sm:p-8">
              <span className={STATIC_TINT} aria-hidden="true" />
              <div className="relative grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {activeGroup.items.map((item) => (
                  <div key={item.title}>
                    <h4 className="font-semibold text-primary">{item.title}</h4>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>

              {activeGroup.items[0] && (
                <a
                  href={activeGroup.items[0].href}
                  className="relative mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                >
                  {activeGroup.items[0].cta} →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
