import { Link } from "@tanstack/react-router";
import type { SolutionProduct } from "@/i18n/content";

// Punto de color por producto, tomado de cada logo (rojo ARIA, violeta Ario,
// cian MeetingMate, plata AR SDD).
const DOT: Record<SolutionProduct["id"], string> = {
  aria: "#ff000d",
  ario: "#5b57ff",
  meetingmate: "#00d4ff",
  sdd: "#b5b8bf",
};

/**
 * Acceso rápido a las fichas de /soluciones, pensado para la primera pantalla
 * del home: los productos quedan a un clic sin tener que scrollear hasta la
 * sección de Soluciones (y antes de que aparezca el menú flotante).
 */
export function SolutionsQuickLinks({
  label,
  products,
}: {
  label: string;
  products: Pick<SolutionProduct, "id" | "name">[];
}) {
  return (
    <nav aria-label={label} className="mt-4 flex flex-col sm:mt-6 items-center gap-3">
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              to="/soluciones"
              hash={p.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-card/50 px-2.5 py-1.5 text-xs font-semibold sm:gap-2 sm:px-4 sm:py-2 sm:text-sm text-foreground transition-colors hover:border-white/30 hover:bg-card"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: DOT[p.id] }}
              />
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
