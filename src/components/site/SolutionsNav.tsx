import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
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
 *  - Resalta la ficha que se está leyendo (scroll-spy con IntersectionObserver).
 *  - El salto entre fichas es un desplazamiento suave, no un corte; con "reducir
 *    movimiento" salta directo.
 *  - Si se entra con un hash (/soluciones#ario, desde el home o el menú), también
 *    se desplaza suavemente hasta esa ficha.
 */
export function SolutionsNav({
  products,
  jumpLabel,
  backLabel,
  rightSlot,
}: {
  products: Item[];
  jumpLabel: string;
  backLabel: string;
  rightSlot?: ReactNode;
}) {
  const [current, setCurrent] = useState<string | null>(null);
  const { visible, dur, delay, enter, tab, island } = useIslandReveal();

  const smooth = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  useEffect(() => {
    const sections = products
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    // La ficha "activa" es la que cruza la franja del medio de la pantalla.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const el of sections) io.observe(el);
    return () => io.disconnect();
  }, [products]);

  // Llegada con hash: esperamos a que se asiente el layout (hay animaciones de
  // entrada) y recién ahí hacemos el desplazamiento suave.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!products.some((p) => p.id === id)) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: smooth(), block: "start" });
    }, 350);
    return () => window.clearTimeout(t);
    // Solo al montar: lee el hash una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: smooth(), block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setCurrent(id);
  };

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
                    href={`#${p.id}`}
                    onClick={(e) => jump(e, p.id)}
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
