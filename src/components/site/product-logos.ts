import ariaLogo from "@/assets/products/aria.png";
import arioLogo from "@/assets/products/ario.png";
import meetingmateLogo from "@/assets/products/meetingmate.png";
import criteriaLogo from "@/assets/products/criteria.png";
import type { SolutionProduct } from "@/i18n/content";

/** Logo (PNG sin fondo) de cada producto, compartido por tarjetas, fichas y accesos rápidos. */
export const PRODUCT_LOGOS: Record<SolutionProduct["id"], string> = {
  aria: ariaLogo,
  ario: arioLogo,
  meetingmate: meetingmateLogo,
  sdd: criteriaLogo,
};

/** Compensa los márgenes propios de cada archivo para que los logos se perciban del mismo tamaño. */
export const PRODUCT_LOGO_SCALE: Record<SolutionProduct["id"], string> = {
  aria: "",
  ario: "",
  meetingmate: "scale-[1.35]",
  sdd: "",
};

/** Ajustes exclusivos de las tarjetas del inicio, para equiparar el peso visual de cada marca. */
export const HOME_PRODUCT_LOGO_SCALE: Record<SolutionProduct["id"], string> = {
  aria: "scale-[1.02]",
  ario: "scale-[0.94]",
  meetingmate: "scale-[1.52]",
  sdd: "",
};
