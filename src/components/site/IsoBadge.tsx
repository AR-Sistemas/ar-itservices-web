/**
 * Badge de certificación ISO 9001:2015 armado en código (sin imagen externa).
 * Ícono de escudo con check en trazo (no relleno) en rojo de marca, y texto en
 * dos líneas. Hereda el fondo/borde de la tarjeta contenedora, así que no lleva
 * chrome propio en la franja de métricas.
 *
 * `compact` → versión a mitad de tamaño, horizontal, para el footer.
 *
 * Al hacer clic en el ícono abre el modal del certificado (IsoCertificateModal)
 * con los datos de la certificación.
 *
 * NOTA: si el organismo certificador provee su isotipo oficial, reemplazar este
 * badge por ese archivo tal cual (sin recolorear ni deformar).
 */
import { useState } from "react";
import { IsoCertificateModal } from "./IsoCertificateModal";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

function ShieldCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 5 5.7v5.1c0 4.3 2.9 7.4 7 8.7 4.1-1.3 7-4.4 7-8.7V5.7L12 3Z" />
      <path d="m8.7 12 2.3 2.3 4.3-4.3" />
    </svg>
  );
}

export function IsoBadge({
  compact = false,
  metric = false,
  className = "",
  label = "Certificados",
}: {
  compact?: boolean;
  /** Para la franja de métricas: ícono + "ISO 9001:2015" en la línea de los números y la etiqueta debajo. */
  metric?: boolean;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const title = getContent(lang).iso.modal.title;

  // El ícono (y el texto, en la franja de métricas) abren el modal con los datos.
  const trigger =
    "cursor-pointer transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const icon = (size: string) => (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-label={title}
      className={`${size} shrink-0 rounded-md text-primary hover:scale-110 ${trigger}`}
    >
      <ShieldCheck className="h-full w-full" />
    </button>
  );

  return (
    <>
      {metric ? (
        <div className={className}>
          <div className="flex h-9 items-center gap-2.5 sm:h-12 lg:h-10 xl:h-12">
            {icon("h-8 w-8 sm:h-9 sm:w-9")}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              className={`rounded-md font-display text-lg font-bold whitespace-nowrap text-foreground sm:text-xl lg:text-base xl:text-lg ${trigger}`}
            >
              ISO 9001:2015
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        </div>
      ) : compact ? (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          {icon("h-5 w-5")}
          <span className="leading-tight">
            <span className="block text-xs font-medium text-foreground">ISO 9001:2015</span>
            <span className="block text-[0.65rem] text-muted-foreground">{label}</span>
          </span>
        </div>
      ) : (
        <div className={`flex flex-col items-start justify-center ${className}`}>
          {icon("h-10 w-10")}
          <span className="mt-3 block font-display text-lg font-medium text-foreground">
            ISO 9001:2015
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
        </div>
      )}
      <IsoCertificateModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
