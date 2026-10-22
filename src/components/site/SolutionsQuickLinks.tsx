import { Link } from "@tanstack/react-router";
import { PRODUCT_LOGOS } from "./product-logos";
import type { SolutionProduct } from "@/i18n/content";

/**
 * Acceso rápido a las fichas de /soluciones, pensado para la primera pantalla
 * del home: los productos quedan a un clic sin tener que scrollear hasta la
 * sección de Soluciones (y antes de que aparezca el menú flotante). Cada acceso
 * muestra el logo del producto (el logo ya trae el nombre; el nombre accesible
 * va en el alt de la imagen).
 */
export function SolutionsQuickLinks({
  label,
  products,
}: {
  label: string;
  products: Pick<SolutionProduct, "id" | "name">[];
}) {
  return (
    <nav aria-label={label} className="mt-4 flex flex-col items-center gap-2.5 sm:mt-6 sm:gap-3">
      <p className="sr-only font-mono text-[11px] tracking-widest text-primary uppercase sm:not-sr-only">
        {label}
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              to="/soluciones"
              hash={p.id}
              className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-card/50 px-3 transition-colors hover:border-white/30 hover:bg-card sm:h-16 sm:px-4"
            >
              <img
                src={PRODUCT_LOGOS[p.id]}
                alt={p.name}
                loading="lazy"
                className="h-8 w-auto object-contain sm:h-11"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
