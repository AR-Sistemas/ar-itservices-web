import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bot, Database, Code2, Users2, X, type LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { ServiceGroup } from "@/i18n/content";

/**
 * "Qué hacemos" en 2 niveles, todo con cards (pedido puntual de gerencia):
 *  1. 4 cards grandes, una por área — es todo lo que se ve al entrar.
 *  2. Al clickear una de esas cards, se "expande" en una card grande tipo
 *     modal (overlay + X + click afuera/Escape para cerrar) que agrupa
 *     ADENTRO los servicios de esa área — nucleados en una sola card, no
 *     sueltos por separado.
 * Animado con CSS puro (`tailwindcss-animate`, igual que el resto del
 * sitio) — se descartó `motion`/`AnimatePresence` porque esa combinación se
 * quedaba trabada sin desmontar en este proyecto.
 */

const GROUP_ICONS: Record<string, LucideIcon> = {
  ai: Bot,
  data: Database,
  engineering: Code2,
  teams: Users2,
};

export function ServiceAreaCards({ groups }: { groups: ServiceGroup[] }) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const expandedRef = useRef<HTMLDivElement>(null);

  // El modal se porta directo a <body> (ver más abajo) para escapar de
  // ancestros con `will-change`/`transform` (p.ej. AnimatedContent) que lo
  // dejaban atrapado detrás de otras secciones de la página. createPortal
  // necesita `document`, así que recién se activa una vez montado en cliente.
  useEffect(() => {
    setMounted(true);
  }, []);

  useOutsideClick(expandedRef, () => setActiveGroupId(null));

  useEffect(() => {
    document.body.style.overflow = activeGroupId ? "hidden" : "";
    if (!activeGroupId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveGroupId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGroupId]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

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
              onClick={() => setActiveGroupId(group.id)}
              aria-haspopup="dialog"
              aria-expanded={isActive}
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

      {mounted && activeGroup && createPortal(
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={expandedRef}
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-primary/40 bg-card p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none"
          >
            <button
              type="button"
              onClick={() => setActiveGroupId(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {(() => {
              const Icon = GROUP_ICONS[activeGroup.id] ?? Bot;
              return <Icon className="h-8 w-8 text-primary" strokeWidth={1.75} />;
            })()}
            <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {activeGroup.label}
            </h3>

            <div className="mt-6 divide-y divide-border">
              {activeGroup.items.map((item) => (
                <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {activeGroup.items[0] && (
              <a
                href={activeGroup.items[0].href}
                onClick={() => setActiveGroupId(null)}
                className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
              >
                {activeGroup.items[0].cta} →
              </a>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
