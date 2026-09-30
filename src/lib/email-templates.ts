import { EMAIL_LOGO_CONTENT_ID } from "./email-logo";

/**
 * Plantilla HTML del mail que recibe quien solicita el framework ARIA (ver
 * framework-request.server.ts). Colores y tipografía tomados de la paleta
 * oficial del Brand Book (los mismos tokens que usa el sitio, ver
 * src/styles.css) — no de una librería de componentes de mail, porque los
 * clientes de correo (sobre todo Outlook de escritorio) no soportan CSS
 * moderno: todo es tablas + estilos inline, sin flexbox/grid ni variables
 * CSS, con una pila de fuentes de sistema como respaldo si Sora/Manrope no
 * cargan.
 *
 * El logo viaja como adjunto inline (cid:) en vez de linkear una URL
 * pública — ver email-logo.ts.
 */

const BRAND_RED = "#ff000d";
const INK = "#232234";
const BACKGROUND = "#14131c";
const CORP_GRAY = "#706f6f";
const FONT_DISPLAY = "'Sora', Arial, Helvetica, sans-serif";
const FONT_SANS = "'Manrope', Arial, Helvetica, sans-serif";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildAriaFrameworkEmailHtml({
  nombre,
  frameworkTitle,
}: {
  nombre: string;
  frameworkTitle: string;
}) {
  const safeName = escapeHtml(nombre);
  const safeTitle = escapeHtml(frameworkTitle);
  const greeting = safeName ? `¡Hola ${safeName}!` : "¡Hola!";

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Framework ${safeTitle} | AR IT Services</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:${FONT_SANS};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
            <!-- Barra de acento -->
            <tr>
              <td style="height:4px; background-color:${BRAND_RED}; font-size:0; line-height:0;">&nbsp;</td>
            </tr>
            <!-- Header -->
            <tr>
              <td style="background-color:${BACKGROUND}; padding:28px 40px;">
                <img
                  src="cid:${EMAIL_LOGO_CONTENT_ID}"
                  alt="AR IT Services"
                  width="44"
                  height="44"
                  style="display:block; width:44px; height:44px; border:0;"
                />
              </td>
            </tr>
            <!-- Contenido -->
            <tr>
              <td style="padding:40px;">
                <p style="margin:0 0 8px; font-family:${FONT_SANS}; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${BRAND_RED};">
                  Framework propio
                </p>
                <h1 style="margin:0 0 20px; font-family:${FONT_DISPLAY}; font-size:26px; font-weight:800; letter-spacing:-0.02em; color:${INK};">
                  ${greeting}
                </h1>
                <p style="margin:0 0 16px; font-family:${FONT_SANS}; font-size:15px; line-height:1.6; color:${INK};">
                  Gracias por tu interés en <strong>${safeTitle}</strong>, nuestro framework de Adopción Responsable de IA para diseñar la empresa AI-Native del mediano y largo plazo.
                </p>
                <p style="margin:0 0 28px; font-family:${FONT_SANS}; font-size:15px; line-height:1.6; color:${INK};">
                  Te dejamos el material completo <strong>adjunto en este mail</strong>, en formato PDF.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                  <tr>
                    <td style="background-color:${BRAND_RED}; border-radius:999px;">
                      <a
                        href="mailto:arconsultores@arconsultores.com.ar?subject=${encodeURIComponent(`Consulta sobre ${frameworkTitle}`)}"
                        style="display:inline-block; padding:13px 28px; font-family:${FONT_SANS}; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:999px;"
                      >
                        Responder este mail →
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0; font-family:${FONT_SANS}; font-size:13px; line-height:1.6; color:${CORP_GRAY};">
                  Si tenés preguntas sobre cómo aplicar ${safeTitle} en tu organización, respondé directamente este correo y te contactamos.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px; background-color:#f9f9fb; border-top:1px solid #ececee;">
                <p style="margin:0 0 4px; font-family:${FONT_SANS}; font-size:13px; font-weight:700; color:${INK};">
                  AR IT Services
                </p>
                <p style="margin:0; font-family:${FONT_SANS}; font-size:12px; line-height:1.6; color:${CORP_GRAY};">
                  Software, datos y equipos dedicados desde 2001 · Dallas · Córdoba · Asunción
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
