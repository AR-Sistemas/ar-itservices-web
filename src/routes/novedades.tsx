import { createFileRoute } from "@tanstack/react-router";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { BackButton } from "@/components/site/BackButton";
import { FloatingNav } from "@/components/site/FloatingNav";
import { IsoBadge } from "@/components/site/IsoBadge";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { PublicEditorialSummary } from "@/components/site/PublicEditorialSummary";
import { SocialLinks } from "@/components/site/SocialLinks";
import { getContent } from "@/i18n/content";
import { useLang } from "@/i18n/language";
import { getPublicEditorial } from "@/lib/editorial.server";

export const Route = createFileRoute("/novedades")({
  loader: () => getPublicEditorial(),
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
  const navItems = c.nav.map((item) =>
    item.href.startsWith("#") ? { ...item, href: `/${item.href}` } : item,
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline play={visible} className="h-8 w-auto shrink-0 text-foreground sm:h-9" />
            <LogoWordmark className="h-[13px] w-auto shrink-0 text-foreground sm:h-3.5" />
          </span>
        )}
        rightSlot={
          <div className="hidden items-center gap-1 text-xs font-semibold sm:flex" role="group" aria-label={c.langLabel}>
            {(["ES", "EN"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={lang === language}
                onClick={() => setLang(language)}
                className={`rounded px-2 py-1 transition-colors ${lang === language ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {language}
              </button>
            ))}
          </div>
        }
      />

      <main className="px-5 pt-20 pb-16 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <BackButton label={c.news.backLink} />
            {lang === "EN" ? (
              <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-card p-8">
                <h1 className="text-2xl font-bold">{c.news.enNoticeHeading}</h1>
                <p className="mt-3 text-muted-foreground">{c.news.enNoticeBody}</p>
              </div>
            ) : editorial.current ? (
              <div className="mt-10">
                <PublicEditorialSummary current={editorial.current} archive={editorial.archive} />
              </div>
            ) : (
              <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-card p-8">
                <h1 className="text-2xl font-bold">Resumen editorial</h1>
                <p className="mt-3 text-muted-foreground">El resumen del mes estará disponible próximamente.</p>
              </div>
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
                <li key={office.city}><span className="text-foreground">{office.city}</span>: {office.address}, {office.country}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{c.footer.sectionsHeading}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {navItems.map((item) => <li key={item.href}><a href={item.href} className="transition-colors hover:text-foreground">{item.label}</a></li>)}
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
