import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import type { ServiceLinkCard } from "@/i18n/content";

/**
 * Carrusel horizontal de servicios: scroll-snap nativo (rueda, trackpad y
 * swipe), flechas y puntos. En desktop muestra 3 tarjetas, en tablet 2 y en
 * mobile 1 (con un peek de la siguiente). El punto activo sigue a la tarjeta
 * más cercana al centro.
 */
export function ServiceCarousel({ cards }: { cards: ServiceLinkCard[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const scrollToCard = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(i, cards.length - 1));
      const child = track.children[target] as HTMLElement | undefined;
      if (!child) return;
      track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    },
    [cards.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(track.children).forEach((node, i) => {
        const r = (node as HTMLElement).getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < best) {
          best = dist;
          nearest = i;
        }
      });
      setActive(nearest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [cards.length]);

  const atStart = active === 0;
  const atEnd = active === cards.length - 1;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <SpotlightCard
            key={card.title}
            as="article"
            contentClassName="flex h-full flex-col"
            className="w-[86%] shrink-0 snap-start rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
          >
            <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
              {card.label}
            </p>
            <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
            <a
              href={card.href}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
            >
              {card.cta} →
            </a>
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Servicios">
          {cards.map((card, i) => (
            <button
              key={card.title}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Ir al servicio ${i + 1} de ${cards.length}`}
              onClick={() => scrollToCard(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-300 ${
                active === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/20 hover:bg-foreground/35"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Servicio anterior"
            onClick={() => scrollToCard(active - 1)}
            disabled={atStart}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Servicio siguiente"
            onClick={() => scrollToCard(active + 1)}
            disabled={atEnd}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
