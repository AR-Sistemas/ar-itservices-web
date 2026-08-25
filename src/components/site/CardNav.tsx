import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useSpringPress } from "./useSpringPress";

export type CardNavLink = { label: string; href: string; ariaLabel?: string };
export type CardNavCard = { label: string; links: CardNavLink[]; accent?: boolean };

/**
 * Card Nav (React Bits) reinterpretado a la paleta AR y sin dependencia de GSAP
 * (el proyecto solo trae Anime.js). El menú vive dentro de una barra flotante
 * redondeada; al abrir, el panel despliega tarjetas por categoría con una
 * animación de alto automático (grid-template-rows 0fr → 1fr) y stagger.
 *
 * Es totalmente responsive: la misma barra sirve en desktop y mobile, así que
 * también resuelve la falta de menú en pantallas chicas.
 */
export function CardNav({
  logo,
  cards,
  ctaLabel = "Hablemos",
  ctaHref = "#contacto",
  rightSlot,
}: {
  logo: ReactNode;
  cards: CardNavCard[];
  ctaLabel?: string;
  ctaHref?: string;
  rightSlot?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const cta = useSpringPress<HTMLAnchorElement>();
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  // Cerrar al hacer click afuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        ref={navRef}
        className={`mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-card/90 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur transition-colors ${
          open ? "border-primary/40" : "border-border"
        }`}
      >
        {/* Barra superior */}
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg text-foreground transition-colors hover:bg-white/5"
            >
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </button>
            <a href="#top" aria-label="AR IT Services" className="flex min-w-0 items-center">
              {logo}
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {rightSlot}
            <a
              ref={cta.ref}
              onMouseDown={cta.press}
              href={ctaHref}
              className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark sm:px-5 sm:py-2.5"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        {/* Panel expandible con tarjetas */}
        <div
          id={menuId}
          className={`grid transition-[grid-template-rows] duration-[400ms] ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-3 px-3 pb-3 sm:grid-cols-3 sm:px-4 sm:pb-4">
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  style={{ transitionDelay: open ? `${i * 60 + 80}ms` : "0ms" }}
                  className={`flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  } ${card.accent ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
                >
                  <p
                    className={`font-mono text-xs tracking-widest uppercase ${
                      card.accent ? "text-primary-foreground/80" : "text-primary"
                    }`}
                  >
                    {card.label}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {card.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          aria-label={l.ariaLabel}
                          tabIndex={open ? 0 : -1}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1.5 text-lg font-semibold transition-opacity hover:opacity-70"
                        >
                          <span aria-hidden="true" className="text-sm opacity-60">
                            ↗
                          </span>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
