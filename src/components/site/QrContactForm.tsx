import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/contact.server";
import { getContent } from "@/i18n/content";
import { useLang } from "@/i18n/language";
import { useSpringPress } from "./useSpringPress";

export function QrContactForm({
  contactType,
  onSuccess,
  onSendingChange,
}: {
  contactType: "empresa" | "postulante";
  onSuccess: () => void;
  onSendingChange: (sending: boolean) => void;
}) {
  const { lang } = useLang();
  const c = getContent(lang);
  const sendContact = useServerFn(sendContactEmail);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formStartedAt] = useState(() => Date.now());
  const [selectedPosition, setSelectedPosition] = useState("");
  const [empresaValue, setEmpresaValue] = useState("");
  const [paisValue, setPaisValue] = useState("");
  const [tipoValue, setTipoValue] = useState("");
  const [telefonoValue, setTelefonoValue] = useState("");
  const [mensajeValue, setMensajeValue] = useState("");
  const avisoId = "";
  const positionOptions = c.careers.positions;
  const puestoSelectValue = selectedPosition;
  const submitCta = useSpringPress<HTMLButtonElement>();
  return (
    <form
      className="mt-8 grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const formData = new FormData(formEl);
        setSendState("sending");
        onSendingChange(true);
        sendContact({ data: formData })
          .then(() => {
            setSendState("sent");
            onSendingChange(false);
            toast.success(c.contact.success);
            formEl.reset();
            onSuccess();
            setSelectedPosition("");
            setEmpresaValue("");
            setPaisValue("");
            setTipoValue("");
            setTelefonoValue("");
            setMensajeValue("");
          })
          .catch((err) => {
            console.error(err);
            setSendState("error");
            onSendingChange(false);
            toast.error(c.contact.error);
          });
      }}
    >
      <input type="hidden" name="contactType" value={contactType} />
      {/* Id del aviso del feed de AR Recruiting, si la postulación
                    viene de una búsqueda concreta. Vacío = postulación
                    espontánea. */}
      <input type="hidden" name="aviso_id" value={avisoId} />
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      {/* Honeypot anti-bot: invisible para personas, los bots que
                    autocompletan todo el formulario sí lo llenan (ver
                    src/lib/contact.server.ts). */}
      <input
        type="text"
        name="sitio_web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <Field id="nombre" label={c.contact.fields.name} />
      <Field id="email" label={c.contact.fields.email} type="email" />

      {contactType === "empresa" && (
        <Field
          id="empresa"
          label={c.contact.fields.company}
          value={empresaValue}
          onChange={setEmpresaValue}
        />
      )}
      {contactType === "postulante" && (
        <Field
          id="telefono"
          label={c.contact.fields.phone}
          type="tel"
          value={telefonoValue}
          onChange={setTelefonoValue}
        />
      )}

      {true && (
        <SelectField
          id="pais"
          label={c.contact.fields.country}
          options={c.contact.countries}
          value={paisValue}
          onChange={setPaisValue}
        />
      )}

      {contactType === "empresa" && (
        <div className="sm:col-span-2">
          <label htmlFor="tipo" className="text-sm font-medium">
            {c.contact.fields.projectType}
          </label>
          <select
            id="tipo"
            name="tipo"
            value={tipoValue || c.contact.projectOptions[0]}
            onChange={(e) => setTipoValue(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
          >
            {c.contact.projectOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {contactType === "postulante" && (
        <>
          <div className="sm:col-span-2">
            <label htmlFor="puesto" className="text-sm font-medium">
              {c.contact.fields.position}
            </label>
            <select
              id="puesto"
              name="puesto"
              value={puestoSelectValue}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
            >
              <option value="">—</option>
              {positionOptions.map((p) => (
                <option key={p.title} value={p.title}>
                  {p.title}
                </option>
              ))}
              <option value="otro">{c.contact.fields.positionOther}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cv" className="text-sm font-medium">
              {c.contact.fields.resume}
            </label>
            <input
              id="cv"
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
            />
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label htmlFor="mensaje" className="text-sm font-medium">
          {c.contact.fields.message}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={mensajeValue}
          onChange={(e) => setMensajeValue(e.target.value)}
          rows={5}
          required={contactType !== "postulante"}
          className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          ref={submitCta.ref}
          onMouseDown={submitCta.press}
          type="submit"
          disabled={sendState === "sending"}
          className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sendState === "sending" ? c.contact.submitting : c.contact.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
      >
        <option value="" disabled>
          —
        </option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
