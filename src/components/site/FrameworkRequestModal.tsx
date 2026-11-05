import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { toast } from "sonner";
import { sendFrameworkRequest } from "@/lib/framework-request.server";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

/**
 * Modal chico para solicitar el framework ARIA. Envía por mail (vía Resend,
 * ver framework-request.server.ts) el PDF del framework directo al
 * visitante, más un aviso interno al equipo — antes esto era un `mailto:`
 * client-side (dependía del cliente de correo del visitante y no adjuntaba
 * nada); ahora es automático.
 *
 * Los textos de la UI siguen el idioma activo del sitio (c.frameworkModal.*
 * en content.ts) — antes estaban hardcodeados en español y no cambiaban al
 * pasar a inglés. El mail que se manda (asunto/cuerpo) sigue en español por
 * ahora; eso vive en framework-request.server.ts y no en este componente.
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
  const { lang } = useLang();
  const c = getContent(lang).frameworkModal;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending">("idle");
  // Trampa de tiempo anti-bot (ver contact.server.ts): se resetea cada vez
  // que el modal se abre, no en el mount del componente (que puede vivir
  // montado bastante antes de que alguien lo abra).
  const [openedAt, setOpenedAt] = useState(() => Date.now());
  const previousFocus = useRef<HTMLElement | null>(null);
  const sendRequest = useServerFn(sendFrameworkRequest);

  useEffect(() => {
    if (open) setOpenedAt(Date.now());
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("frameworkTitle", frameworkTitle);
    setSendState("sending");
    sendRequest({ data: formData })
      .then(() => {
        setSendState("idle");
        toast.success(c.successToast(frameworkTitle));
        setName("");
        setEmail("");
        setCompany("");
        onClose();
      })
      .catch((err) => {
        console.error(err);
        setSendState("idle");
        toast.error(c.errorToast);
      });
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4">
          <Dialog.Content
            aria-label={c.requestTitle(frameworkTitle)}
            aria-describedby={undefined}
            onOpenAutoFocus={() => {
              previousFocus.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              previousFocus.current?.focus();
            }}
            className="relative my-auto w-full max-w-md rounded-2xl border border-primary/40 bg-card p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={c.closeLabel}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="pr-10 font-display text-2xl font-extrabold tracking-tight">
              {c.requestTitle(frameworkTitle)}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="formStartedAt" value={openedAt} />
              {/* Honeypot anti-bot: invisible para personas (ver contact.server.ts). */}
              <input
                type="text"
                name="sitio_web"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <div>
                <label htmlFor="framework-name" className="text-sm font-medium">
                  {c.fields.name}
                </label>
                <input
                  id="framework-name"
                  name="nombre"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "ES" ? "Tu nombre completo" : "Your full name"}
                  className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="framework-email" className="text-sm font-medium">
                  {c.fields.email}
                </label>
                <input
                  id="framework-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === "ES" ? "nombre@ejemplo.com" : "name@example.com"}
                  className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="framework-company" className="text-sm font-medium">
                  {c.fields.company}{" "}
                  <span className="text-muted-foreground">{c.fields.companyOptional}</span>
                </label>
                <input
                  id="framework-company"
                  name="empresa"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={lang === "ES" ? "Nombre de tu empresa" : "Your company name"}
                  className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={sendState === "sending"}
                className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendState === "sending" ? c.submitting : c.submit}
              </button>
              <p className="text-center text-xs text-muted-foreground">{c.footnote}</p>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
