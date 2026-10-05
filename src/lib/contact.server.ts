import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";

/**
 * Envía el formulario de #contacto por mail vía Resend (API HTTP — a
 * diferencia de SMTP crudo, funciona sin importar dónde termine
 * desplegado el sitio). El destinatario depende del tipo de consulta
 * elegido en el formulario (pedido de gerencia, sept. 2026):
 *  - "empresa"    -> arconsultores@arconsultores.com.ar
 *  - "postulante" -> rrhh@arconsultores.com.ar
 *  - "consulta"   -> arconsultores@arconsultores.com.ar
 *
 * Requiere la env var RESEND_API_KEY en el servidor (nunca con prefijo
 * VITE_, que la expondría al bundle del cliente).
 *
 * Anti-spam (pedido de gerencia, sept. 2026): sin captcha de terceros (no
 * hacía falta sumar otra cuenta/servicio para esto), dos chequeos simples
 * del lado del servidor que filtran la enorme mayoría de bots de spam:
 *  - Honeypot: un campo oculto para humanos (CSS) que los bots que
 *    autocompletan todo el formulario sí llenan.
 *  - Trampa de tiempo: un bot que llena y manda el formulario en menos de
 *    ~1.5s no es una persona escribiendo. El timestamp de inicio lo manda
 *    el cliente, pero se valida contra el reloj del servidor.
 * En ambos casos se responde como si el envío fuera exitoso (sin mandar
 * el mail) para no darle pistas al bot de que fue detectado.
 */

const RECIPIENTS: Record<string, string> = {
  empresa: "arconsultores@arconsultores.com.ar",
  postulante: "rrhh@arconsultores.com.ar",
  consulta: "arconsultores@arconsultores.com.ar",
};

const FROM_ADDRESS = "Sitio AR IT Services <no-responder@arconsultores.com.ar>";

const MIN_FILL_TIME_MS = 1500;

// Límites validados en el servidor (los `accept`/`required` del formulario solo
// valen para el navegador y se saltean con un POST directo).
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
// Vercel corta los requests a ~4.5 MB; dejamos margen para el resto del form.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildBody(data: ContactFormData) {
  const lines = [
    `Tipo de consulta: ${data.contactType}`,
    `Nombre: ${data.nombre || "—"}`,
    `Email: ${data.email || "—"}`,
    data.empresa && `Empresa: ${data.empresa}`,
    data.telefono && `Teléfono: ${data.telefono}`,
    data.pais && `País: ${data.pais}`,
    data.tipo && `Tipo de proyecto: ${data.tipo}`,
    data.puesto && `Puesto: ${data.puesto}`,
    // Cuando la postulación viene de una búsqueda del feed, el id permite
    // cruzarla contra el aviso en AR Recruiting. Vacío = espontánea.
    data.avisoId && `Aviso (AR Recruiting): ${data.avisoId}`,
    "",
    "Mensaje:",
    data.mensaje || "(sin mensaje)",
  ].filter((line): line is string => Boolean(line));
  return lines.join("\n");
}

interface ContactFormData {
  contactType: string;
  nombre: string;
  email: string;
  empresa: string;
  telefono: string;
  pais: string;
  tipo: string;
  puesto: string;
  mensaje: string;
  cv: File | null;
  avisoId: string;
  isLikelyBot: boolean;
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((data: unknown): ContactFormData => {
    if (!(data instanceof FormData)) {
      throw new Error("Se esperaba FormData");
    }
    const get = (key: string) => (data.get(key)?.toString() ?? "").trim();
    const cv = data.get("cv");

    // Honeypot: nombre pensado para que los bots que rellenan "todo" un
    // formulario lo completen (ver el input oculto en el form). Cualquier
    // valor acá es señal de bot.
    const honeypot = get("sitio_web");
    const startedAt = Number(get("formStartedAt"));
    const fillTime = Number.isFinite(startedAt) ? Date.now() - startedAt : 0;
    const isLikelyBot = honeypot !== "" || !Number.isFinite(startedAt) || fillTime < MIN_FILL_TIME_MS;

    const shortFields = [
      "nombre",
      "email",
      "empresa",
      "telefono",
      "pais",
      "tipo",
      "puesto",
      "aviso_id",
    ];
    if (shortFields.some((k) => get(k).length > MAX_FIELD_LENGTH)) {
      throw new Error("Campo demasiado largo");
    }
    if (get("mensaje").length > MAX_MESSAGE_LENGTH) {
      throw new Error("Mensaje demasiado largo");
    }
    if (get("email") && !EMAIL_RE.test(get("email"))) {
      throw new Error("Email inválido");
    }
    if (cv instanceof File && cv.size > 0) {
      const name = cv.name.toLowerCase();
      if (cv.size > MAX_CV_BYTES || !CV_EXTENSIONS.some((ext) => name.endsWith(ext))) {
        throw new Error("Archivo no permitido");
      }
    }

    return {
      contactType: get("contactType") || "consulta",
      nombre: get("nombre"),
      email: get("email"),
      empresa: get("empresa"),
      telefono: get("telefono"),
      pais: get("pais"),
      tipo: get("tipo"),
      puesto: get("puesto"),
      mensaje: get("mensaje"),
      cv: cv instanceof File && cv.size > 0 ? cv : null,
      avisoId: get("aviso_id"),
      isLikelyBot,
    };
  })
  .handler(async ({ data }) => {
    // Se responde éxito sin enviar nada — no le damos pistas al bot de que
    // fue detectado, para no incentivarlo a adaptarse.
    if (data.isLikelyBot) {
      return { ok: true as const };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Falta configurar RESEND_API_KEY en las variables de entorno del servidor.",
      );
    }

    const to = RECIPIENTS[data.contactType] ?? RECIPIENTS.consulta;
    const attachments = [];
    if (data.cv) {
      const buffer = Buffer.from(await data.cv.arrayBuffer());
      attachments.push({ filename: data.cv.name, content: buffer });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      replyTo: data.email || undefined,
      subject: `Nuevo contacto (${data.contactType}) | ${data.nombre || "sin nombre"}`,
      text: buildBody(data),
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true as const };
  });
