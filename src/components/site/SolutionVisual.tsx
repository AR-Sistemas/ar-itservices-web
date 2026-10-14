import arioLogo from "@/assets/products/ario.png";
import meetingmateLogo from "@/assets/products/meetingmate.png";
import sddLogo from "@/assets/products/ar-sdd.png";
import type { SolutionProduct } from "@/i18n/content";

const LOGOS: Record<SolutionProduct["id"], string> = {
  ario: arioLogo,
  meetingmate: meetingmateLogo,
  sdd: sddLogo,
};

/**
 * Panel visual de un producto. Hoy muestra el logo (PNG sin fondo; las partes
 * azul marino originales se pasaron a blanco para que se lean sobre el fondo
 * oscuro) dentro de un panel sutil. Cuando estén listas las animaciones que
 * explican cómo funciona cada producto, se reemplaza el contenido de este
 * panel — el resto de la página no cambia.
 */
export function SolutionVisual({
  id,
  alt,
  className = "",
}: {
  id: SolutionProduct["id"];
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/40 p-6 ${className}`}
    >
      <img src={LOGOS[id]} alt={alt} loading="lazy" className="h-full w-full object-contain" />
    </div>
  );
}
