import { useEffect, useState, type ReactNode } from "react";
import { useSpringPress } from "./useSpringPress";
import { useIslandReveal } from "./useIslandReveal";
import { useContactModal } from "./ContactModal";
import type { NavItem } from "@/i18n/content";

export type { NavItem };

/**
 * Barra de navegación flotante tipo "isla":
 *  - No se muestra al entrar al sitio (queda oculta sobre el hero).
 *  - Al hacer scroll hacia abajo aparece con un efecto de armado: la isla baja
 *    y hace fade, y sus elementos (logo, links, CTA) entran escalonados.
 *  - Una vez visible, queda fija (`position: fixed`) y acompaña el scroll.
 *  - Despegada del fondo: bordes redondeados, sombra, blur y ring sutil.
 *  - Tras unos segundos de inactividad se "esfuma" (blur + fade, el inverso de
 *    materializarse) y reaparece con cualquier interacción (mouse, scroll, tecla,
 *    touch), volviendo a armarse con el mismo stagger.
 *  - Responsive: en pantallas chicas los links pasan a un menú desplegable.
 *  - Los ítems con `children` (hoy "Soluciones") abren en escritorio un panel
 *    que se expande dentro de la propia isla (la isla recorta lo que sobresale,
 *    por eso no es un popover) y en mobile muestran los hijos indentados.
 */
export function FloatingNav({
  logo,
  items,
  ctaLabel = "Hablemos",
  ctaHref = "#contacto",
  logoHref = "#top",
  activeHref,
  rightSlot,
  revealAt = 120,
  idleMs = 3500,
}: {
  logo: ReactNode | ((visible: boolean) => ReactNode);
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Destino del logo (en páginas internas, el inicio). */
  logoHref?: string;
  /** Página actual: resalta el ítem (o el hijo) que apunta a ella. */
  activeHref?: string;
  rightSlot?: ReactNode;
  /** Scroll (px) desde el que aparece; un valor negativo la deja visible desde arriba. */
  revealAt?: number;
  idleMs?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const cta = useSpringPress<HTMLAnchorElement>();
  const openContact = useContactModal();
  // Fuera de la home, "Hablemos" (`/#contacto`) abre el formulario en un modal
  // en vez de mandar a otra página; en la home (`#contacto`) sigue haciendo scroll.
  const ctaOpensModal = ctaHref.startsWith("/#contacto");
  const onCtaClick = (e: React.MouseEvent) => {
    if (!ctaOpensModal) return;
    e.preventDefault();
    setMenuOpen(false);
    openContact();
  };
  const { shown, visible, dur, delay, enter, tab, island } = useIslandReveal({
    revealAt,
    idleMs,
    hold: menuOpen,
  });

  // El menú mobile no puede quedar abierto si la barra se oculta.
  useEffect(() => {
    if (!shown) {
      setMenuOpen(false);
      setOpenKey(null);
    }
  }, [shown]);

  const isActive = (n: NavItem) =>
    activeHref !== undefined &&
    (n.href === activeHref || (n.children?.some((child) => child.href === activeHref) ?? false));

  // Ítem con panel desplegable (hoy hay uno solo) y si está abierto.
  const panelItem = items.find((n) => n.children?.length);
  const panelOpen = visible && panelItem !== undefined && openKey === panelItem.href;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-hidden={!visible}
        className={`star-border relative w-full max-w-7xl overflow-hidden rounded-2xl p-[1.5px] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)] transition-all ${dur} ease-out ${island}`}
      >
        <span
          className="star-border-glow star-border-bottom"
          style={{ animationDuration: "8s" }}
          aria-hidden="true"
        />
        <span
          className="star-border-glow star-border-top"
          style={{ animationDuration: "8s" }}
          aria-hidden="true"
        />
        <div
          className="relative z-10 rounded-2xl border border-white/10 bg-card ring-1 ring-white/5 backdrop-blur-xl"
          onMouseLeave={() => setOpenKey(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpenKey(null);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setOpenKey(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
            <a
              href={logoHref}
              aria-label="AR IT Services"
              tabIndex={tab}
              className={`flex min-w-0 items-center transition-all ${dur} ease-out ${enter}`}
              style={{ transitionDelay: delay(0) }}
            >
              {typeof logo === "function" ? logo(visible) : logo}
            </a>

            <div className="hidden items-center gap-4 xl:flex 2xl:gap-6">
              {items.map((n, i) => (
                <a
                  key={n.href}
                  href={n.href}
                  tabIndex={tab}
                  aria-current={isActive(n) ? "page" : undefined}
                  aria-haspopup={n.children ? "true" : undefined}
                  aria-expanded={n.children ? openKey === n.href : undefined}
                  onMouseEnter={() => setOpenKey(n.children ? n.href : null)}
                  onFocus={() => setOpenKey(n.children ? n.href : null)}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all ${dur} ease-out hover:text-foreground ${enter} ${
                    isActive(n) ? "text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ transitionDelay: delay(i + 1) }}
                >
                  {n.label}
                  {n.badge && (
                    <span className="rounded-full bg-primary px-1.5 py-px text-xs leading-4 font-bold tracking-wide text-primary-foreground uppercase">
                      {n.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div
              className={`flex items-center gap-2 transition-all ${dur} ease-out sm:gap-4 ${enter}`}
              style={{ transitionDelay: delay(items.length + 1) }}
            >
              {/* En escritorio el idioma va en la barra; en mobile/tablet, dentro del desplegable. */}
              <div className="hidden xl:block">{rightSlot}</div>
              <a
                ref={cta.ref}
                onMouseDown={cta.press}
                onClick={onCtaClick}
                href={ctaHref}
                tabIndex={tab}
                className="hidden shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white sm:inline-flex"
              >
                {ctaLabel}
              </a>
              <button
                type="button"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                tabIndex={tab}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg text-foreground transition-colors hover:bg-white/5 xl:hidden"
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

          {/* Panel desplegable (escritorio): se expande dentro de la isla */}
          {panelItem?.children && (
            <div
              aria-hidden={!panelOpen}
              className={`hidden overflow-hidden transition-[grid-template-rows] duration-300 ease-out xl:grid ${
                panelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-4 gap-2 border-t border-white/10 p-3">
                  {panelItem.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      tabIndex={panelOpen ? 0 : -1}
                      aria-current={child.href === activeHref ? "page" : undefined}
                      onClick={() => setOpenKey(null)}
                      className={`rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5 ${
                        child.href === activeHref ? "bg-white/10 ring-1 ring-primary/70" : ""
                      }`}
                    >
                      <span className="block font-display text-sm font-extrabold text-foreground">
                        {child.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                        {child.hint}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menú desplegable (mobile / tablet) */}
          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out xl:hidden ${
              menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex max-h-[calc(100dvh-6rem)] flex-col gap-1 overflow-y-auto border-t border-white/10 px-3 py-3">
                {items.map((n) => (
                  <div key={n.href} className="flex flex-col">
                    <a
                      href={n.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(n) ? "page" : undefined}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground ${
                        isActive(n) ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {n.label}
                      {n.badge && (
                        <span className="rounded-full bg-primary px-1.5 py-px text-xs leading-4 font-bold tracking-wide text-primary-foreground uppercase">
                          {n.badge}
                        </span>
                      )}
                    </a>
                    {n.children?.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={child.href === activeHref ? "page" : undefined}
                        className={`rounded-lg py-2 pr-3 pl-7 text-sm transition-colors hover:bg-white/5 hover:text-foreground ${
                          child.href === activeHref
                            ? "bg-white/10 text-foreground ring-1 ring-primary/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold text-foreground">{child.label}</span>
                        <span className="block text-xs">{child.hint}</span>
                      </a>
                    ))}
                  </div>
                ))}
                {rightSlot && (
                  <div className="mt-1 flex justify-center border-t border-white/10 pt-3 [&_button]:px-3.5 [&_button]:py-2 [&_button]:text-sm">
                    {rightSlot}
                  </div>
                )}
                <a
                  href={ctaHref}
                  onClick={(e) => {
                    setMenuOpen(false);
                    onCtaClick(e);
                  }}
                  className="mt-1 rounded-full bg-primary px-5 py-2.5 text-center sm:hidden text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white"
                >
                  {ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
