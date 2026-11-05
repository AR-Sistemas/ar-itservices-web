import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { TiltedCard } from "@/components/site/TiltedCard";
import { FloatingNav } from "@/components/site/FloatingNav";
import { IsoBadge } from "@/components/site/IsoBadge";
import { useContactModal } from "@/components/site/ContactModal";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { TEAM_PHOTOS } from "@/components/site/team-photos";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nuestra gente | AR IT Services" },
      {
        name: "description",
        content:
          "Los socios y directores detrás de AR IT Services: 25 años de trayectoria en software, datos e IA entre Dallas, Córdoba y Asunción.",
      },
      { property: "og:title", content: "Nuestra gente | AR IT Services" },
      {
        property: "og:description",
        content: "Conocé al equipo de socios que lidera AR IT Services desde 2001.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ar-itservices.com/nosotros" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/nosotros" }],
  }),
  component: PeoplePage,
});

const PRIMARY =
  "inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white";
const SECONDARY =
  "inline-flex rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/30";

function PeoplePage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const openContact = useContactModal();
  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logoHref="/"
        activeHref="/nosotros"
        revealAt={-1}
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline play={visible} className="h-8 w-auto shrink-0 text-foreground sm:h-9" />
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
                  lang === l ? "text-brand-text" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        }
      />

      <main className="px-5 pt-28 pb-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {c.people.heading}
                </h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {c.people.intro}
                </p>
              </div>
            </div>
          </AnimatedContent>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.people.items.map((p, i) => (
              <li key={p.name}>
                <AnimatedContent delay={i * 60} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                    <TiltedCard className="mx-auto w-full max-w-[190px]">
                      <img
                        src={TEAM_PHOTOS[i]}
                        alt={c.people.portraitAlt(p.name)}
                        width={190}
                        height={190}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full rounded-full bg-secondary object-cover ring-1 ring-primary/25"
                      />
                    </TiltedCard>
                    <h2 className="mt-6 text-center font-display text-lg font-bold">{p.name}</h2>
                    <p className="mt-1 text-center text-sm font-semibold text-brand-text">
                      {p.role}
                    </p>
                    <blockquote className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                      “{p.quote}”
                    </blockquote>
                  </article>
                </AnimatedContent>
              </li>
            ))}
          </ul>

          <section className="mt-20 mb-8">
            <AnimatedContent>
              <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-card p-8 md:flex-row md:items-center md:justify-between md:p-10">
                <h2 className="text-2xl font-bold tracking-tight">{c.people.joinHeading}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/trabaja-con-nosotros" className={PRIMARY}>
                    {c.people.careersLink}
                  </Link>
                  <button
                    type="button"
                    onClick={() => openContact({ type: "postulante" })}
                    className={`${SECONDARY} cursor-pointer`}
                  >
                    {c.cta.talk}
                  </button>
                </div>
              </div>
            </AnimatedContent>
          </section>
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
