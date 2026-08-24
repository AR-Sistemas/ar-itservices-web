import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LogoLoop (React Bits) — marquee continuo de nodos React, restyleado a AR.
 */
export function LogoLoop({
  logos,
  speed = 40,
  direction = "left",
  gap = 12,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = "var(--background)",
  className = "",
}: {
  logos: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.scrollWidth / 2;
      if (w > 0) setDuration(w / Math.max(speed, 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed, logos.length]);

  const items = [...logos, ...logos];

  return (
    <div className={`logo-loop relative overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className={`logo-loop-track flex w-max ${pauseOnHover ? "logo-loop-pausable" : ""}`}
        style={{
          gap: `${gap}px`,
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((node, i) => (
          <div key={i} className="shrink-0">
            {node}
          </div>
        ))}
      </div>
      {fadeOut && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20"
            style={{ background: `linear-gradient(to right, ${fadeOutColor}, transparent)` }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20"
            style={{ background: `linear-gradient(to left, ${fadeOutColor}, transparent)` }}
          />
        </>
      )}
    </div>
  );
}
