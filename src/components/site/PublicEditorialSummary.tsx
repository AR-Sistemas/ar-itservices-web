import type { PublicEditorialItem } from "@/lib/editorial";

export function PublicEditorialSummary({
  current,
  archive,
}: {
  current: PublicEditorialItem;
  archive: PublicEditorialItem[];
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] sm:p-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">Resumen editorial</p>
        <p className="mt-4 text-sm font-semibold text-primary">{current.period}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">{current.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{current.summary}</p>

        <div className="mt-8">
          <h2 className="font-mono text-xs tracking-widest text-primary uppercase">Tres ideas del mes</h2>
          <ul className="mt-4 space-y-3">
            {current.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={current.magazineUrl}
          className="mt-9 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Leer la revista completa →
        </a>
      </div>

      {archive.length > 0 && (
        <section className="mt-12 border-t border-border pt-8" aria-labelledby="editorial-archive-heading">
          <h2 id="editorial-archive-heading" className="font-mono text-xs tracking-widest text-primary uppercase">
            Ediciones anteriores
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {archive.map((item) => (
              <li key={item.slug} className="rounded-2xl border border-border p-4">
                <p className="text-xs font-semibold text-primary">{item.period}</p>
                <p className="mt-1 font-semibold text-foreground">{item.title}</p>
                <a
                  href={item.magazineUrl}
                  className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Ver edición →
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
