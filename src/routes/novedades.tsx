import { createFileRoute, redirect } from "@tanstack/react-router";
import { isIntermedio } from "@/lib/site-mode";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { FloatingNav } from "@/components/site/FloatingNav";
import { IsoBadge } from "@/components/site/IsoBadge";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { PublicEditorialSummary } from "@/components/site/PublicEditorialSummary";
import { SocialLinks } from "@/components/site/SocialLinks";
import { NEWSLETTER_ISSUE } from "@/data/newsletter";
import { getContent } from "@/i18n/content";
import { useLang } from "@/i18n/language";
import { getPublicEditorial } from "@/lib/editorial.server";
import { z } from "zod";

export const Route = createFileRoute("/novedades")({
  validateSearch: z
    .object({
      edicion: z
        .string()
        .regex(/^\d{4}-\d{2}$/)
        .optional(),
    })
    .catch({}),
  loader: () => getPublicEditorial(),
  // En la versión intermedia la página no existe: se redirige al inicio.
  beforeLoad: () => {
    if (isIntermedio) throw redirect({ to: "/", replace: true });
  },
  head: () => ({
    meta: [
      { title: "Resumen editorial | Novedades de IA · AR IT Services" },
      {
        name: "description",
        content: "Resumen mensual de inteligencia artificial y tecnología de AR Consultores.",
      },
      { property: "og:title", content: "Resumen editorial | Novedades de IA" },
      {
        property: "og:description",
        content: "Resumen mensual de inteligencia artificial y tecnología de AR Consultores.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ar-itservices.com/novedades" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/novedades" }],
  }),
  component: EditorialPage,
});

function EditorialPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const editorial = Route.useLoaderData();
  const { edicion } = Route.useSearch();
  const selected = edicion
    ? ([editorial.current, ...editorial.archive].find((item) => item?.slug === edicion) ??
      editorial.current)
    : editorial.current;
  const navItems = c.nav.map((item) =>
    item.href.startsWith("#") ? { ...item, href: `/${item.href}` } : item,
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logoHref="/"
        activeHref="/novedades"
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
            {(["ES", "EN"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={lang === language}
                onClick={() => setLang(language)}
                className={`rounded px-2 py-1 transition-colors ${lang === language ? "text-brand-text" : "text-muted-foreground hover:text-foreground"}`}
              >
                {language}
              </button>
            ))}
          </div>
        }
      />

      <main className="px-5 pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            {lang === "EN" ? (
              <div className="max-w-2xl rounded-2xl border border-border bg-card p-8">
                <h1 className="text-2xl font-bold">{c.news.enNoticeHeading}</h1>
                <p className="mt-3 text-muted-foreground">{c.news.enNoticeBody}</p>
              </div>
            ) : selected ? (
              <div>
                <PublicEditorialSummary
                  current={editorial.current ?? selected}
                  selected={selected}
                  archive={editorial.archive}
                />
              </div>
            ) : (
              <NewsletterFallback />
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
              {c.footer.offices.map((office) => (
                <li key={office.city}>
                  <span className="text-foreground">{office.city}</span>: {office.address},{" "}
                  {office.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.sectionsHeading}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
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

/** Mantiene visible la edición publicada aun si el servicio editorial no responde. */
function NewsletterFallback() {
  const issue = NEWSLETTER_ISSUE;

  return (
    <article className="max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] sm:p-10">
      <p className="font-mono text-xs tracking-widest text-brand-text uppercase">{issue.kicker}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{issue.title}</h1>
      <p className="mt-3 text-lg font-medium text-foreground">{issue.subtitle}</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{issue.description}</p>
      <p className="mt-4 text-xs text-muted-foreground">{issue.closingDate}</p>
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-2xl font-bold tracking-tight">{issue.editorial.heading}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{issue.editorial.body}</p>
      </section>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {issue.sections.map((section) => (
          <section
            key={section.number}
            className="rounded-2xl border border-border bg-background p-5"
          >
            <p className="font-mono text-xs tracking-widest text-brand-text uppercase">
              {section.number}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{section.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.intro}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
