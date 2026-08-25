import { useEffect, useState, type ReactNode } from "react";
import { useSpringPress } from "./useSpringPress";

export type NavItem = { label: string; href: string };

/**
 * Barra de navegación flotante tipo "isla":
 *  - No se muestra al entrar al sitio (queda oculta sobre el hero).
 *  - Al hacer scroll hacia abajo aparece con un efecto de armado: la isla baja
 *    y hace fade, y sus elementos (logo, links, CTA) entran escalonados.
 *  - Una vez visible, queda fija (`position: fixed`) y acompaña el scroll.
 *  - Despegada del fondo: bordes redondeados, sombra, blur y ring sutil.
 *  - Responsive: en pantallas chicas los links pasan a un menú desplegable.
 */
export function FloatingNav({
  logo,
  items,
  ctaLabel = "Hablemos",
  ctaHref = "#contacto",
  rightSlot,
  revealAt = 120,
}: {
  logo: ReactNode;
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  rightSlot?: ReactNode;
  revealAt?: number;
}) {
  const [shown, setShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cta = useSpringPress<HTMLAnchorElement>();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > revealAt);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAt]);

  // El menú mobile no puede quedar abierto si la barra se oculta.
  useEffect(() => {
    if (!shown) setMenuOpen(false);
  }, [shown]);

  const delay = (i: number) => (shown ? `${100 + i * 70}ms` : "0ms");
  const enter = shown ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0";
  const tab = shown ? 0 : -1;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-hidden={!shown}
        className={`w-full max-w-5xl rounded-2xl border border-white/10 bg-card/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-500 ease-out ${
          shown ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <a
            href="#top"
            aria-label="AR IT Services"
            tabIndex={tab}
            className={`flex min-w-0 items-center transition-all duration-500 ease-out ${enter}`}
            style={{ transitionDelay: delay(0) }}
          >
            {logo}
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {items.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                tabIndex={tab}
                className={`text-sm font-medium text-muted-foreground transition-all duration-500 ease-out hover:text-foreground ${enter}`}
                style={{ transitionDelay: delay(i + 1) }}
              >
                {n.label}
              </a>
            ))}
          </div>

          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-out sm:gap-4 ${enter}`}
            style={{ transitionDelay: delay(items.length + 1) }}
          >
            {rightSlot}
            <a
              ref={cta.ref}
              onMouseDown={cta.press}
              href={ctaHref}
              tabIndex={tab}
              className="hidden shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark sm:inline-flex"
            >
              {ctaLabel}
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              tabIndex={tab}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg text-foreground transition-colors hover:bg-white/5 lg:hidden"
            >
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Menú desplegable (mobile / tablet) */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-3">
              {items.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={ctaHref}
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
