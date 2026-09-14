/**
 * Flag de versión del sitio. "full" (default) muestra todo el contenido actual.
 * "intermedio" oculta secciones/páginas puntuales (ver README) sin borrar nada
 * del código — se activa seteando VITE_SITE_MODE=intermedio al buildear/correr.
 */
export type SiteMode = "full" | "intermedio";

export const SITE_MODE: SiteMode =
  import.meta.env.VITE_SITE_MODE === "intermedio" ? "intermedio" : "full";

export const isIntermedio = SITE_MODE === "intermedio";
