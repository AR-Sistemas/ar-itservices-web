import { useState } from "react";
import { Bot, Database, Code2, Users2, ChevronDown, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import type { ServiceGroup } from "@/i18n/content";

/**
 * "Qué hacemos" en 2 niveles, todo con cards (pedido puntual de gerencia):
 *  1. 4 cards grandes, una por área — es todo lo que se ve al entrar.
 *  2. Al clickear una de esas cards, se expande DENTRO de ella misma (no en
 *     un panel aparte) el detalle de los servicios de esa área.
 * Reemplaza el modal "a pantalla completa" (card despegándose al frente)
 * por un acordeón inline por card, a pedido de gerencia.
 */

const GROUP_ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  data: Database,
  engineering: Code2,
  teams: Users2,
};

export function ServiceAreaCards({ groups }: { groups: ServiceGroup[] }) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const toggle = (id: string) => setActiveGroupId((cur) => (cur === id ? null : id));

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => {
        const Icon = GROUP_ICONS[group.id] ?? Bot;
        const isActive = activeGroupId === group.id;
        return (
          <SpotlightCard
            key={group.id}
            as="div"
            className={`rounded-2xl border p-6 transition-colors duration-300 ease-out ${
              isActive ? "border-primary/40 bg-card" : "border-border bg-card hover:border-white/25"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={isActive}
              aria-controls={`service-panel-${group.id}`}
              className="w-full text-left"
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
            </button>

            <div
              id={`service-panel-${group.id}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isActive ? "mt-5 grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="divide-y divide-border border-t border-border">
                  {group.items.map((item) => (
                    <div key={item.title} className="py-4 first:pt-4 last:pb-0">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {group.items[0] && (
                  <a
                    href={group.items[0].href}
                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                  >
                    {group.items[0].cta} →
                  </a>
                )}
              </div>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
