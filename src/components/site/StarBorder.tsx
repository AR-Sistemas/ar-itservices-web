import type { ReactNode } from "react";
import { useSpringPress } from "./useSpringPress";

/**
 * Star Border (React Bits) recoloreado a la paleta AR: acento rojo #FF000D.
 * Suma rebote físico (Anime.js spring) al click, sin tocar la animación del borde.
 */
export function StarBorder({
  children,
  href,
  speed = "6s",
  className = "",
}: {
  children: ReactNode;
  href: string;
  speed?: string;
  className?: string;
}) {
  const { ref, press } = useSpringPress<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={href}
      onMouseDown={press}
      className={`star-border relative inline-block overflow-hidden rounded-full p-[1.5px] ${className}`}
    >
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
      <span className="relative z-10 block rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-brand-dark">
        {children}
      </span>
    </a>
  );
}
