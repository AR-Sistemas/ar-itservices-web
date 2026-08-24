import { BorderGlow } from "./BorderGlow";
import { SpotlightCard } from "./SpotlightCard";

export type BentoCard = {
  title: string;
  desc: string;
  label?: string;
  span?: "large" | "small";
};

/**
 * Magic Bento (React Bits) restyleado a la paleta AR:
 * las 2 tarjetas grandes usan Border Glow, las chicas Spotlight Card.
 */
export function MagicBento({ cards }: { cards: BentoCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) =>
        c.span === "large" ? (
          <BorderGlow key={c.title} className="sm:col-span-2">
            <div className="p-7 lg:p-9">
              <Content card={c} large />
            </div>
          </BorderGlow>
        ) : (
          <SpotlightCard
            key={c.title}
            as="article"
            className="rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
          >
            <Content card={c} />
          </SpotlightCard>
        ),
      )}
    </div>
  );
}

function Content({ card, large = false }: { card: BentoCard; large?: boolean }) {
  return (
    <>
      {card.label && (
        <p className="font-mono text-[11px] tracking-widest text-primary uppercase">{card.label}</p>
      )}
      <h3 className={`mt-3 font-semibold ${large ? "text-2xl" : "text-lg"}`}>{card.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
    </>
  );
}
