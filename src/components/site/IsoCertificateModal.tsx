import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { ISO_CERTIFICATE } from "@/lib/iso-certificate";

/**
 * Modal del certificado ISO 9001:2015: resume los datos del certificado (empresa,
 * certificadora, alcance y número). A propósito no muestra fechas de emisión ni
 * vigencia ni enlaza al PDF, para no tener que tocar la web en cada recertificación.
 * Los textos viven en content.ts (`iso.modal`) y siguen el idioma del sitio.
 */
export function IsoCertificateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const c = getContent(lang).iso.modal;
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useOutsideClick(ref, onClose);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={c.title}
    >
      <div
        ref={ref}
        className="relative w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={c.closeLabel}
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="font-mono text-[11px] tracking-widest text-primary uppercase">{c.eyebrow}</p>
        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight">{c.title}</h3>

        <dl className="mt-5 divide-y divide-white/10 text-sm">
          {c.rows.map((row) => (
            <div key={row.label} className="grid gap-1 py-2.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {c.verify}{" "}
          <a
            href={`tel:${ISO_CERTIFICATE.verifyPhone.replace(/\s/g, "")}`}
            className="font-semibold text-foreground underline-offset-2 hover:underline"
          >
            {ISO_CERTIFICATE.verifyPhone}
          </a>
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">{c.note}</p>
      </div>
    </div>,
    document.body,
  );
}
