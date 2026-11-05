/**
 * Beams (React Bits, categoría Backgrounds) — versión liviana en CSS puro,
 * recoloreada a rojo #FF000D / vino #990F1B sobre tinta #232234, opacidad baja.
 * Sin WebGL ni Three.js. Se desactiva con prefers-reduced-motion.
 */
export function Beams({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="beam beam-1" />
      <div className="beam beam-2" />
      <div className="beam beam-3" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}
