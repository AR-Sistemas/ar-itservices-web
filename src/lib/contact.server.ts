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
 */

const RECIPIENTS: Record<string, string> = {
  empresa: "arconsultores@arconsultores.com.ar",
  postulante: "rrhh@arconsultores.com.ar",
  consulta: "arconsultores@arconsultores.com.ar",
};

// TODO: una vez verificado el dominio arconsultores.com.ar en Resend,
// cambiar por algo como "Sitio AR IT Services <contacto@arconsultores.com.ar>".
// Hasta entonces, Resend solo permite enviar "from" su propio dominio de
// pruebas (funciona igual, el remitente visible es distinto).
const FROM_ADDRESS = "Sitio AR IT Services <onboarding@resend.dev>";

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
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((data: unknown): ContactFormData => {
    if (!(data instanceof FormData)) {
      throw new Error("Se esperaba FormData");
    }
    const get = (key: string) => (data.get(key)?.toString() ?? "").trim();
    const cv = data.get("cv");
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
    };
  })
  .handler(async ({ data }) => {
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
      subject: `Nuevo contacto (${data.contactType}) — ${data.nombre || "sin nombre"}`,
      text: buildBody(data),
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true as const };
  });
