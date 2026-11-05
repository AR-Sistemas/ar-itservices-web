import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AR_PATH_A, AR_PATH_R, AR_VIEWBOX } from "./LogoMark";

/**
 * Portada de "revista" que anuncia el boletín de novedades dentro del scroll
 * del home. Al hacer click, se simula una apertura: la portada se agranda y
 * un overlay con su mismo degradé cubre la pantalla antes de navegar a
 * /novedades — como si entráramos a la revista en vez de cambiar de página.
 */
export function NewsMagazineCover({
  kicker,
  title,
  subtitle,
  eyebrow,
  cta,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  cta: string;
}) {
  const [opening, setOpening] = useState(false);
  const navigate = useNavigate();

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (opening) return;
    setOpening(true);
    setTimeout(() => navigate({ to: "/novedades" }), 480);
  };

  return (
    <>
      <Link
        to="/novedades"
        onClick={handleOpen}
        aria-label={`${cta}: ${title}`}
        className={`group relative block overflow-hidden rounded-3xl border border-white/10 p-8 transition-transform duration-500 ease-out sm:p-12 ${
          opening ? "scale-105" : "scale-100 hover:scale-[1.015]"
        }`}
        style={{
          background: "linear-gradient(135deg, #FF000D 0%, #990F1B 65%, #2a0509 100%)",
        }}
      >
        <svg
          viewBox={AR_VIEWBOX}
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 h-64 w-auto text-white/10 sm:h-80"
          fill="currentColor"
        >
          <path d={AR_PATH_R} />
          <path d={AR_PATH_A} fillRule="evenodd" />
        </svg>

        <div className="relative">
          <p className="font-mono text-xs tracking-widest text-white/70 uppercase">{eyebrow}</p>
          <p className="mt-6 font-mono text-xs tracking-widest text-white/60 uppercase">{kicker}</p>
          <h3 className="mt-2 max-w-xl text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-base text-white/85">{subtitle}</p>

          <span className="mt-9 inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors group-hover:bg-white/25">
            {cta}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      {opening && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[60] animate-[news-cover-open_480ms_ease-in_forwards]"
          style={{
            background: "linear-gradient(135deg, #FF000D 0%, #990F1B 65%, #2a0509 100%)",
          }}
        />
      )}
    </>
  );
}
