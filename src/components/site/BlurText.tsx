import { useEffect, useState, type ReactNode } from "react";

/**
 * BlurText (React Bits, TS + Tailwind) restyleado.
 * Entrada palabra por palabra con blur, una sola vez al montar.
 */
export function BlurText({
  text,
  delay = 90,
  className = "",
  highlightFrom,
  highlightTo,
  highlightClassName = "text-brand",
}: {
  text: string;
  delay?: number;
  className?: string;
  /** índice de palabra (inclusive) donde arranca el resalte */
  highlightFrom?: number;
  /** índice de palabra (exclusive) donde termina el resalte */
  highlightTo?: number;
  highlightClassName?: string;
}) {
  const words = text.split(" ");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className={className}>
      {words.map((w, i) => {
        const highlighted =
          highlightFrom !== undefined &&
          highlightTo !== undefined &&
          i >= highlightFrom &&
          i < highlightTo;
        const shown = ready || reduced;
        return (
          <span
            key={`${w}-${i}`}
            className={highlighted ? highlightClassName : undefined}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: shown ? 1 : 0,
              filter: shown ? "blur(0px)" : "blur(10px)",
              transform: shown ? "none" : "translateY(14px)",
              transition: reduced
                ? "none"
                : `opacity 620ms ease-out ${i * delay}ms, filter 620ms ease-out ${i * delay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${i * delay}ms`,
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

export function BlurTextBlock({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
