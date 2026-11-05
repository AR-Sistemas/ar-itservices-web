import { type ReactNode } from "react";

/** Contenedor compartido para las tarjetas del sitio. */
export function SpotlightCard({
  children,
  className = "",
  contentClassName = "",
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: "div" | "article" | "li";
  style?: React.CSSProperties | undefined;
}) {
  return (
    <Tag style={style} className={`spotlight-card group relative overflow-hidden ${className}`}>
      <div className={`relative ${contentClassName}`}>{children}</div>
    </Tag>
  );
}
