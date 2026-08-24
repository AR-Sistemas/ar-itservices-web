import { useRef, type MouseEvent } from "react";

export type BentoCard = {
  title: string;
  desc: string;
  label?: string;
  span?: "large" | "small";
};

/**
 * Magic Bento (React Bits) restyleado a la paleta AR:
 * grilla bento (2 tarjetas grandes + 4 chicas) con spotlight rojo al hover.
 */
export function MagicBento({ cards }: { cards: BentoCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <BentoTile key={c.title} card={c} />
      ))}
    </div>
  );
}

function BentoTile({ card }: { card: BentoCard }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const large = card.span === "large";

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      className={`magic-card group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40 ${
        large ? "sm:col-span-2 lg:row-span-2 lg:min-h-64" : ""
      }`}
    >
      <span className="magic-card-spotlight" aria-hidden="true" />
      <div className="relative">
        {card.label && (
          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">{card.label}</p>
        )}
        <h3 className={`mt-3 font-semibold ${large ? "text-2xl" : "text-lg"}`}>{card.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
      </div>
    </article>
  );
}
