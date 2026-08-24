import { useEffect, useRef } from "react";

/**
 * Isotipo "AR" vectorizado (provisional) animado con Anime.js svg.createDrawable().
 * Se dibuja una sola vez al entrar al sitio. Solo en el hero.
 */
export function LogoDraw({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".ar-logo-path"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const p of paths) p.style.opacity = "1";
      return;
    }
    let cancelled = false;
    void (async () => {
      const { animate, svg, stagger } = await import("animejs");
      if (cancelled) return;
      for (const p of paths) p.style.opacity = "1";
      animate(svg.createDrawable(".ar-logo-path"), {
        draw: ["0 0", "0 1"],
        ease: "inOutQuad",
        duration: 1200,
        delay: stagger(140),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 112 84"
      className={className}
      fill="none"
      role="img"
      aria-label="AR IT Services"
    >
      <g
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="ar-logo-path" style={{ opacity: 0 }} d="M8 72 L28 12 L48 72" />
        <path className="ar-logo-path" style={{ opacity: 0 }} d="M17 52 H39" />
        <path
          className="ar-logo-path"
          style={{ opacity: 0 }}
          d="M66 72 V12 H84 a16 16 0 0 1 0 32 H66"
        />
        <path className="ar-logo-path" style={{ opacity: 0 }} d="M82 44 L104 72" />
      </g>
    </svg>
  );
}
