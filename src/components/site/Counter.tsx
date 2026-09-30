import { useEffect, useRef, useState } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Counter (React Bits): efecto odómetro. Se dispara una sola vez
 * cuando el número entra en el viewport.
 */
export function Counter({
  value,
  locale = "es-AR",
  className = "",
}: {
  value: number;
  locale?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = value.toLocaleString(locale).split("");

  return (
    <span ref={ref} className={`inline-flex ${className}`} aria-label={String(value)}>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={`${c}-${i}`} aria-hidden="true">
              {c}
            </span>
          );
        }
        const target = Number(c);
        return (
          <span
            key={`${c}-${i}`}
            className="relative inline-block overflow-hidden"
            style={{ height: "1em", lineHeight: "1em" }}
            aria-hidden="true"
          >
            {/* Sizer invisible: la celda toma el ancho real del dígito en la
                tipografía activa (con un ancho fijo, el "0" en negrita se cortaba). */}
            <span className="invisible">{c}</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col items-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateY(-${(play ? target + 10 : 0) * 1}em)`,
                transitionDelay: `${i * 70}ms`,
              }}
            >
              {[...DIGITS, ...DIGITS].map((d, j) => (
                <span key={j} style={{ height: "1em", lineHeight: "1em" }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
