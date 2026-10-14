import { createFileRoute } from "@tanstack/react-router";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { BackButton } from "@/components/site/BackButton";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SolutionVisual } from "@/components/site/SolutionVisual";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export const Route = createFileRoute("/soluciones")({
  head: () => ({
    meta: [
      { title: "Soluciones | AR IT Services" },
      {
        name: "description",
        content:
          "Ario, MeetingMate y AR SDD: productos propios de AR IT Services para automatizar documentos, potenciar reuniones y desarrollar con IA de forma controlada.",
      },
      { property: "og:title", content: "Soluciones | AR IT Services" },
      {
        property: "og:description",
        content: "Tecnología que se convierte en soluciones concretas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ar-itservices.com/soluciones" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/soluciones" }],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const s = c.solutions;
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
            className="flex items-center gap-1 text-xs font-semibold"
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
            <BackButton label={s.backLink} />
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              {s.heading}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {s.subtitle}
            </p>
          </AnimatedContent>

          {s.products.map((p) => (
            <section
              key={p.id}
              id={p.id}
              className="mt-14 scroll-mt-24 border-t border-border pt-14 first-of-type:mt-10"
            >
              <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
                <AnimatedContent className="lg:sticky lg:top-28">
                  <SolutionVisual
                    id={p.id}
                    alt={s.logoAlt(p.name)}
                    className="max-w-md lg:max-w-none"
                  />
                </AnimatedContent>

                <AnimatedContent delay={80}>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-lg font-semibold text-primary">{p.tagline}</p>
                  <p className="mt-4 text-muted-foreground">{p.short}</p>

                  <div className="mt-8">
                    <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                      {s.labels.problem}
                    </h3>
                    <p className="mt-2 text-foreground">{p.problem}</p>
                    {p.example && (
                      <p className="mt-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{s.labels.example}: </span>
                        {p.example}
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                      {s.labels.how}
                    </h3>
                    <ol className="mt-3 space-y-3">
                      {p.steps.map((step, i) => (
                        <li key={step} className="flex gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                      {s.labels.features}
                    </h3>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {p.features.map((f) => (
                        <li key={f.title} className="rounded-xl border border-border bg-card p-4">
                          <p className="text-sm font-semibold">{f.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                      {s.labels.audience}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{p.audience}</p>
                  </div>

                  <a
                    href={`/?producto=${p.id}#contacto`}
                    className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                  >
                    {s.contactCta}
                  </a>
                </AnimatedContent>
              </div>
            </section>
          ))}
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
                  <span className="text-foreground">{o.city}</span>: {o.address}, {o.country}
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
