import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import cordobaTechWeekLogo from "@/assets/events/cordoba-tech-week.png";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { isEventBannerActive } from "@/lib/event-banner";

// Incluye el evento en la clave para que un aviso futuro no herede el cierre de este.
const DISMISS_KEY = "ar-event-banner-dismissed-cordoba-tech-week-2026";

/**
 * Aviso de Córdoba Tech Week arriba del home, con el logo oficial del evento
 * (sin la bajada, que a este tamaño no se lee) y enlace a /soluciones.
 *
 * La iluminación está hecha con CSS puro (ver `.ctw-*` en styles.css), con
 * técnicas en la línea de los efectos de React Bits y Magic UI: aurora verde lima
 * que se desplaza, haces de luz que recorren los bordes, brillo que cruza las
 * letras del logo (máscara con el propio PNG) y halo que pulsa. Se pausa fuera de
 * pantalla y se apaga con "reducir movimiento".
 *
 * Se retira solo al pasar la fecha de src/lib/event-banner.ts, o con
 * `enabled: false`. El cierre se recuerda en el navegador; como localStorage
 * puede fallar (ventana privada, datos bloqueados), todo acceso va protegido y
 * el aviso se ve igual.
 */
export function EventBanner() {
  const { lang } = useLang();
  const c = getContent(lang).eventBanner;
  const ref = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      // sin almacenamiento: el aviso queda visible hasta recargar
    }
  }, []);

  // Pausa las animaciones cuando el cartel sale de pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) =>
      setVisible(entries.some((e) => e.isIntersecting)),
    );
    io.observe(el);
    return () => io.disconnect();
  }, [dismissed]);

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
    <div
      ref={ref}
      data-paused={!visible}
      className="ctw-banner relative z-40 overflow-hidden border-b border-[#c4f023]/30 bg-[#0e0e15] py-2.5 pr-11 pl-3 sm:py-3 sm:pr-14 sm:pl-6"
    >
      <span aria-hidden="true" className="ctw-aurora ctw-aurora-a" />
      <span aria-hidden="true" className="ctw-aurora ctw-aurora-b" />
      <span aria-hidden="true" className="ctw-beam ctw-beam-top" />
      <span aria-hidden="true" className="ctw-beam ctw-beam-bottom" />

      <div className="relative mx-auto flex max-w-5xl items-center justify-center gap-3 text-left text-xs sm:gap-6 sm:text-sm">
        <span
          className="ctw-logo relative inline-block shrink-0"
          style={{ "--ctw-logo": `url(${cordobaTechWeekLogo})` } as CSSProperties}
        >
          <img
            src={cordobaTechWeekLogo}
            alt="Córdoba Tech Week"
            className="relative block h-10 w-auto sm:h-14"
          />
          <span aria-hidden="true" className="ctw-shine" />
        </span>
        <p className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-semibold text-foreground">
            <span className="hidden sm:inline">{c.lead} · </span>
            {c.dates}
          </span>
          <Link to="/" hash="soluciones" className="ctw-cta font-bold">
            {c.cta} →
          </Link>
        </p>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label={c.close}
        className="absolute top-1/2 right-2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
