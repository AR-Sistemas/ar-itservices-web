/**
 * Datos fijos del certificado ISO 9001:2015 de AR Consultores S.R.L. (Bureau
 * Veritas Certification). El modal no muestra fechas de emisión ni vigencia ni
 * enlaza al PDF, así que no hace falta tocar la web al recertificar (salvo que
 * cambie el número o el alcance, que viven en `iso.modal` de content.ts).
 */
export const ISO_CERTIFICATE = {
  /** Teléfono de verificación que figura en el certificado. */
  verifyPhone: "+54 11 4000 8100",
} as const;
