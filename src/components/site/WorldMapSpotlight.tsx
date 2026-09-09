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

// Variantes de tamaño/opacidad para que los puntos no queden todos idénticos
// (look "rústico") sino con la textura suave y despareja de un mapa real.
const DOT_VARIANTS: { cls: string; r: number }[] = [
  { cls: "a", r: 0.42 },
  { cls: "b", r: 0.55 },
  { cls: "b", r: 0.6 },
  { cls: "c", r: 0.62 },
  { cls: "b", r: 0.55 },
  { cls: "d", r: 0.72 },
];

// Pseudo-random determinístico (mismo resultado siempre) a partir de la
// posición del punto, para variar sin depender de Math.random en cada build.
function pick<T>(arr: T[], x: number, y: number, i: number): T {
  const h = Math.abs(Math.round(x * 13 + y * 7 + i * 31));
  return arr[h % arr.length] ?? arr[0]!;
}

function buildMapMask(): string {
  const circles = WORLD_MAP_POINTS.map(([x, y], i) => {
    const v = pick(DOT_VARIANTS, x, y, i);
    return `<circle cx="${x}" cy="${y}" r="${v.r}" class="${v.cls}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}" fill="#fff">
    <defs><filter id="soft-dot" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="0.22"/></filter></defs>
    <style>.a{opacity:.42}.b{opacity:.68}.c{opacity:.86}.d{opacity:1}</style>
    <g filter="url(#soft-dot)">${circles}</g>
  </svg>`;
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

// Destellos ambientales sueltos (no tienen que ver con el mapa ni las
// oficinas), como las lucecitas de fondo de las imágenes de referencia.
const AMBIENT_STARS: { x: number; y: number; r: number; o: number }[] = [
  { x: 5, y: 4, r: 0.35, o: 0.6 }, { x: 15, y: 10, r: 0.25, o: 0.4 },
  { x: 34, y: 3, r: 0.3, o: 0.5 }, { x: 50, y: 6, r: 0.4, o: 0.7 },
  { x: 70, y: 4, r: 0.28, o: 0.45 }, { x: 80, y: 12, r: 0.32, o: 0.55 },
  { x: 8, y: 20, r: 0.3, o: 0.5 }, { x: 45, y: 22, r: 0.22, o: 0.35 },
  { x: 60, y: 18, r: 0.36, o: 0.6 }, { x: 75, y: 25, r: 0.26, o: 0.4 },
  { x: 20, y: 35, r: 0.3, o: 0.5 }, { x: 40, y: 40, r: 0.24, o: 0.4 },
  { x: 65, y: 38, r: 0.34, o: 0.55 }, { x: 85, y: 30, r: 0.28, o: 0.45 },
  { x: 12, y: 42, r: 0.26, o: 0.4 }, { x: 55, y: 15, r: 0.3, o: 0.5 },
  { x: 30, y: 25, r: 0.22, o: 0.35 }, { x: 3, y: 30, r: 0.3, o: 0.5 },
  { x: 88, y: 20, r: 0.26, o: 0.4 }, { x: 48, y: 35, r: 0.32, o: 0.55 },
];

function buildOfficesOverlaySvg(): string {
  const { cordoba, dallas, asuncion } = WORLD_MAP_OFFICES;
  const paths = [arc(cordoba, dallas), arc(cordoba, asuncion), arc(dallas, asuncion)]
    .map((d) => `<path d="${d}" fill="none" stroke="#FF000D" stroke-width="0.14" opacity="0.6"/>`)
    .join("");
  const cities = [cordoba, dallas, asuncion];
  const pinGlow = cities
    .map(({ x, y }) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#FF000D" opacity="0.28"/>`)
    .join("");
  const pinCore = cities.map(({ x, y }) => `<circle cx="${x}" cy="${y}" r="0.6" fill="#fff"/>`).join("");
  const stars = AMBIENT_STARS.map(
    ({ x, y, r, o }) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}">
    <defs>
      <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="0.5"/></filter>
      <filter id="star-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="0.3"/></filter>
    </defs>
    <g filter="url(#star-glow)">${stars}</g>
    <g filter="url(#glow)">${paths}${pinGlow}</g>
    ${pinCore}
  </svg>`;
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
        className="absolute inset-0 opacity-50"
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
