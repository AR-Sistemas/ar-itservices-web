/**
 * Configuración de las piezas temporales de visibilidad de /soluciones:
 *  - Cartel de Córdoba Tech Week (EventBanner): se muestra hasta que termina
 *    el evento (12 y 13 de nov. de 2026) y después desaparece solo.
 *  - Etiqueta "Nuevo" junto a "Soluciones" en el menú.
 * Para retirar el cartel antes de tiempo alcanza con `enabled: false`; para
 * quitarlo del todo se borran este archivo, EventBanner.tsx y su uso en el home.
 * Las fechas se expresan en hora de Argentina (UTC-3).
 */
export const EVENT_BANNER = {
  enabled: true,
  /** Hasta el 13/11/2026 inclusive: el 14/11 a las 00:00 (ART) deja de verse. */
  until: Date.UTC(2026, 10, 14, 3, 0, 0),
} as const;

/** La etiqueta "Nuevo" del menú se retira a fin de noviembre de 2026. */
export const NEW_BADGE_UNTIL = Date.UTC(2026, 11, 1, 3, 0, 0);

export function isEventBannerActive(now: number = Date.now()): boolean {
  return EVENT_BANNER.enabled && now < EVENT_BANNER.until;
}

export function isNewBadgeActive(now: number = Date.now()): boolean {
  return now < NEW_BADGE_UNTIL;
}
