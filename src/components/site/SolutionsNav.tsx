import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PRODUCT_LOGOS } from "./product-logos";
import { useIslandReveal } from "./useIslandReveal";
import type { SolutionProduct } from "@/i18n/content";

type Item = Pick<SolutionProduct, "id" | "name">;

/**
 * Barra de navegación de /soluciones: reemplaza a la barra general en esta
 * página. Tiene el botón "Volver al inicio", un acceso con el logo de cada
 * solución y el selector de idioma (`rightSlot`).
 *  - Misma "isla" que FloatingNav (useIslandReveal + Star Border): aparece al
 *    scrollear, entra escalonada, se esfuma por inactividad y vuelve al interactuar.
 *  - Los logos conducen a las páginas individuales de cada solución.
 */
export function SolutionsNav({
  products,
  jumpLabel,
  backLabel,
  rightSlot,
  current,
}: {
  products: Item[];
  jumpLabel: string;
  backLabel: string;
  rightSlot?: ReactNode;
  current?: string | undefined;
}) {
  const { visible, dur, delay, enter, tab, island } = useIslandReveal();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-label={jumpLabel}
        aria-hidden={!visible}
        className={`star-border relative w-full max-w-5xl overflow-hidden rounded-2xl p-[1.5px] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)] transition-all ${dur} ease-out ${island}`}
      >
        <span
          className="star-border-glow star-border-bottom"
          style={{ animationDuration: "8s" }}
          aria-hidden="true"
        />
        <span
          className="star-border-glow star-border-top"
          style={{ animationDuration: "8s" }}
          aria-hidden="true"
        />
        <div className="relative z-10 rounded-2xl border border-white/10 bg-card/70 ring-1 ring-white/5 backdrop-blur-xl">
          {/* En celular se parte en dos filas: volver + idioma arriba, logos abajo. */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2.5 sm:flex-nowrap sm:px-5">
            <Link
              to="/"
              tabIndex={tab}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all ${dur} ease-out hover:border-primary/40 hover:text-primary ${enter}`}
              style={{ transitionDelay: delay(0) }}
            >
              <span aria-hidden="true">←</span>
              {backLabel}
            </Link>

            <div className="order-last flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto">
              {products.map((p, i) => {
                const isActive = current === p.id;
                return (
                  <a
                    key={p.id}
                    href={`/soluciones/${p.id}`}
                    tabIndex={tab}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex h-10 items-center justify-center rounded-xl px-2.5 transition-all ${dur} ease-out sm:h-11 sm:px-3.5 ${enter} ${
                      isActive
                        ? "bg-white/10 ring-1 ring-primary/70"
                        : "opacity-100 hover:bg-white/5"
                    }`}
                    style={{ transitionDelay: delay(i + 1) }}
                  >
                    <img
                      src={PRODUCT_LOGOS[p.id]}
                      alt={p.name}
                      className={`h-6 w-auto object-contain transition-opacity sm:h-8 ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                    />
                  </a>
                );
              })}
            </div>

            <div
              className={`flex shrink-0 items-center transition-all ${dur} ease-out ${enter}`}
              style={{ transitionDelay: delay(products.length + 1) }}
            >
              {rightSlot}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
