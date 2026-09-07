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

// Fragmentos de código (CSS/JS) que se van concatenando para armar líneas
// densas y continuas, como un dump de código minificado — no son fragmentos
// sueltos, es una pared de texto.
const TOKENS = [
  "display:flex;", "padding:0 24px;", "border-radius:12px;", "position:absolute;",
  "transform:rotate(-45deg);", "transition:all .3s ease;", "background:#0f0f14;",
  "@keyframes fade-in{", "from{opacity:0}", "to{opacity:1}}", "animation:spin 2s linear infinite;",
  "const handleClick=()=>{", "setState(true)}", "grid-template-columns:repeat(4,1fr);",
  "async function fetchData(){", "await res.json()}", "box-shadow:0 4px 12px rgba(0,0,0,.4);",
  "if(user&&user.isActive){", "return true}", "z-index:10;overflow:hidden;",
  "for(let i=0;i<arr.length;i++){", "export default function App(){",
  ".nav a{text-decoration:none;", "color:#fff}", "width:100%;height:100vh;",
  "backdrop-filter:blur(8px);", "cursor:pointer;user-select:none;",
  "flex-direction:column;align-items:center;", "letter-spacing:-.02em;",
  "font-family:monospace;font-size:14px;", "border:1px solid rgba(255,255,255,.1);",
  "import{useState}from 'react';", "export const App=()=>{",
  "return(<div className=", "onClick={()=>setOpen(!open)}",
  "margin:0 auto;max-width:1200px;", "opacity:.85;mix-blend-mode:screen;",
  "@media (min-width:768px){", "overflow-y:auto;scroll-behavior:smooth;}",
];

const TILE_W = 480;
const TILE_H = 420;
const LINE_HEIGHT = 16;
const LINE_COUNT = 24;
const FONT_SIZE = 10;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildLines(count: number): string[] {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * 3;
    const parts = [0, 1, 2].map((offset) => TOKENS[(start + offset) % TOKENS.length] ?? "");
    lines.push(parts.join(""));
  }
  return lines;
}

function buildTileMask(): string {
  const lines = buildLines(LINE_COUNT);
  const glyphs = lines
    .map((line, i) => {
      // Alterna un pequeño corrimiento horizontal para que no quede todo
      // alineado a la misma columna, como un texto que sigue wrappeando.
      const x = i % 3 === 0 ? -8 : i % 3 === 1 ? 0 : -16;
      const y = LINE_HEIGHT * (i + 1);
      return `<text x="${x}" y="${y}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="${FONT_SIZE}" xml:space="preserve" fill="#fff">${escapeXml(line)}</text>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">${glyphs}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const TILE_MASK = buildTileMask();

const tileMaskStyle = {
  maskImage: TILE_MASK,
  WebkitMaskImage: TILE_MASK,
  maskSize: `${TILE_W}px ${TILE_H}px`,
  WebkitMaskSize: `${TILE_W}px ${TILE_H}px`,
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
