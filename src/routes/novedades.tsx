import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { BackButton } from "@/components/site/BackButton";
import { WorldMapSpotlight } from "@/components/site/WorldMapSpotlight";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { BorderGlow } from "@/components/site/BorderGlow";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { NEWSLETTER_ISSUE, type NewsletterSection } from "@/data/newsletter";

type PodcastData = { title: string; spotifyEpisodeId: string };

export const Route = createFileRoute("/novedades")({
  head: () => ({
    meta: [
      { title: `${NEWSLETTER_ISSUE.title} — Novedades de IA · AR IT Services` },
      {
        name: "description",
        content: NEWSLETTER_ISSUE.description,
      },
      { property: "og:title", content: `${NEWSLETTER_ISSUE.title} — Novedades de IA` },
      { property: "og:description", content: NEWSLETTER_ISSUE.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ar-talent-forge.lovable.app/novedades" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ar-talent-forge.lovable.app/novedades" }],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const issue = NEWSLETTER_ISSUE;
  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) =>
    n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n,
  );

  // "Modo revista": en vez de un scroll continuo por las 8 secciones, se
  // navega página por página (portada, 01-08, fuentes) con flechas, teclado
  // o swipe — como si fueras pasando las hojas del boletín.
  const pageCount = issue.sections.length + 2;
  const [pageIndex, setPageIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const pagerRef = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, i));
    setDir(clamped >= pageIndex ? 1 : -1);
    setPageIndex(clamped);
    // Al cambiar de página, volvemos al inicio del paginado — si no, el
    // lector queda a la altura de donde tocó "Siguiente" (abajo del todo) y
    // tiene que scrollear para arriba para empezar a leer la página nueva.
    if (clamped !== pageIndex) {
      pagerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (lang === "EN") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(pageIndex + 1);
      else if (e.key === "ArrowLeft") goTo(pageIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, lang]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(dx) < 40) return;
    goTo(dx < 0 ? pageIndex + 1 : pageIndex - 1);
  };

  const currentPageLabel =
    pageIndex === 0
      ? "Portada"
      : pageIndex === pageCount - 1
        ? issue.sourcesHeading
        : (() => {
            const s = issue.sections[pageIndex - 1];
            return s ? `${s.number} — ${s.heading}` : "";
          })();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <WorldMapSpotlight />
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline
              play={visible}
              className="h-8 w-auto shrink-0 text-foreground sm:h-9"
            />
            <LogoWordmark className="h-[13px] w-auto shrink-0 text-foreground sm:h-3.5" />
          </span>
        )}
        rightSlot={
          <div
            className="hidden items-center gap-1 text-xs font-semibold sm:flex"
            role="group"
            aria-label={c.langLabel}
          >
            {(["ES", "EN"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded px-2 py-1 transition-colors ${
                  lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        }
      />

      <main className="px-5 pt-20 pb-8 sm:pt-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <BackButton label={c.news.backLink} />
            <p className="mt-5 font-mono text-xs tracking-widest text-primary uppercase">
              {issue.kicker}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{issue.title}</h1>
            <div className="max-w-2xl">
              <p className="mt-2 text-lg font-medium text-foreground">{issue.subtitle}</p>
              <p className="mt-3 text-base text-muted-foreground">{issue.description}</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{issue.closingDate}</p>
          </AnimatedContent>

          {lang === "EN" ? (
            <AnimatedContent className="mt-10 max-w-2xl" distance={30}>
              <div className="rounded-2xl border border-border bg-card p-8">
                <p className="text-lg font-semibold">{c.news.enNoticeHeading}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.news.enNoticeBody}</p>
              </div>
            </AnimatedContent>
          ) : (
            <div ref={pagerRef} className="mt-10 scroll-mt-28">
              {/* Índice — tabs de página, como las solapas de una revista */}
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Páginas del boletín">
                <PageTab label="Portada" active={pageIndex === 0} onClick={() => goTo(0)} />
                {issue.sections.map((s, i) => (
                  <PageTab
                    key={s.number}
                    label={s.number}
                    active={pageIndex === i + 1}
                    onClick={() => goTo(i + 1)}
                  />
                ))}
                <PageTab
                  label="Fuentes"
                  active={pageIndex === pageCount - 1}
                  onClick={() => goTo(pageCount - 1)}
                />
              </div>

              <p aria-live="polite" className="sr-only">
                {currentPageLabel}
              </p>

              <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="relative mt-6 min-h-[50vh] overflow-hidden"
              >
                <div
                  key={pageIndex}
                  className={
                    dir === 1
                      ? "animate-[page-slide-in-right_420ms_ease-out]"
                      : "animate-[page-slide-in-left_420ms_ease-out]"
                  }
                >
                  {pageIndex === 0 && (
                    <div>
                      {issue.podcast && <Podcast className="max-w-2xl" podcast={issue.podcast} />}
                      <div className="mt-10 max-w-2xl">
                        <h2 className="text-xl font-bold tracking-tight">
                          {issue.editorial.heading}
                        </h2>
                        <p className="mt-3 text-muted-foreground">{issue.editorial.body}</p>
                        <PullQuote
                          className="mt-5"
                          heading={issue.editorial.calloutHeading}
                          body={issue.editorial.calloutBody}
                        />
                      </div>
                    </div>
                  )}

                  {pageIndex >= 1 &&
                    pageIndex <= issue.sections.length &&
                    (() => {
                      const s = issue.sections[pageIndex - 1];
                      return s ? <Section section={s} /> : null;
                    })()}

                  {pageIndex === pageCount - 1 && (
                    <div className="max-w-2xl">
                      <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
                        {issue.sourcesHeading}
                      </h2>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {issue.sources.join(" · ")}
                      </p>
                      <p className="mt-6 text-xs text-muted-foreground">{issue.closingNote}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / next */}
              <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => goTo(pageIndex - 1)}
                  disabled={pageIndex === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <p className="font-mono text-xs text-muted-foreground">
                  {pageIndex + 1} / {pageCount}
                </p>
                <button
                  type="button"
                  onClick={() => goTo(pageIndex + 1)}
                  disabled={pageIndex === pageCount - 1}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 py-8 text-muted-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-4">
          <div>
            <LogoMark className="h-10 w-auto text-foreground" />
            <p className="mt-2 text-sm">{c.footer.tagline}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.officesHeading}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {c.footer.offices.map((o) => (
                <li key={o.city}>
                  <span className="text-foreground">{o.city}</span> — {o.address}, {o.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.sectionsHeading}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.followHeading}</h2>
            <SocialLinks />
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.legal}</p>
          <IsoBadge compact label={c.iso.certified} />
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ number, heading, intro }: { number: string; heading: string; intro: string }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-primary uppercase">{number}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>
    </div>
  );
}

function PageTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Podcast({
  podcast,
  className = "",
}: {
  podcast: PodcastData;
  className?: string;
}) {
  return (
    <AnimatedContent className={className} distance={30}>
      <BorderGlow>
        <div className="p-6 sm:p-7">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Episodio del mes
          </p>
          <p className="mt-2 font-semibold">{podcast.title}</p>
          <iframe
            className="mt-4 w-full rounded-xl"
            src={`https://open.spotify.com/embed/episode/${podcast.spotifyEpisodeId}?utm_source=generator`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={podcast.title}
          />
        </div>
      </BorderGlow>
    </AnimatedContent>
  );
}

function PullQuote({
  heading,
  body,
  className = "",
}: {
  heading: string;
  body: string;
  className?: string;
}) {
  return (
    <BorderGlow className={`max-w-2xl ${className}`}>
      <div className="p-6 sm:p-7">
        <p className="font-semibold">{heading}</p>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
    </BorderGlow>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <SpotlightCard
      as="article"
      className={`rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 ${className}`}
    >
      {children}
    </SpotlightCard>
  );
}

function Section({ section }: { section: NewsletterSection }) {
  switch (section.kind) {
    case "headlines":
      return (
        <div>
          <SectionHeader number={section.number} heading={section.heading} intro={section.intro} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <Card key={item.n}>
                <p className="font-mono text-xs text-primary">{item.n}</p>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="max-w-3xl">
          <SectionHeader number={section.number} heading={section.heading} intro={section.intro} />
          <div className="mt-6 space-y-4 border-l-2 border-primary/25 pl-5 sm:pl-6">
            {section.items.map((item) => (
              <Card key={item.title}>
                <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                  {item.tag}
                </p>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                {item.body.map((p) => (
                  <p key={p} className="mt-2 text-sm text-muted-foreground">
                    {p}
                  </p>
                ))}
              </Card>
            ))}
          </div>
          {section.pullQuote && <PullQuote className="mt-6" {...section.pullQuote} />}
        </div>
      );

    case "dev":
      return (
        <div className="max-w-3xl">
          <SectionHeader number={section.number} heading={section.heading} intro={section.intro} />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{section.paragraph}</p>

          <p className="mt-8 font-mono text-xs tracking-widest text-primary uppercase">
            {section.bulletsHeading}
          </p>
          <ul className="mt-4 space-y-3">
            {section.bullets.map((b) => (
              <li key={b.lead} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-foreground">{b.lead}</span>{" "}
                  <span className="text-muted-foreground">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <PullQuote className="mt-6" {...section.pullQuote} />

          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {section.sidebarHeading}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{section.sidebarBody}</p>
          </div>
        </div>
      );

    case "glossary":
      return (
        <div>
          <SectionHeader number={section.number} heading={section.heading} intro={section.intro} />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {section.paragraph}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <Card key={item.title}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </Card>
            ))}
          </div>
          <PullQuote className="mt-6" {...section.pullQuote} />
        </div>
      );

    case "regions":
      return (
        <div>
          <SectionHeader number={section.number} heading={section.heading} intro={section.intro} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <Card key={item.region}>
                <h3 className="font-semibold">{item.region}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </Card>
            ))}
          </div>
          <PullQuote className="mt-6" {...section.pullQuote} />
        </div>
      );

    default:
      return null;
  }
}
