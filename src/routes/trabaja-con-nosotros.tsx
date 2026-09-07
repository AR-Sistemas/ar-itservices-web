import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { BackButton } from "@/components/site/BackButton";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export const Route = createFileRoute("/trabaja-con-nosotros")({
  head: () => ({
    meta: [
      { title: "Trabajá con nosotros — AR IT Services" },
      {
        name: "description",
        content:
          "Sumate al equipo de AR IT Services: 25 años armando equipos que se quedan en software, datos e IA.",
      },
      { property: "og:title", content: "Trabajá con nosotros — AR IT Services" },
      {
        property: "og:description",
        content: "Búsquedas abiertas y postulación espontánea en AR IT Services.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://ar-talent-forge.lovable.app/trabaja-con-nosotros",
      },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://ar-talent-forge.lovable.app/trabaja-con-nosotros" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) =>
    n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n,
  );
  const hasPositions = c.careers.positions.length > 0;

  const categories = useMemo(
    () => Array.from(new Set(c.careers.positions.map((p) => p.category))),
    [c.careers.positions],
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const visiblePositions = activeCategory
    ? c.careers.positions.filter((p) => p.category === activeCategory)
    : c.careers.positions;

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
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <BackButton label={c.careers.backLink} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {c.careers.heading}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">{c.careers.intro}</p>
          </AnimatedContent>

          <AnimatedContent className="mt-14" distance={30}>
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
              {c.careers.positionsHeading}
            </h2>

            {hasPositions && categories.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === null
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.careers.filterAllLabel}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {visiblePositions.length === 0 && hasPositions && (
              <p className="mt-5 text-sm text-muted-foreground">{c.careers.filterEmptyMessage}</p>
            )}

            {visiblePositions.length > 0 ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {visiblePositions.map((p, i) => (
                  <AnimatedContent key={p.title} delay={Math.min(i, 4) * 60}>
                    <SpotlightCard
                      as="article"
                      className="h-full rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                            {p.category}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {p.location} · {p.modality} · {p.seniority}
                          </p>
                        </div>
                        <a
                          href={`/?puesto=${encodeURIComponent(p.title)}#contacto`}
                          className="inline-flex shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                        >
                          {c.careers.positionCtaLabel}
                        </a>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">{p.intro}</p>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                            {c.careers.mustHaveLabel}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {p.mustHave.map((item) => (
                              <li key={item} className="flex gap-2 text-sm">
                                <span
                                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"
                                  aria-hidden="true"
                                />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                            {c.careers.niceToHaveLabel}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {p.niceToHave.map((item) => (
                              <li key={item} className="flex gap-2 text-sm">
                                <span
                                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                                  aria-hidden="true"
                                />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </SpotlightCard>
                  </AnimatedContent>
                ))}
              </div>
            ) : (
              !hasPositions && (
                <div className="mt-5 rounded-2xl border border-border bg-card p-8 sm:p-10">
                  <p className="text-lg font-semibold">{c.careers.emptyHeading}</p>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    {c.careers.emptyBody}
                  </p>
                  <a
                    href="/#contacto"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                  >
                    {c.careers.applyCta}
                  </a>
                </div>
              )
            )}
          </AnimatedContent>
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
