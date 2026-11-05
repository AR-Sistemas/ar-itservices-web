import { useEffect, useId, useRef } from "react";
import { AR_PATH_A, AR_PATH_R, AR_VIEWBOX, ArLogoDefs } from "./LogoMark";

/**
 * Isotipo "AR" real vectorizado del logotipo institucional, animado con
 * Anime.js svg.createDrawable(). Se dibuja una sola vez al entrar al sitio.
 *
 * Lleva el sombreado de la versión con degradé del logotipo: la "R" pasa de
 * blanco a gris claro hacia la derecha y la pierna derecha de la "A" se oscurece
 * hacia arriba (rojo vino → rojo de marca).
 */
export function LogoDraw({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const id = `ar-hero-${useId().replace(/:/g, "")}`;

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
      viewBox={AR_VIEWBOX}
      className={className}
      role="img"
      aria-label="AR IT Services"
    >
      <ArLogoDefs id={id} />
      <path
        id="ar-logo-r"
        className="ar-logo-path"
        fill={`url(#${id}-r)`}
        stroke={`url(#${id}-r)`}
        strokeWidth={0.6}
        strokeLinejoin="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_R}
      />
      <path
        id="ar-logo-a"
        className="ar-logo-path"
        fill="#FF000D"
        fillRule="evenodd"
        stroke="#FF000D"
        strokeWidth={0.6}
        strokeLinejoin="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_A}
      />
      <path
        className="ar-logo-path"
        clipPath={`url(#${id}-clip)`}
        fill={`url(#${id}-a)`}
        fillRule="evenodd"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_A}
      />
    </svg>
  );
}
