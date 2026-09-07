import { useEffect, useRef } from "react";

/**
 * Fondo fijo (no scrollea) para toda la home: una grilla tenue de fragmentos
 * de código que se repite en toda la pantalla, con un "spotlight" circular
 * que sigue al mouse e ilumina en rojo los fragmentos cercanos al cursor.
 *
 * Misma técnica que usa santexgroup.com para su grilla de puntos: no es un
 * canvas de partículas, es un truco de máscaras CSS anidadas.
 *  1. Un contenedor tiene como `mask-image` un tile SVG repetido con los
 *     fragmentos de código — todo lo que se dibuje adentro queda "recortado"
 *     con esa forma.
 *  2. Adentro, un círculo grande (el spotlight) tiene su propia máscara de
 *     desvanecimiento radial y se reposiciona con el mouse vía transform.
 * Como las máscaras se combinan por anidamiento, el resultado es: fragmentos
 * de código que se iluminan en un halo suave alrededor del cursor.
 */

const SNIPPETS = [
  "</>",
  "{ }",
  "=>",
  "if()",
  "[ ]",
  "//",
  "<div>",
  "git",
  "npm",
  "&&",
  "();",
  "const",
  "async",
  "0101",
  "#!/",
  "map()",
];

// Posiciones dispersas (no una grilla perfecta) dentro de un tile que se
// repite en toda la pantalla.
const TILE_SIZE = 280;
const POSITIONS: { x: number; y: number; r: number }[] = [
  { x: 16, y: 34, r: -6 },
  { x: 132, y: 20, r: 4 },
  { x: 236, y: 44, r: -3 },
  { x: 58, y: 92, r: 8 },
  { x: 176, y: 100, r: -8 },
  { x: 22, y: 156, r: 5 },
  { x: 122, y: 168, r: -4 },
  { x: 244, y: 150, r: 6 },
  { x: 76, y: 210, r: -7 },
  { x: 206, y: 224, r: 3 },
  { x: 12, y: 252, r: -5 },
  { x: 140, y: 254, r: 7 },
  { x: 256, y: 260, r: -2 },
];

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildTileMask(): string {
  const glyphs = POSITIONS.map(({ x, y, r }, i) => {
    const text = escapeXml(SNIPPETS[i % SNIPPETS.length] ?? "//");
    return `<text x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="15" fill="#fff">${text}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_SIZE}" height="${TILE_SIZE}" viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}">${glyphs}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const TILE_MASK = buildTileMask();

const tileMaskStyle = {
  maskImage: TILE_MASK,
  WebkitMaskImage: TILE_MASK,
  maskSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
  WebkitMaskSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
  maskRepeat: "repeat",
  WebkitMaskRepeat: "repeat",
} as React.CSSProperties;

const SPOTLIGHT_SIZE = 560;

export function CodeGridSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = spotRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX - SPOTLIGHT_SIZE / 2}px, ${
        e.clientY - SPOTLIGHT_SIZE / 2
      }px, 0)`;
      el.style.opacity = "1";
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
      {/* Grilla de fragmentos, siempre visible y muy tenue */}
      <div className="absolute inset-0 bg-white/[0.05]" style={tileMaskStyle} />

      {/* La misma grilla como máscara del contenedor del spotlight, para que
          el círculo que sigue al mouse solo ilumine los fragmentos, no un
          círculo sólido. */}
      <div className="absolute inset-0" style={tileMaskStyle}>
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
