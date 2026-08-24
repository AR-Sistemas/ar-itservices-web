import type { ReactNode } from "react";

/**
 * Star Border (React Bits) recoloreado a la paleta AR: acento rojo #FF000D.
 * Único elemento con movimiento continuo en la página.
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
  return (
    <a
      href={href}
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
