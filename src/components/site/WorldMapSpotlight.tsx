import { useEffect, useRef } from "react";
import { WORLD_MAP_HEIGHT, WORLD_MAP_OFFICES, WORLD_MAP_POINTS, WORLD_MAP_WIDTH } from "@/data/worldMapPoints";

/**
 * Fondo fijo para /novedades: mismo mecanismo que CodeGridSpotlight (fondo
 * "AR" del home) — máscaras CSS anidadas + un spotlight que sigue al mouse —
 * pero en vez de una grilla de código repetida, es un mapamundi hecho de
 * puntos (una sola vez, sin tile) con líneas conectando las 3 oficinas de
 * AR (Córdoba, Dallas, Asunción), inspirado en la referencia que pasó el
 * cliente.
 *
 * No reutiliza código de CodeGridSpotlight a propósito: ese componente no se
 * toca.
 */

const MAP_DISPLAY_WIDTH = 1100; // px, alto se deriva del aspect ratio del mapa
const SPOTLIGHT_SIZE = 520;

function buildMapMask(): string {
  const circles = WORLD_MAP_POINTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.55"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}" fill="#fff">${circles}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const MAP_MASK = buildMapMask();

const mapMaskStyle = {
  maskImage: MAP_MASK,
  WebkitMaskImage: MAP_MASK,
  maskSize: `${MAP_DISPLAY_WIDTH}px auto`,
  WebkitMaskSize: `${MAP_DISPLAY_WIDTH}px auto`,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as React.CSSProperties;

// Arco simple entre dos oficinas, para que las líneas no queden rectas.
function arc(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 4;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

function buildOfficesOverlaySvg(): string {
  const { cordoba, dallas, asuncion } = WORLD_MAP_OFFICES;
  const paths = [arc(cordoba, dallas), arc(cordoba, asuncion), arc(dallas, asuncion)]
    .map((d) => `<path d="${d}" fill="none" stroke="#FF000D" stroke-width="0.16" opacity="0.55"/>`)
    .join("");
  const pins = [cordoba, dallas, asuncion]
    .map(({ x, y }) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#FF000D"/>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}">${paths}${pins}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const OFFICES_OVERLAY = buildOfficesOverlaySvg();

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
      {/* Mapamundi de puntos, siempre visible y muy tenue */}
      <div className="absolute inset-0 bg-white/[0.06]" style={mapMaskStyle} />

      {/* Líneas que conectan las 3 oficinas de AR, sutiles y fijas */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: OFFICES_OVERLAY,
          backgroundSize: `${MAP_DISPLAY_WIDTH}px auto`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* El mismo mapamundi como máscara del contenedor del spotlight, para
          que el círculo que sigue al mouse solo ilumine los puntos. */}
      <div className="absolute inset-0" style={mapMaskStyle}>
        <div
          ref={spotRef}
          className="absolute top-0 left-0 rounded-full opacity-0 transition-opacity duration-300"
          style={{
            height: SPOTLIGHT_SIZE,
            width: SPOTLIGHT_SIZE,
            background:
              "radial-gradient(circle, var(--primary) 0%, var(--primary) 35%, transparent 70%)",
            maskImage: "radial-gradient(closest-side, #fff 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(closest-side, #fff 0%, transparent 100%)",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
