import { useEffect, useRef } from "react";
import { AR_PATH_A, AR_PATH_R, AR_VIEWBOX } from "./LogoMark";

/**
 * Variante animada del isotipo "AR" para la barra de navegación: reusa el mismo
 * efecto de "reescritura" del logo del hero. El trazo se dibuja en rojo y al
 * rellenarse queda en la versión de marca "Negativo color" (Brand Book 1.3):
 * la "A" en rojo #ff000d y la "R" en blanco (fillColor / currentColor), que es
 * la versión correcta sobre fondos oscuros. La "A" va por encima de la "R".
 *
 * Usa ids propios (nav-logo-*) para no colisionar con el `svg.createDrawable`
 * del logo del hero, que selecciona por id global.
 *
 * Se redibuja cada vez que `play` pasa a true (cada vez que la barra reaparece).
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

  useEffect(() => {
    if (!play) return;
    const el = ref.current;
    if (!el) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".ar-draw-path"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const p of paths) {
        p.style.fillOpacity = "1";
        p.style.strokeOpacity = "0";
      }
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const running: any[] = [];
    void (async () => {
      const { animate, svg } = await import("animejs");
      if (cancelled) return;
      // Reset: contorno rojo visible, relleno oculto (para redibujar de cero).
      for (const p of paths) {
        p.style.strokeOpacity = "1";
        p.style.fillOpacity = "0";
      }
      // 1) Se dibuja el contorno rojo (la "reescritura").
      running.push(
        animate(svg.createDrawable("#nav-logo-a"), {
          draw: ["0 0", "0 1"],
          ease: "inOutQuad",
          duration: 1100,
        }),
        animate(svg.createDrawable("#nav-logo-r"), {
          draw: ["0 0", "0 1"],
          ease: "inOutQuad",
          duration: 1100,
          delay: 300,
        }),
        // 2) El relleno blanco entra y el trazo rojo se desvanece (crossfade).
        animate(paths, {
          fillOpacity: [0, 1],
          strokeOpacity: [1, 0],
          ease: "outQuad",
          duration: 650,
          delay: 1450,
        }),
      );
    })();
    return () => {
      cancelled = true;
      // Corta cualquier animación en curso si la barra se esfuma a mitad.
      for (const a of running) a?.pause?.();
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
        id="nav-logo-r"
        className="ar-draw-path"
        stroke={strokeColor}
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_R}
      />
      <path
        id="nav-logo-a"
        className="ar-draw-path"
        fill="#FF000D"
        fillRule="evenodd"
        stroke={strokeColor}
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ fillOpacity: 0, strokeOpacity: 0 }}
        d={AR_PATH_A}
      />
    </svg>
  );
}
