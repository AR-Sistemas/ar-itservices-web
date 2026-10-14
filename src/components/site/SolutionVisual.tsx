import arioLogo from "@/assets/products/ario.webp";
import meetingmateLogo from "@/assets/products/meetingmate.webp";
import sddLogo from "@/assets/products/ar-sdd.webp";
import type { SolutionProduct } from "@/i18n/content";

const LOGOS: Record<SolutionProduct["id"], string> = {
  ario: arioLogo,
  meetingmate: meetingmateLogo,
  sdd: sddLogo,
};

/**
 * Panel visual de un producto. Hoy muestra el logo sobre fondo claro (los
 * logos vienen con fondo blanco). Cuando estén listas las animaciones que
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
      className={`flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-6 ${className}`}
    >
      <img src={LOGOS[id]} alt={alt} loading="lazy" className="h-full w-full object-contain" />
    </div>
  );
}
