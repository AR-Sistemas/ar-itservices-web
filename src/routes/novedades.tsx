import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
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

type PodcastData = { title: string; audioUrl: string; note: string };

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
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
        <div className="mx-auto max-w-3xl">
          <AnimatedContent>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← {c.news.backLink}
            </Link>
            <p className="mt-5 font-mono text-xs tracking-widest text-primary uppercase">
              {issue.kicker}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{issue.title}</h1>
            <p className="mt-2 text-lg font-medium text-foreground">{issue.subtitle}</p>
            <p className="mt-3 text-base text-muted-foreground">{issue.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">{issue.closingDate}</p>
          </AnimatedContent>

          {lang === "EN" ? (
            <AnimatedContent className="mt-10" distance={30}>
              <div className="rounded-2xl border border-border bg-card p-8">
                <p className="text-lg font-semibold">{c.news.enNoticeHeading}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.news.enNoticeBody}</p>
              </div>
            </AnimatedContent>
          ) : (
            <>
              {issue.podcast && <Podcast className="mt-10" podcast={issue.podcast} />}

              <AnimatedContent className="mt-10" distance={30}>
                <h2 className="text-xl font-bold tracking-tight">{issue.editorial.heading}</h2>
                <p className="mt-3 text-muted-foreground">{issue.editorial.body}</p>
                <PullQuote
                  className="mt-5"
                  heading={issue.editorial.calloutHeading}
                  body={issue.editorial.calloutBody}
                />
              </AnimatedContent>

              <div className="mt-16 space-y-16">
                {issue.sections.map((section, i) => (
                  <AnimatedContent key={section.number} delay={Math.min(i, 3) * 60}>
                    <Section section={section} />
                  </AnimatedContent>
                ))}
              </div>

              <AnimatedContent className="mt-16 border-t border-white/10 pt-8" distance={20}>
                <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
                  {issue.sourcesHeading}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">{issue.sources.join(" · ")}</p>
                <p className="mt-6 text-xs text-muted-foreground">{issue.closingNote}</p>
              </AnimatedContent>
            </>
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
          <audio controls preload="none" className="mt-4 w-full" src={podcast.audioUrl}>
            Tu navegador no soporta la reproducción de audio.
          </audio>
          <p className="mt-3 text-xs text-muted-foreground">{podcast.note}</p>
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
    <BorderGlow className={className}>
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
        <div>
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
        <div>
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
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{section.paragraph}</p>
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
