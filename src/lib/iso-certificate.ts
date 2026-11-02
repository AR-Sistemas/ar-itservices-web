/**
 * Certificado ISO 9001:2015 de AR Consultores S.R.L. (Bureau Veritas
 * Certification, acreditado por el OAA). El PDF de public/certificados es el
 * original escaneado, tal cual lo emitió la certificadora: no se rehace ni se
 * rediseña. Los datos del modal salen de ese documento (ver `iso` en content.ts).
 *
 * IMPORTANTE: el certificado vence el 10/01/2027. Al recertificar hay que
 * reemplazar el PDF y actualizar la vigencia y el número en content.ts (ES y EN)
 * y `validUntil` acá; si no, la web seguiría mostrando un certificado vencido.
 */
export const ISO_CERTIFICATE = {
  pdfUrl: "/certificados/ISO-9001-AR-Consultores.pdf",
  /** Fin de vigencia: 10/01/2027 inclusive (hora de Argentina, UTC-3). */
  validUntil: Date.UTC(2027, 0, 11, 3, 0, 0),
  /** Teléfono de verificación que figura en el certificado. */
  verifyPhone: "+54 11 4000 8100",
} as const;

export function isIsoCertificateCurrent(now: number = Date.now()): boolean {
  return now < ISO_CERTIFICATE.validUntil;
}
