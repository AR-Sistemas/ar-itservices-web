import { useEffect, useRef, useState } from "react";
import { Bot, Database, Code2, Users2, X, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { ServiceGroup, ServiceItem } from "@/i18n/content";

/**
 * "Qué hacemos" en 3 niveles, todo con cards (pedido puntual de gerencia:
 * nada de listas):
 *  1. 4 cards grandes, una por área — es todo lo que se ve al entrar.
 *  2. Al pasar el mouse o tocar/clickear una de esas cards, se despliega
 *     abajo una grilla de cards chicas con los servicios de esa área.
 *  3. Al elegir un servicio, esa card se "expande" en una card grande
 *     (modal) con su descripción y CTA — inspirado en el patrón
 *     "expandable card" de Aceternity, pero animado con CSS puro
 *     (`tailwindcss-animate`, igual que el resto del sitio) en vez de
 *     `motion`/`AnimatePresence`: esa combinación se quedaba "trabada" sin
 *     desmontar al cerrar en este entorno (React 19 + motion 13), así que
 *     se descartó a favor de algo simple y confiable.
 * El hover-preview solo se activa en dispositivos con mouse real
 * (`(hover: hover)`) — en touch, todo funciona a tap.
 */

const GROUP_ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  data: Database,
  engineering: Code2,
  teams: Users2,
};

export function ServiceAreaCards({ groups }: { groups: ServiceGroup[] }) {
  const [canHover, setCanHover] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ServiceItem | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useOutsideClick(expandedRef, () => setActiveItem(null));

  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    if (!activeItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  const selectGroup = (id: string) => {
    // No alterna a cerrado si ya está abierta (p.ej. por hover) — un click
    // siempre "fija" esa área abierta, nunca la cierra a sí misma.
    setActiveGroupId(id);
    setActiveItem(null);
  };

  const hoverGroup = (id: string) => {
    if (!canHover) return;
    setActiveGroupId(id);
    setActiveItem(null);
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.id] ?? Bot;
          const isActive = activeGroupId === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => selectGroup(group.id)}
              onMouseEnter={() => hoverGroup(group.id)}
              aria-expanded={isActive}
              aria-controls={`service-group-${group.id}`}
              className="text-left"
            >
              <SpotlightCard
                as="div"
                className={`h-full rounded-2xl border p-6 transition-all duration-300 ease-out ${
                  isActive
                    ? "border-primary/40 bg-card -translate-y-1 scale-[1.03] shadow-[0_16px_32px_-16px_rgba(255,0,13,0.35)]"
                    : "border-border bg-card hover:border-white/25"
                }`}
              >
                <Icon
                  className={`h-7 w-7 ${isActive ? "text-primary/70" : "text-muted-foreground"}`}
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
              </SpotlightCard>
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div
          id={`service-group-${activeGroup.id}`}
          className="mt-6 animate-in fade-in-0 slide-in-from-top-2 duration-300 motion-reduce:animate-none"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeGroup.items.map((item) => (
              <button key={item.title} type="button" onClick={() => setActiveItem(item)} className="text-left">
                <SpotlightCard
                  as="div"
                  className="h-full rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-white/25"
                >
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.desc}</p>
                </SpotlightCard>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeItem && activeGroup && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={expandedRef}
            className="relative w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none"
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="font-mono text-[11px] tracking-widest text-primary uppercase">{activeGroup.label}</p>
            <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {activeItem.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{activeItem.desc}</p>
            <a
              href={activeItem.href}
              className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
            >
              {activeItem.cta} →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
