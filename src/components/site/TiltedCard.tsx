import { useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Tilted Card (React Bits) en versión suave para la sección "Nuestra gente".
 */
export function TiltedCard({
  children,
  className = "",
  rotateAmplitude = 8,
  scaleOnHover = 1.03,
}: {
  children: ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({
      rx: -py * 2 * rotateAmplitude,
      ry: px * 2 * rotateAmplitude,
      s: scaleOnHover,
    });
  };

  return (
    <div className={`[perspective:900px] ${className}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setT({ rx: 0, ry: 0, s: 1 })}
        className="transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}
