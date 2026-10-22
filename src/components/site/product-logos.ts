import ariaLogo from "@/assets/products/aria.png";
import arioLogo from "@/assets/products/ario.png";
import meetingmateLogo from "@/assets/products/meetingmate.png";
import sddLogo from "@/assets/products/ar-sdd.png";
import type { SolutionProduct } from "@/i18n/content";

/** Logo (PNG sin fondo) de cada producto, compartido por tarjetas, fichas y accesos rápidos. */
export const PRODUCT_LOGOS: Record<SolutionProduct["id"], string> = {
  aria: ariaLogo,
  ario: arioLogo,
  meetingmate: meetingmateLogo,
  sdd: sddLogo,
};
