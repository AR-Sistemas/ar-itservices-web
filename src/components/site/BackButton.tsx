import { Link } from "@tanstack/react-router";

/**
 * Botón "volver al inicio" usado en todas las sub-páginas (Nosotros, Novedades,
 * Trabajá con nosotros). Antes era un link de texto suelto con una flecha;
 * ahora es un botón real, consistente en toda la web.
 */
export function BackButton({ label }: { label: string }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
