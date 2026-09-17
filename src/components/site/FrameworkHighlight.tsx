import { StarBorderCard } from "./StarBorderCard";
import type { ServiceLinkCard } from "@/i18n/content";

/**
 * Bloque destacado a lo ancho para el framework propio (ARIA): borde animado
 * de StarBorderCard y layout en dos columnas, similar a los casos de éxito.
 */
export function FrameworkHighlight({ card }: { card: ServiceLinkCard }) {
  return (
    <StarBorderCard>
      <div className="grid gap-6 rounded-2xl bg-card p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center md:p-10">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
            {card.label}
          </p>
          <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {card.title}
          </h3>
        </div>
        <div>
          <p className="text-muted-foreground">{card.desc}</p>
          <a
            href={card.href}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
          >
            {card.cta} →
          </a>
        </div>
      </div>
    </StarBorderCard>
  );
}
