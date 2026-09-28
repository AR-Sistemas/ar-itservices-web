import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";

const REQUEST_EMAIL = "arconsultores@arconsultores.com.ar";

/**
 * Modal chico para solicitar el framework ARIA por mail. Arma un `mailto:`
 * con los datos cargados y abre el cliente de correo del propio visitante
 * — no pasa por el backend de #contacto (que sí envía por Resend), así que
 * depende de que el visitante tenga un cliente de mail configurado.
 */
export function FrameworkRequestModal({
  open,
  onClose,
  frameworkTitle,
}: {
  open: boolean;
  onClose: () => void;
  frameworkTitle: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Quiero el framework ${frameworkTitle}`;
    const bodyLines = [
      `Nombre: ${name}`,
      `Email de contacto: ${email}`,
      company ? `Empresa: ${company}` : null,
      "",
      `Hola, quiero solicitar el framework ${frameworkTitle}.`,
    ].filter(Boolean);
    const mailto = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 animate-in fade-in-0 duration-200 motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Solicitar ${frameworkTitle}`}
    >
      <div
        ref={ref}
        className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-card p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="font-mono text-[11px] tracking-widest text-primary uppercase">Framework propio</p>
        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
          Solicitá {frameworkTitle}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Dejanos tus datos y te escribimos con el material completo.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="framework-name" className="text-sm font-medium">
              Nombre
            </label>
            <input
              id="framework-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="framework-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="framework-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="framework-company" className="text-sm font-medium">
              Empresa <span className="text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="framework-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
          >
            Solicitar por mail
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Se abre tu cliente de correo con el mensaje ya armado, dirigido a nuestro equipo.
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
}
