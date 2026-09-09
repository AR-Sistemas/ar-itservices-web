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

// Puntos de "noticia" sobre el mapa (posición en % del viewport), inspirados
// en los pulsos de la placa de referencia que pasó el cliente.
const EPICENTERS: { top: number; left: number; delay?: number }[] = [
  { top: 30, left: 19 },
  { top: 62, left: 27, delay: 0.6 },
  { top: 22, left: 51, delay: 1.2 },
  { top: 50, left: 56, delay: 0.3 },
  { top: 33, left: 70, delay: 0.9 },
  { top: 68, left: 83, delay: 1.5 },
];

function EpicenterPulse({ top, left, delay = 0 }: { top: number; left: number; delay?: number }) {
  return (
    <div
      className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <span className="epicenter-ring absolute inset-0 rounded-full border border-primary/70" style={{ animationDelay: `${delay}s` }} />
      <span
        className="epicenter-ring absolute inset-0 rounded-full border border-primary/70"
        style={{ animationDelay: `${delay + 0.9}s` }}
      />
      <span className="relative block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_rgba(255,0,13,0.55)]" />
    </div>
  );
}

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
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
        />
      </picture>

      {/* Epicentros de noticias, pulsando sobre el mapa */}
      {EPICENTERS.map((p, i) => (
        <EpicenterPulse key={i} top={p.top} left={p.left} delay={p.delay ?? 0} />
      ))}

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
