import { useEffect, useRef } from "react";

/**
 * Isotipo "AR" real vectorizado del logotipo institucional, animado con
 * Anime.js svg.createDrawable(). Se dibuja una sola vez al entrar al sitio.
 */
export function LogoDraw({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".ar-logo-path"));
    const showFill = () => {
      for (const p of paths) p.style.fillOpacity = "1";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const p of paths) p.style.strokeOpacity = "1";
      showFill();
      return;
    }
    let cancelled = false;
    void (async () => {
      const { animate, svg } = await import("animejs");
      if (cancelled) return;
      for (const p of paths) p.style.strokeOpacity = "1";
      animate(svg.createDrawable("#ar-logo-a"), {
        draw: ["0 0", "0 1"],
        ease: "inOutQuad",
        duration: 700,
      });
      animate(svg.createDrawable("#ar-logo-r"), {
        draw: ["0 0", "0 1"],
        ease: "inOutQuad",
        duration: 700,
        delay: 200,
      });
      animate(paths, {
        fillOpacity: [0, 1],
        ease: "outQuad",
        duration: 500,
        delay: 900,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 246.7"
      className={className}
      role="img"
      aria-label="AR IT Services"
    >
      <path
        id="ar-logo-a"
        className="ar-logo-path"
        fillRule="evenodd"
        fill="#FF000D"
        stroke="#FF000D"
        strokeWidth={3}
        strokeLinejoin="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d="M 168.5 0.0 L 112.6 0.3 L 0.0 246.1 L 54.2 246.1 L 85.1 178.8 L 221.8 243.6 L 249.3 246.1 L 263.6 237.8 L 267.3 228.4 L 265.9 218.1 Z M 140.4 58.5 L 209.7 214.3 L 95.4 156.2 Z"
      />
      <path
        id="ar-logo-r"
        className="ar-logo-path"
        fill="#FF000D"
        stroke="#FF000D"
        strokeWidth={3}
        strokeLinejoin="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d="M 184.2 0.3 L 201.4 38.7 L 315.5 38.7 L 332.1 43.8 L 343.3 53.0 L 351.3 67.9 L 352.1 84.8 L 345.3 100.9 L 333.0 112.0 L 314.3 117.8 L 236.7 118.3 L 253.3 155.3 L 272.2 157.0 L 288.5 166.2 L 347.6 246.1 L 399.7 246.1 L 326.1 155.3 L 362.5 138.4 L 377.9 121.5 L 386.8 104.0 L 390.0 64.2 L 372.5 27.8 L 350.1 9.7 L 323.5 0.9 Z"
      />
    </svg>
  );
}
