import type { PublicEditorialItem } from "@/lib/editorial";

const RECENT_ARCHIVE_LIMIT = 3;

function EditorialArchiveItem({ item }: { item: PublicEditorialItem }) {
  return (
    <li className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-background/20 p-4 transition-colors hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
          {item.period}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-foreground">{item.title}</p>
      </div>
      <a
        href={`/novedades?edicion=${item.slug}`}
        className="inline-flex shrink-0 items-center text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Ver edición{" "}
        <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </a>
    </li>
  );
}

export function PublicEditorialSummary({
  current,
  selected = current,
  archive,
}: {
  current: PublicEditorialItem;
  selected?: PublicEditorialItem;
  archive: PublicEditorialItem[];
}) {
  const recentArchive = archive.slice(0, RECENT_ARCHIVE_LIMIT);
  const remainingArchive = archive.slice(RECENT_ARCHIVE_LIMIT);
  const podcastUrl = selected.podcast
    ? `https://open.spotify.com/episode/${encodeURIComponent(selected.podcast.episodeId)}`
    : undefined;
  const isArchiveEdition = selected.slug !== current.slug;

  return (
    <div className="space-y-6">
      <article className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] sm:p-10 lg:p-12">
        <div
          className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-3 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
                {isArchiveEdition ? "Edición archivada" : "Resumen editorial"}
              </p>
              <span className="font-mono text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {selected.period}
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              {selected.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {selected.summary}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={selected.magazineUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Leer la revista completa{" "}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </a>
              {podcastUrl && (
                <a
                  href={podcastUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Escuchar el resumen{" "}
                  <span aria-hidden="true" className="ml-1">
                    ↗
                  </span>
                </a>
              )}
              {isArchiveEdition && (
                <a
                  href="/novedades"
                  className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Volver a la edición actual
                </a>
              )}
            </div>
          </div>

          <section
            className="self-start rounded-2xl border border-border/80 bg-background/25 p-5 sm:p-6"
            aria-labelledby="editorial-highlights-heading"
          >
            <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-4">
              <h2
                id="editorial-highlights-heading"
                className="font-mono text-xs font-semibold tracking-[0.18em] text-primary uppercase"
              >
                Tres ideas clave
              </h2>
              <span
                className="font-display text-3xl font-bold text-foreground/15"
                aria-hidden="true"
              >
                03
              </span>
            </div>
            <ol className="mt-2 divide-y divide-border/70">
              {selected.highlights.map((highlight, index) => (
                <li key={highlight} className="flex gap-4 py-4 first:pt-3 last:pb-1">
                  <span className="font-mono text-sm font-semibold text-primary" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{highlight}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>

      {archive.length > 0 && (
        <section
          className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8"
          aria-labelledby="editorial-archive-heading"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
                También podés consultar
              </p>
              <h2
                id="editorial-archive-heading"
                className="mt-2 font-display text-2xl font-bold tracking-tight"
              >
                Archivo editorial
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {archive.length} {archive.length === 1 ? "edición anterior" : "ediciones anteriores"}
            </p>
          </div>
          <ul className="mt-5 grid gap-3">
            {recentArchive.map((item) => (
              <EditorialArchiveItem key={item.slug} item={item} />
            ))}
          </ul>
          {remainingArchive.length > 0 && (
            <details className="mt-3 rounded-2xl border border-border/80 bg-background/15">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="flex items-center justify-between gap-4">
                  Ver archivo completo
                  <span aria-hidden="true" className="text-primary">
                    +
                  </span>
                </span>
              </summary>
              <ul className="grid gap-3 border-t border-border/80 p-3">
                {remainingArchive.map((item) => (
                  <EditorialArchiveItem key={item.slug} item={item} />
                ))}
              </ul>
            </details>
          )}
        </section>
      )}
    </div>
  );
}
