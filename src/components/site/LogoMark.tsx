import { useId } from "react";

/**
 * Curvas OFICIALES del isotipo "AR" extraídas del logotipo vectorizado del
 * Brand Book (archivo editable). Fuente única de verdad compartida entre el
 * logo animado del hero (LogoDraw), el de la navbar (LogoDrawInline) y este
 * isotipo estático (footer).
 *
 * La "A" incluye su perforación interna (contrapunzón) como subpath, por eso
 * debe pintarse con `fillRule="evenodd"`. La "R" es la forma oficial plana.
 */
export const AR_VIEWBOX = "0 0 77.23 47.8";

export const AR_PATH_A =
  "M18.45 30.17L27.13 11.24 40.61 41.42ZM21.79 0L0 47.53H10.5L16.46 34.52 39.36 45.61C41.98 46.87 44.5 47.8 47.74 47.53 50.58 47.53 52.48 44.6 51.32 42.01L32.57 0Z";

export const AR_PATH_R =
  "M63.04 30.03L62.99 29.93C70.13 28.64 75.55 22.48 75.55 15.09 75.55 6.77 68.66 0 60.2 0H35.54L38.87 7.48H60.2C64.54 7.48 68.07 10.9 68.07 15.09 68.07 19.15 64.77 22.47 60.63 22.68V22.67L45.65 22.68 48.92 30.03H50.32C52.9 30.03 55.33 31.27 56.84 33.36L67.09 47.53H77.23Z";

/**
 * Sombreado del logotipo con degradé (versión oficial más reciente): la "R" pasa
 * de blanco a gris claro hacia la derecha y la pierna derecha de la "A" se
 * oscurece hacia arriba (rojo vino → rojo de marca). Lo comparten el isotipo
 * estático, el animado de la navbar y el del hero. `id` debe ser único por
 * instancia (los degradés se referencian por id dentro del documento).
 *
 * Uso: fill de la R = `url(#${id}-r)`; sobre la A se dibuja otra copia con
 * `clipPath=url(#${id}-clip)` y fill = `url(#${id}-a)`.
 */
export function ArLogoDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-r`} gradientUnits="userSpaceOnUse" x1="46" y1="0" x2="75.5" y2="0">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#D0D0D0" />
      </linearGradient>
      <linearGradient id={`${id}-a`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="22">
        <stop offset="0" stopColor="#6E0E1B" />
        <stop offset="0.5" stopColor="#C20A15" />
        <stop offset="1" stopColor="#FF000D" />
      </linearGradient>
      {/* Mitad derecha de la "A" (pierna derecha): ahí va el degradé oscuro. */}
      <clipPath id={`${id}-clip`}>
        <polygon points="31.3,0 80,0 80,47.8 12.7,47.8" />
      </clipPath>
    </defs>
  );
}

/**
 * Isotipo "AR" vectorial estático en su versión de marca "Negativo color"
 * (Brand Book 1.3): la "A" en rojo #ff000d y la "R" en el color del texto
 * (`currentColor` → blanco sobre fondos oscuros). La "A" se dibuja por encima
 * de la "R", como en el logotipo oficial.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  const id = `ar-mark-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox={AR_VIEWBOX} className={className} role="img" aria-label="AR IT Services">
      <ArLogoDefs id={id} />
      <path d={AR_PATH_R} fill={`url(#${id}-r)`} />
      <path d={AR_PATH_A} fill="#FF000D" fillRule="evenodd" />
      <path d={AR_PATH_A} fill={`url(#${id}-a)`} fillRule="evenodd" clipPath={`url(#${id}-clip)`} />
    </svg>
  );
}
