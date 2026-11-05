import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { ARIA_PDF_BASE64, ARIA_PDF_FILENAME } from "./framework-aria-pdf";
import { EMAIL_LOGO_BASE64, EMAIL_LOGO_CONTENT_ID, EMAIL_LOGO_FILENAME } from "./email-logo";
import { buildAriaFrameworkEmailHtml } from "./email-templates";

/**
 * Modal de "Solicitá ARIA" (ver FrameworkRequestModal.tsx): antes armaba un
 * `mailto:` y dependía del cliente de correo del visitante. Ahora manda dos
 * mails de verdad por Resend (pedido de gerencia, sept. 2026):
 *  1. al visitante, con una plantilla HTML de marca (ver email-templates.ts)
 *     y el PDF del framework adjunto — automático, sin que nadie del equipo
 *     tenga que hacer nada.
 *  2. un aviso interno a arconsultores@arconsultores.com.ar con los datos
 *     cargados, para que el equipo pueda hacer seguimiento comercial (texto
 *     plano, no necesita ser lindo — es para uso interno).
 *
 * Mismo anti-spam (honeypot + trampa de tiempo) que #contacto — ver
 * src/lib/contact.server.ts para el detalle de por qué funciona así.
 */

const NOTIFY_EMAIL = "arconsultores@arconsultores.com.ar";
const FROM_ADDRESS = "Sitio AR IT Services <no-responder@arconsultores.com.ar>";
const MIN_FILL_TIME_MS = 1500;

interface FrameworkRequestData {
  nombre: string;
  email: string;
  empresa: string;
  frameworkTitle: string;
  isLikelyBot: boolean;
}

export const sendFrameworkRequest = createServerFn({ method: "POST" })
  .validator((data: unknown): FrameworkRequestData => {
    if (!(data instanceof FormData)) {
      throw new Error("Se esperaba FormData");
    }
    const get = (key: string) => (data.get(key)?.toString() ?? "").trim();

    const honeypot = get("sitio_web");
    const startedAt = Number(get("formStartedAt"));
    const fillTime = Number.isFinite(startedAt) ? Date.now() - startedAt : 0;
    const isLikelyBot =
      honeypot !== "" || !Number.isFinite(startedAt) || fillTime < MIN_FILL_TIME_MS;

    return {
      nombre: get("nombre"),
      email: get("email"),
      empresa: get("empresa"),
      frameworkTitle: get("frameworkTitle") || "ARIA",
      isLikelyBot,
    };
  })
  .handler(async ({ data }) => {
    // Mismo criterio que #contacto: se responde éxito sin mandar nada, para
    // no darle pistas al bot de que fue detectado.
    if (data.isLikelyBot) {
      return { ok: true as const };
    }

    if (!data.email) {
      throw new Error("Falta el email.");
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      throw new Error("Falta configurar RESEND_API_KEY en las variables de entorno del servidor.");
    }

    const resend = new Resend(apiKey);

    // Fallback en texto plano para clientes de correo que no rendericen
    // HTML (o para quien lea el mail desde una vista de solo-texto).
    const visitorText = [
      `¡Hola${data.nombre ? " " + data.nombre : ""}!`,
      "",
      `Gracias por tu interés en ${data.frameworkTitle}, nuestro framework de Adopción Responsable de IA.`,
      "Te dejamos el material completo adjunto en este mail.",
      "",
      "Si tenés preguntas, respondé directamente este correo y te contactamos.",
      "",
      "Equipo AR IT Services",
    ].join("\n");

    const { error: visitorError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: data.email,
      replyTo: NOTIFY_EMAIL,
      subject: `Framework ${data.frameworkTitle} | AR IT Services`,
      text: visitorText,
      html: buildAriaFrameworkEmailHtml({
        nombre: data.nombre,
        frameworkTitle: data.frameworkTitle,
      }),
      attachments: [
        { filename: ARIA_PDF_FILENAME, content: ARIA_PDF_BASE64 },
        {
          filename: EMAIL_LOGO_FILENAME,
          content: EMAIL_LOGO_BASE64,
          contentId: EMAIL_LOGO_CONTENT_ID,
        },
      ],
    });
    if (visitorError) {
      throw new Error(visitorError.message);
    }

    const internalBody = [
      `Nombre: ${data.nombre || "—"}`,
      `Email: ${data.email}`,
      data.empresa && `Empresa: ${data.empresa}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    const { error: internalError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `Nueva solicitud del framework ${data.frameworkTitle} | ${data.nombre || "sin nombre"}`,
      text: internalBody,
    });
    if (internalError) {
      throw new Error(internalError.message);
    }

    return { ok: true as const };
  });
