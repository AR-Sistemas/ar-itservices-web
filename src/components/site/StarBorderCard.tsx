import type { ReactNode } from "react";

/**
 * Variante de Star Border (React Bits) para envolver CARDS rectangulares.
 * Reusa el mismo efecto de luz que recorre el borde (utilidades `star-border`
 * de styles.css) que el botón, pero con radio de card y sin fondo propio: deja
 * pasar el contenido (que ya trae su propio fondo/efecto animado) y suma el
 * borde animado por fuera.
 */
export function StarBorderCard({
  children,
  className = "",
  radius = "rounded-2xl",
  speed = "6s",
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  speed?: string;
}) {
  return (
    <div className={`star-border relative overflow-hidden p-[1.5px] ${radius} ${className}`}>
      <span
        className="star-border-glow star-border-bottom"
        style={{ animationDuration: speed }}
        aria-hidden="true"
      />
      <span
        className="star-border-glow star-border-top"
        style={{ animationDuration: speed }}
        aria-hidden="true"
      />
      <div className={`relative z-10 h-full ${radius}`}>{children}</div>
    </div>
  );
}
