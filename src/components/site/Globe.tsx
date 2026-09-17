import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

/**
 * Fondo de globo 3D (cobe — https://github.com/shuding/cobe), restyleado a la
 * paleta AR: marcadores y glow en rojo de marca (--brand). Marca las 3
 * oficinas reales (Dallas, Córdoba, Asunción). Respeta prefers-reduced-motion
 * (no rota, se queda fija).
 *
 * OJO con dark:1 — con ese flag el baseColor tiene que seguir siendo un gris
 * medio (~0.3), si se oscurece demasiado los puntos del mapa (los que dibujan
 * los continentes) pierden contraste contra el fondo y quedan invisibles,
 * dejando solo el aro de glow y los markers — así quedó roto la primera vez.
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
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.32, 0.28, 0.29], // gris medio, apenas tibio — necesario para que los puntos del mapa se vean con dark:1
      markerColor: [1, 0.08, 0.11], // --brand #FF000D
      glowColor: [1, 0.55, 0.55], // glow cálido/rojizo pero brillante (glow oscuro = globo se apaga entero)
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
