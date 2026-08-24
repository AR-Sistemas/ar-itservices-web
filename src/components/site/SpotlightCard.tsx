import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Spotlight Card (React Bits) restyleado a la paleta AR:
 * glow radial tenue en rojo de marca que sigue al cursor dentro de la tarjeta.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 0, 13, 0.12)",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      onMouseMove={onMove}
      style={{ "--spotlight-color": spotlightColor } as React.CSSProperties}
      className={`spotlight-card group relative overflow-hidden ${className}`}
    >
      <span className="spotlight-card-glow" aria-hidden="true" />
      <div className="relative">{children}</div>
    </Tag>
  );
}
