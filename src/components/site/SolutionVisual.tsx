import { useEffect, useRef, useState } from "react";
import arioLogo from "@/assets/products/ario.png";
import meetingmateLogo from "@/assets/products/meetingmate.png";
import sddLogo from "@/assets/products/ar-sdd.png";
import arioAnim from "@/assets/products/animations/ario.svg?raw";
import meetingmateAnim from "@/assets/products/animations/meetingmate.svg?raw";
import sddAnim from "@/assets/products/animations/sdd.svg?raw";
import { useLang } from "@/i18n/language";
import type { SolutionProduct } from "@/i18n/content";

type ProductId = SolutionProduct["id"];

const LOGOS: Record<ProductId, string> = {
  ario: arioLogo,
  meetingmate: meetingmateLogo,
  sdd: sddLogo,
};

const ANIMATIONS: Record<ProductId, string> = {
  ario: arioAnim,
  meetingmate: meetingmateAnim,
  sdd: sddAnim,
};

// Descripción accesible de cada animación (el SVG original solo la trae en español).
const ANIM_LABELS: Record<ProductId, { ES: string; EN: string }> = {
  ario: {
    ES: "Ario: los documentos entran, se leen, se extraen los campos y salen datos ordenados en una tabla",
    EN: "Ario: documents come in, are read, their fields are extracted and orderly data comes out in a table",
  },
  meetingmate: {
    ES: "MeetingMate: una reunión se transcribe y genera un resumen y las tareas acordadas",
    EN: "MeetingMate: a meeting is transcribed and produces a summary and the agreed tasks",
  },
  sdd: {
    ES: "AR SDD: un pedido pasa por especificación, desarrollo y verificaciones hasta quedar aprobado",
    EN: "AR SDD: a request goes through specification, development and checks until it is approved",
  },
};

/**
 * Panel visual de un producto: animación SVG (loop de 10 s, 4:3, sin texto)
 * que explica a grandes rasgos cómo funciona. Las animaciones son CSS
 * puro dentro del SVG (ver src/assets/products/animations); acá solo se
 * pausan cuando el panel no está a la vista y, si la persona pidió reducir
 * el movimiento, se muestra el logo estático en su lugar.
 */
export function SolutionVisual({
  id,
  alt,
  className = "",
}: {
  id: ProductId;
  alt: string;
  className?: string;
}) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      {
        threshold: 0.2,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const label = ANIM_LABELS[id][lang === "EN" ? "EN" : "ES"];
  const svg = ANIMATIONS[id].replace(/aria-label="[^"]*"/, `aria-label="${label}"`);

  return (
    <div
      ref={ref}
      data-paused={!visible}
      className={`sol-anim flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/40 p-3 ${className}`}
    >
      {reduceMotion ? (
        <img
          src={LOGOS[id]}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-contain p-3"
        />
      ) : (
        <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}
