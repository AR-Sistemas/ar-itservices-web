import { useEffect, useState } from "react";

/**
 * Comportamiento de la barra "isla" flotante (FloatingNav):
 *  - Oculta arriba del todo; aparece al scrollear más de `revealAt` px.
 *  - Tras `idleMs` sin actividad (mouse, scroll, tecla, touch) se esfuma
 *    (blur + fade lento) y reaparece con cualquier interacción.
 *  - `hold` la mantiene visible aunque no haya actividad (menú abierto).
 * Devuelve las clases de transición para el contenedor (`island`) y para los
 * elementos que entran escalonados (`enter` + `delay(i)`).
 */
export function useIslandReveal({
  revealAt = 120,
  idleMs = 3500,
  hold = false,
}: { revealAt?: number; idleMs?: number; hold?: boolean } = {}) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > revealAt);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAt]);

  // Detección de inactividad: cada interacción reactiva la barra y reinicia el
  // temporizador; si no pasa nada durante idleMs, se esfuma.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const ping = () => {
      setActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => setActive(false), idleMs);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel", "scroll"];
    for (const e of events) window.addEventListener(e, ping, { passive: true });
    ping();
    return () => {
      clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, ping);
    };
  }, [idleMs]);

  // Visible mientras estemos scrolleados y haya actividad (o se la retenga).
  const visible = shown && (active || hold);
  // Esfumado por inactividad (sigue scrolleado pero sin actividad): usamos una
  // transición mucho más lenta para que el efecto se aprecie. La aparición y el
  // rearmado mantienen su velocidad original.
  const dissolving = shown && !visible;
  const dur = dissolving ? "duration-[2200ms]" : "duration-500";
  const delay = (i: number) => (visible ? `${100 + i * 70}ms` : "0ms");
  const enter = visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0";
  const tab = visible ? 0 : -1;

  // Tres estados para el contenedor:
  //  - arriba del todo (no scrolleado): sube y desaparece.
  //  - esfumado por inactividad: se queda en lugar y se disuelve (blur + fade).
  //  - visible: nítido y en su sitio.
  const island = visible
    ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
    : shown
      ? "pointer-events-none scale-[0.98] opacity-0 blur-[6px]"
      : "pointer-events-none -translate-y-8 opacity-0";

  return { shown, visible, dur, delay, enter, tab, island };
}
