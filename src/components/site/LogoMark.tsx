/**
 * Curvas reales del isologo "AR" vectorizadas del logotipo institucional.
 * Fuente única de verdad compartida entre el logo animado del hero (LogoDraw)
 * y este isotipo estático usado en navbar / footer.
 */
export const AR_VIEWBOX = "0 0 400 246.54";

export const AR_PATH_A =
  "M 113.00 0.00 L 0.00 246.54 L 53.85 246.54 L 85.29 178.99 L 214.47 241.25 L 235.64 246.54 L 250.89 246.23 L 257.74 243.74 L 266.46 233.46 L 267.70 228.48 L 266.46 218.83 L 168.72 0.00 Z";

export const AR_PATH_R =
  "M 184.28 0.00 L 201.40 38.60 L 315.64 38.60 L 332.76 43.89 L 343.97 53.23 L 352.06 68.79 L 352.68 84.67 L 346.46 99.92 L 334.01 111.75 L 317.20 117.67 L 236.89 117.98 L 253.70 155.64 L 273.00 157.20 L 288.87 166.23 L 347.70 246.23 L 400.00 246.23 L 326.54 155.64 L 345.84 149.11 L 363.89 137.59 L 377.59 122.65 L 386.93 104.90 L 391.28 86.23 L 390.66 65.68 L 385.37 47.63 L 372.61 27.39 L 350.51 9.65 L 324.67 0.93 Z";

/**
 * Isotipo "AR" vectorial estático. Toma el color del texto vía `currentColor`,
 * así se puede pintar blanco (header/footer) o rojo (`text-primary`) sin editarlo.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={AR_VIEWBOX}
      className={className}
      role="img"
      aria-label="AR IT Services"
      fill="currentColor"
    >
      <path d={AR_PATH_A} />
      <path d={AR_PATH_R} />
    </svg>
  );
}
