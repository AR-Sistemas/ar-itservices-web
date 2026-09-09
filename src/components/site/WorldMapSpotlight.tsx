import { useEffect, useRef } from "react";

/**
 * Fondo fijo para /novedades: mismo mecanismo interactivo que
 * CodeGridSpotlight (fondo "AR" del home) — un halo que sigue al mouse —
 * pero aplicado sobre el mapamundi de puntos que generó el cliente
 * (public/images/world-map-bg.*), en vez del mapa procedural anterior.
 *
 * No reutiliza código de CodeGridSpotlight a propósito: ese componente no se
 * toca.
 */

const SPOTLIGHT_SIZE = 520;

export function WorldMapSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = spotRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX - SPOTLIGHT_SIZE / 2}px, ${
        e.clientY - SPOTLIGHT_SIZE / 2
      }px, 0)`;
      el.style.opacity = "0.5";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Mapamundi generado por el cliente, siempre visible y tenue */}
      <picture>
        <source srcSet="/images/world-map-bg.webp" type="image/webp" />
        <img
          src="/images/world-map-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
        />
      </picture>

      {/* Halo que sigue al mouse, misma interacción que el fondo del home */}
      <div
        ref={spotRef}
        className="absolute top-0 left-0 rounded-full opacity-0 mix-blend-screen transition-opacity duration-300"
        style={{
          height: SPOTLIGHT_SIZE,
          width: SPOTLIGHT_SIZE,
          background: "radial-gradient(circle, var(--primary) 0%, var(--primary) 35%, transparent 70%)",
          maskImage: "radial-gradient(closest-side, #fff 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, #fff 0%, transparent 100%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
