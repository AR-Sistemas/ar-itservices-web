import { useEffect, useRef } from "react";
import { AR_PATH_A, AR_PATH_R, AR_VIEWBOX } from "./LogoMark";

/**
 * Variante animada del isotipo "AR" para la barra de navegación: reusa el mismo
 * efecto de "reescritura" del logo del hero, pero el trazo se dibuja en rojo y
 * al terminar hace crossfade a blanco (fillColor), para no romper el contraste
 * con la barra oscura.
 *
 * Usa ids propios (nav-logo-*) para no colisionar con el `svg.createDrawable`
 * del logo del hero, que selecciona por id global.
 *
 * Se dispara una sola vez, cuando `play` pasa a true (la primera vez que la
 * barra se hace visible).
 */
export function LogoDrawInline({
  className = "",
  play,
  strokeColor = "#FF000D",
  fillColor = "currentColor",
}: {
  className?: string;
  play: boolean;
  strokeColor?: string;
  fillColor?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!play || played.current) return;
    const el = ref.current;
    if (!el) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".ar-draw-path"));
    played.current = true;

    const showFinal = () => {
      for (const p of paths) {
        p.style.fillOpacity = "1";
        p.style.strokeOpacity = "0";
      }
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showFinal();
      return;
    }

    let cancelled = false;
    void (async () => {
      const { animate, svg } = await import("animejs");
      if (cancelled) return;
      for (const p of paths) {
        p.style.strokeOpacity = "1";
        p.style.fillOpacity = "0";
      }
      // 1) Se dibuja el contorno rojo (la "reescritura").
      animate(svg.createDrawable("#nav-logo-a"), {
        draw: ["0 0", "0 1"],
        ease: "inOutQuad",
        duration: 550,
      });
      animate(svg.createDrawable("#nav-logo-r"), {
        draw: ["0 0", "0 1"],
        ease: "inOutQuad",
        duration: 550,
        delay: 150,
      });
      // 2) El relleno blanco entra y el trazo rojo se desvanece (crossfade).
      animate(paths, {
        fillOpacity: [0, 1],
        strokeOpacity: [1, 0],
        ease: "outQuad",
        duration: 420,
        delay: 720,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [play]);

  return (
    <svg
      ref={ref}
      viewBox={AR_VIEWBOX}
      className={className}
      role="img"
      aria-label="AR IT Services"
      fill={fillColor}
    >
      <path
        id="nav-logo-a"
        className="ar-draw-path"
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_A}
      />
      <path
        id="nav-logo-r"
        className="ar-draw-path"
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_R}
      />
    </svg>
  );
}
