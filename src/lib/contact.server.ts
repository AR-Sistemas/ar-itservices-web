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
