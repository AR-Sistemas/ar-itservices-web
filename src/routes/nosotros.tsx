import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { TiltedCard } from "@/components/site/TiltedCard";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import felixPhoto from "@/assets/felix-melinsky.png.asset.json";
import josePhoto from "@/assets/jose-romanutti.png.asset.json";
import adrianPhoto from "@/assets/adrian-ferrari.png.asset.json";
import constanzaPhoto from "@/assets/constanza-giordano.png.asset.json";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nuestra gente — AR IT Services" },
      {
        name: "description",
        content:
          "Los socios y directores detrás de AR IT Services: 25 años de trayectoria en software, datos e IA entre Dallas, Córdoba y Asunción.",
      },
      { property: "og:title", content: "Nuestra gente — AR IT Services" },
      {
        property: "og:description",
        content: "Conocé al equipo de socios que lidera AR IT Services desde 2001.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ar-talent-forge.lovable.app/nosotros" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ar-talent-forge.lovable.app/nosotros" }],
  }),
  component: PeoplePage,
});

const PHOTOS = [felixPhoto.url, josePhoto.url, adrianPhoto.url, constanzaPhoto.url];

function PeoplePage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
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

      <main className="px-5 pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← {c.people.backLink}
            </Link>
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              {c.people.heading}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{c.people.statement}</p>
          </AnimatedContent>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.people.items.map((p, i) => (
              <AnimatedContent key={p.name} delay={i * 60}>
                <figure>
                  <TiltedCard>
                    <div className="flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded-xl bg-secondary p-5">
                      <img
                        src={PHOTOS[i]}
                        alt={c.people.portraitAlt(p.name)}
                        loading="lazy"
                        className="aspect-square w-full rounded-full object-cover ring-1 ring-primary/25"
                      />
                    </div>
                  </TiltedCard>
                  <figcaption className="mt-4">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.role}</p>
                  </figcaption>
                  <blockquote className="mt-3 text-sm text-foreground italic">
                    “{p.quote}”
                  </blockquote>
                </figure>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-5 py-16 text-muted-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <LogoMark className="h-14 w-auto text-foreground" />
            <p className="mt-5 text-sm">{c.footer.tagline}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.officesHeading}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.footer.offices.map((o) => (
                <li key={o.city}>
                  <span className="text-foreground">{o.city}</span> — {o.address}, {o.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.sectionsHeading}</h2>
            <ul className="mt-4 space-y-3 text-sm">
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
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.legal}</p>
          <IsoBadge compact label={c.iso.certified} />
        </div>
      </footer>
    </div>
  );
}
