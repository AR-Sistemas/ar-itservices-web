import { useEffect, useState } from "react";
import { Bot, Database, Code2, Users2, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import type { ServiceGroup, ServiceItem } from "@/i18n/content";

/**
 * "Qué hacemos" en 3 niveles, todo con cards (pedido puntual de gerencia:
 * nada de listas):
 *  1. 4 cards grandes, una por área — es todo lo que se ve al entrar.
 *  2. Al pasar el mouse o tocar/clickear una de esas cards, se despliega
 *     abajo una grilla de cards chicas con los servicios de esa área.
 *  3. Al elegir un servicio, se muestra su card de detalle (descripción +
 *     CTA) debajo.
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

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

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
                className={`h-full rounded-2xl border p-6 transition-colors ${
                  isActive ? "border-primary bg-card" : "border-border bg-card hover:border-white/25"
                }`}
              >
                <Icon
                  className={`h-7 w-7 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-lg font-bold tracking-tight">{group.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "servicio" : "servicios"}
                </p>
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
            {activeGroup.items.map((item) => {
              const isActive = activeItem?.title === item.title;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveItem((current) => (current?.title === item.title ? null : item))}
                  aria-pressed={isActive}
                  className="text-left"
                >
                  <SpotlightCard
                    as="div"
                    className={`h-full rounded-xl border p-5 transition-colors ${
                      isActive ? "border-primary bg-card" : "border-border bg-card/60 hover:border-white/25"
                    }`}
                  >
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.desc}</p>
                  </SpotlightCard>
                </button>
              );
            })}
          </div>

          {activeItem && (
            <div className="mt-6 animate-in fade-in-0 slide-in-from-top-2 duration-300 motion-reduce:animate-none">
              <SpotlightCard as="article" className="rounded-2xl border border-border bg-card p-8">
                <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                  {activeGroup.label}
                </p>
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
              </SpotlightCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
