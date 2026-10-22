import { useEffect, useState, type MouseEvent } from "react";
import { PRODUCT_LOGOS } from "./product-logos";
import type { SolutionProduct } from "@/i18n/content";

type Item = Pick<SolutionProduct, "id" | "name">;

/**
 * Acceso rápido fijo de /soluciones: una barra flotante abajo, con el logo de
 * cada producto, para saltar entre fichas sin tener que scrollear y buscar.
 *  - Resalta la ficha que se está leyendo (scroll-spy con IntersectionObserver).
 *  - El salto es un desplazamiento suave, no un corte (`scrollIntoView` smooth);
 *    con "reducir movimiento" salta directo.
 *  - Se oculta al llegar al footer para no tapar sus enlaces.
 *  - Si se entra con un hash (/soluciones#ario, desde el home o el menú), también
 *    se desplaza suavemente hasta esa ficha.
 */
export function SolutionsDock({ products, label }: { products: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const smooth = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  useEffect(() => {
    const sections = products
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    // La ficha "activa" es la que cruza la franja del medio de la pantalla.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const el of sections) io.observe(el);
    return () => io.disconnect();
  }, [products]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver((entries) =>
      setHidden(entries.some((e) => e.isIntersecting)),
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

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
    setActive(id);
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 transition-all duration-300 sm:bottom-5 ${
        hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <nav
        aria-label={label}
        className={`flex items-center gap-1 rounded-2xl border border-white/10 bg-card/80 p-1.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/5 backdrop-blur-xl ${
          hidden ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {products.map((p) => {
          const isActive = active === p.id;
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              onClick={(e) => jump(e, p.id)}
              tabIndex={hidden ? -1 : 0}
              aria-current={isActive ? "true" : undefined}
              className={`flex h-11 items-center justify-center rounded-xl px-2.5 transition-all sm:h-12 sm:px-4 ${
                isActive
                  ? "bg-white/10 opacity-100 ring-1 ring-primary/70"
                  : "opacity-60 hover:bg-white/5 hover:opacity-100"
              }`}
            >
              <img
                src={PRODUCT_LOGOS[p.id]}
                alt={p.name}
                className="h-7 w-auto object-contain sm:h-8"
              />
            </a>
          );
        })}
      </nav>
    </div>
  );
}
