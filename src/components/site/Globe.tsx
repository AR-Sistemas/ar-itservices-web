import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

/**
 * Fondo de globo 3D (cobe — https://github.com/shuding/cobe), restyleado a la
 * paleta AR: base oscura (--ink), marcadores y glow en rojo de marca
 * (--brand). Marca las 3 oficinas reales (Dallas, Córdoba, Asunción).
 * Respeta prefers-reduced-motion (no rota, se queda fija).
 */

const OFFICE_MARKERS = [
  { location: [32.7767, -96.797] as [number, number], size: 0.07 }, // Dallas
  { location: [-31.4201, -64.1888] as [number, number], size: 0.09 }, // Córdoba
  { location: [-25.2637, -57.5759] as [number, number], size: 0.07 }, // Asunción
];

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 2.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.15, 0.17],
      markerColor: [1, 0.1, 0.15], // --brand #FF000D
      glowColor: [0.9, 0.08, 0.15], // --brand más brillante para que se note detrás de la card
      opacity: 1,
      markers: OFFICE_MARKERS.map((m) => ({ location: m.location, size: m.size })),
      onRender: (state) => {
        if (!reducedMotion) phiRef.current += 0.0032;
        state.phi = phiRef.current;
        state.width = size * dpr;
        state.height = size * dpr;
      },
    });

    return () => globe.destroy();
  }, [size]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", aspectRatio: "1", contain: "layout paint size" }}
      />
    </div>
  );
}
