/**
 * Badge de certificación ISO 9001:2015 armado en código (sin imagen externa).
 * Ícono de escudo con check en trazo (no relleno) en rojo de marca, y texto en
 * dos líneas. Hereda el fondo/borde de la tarjeta contenedora, así que no lleva
 * chrome propio en la franja de métricas.
 *
 * `compact` → versión a mitad de tamaño, horizontal, para el footer.
 *
 * Al hacer clic abre el modal del certificado (IsoCertificateModal) con los datos
 * y el PDF original de Bureau Veritas.
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
  className = "",
  label = "Certificados",
}: {
  compact?: boolean;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const view = getContent(lang).iso.view;

  const trigger = compact ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      title={view}
      className={`group inline-flex items-center gap-2 rounded-md text-left transition-opacity hover:opacity-80 ${className}`}
    >
      <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
      <span className="leading-tight">
        <span className="block text-xs font-medium text-foreground">ISO 9001:2015</span>
        <span className="block text-[0.65rem] text-muted-foreground group-hover:text-primary">
          {label}
        </span>
      </span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      className={`group flex flex-col items-start justify-center rounded-lg text-left ${className}`}
    >
      <ShieldCheck className="h-10 w-10 text-primary" />
      <span className="mt-3 block font-display text-lg font-medium text-foreground">
        ISO 9001:2015
      </span>
      <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
      <span className="mt-1 block text-xs font-semibold text-primary transition-colors group-hover:text-brand-dark">
        {view} →
      </span>
    </button>
  );

  return (
    <>
      {trigger}
      <IsoCertificateModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
