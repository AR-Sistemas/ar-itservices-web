import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import cordobaTechWeekLogo from "@/assets/events/cordoba-tech-week.png";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { isEventBannerActive } from "@/lib/event-banner";

// Incluye el evento en la clave para que un aviso futuro no herede el cierre de este.
const DISMISS_KEY = "ar-event-banner-dismissed-cordoba-tech-week-2026";

/**
 * Aviso sobrio de Córdoba Tech Week arriba del home, con el logo oficial del
 * evento y enlace a /soluciones. Texto simple a propósito (nada que parezca publicidad). Se retira solo al
 * pasar la fecha de src/lib/event-banner.ts, o con `enabled: false` en ese archivo.
 * El cierre se recuerda en el navegador; como localStorage puede fallar (ventana
 * privada, datos bloqueados), todo acceso va protegido y el aviso se ve igual.
 */
export function EventBanner() {
  const { lang } = useLang();
  const c = getContent(lang).eventBanner;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      // sin almacenamiento: el aviso queda visible hasta recargar
    }
  }, []);

  if (!isEventBannerActive() || dismissed) return null;

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // idem: no persiste, pero se cierra en esta visita
    }
  };

  return (
    <div className="relative z-40 border-b border-white/10 bg-card/80 px-10 py-2 text-center text-xs sm:text-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-left sm:text-center">
        <img
          src={cordobaTechWeekLogo}
          alt="Córdoba Tech Week"
          className="h-9 w-auto shrink-0 sm:h-11"
        />
        <p className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-foreground">
            <span className="hidden sm:inline">{c.lead} · </span>
            {c.dates}
          </span>
          <Link
            to="/soluciones"
            className="font-semibold text-primary transition-colors hover:text-brand-dark"
          >
            {c.cta} →
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label={c.close}
        className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
