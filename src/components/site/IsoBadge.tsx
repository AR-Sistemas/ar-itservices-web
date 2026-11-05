import { useState } from "react";

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group inline-flex cursor-pointer items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
        aria-label="Ver certificado ISO 9001:2015"
      >
        <ShieldCheck className={`${compact ? "h-5 w-5" : "h-10 w-10"} shrink-0 text-brand-text`} />
        <span className="leading-tight">
          <span
            className={`${compact ? "text-xs" : "text-lg"} block font-medium text-foreground transition-colors group-hover:text-brand-text`}
          >
            ISO 9001:2015
          </span>
          {label && (
            <span className="block text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              {label}
            </span>
          )}
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ISO 9001:2015"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>
            <h2 className="pr-10 font-display text-2xl font-extrabold">ISO 9001:2015</h2>
            <dl className="mt-5 divide-y divide-border text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted-foreground">Empresa</dt>
                <dd className="font-medium">AR Consultores S.R.L.</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted-foreground">Certificadora</dt>
                <dd className="font-medium">Bureau Veritas Certification, acreditada por el OAA</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted-foreground">Alcance</dt>
                <dd className="font-medium">
                  Desarrollo de productos de software a medida y provisión de recursos humanos para
                  desarrollo de software.
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted-foreground">Certificado N°</dt>
                <dd className="font-medium">AR-O240463</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
