import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "vertical" | "horizontal";

/**
 * AnimatedContent (React Bits, variante TS + Tailwind) restyleado a la marca.
 * Wrapper de entrada por scroll con props de distancia, dirección y duración.
 * Respeta prefers-reduced-motion.
 */
export function AnimatedContent({
  children,
  distance = 40,
  direction = "vertical",
  reverse = false,
  duration = 700,
  delay = 0,
  threshold = 0.12,
  scale = 1,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  direction?: Direction;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  threshold?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const offset = reverse ? -distance : distance;
  const axis = direction === "vertical" ? "translateY" : "translateX";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `${axis}(${offset}px) scale(${scale})`,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
