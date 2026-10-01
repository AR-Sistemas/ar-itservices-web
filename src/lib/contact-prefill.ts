/**
 * Precarga del mensaje del formulario de #contacto desde otras secciones
 * (armado de equipo, "Qué hacemos"). Las secciones disparan este evento y el
 * formulario (en routes/index.tsx) lo escucha: pasa a modo "empresa" y
 * completa el campo de mensaje.
 */
export const CONTACT_PREFILL_EVENT = "contact-prefill";

export function prefillContactMessage(message: string) {
  if (!message) return;
  window.dispatchEvent(new CustomEvent(CONTACT_PREFILL_EVENT, { detail: message }));
}
