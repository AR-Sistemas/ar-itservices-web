import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Border Glow (React Bits) recoloreado a la paleta AR:
 * trazo de glow (#FF000D → #990F1B) que recorre el borde cerca del cursor.
 * Reservado para las 2 tarjetas grandes del bento de servicios.
 */
export function BorderGlow({
  children,
  className = "",
  background = "#232234",
}: {
  children: ReactNode;
  className?: string;
  background?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`border-glow group relative rounded-2xl p-px ${className}`}
    >
      <span className="border-glow-line" aria-hidden="true" />
      <div className="relative h-full rounded-[calc(1rem-1px)]" style={{ background }}>
        {children}
      </div>
    </div>
  );
}
