import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/contact.server";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ContactType = "empresa" | "postulante" | "consulta";

export type OpenContactOptions = {
  /** Pestaña con la que abre (por defecto, "empresa"). */
  type?: ContactType;
  /** Mensaje precargado. */
  message?: string;
  /** Nombre del producto de interés (va en el mail como "Producto de interés"). */
  producto?: string;
  /**
   * Postulación a una búsqueda concreta del feed de AR Recruiting. Con `avisoId`
   * el modal queda fijo en "postulante" (sin pestañas), el puesto va de título y
   * no se puede editar, y el mail lleva el id del aviso.
   */
  avisoId?: string;
  puesto?: string;
  /** Limita las opciones que se pueden elegir en el formulario. */
  allowedTypes?: ContactType[];
  /** Abre un único formulario sin mostrar el selector de tipo. */
  hideTypeSelector?: boolean;
};

/**
 * Qué formulario abre cada botón (un solo modal, mismo diseño y mismos campos):
 *  - "Hablemos" del navbar y CTA generales      → "empresa" (por defecto).
 *  - CTA de una solución ("Conversemos…")       → "consulta" + producto: quiere
 *    saber de un producto, no encargar un proyecto; la empresa es opcional.
 *  - "Dejanos tu CV" / "Hablemos" del bloque de equipo → "postulante".
 *  - "Postularme" de una búsqueda               → "postulante" fijo con `avisoId`.
 */
const ContactModalContext = createContext<(options?: OpenContactOptions) => void>(() => {});

/**
 * Abre el formulario de contacto en un modal desde cualquier página, en lugar
 * de redirigir a la sección #contacto de la home.
 */
export function useContactModal() {
  return useContext(ContactModalContext);
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  // `key` cambia en cada apertura: el modal se monta de cero (formulario limpio
  // y trampa de tiempo reiniciada).
  const [state, setState] = useState<{ key: number; options: OpenContactOptions } | null>(null);
  const open = useCallback(
    (options: OpenContactOptions = {}) =>
      setState((prev) => ({ key: (prev?.key ?? 0) + 1, options })),
    [],
  );
  const close = useCallback(() => setState(null), []);

  return (
    <ContactModalContext.Provider value={open}>
      {children}
      {state && <ContactModal key={state.key} options={state.options} onClose={close} />}
    </ContactModalContext.Provider>
  );
}

const INPUT = "mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm";

function ContactModal({ options, onClose }: { options: OpenContactOptions; onClose: () => void }) {
  const { lang } = useLang();
  const c = getContent(lang);
  const f = c.contact.fields;
  const es = lang === "ES";
  // Con aviso es una postulación: el tipo no se elige.
  const locked = Boolean(options.avisoId);
  const allowedTypes = options.allowedTypes ?? ["empresa", "postulante", "consulta"];
  const typeSelectorHidden = locked || options.hideTypeSelector === true;
  const [type, setType] = useState<ContactType>(
    locked ? "postulante" : (options.type ?? "empresa"),
  );
  const [message, setMessage] = useState(
    options.message ??
      (locked && options.puesto
        ? c.contact.applicationDraft.replace("{puesto}", options.puesto)
        : ""),
  );
  const [sending, setSending] = useState(false);
  // Trampa de tiempo anti-bot (ver contact.server.ts): el modal se monta al abrir.
  const [startedAt] = useState(() => Date.now());
  const previousFocus = useRef<HTMLElement | null>(null);
  const send = useServerFn(sendContactEmail);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    send({ data: new FormData(e.currentTarget) })
      .then(() => {
        setSending(false);
        toast.success(c.contact.success);
        onClose();
      })
      .catch((err) => {
        console.error(err);
        setSending(false);
        toast.error(c.contact.error);
      });
  };

  const showProduct = Boolean(options.producto) && type !== "postulante";

  return (
    <Dialog.Root
      open={true}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] grid place-items-start overflow-y-auto bg-black/60 p-4 sm:place-items-center">
          <Dialog.Content
            aria-labelledby="contact-modal-title"
            aria-describedby={undefined}
            onOpenAutoFocus={() => {
              previousFocus.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              previousFocus.current?.focus();
            }}
            className="relative my-auto w-full max-w-2xl rounded-2xl border border-primary/40 bg-card p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={c.frameworkModal.closeLabel}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2
              id="contact-modal-title"
              className="pr-10 text-2xl font-bold tracking-tight text-balance"
            >
              {locked
                ? options.puesto
                : type === "postulante"
                  ? c.contact.candidateHeading
                  : type === "consulta"
                    ? c.contact.generalHeading
                    : c.contact.heading}
            </h2>
            {!locked &&
              (() => {
                const sub =
                  type === "postulante"
                    ? c.contact.candidateSubtitle
                    : type === "consulta"
                      ? c.contact.generalSubtitle
                      : c.contact.subtitle;
                // La bajada de "empresa" se eliminó (queda vacía): no se dibuja un párrafo vacío.
                return sub ? <p className="mt-2 text-sm text-muted-foreground">{sub}</p> : null;
              })()}

            {!typeSelectorHidden && (
              <div
                className={`mt-6 grid gap-1.5 rounded-2xl border border-border bg-background/40 p-1.5 ${allowedTypes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
              >
                {(
                  [
                    ["empresa", c.contact.typeLabels.company],
                    ["postulante", c.contact.typeLabels.candidate],
                    ["consulta", c.contact.typeLabels.general],
                  ] as const
                )
                  .filter(([value]) => allowedTypes.includes(value))
                  .map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={type === value}
                      onClick={() => setType(value)}
                      className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-2 py-2 text-center text-xs leading-tight font-medium text-balance transition-colors sm:text-sm ${
                        type === value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
              <input type="hidden" name="contactType" value={type} />
              <input type="hidden" name="formStartedAt" value={startedAt} />
              {locked && <input type="hidden" name="aviso_id" value={options.avisoId} />}
              {showProduct && <input type="hidden" name="producto" value={options.producto} />}
              {/* Honeypot anti-bot: invisible para personas (ver contact.server.ts). */}
              <input
                type="text"
                name="sitio_web"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {showProduct && (
                <p className="rounded-full border border-primary/40 bg-background/40 px-4 py-2 text-sm sm:col-span-2">
                  <span className="text-muted-foreground">{c.contact.productLabel}: </span>
                  <span className="font-semibold">{options.producto}</span>
                </p>
              )}

              {/* Nombre y email ocupan el mismo lugar en todos los tipos: al cambiar
                  de pestaña no se pierde lo que ya se escribió. */}
              <div>
                <label htmlFor="cm-nombre" className="text-sm font-medium">
                  {f.name}
                </label>
                <input
                  id="cm-nombre"
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={es ? "Tu nombre completo" : "Your full name"}
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="cm-email" className="text-sm font-medium">
                  {f.email}
                </label>
                <input
                  id="cm-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={es ? "nombre@ejemplo.com" : "name@example.com"}
                  className={INPUT}
                />
              </div>

              {type === "empresa" && (
                <>
                  <div>
                    <label htmlFor="cm-empresa" className="text-sm font-medium">
                      {f.company}
                    </label>
                    <input
                      id="cm-empresa"
                      name="empresa"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder={es ? "Nombre de tu empresa" : "Your company name"}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor="cm-telefono" className="text-sm font-medium">
                      {f.phone}
                    </label>
                    <input
                      id="cm-telefono"
                      name="telefono"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+54 9 351 123 4567"
                      className={INPUT}
                    />
                  </div>
                  <CountryField
                    label={f.country}
                    countries={c.contact.countries}
                    className="sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <label htmlFor="cm-tipo" className="text-sm font-medium">
                      {f.projectType}
                    </label>
                    <select id="cm-tipo" name="tipo" className={INPUT}>
                      {c.contact.projectOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {type === "postulante" && (
                <>
                  <div>
                    <label htmlFor="cm-telefono" className="text-sm font-medium">
                      {f.phone}
                    </label>
                    <input
                      id="cm-telefono"
                      name="telefono"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+54 9 351 123 4567"
                      className={INPUT}
                    />
                  </div>
                  <CountryField label={f.country} countries={c.contact.countries} />
                  {/* Con aviso el puesto es el de la búsqueda y viaja fijo; sin aviso
                      (postulación espontánea) se escribe a mano. */}
                  {!locked && (
                    <div className="sm:col-span-2">
                      <label htmlFor="cm-puesto" className="text-sm font-medium">
                        {f.position}
                      </label>
                      <input
                        id="cm-puesto"
                        name="puesto"
                        type="text"
                        placeholder={
                          es ? "Ej.: Desarrollador/a Full Stack" : "e.g. Full Stack Developer"
                        }
                        className={INPUT}
                      />
                    </div>
                  )}
                  {locked && <input type="hidden" name="puesto" value={options.puesto} />}
                  <div className="sm:col-span-2">
                    <label htmlFor="cm-cv" className="text-sm font-medium">
                      {f.resume}
                    </label>
                    <input
                      id="cm-cv"
                      name="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
                    />
                  </div>
                </>
              )}

              {type === "consulta" && (
                <>
                  <div>
                    <label htmlFor="cm-empresa" className="text-sm font-medium">
                      {f.company}{" "}
                      <span className="text-muted-foreground">
                        {c.frameworkModal.fields.companyOptional}
                      </span>
                    </label>
                    <input
                      id="cm-empresa"
                      name="empresa"
                      type="text"
                      autoComplete="organization"
                      placeholder={es ? "Nombre de tu empresa" : "Your company name"}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor="cm-telefono" className="text-sm font-medium">
                      {f.phone}
                    </label>
                    <input
                      id="cm-telefono"
                      name="telefono"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+54 9 351 123 4567"
                      className={INPUT}
                    />
                  </div>
                  <CountryField
                    label={f.country}
                    countries={c.contact.countries}
                    className="sm:col-span-2"
                  />
                </>
              )}

              <div className="sm:col-span-2">
                <label htmlFor="cm-mensaje" className="text-sm font-medium">
                  {f.message}
                </label>
                <textarea
                  id="cm-mensaje"
                  name="mensaje"
                  rows={6}
                  required={type !== "postulante"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "postulante"
                      ? es
                        ? "Contanos por qué te interesa"
                        : "Tell us why you're interested"
                      : es
                        ? "Contanos en qué podemos ayudarte"
                        : "Tell us how we can help"
                  }
                  className={`${INPUT} min-h-36 resize-y`}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? c.contact.submitting
                    : type === "postulante"
                      ? c.careers.applySubmitLabel
                      : c.contact.submit}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CountryField({
  label,
  countries,
  className = "",
}: {
  label: string;
  countries: string[];
  className?: string;
}) {
  const [value, setValue] = useState("");

  return (
    <div className={className}>
      <label htmlFor="cm-pais" className="text-sm font-medium">
        {label}
      </label>
      <Select value={value} onValueChange={setValue} name="pais" required>
        <SelectTrigger id="cm-pais" className={`${INPUT} h-auto text-left`}>
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent side="bottom" avoidCollisions={false} className="max-h-64">
          {countries.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
