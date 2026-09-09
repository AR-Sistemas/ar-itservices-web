import { useCallback, useRef } from "react";
import { animate, createSpring } from "animejs";

/**
 * Anime.js: rebote físico (spring bounce 1.25) como feedback de click
 * en los CTAs primarios. Se suma al Star Border, no lo reemplaza.
 */
export function useSpringPress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const press = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(el, {
      scale: [1, 0.96, 1.03, 1],
      ease: createSpring({ bounce: 0.35 }),
      duration: 500,
    });
  }, []);

  return { ref, press };
}
