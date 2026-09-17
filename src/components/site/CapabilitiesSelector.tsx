import { useId, useState } from "react";
import { SpotlightCard } from "./SpotlightCard";
import type { ServiceGroup, ServiceItem } from "@/i18n/content";

/**
 * Selector de capacidades (master–detail): a la izquierda, la lista completa de
 * servicios agrupados por categoría; a la derecha, el detalle del seleccionado.
 * En mobile el detalle se expande debajo del ítem activo (acordeón).
 */
export function CapabilitiesSelector({ groups }: { groups: ServiceGroup[] }) {
  const detailId = useId();
  const items: ServiceItem[] = groups.flatMap((group) => group.items);
  const [active, setActive] = useState(0);
  const current = items[active];
  const currentGroup = current ? groups.find((group) => group.items.includes(current)) : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
      <div>
        {groups.map((group) => (
          <div key={group.id} className="mt-8 first:mt-0">
            <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="mt-3">
              {group.items.map((item) => {
                const index = items.indexOf(item);
                const isActive = active === index;
                return (
                  <li key={item.title} className="border-t border-border last:border-b">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-pressed={isActive}
                      aria-controls={detailId}
                      className={`flex w-full items-center gap-4 py-4 text-left transition-colors ${
                        isActive ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg font-semibold">{item.title}</span>
                    </button>
                    {isActive && (
                      <div className="pb-6 lg:hidden">
                        <ServiceDetail item={item} groupLabel={group.label} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <SpotlightCard
            as="article"
            className="rounded-2xl border border-border bg-card p-9"
            contentClassName="flex min-h-[320px] flex-col"
          >
            <div
              id={detailId}
              key={active}
              className="flex flex-1 flex-col animate-in fade-in-0 slide-in-from-right-2 duration-300 motion-reduce:animate-none"
            >
              {current && <ServiceDetail item={current} groupLabel={currentGroup?.label ?? ""} />}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ item, groupLabel }: { item: ServiceItem; groupLabel: string }) {
  return (
    <>
      <p className="font-mono text-[11px] tracking-widest text-primary uppercase">{groupLabel}</p>
      <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        {item.title}
      </h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">{item.desc}</p>
      <a
        href={item.href}
        className="mt-auto inline-flex w-fit items-center gap-1 pt-6 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
      >
        {item.cta} →
      </a>
    </>
  );
}
