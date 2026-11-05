import { useState } from "react";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { FloatingNav } from "@/components/site/FloatingNav";
import { FrameworkRequestModal } from "@/components/site/FrameworkRequestModal";
import { IsoBadge } from "@/components/site/IsoBadge";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SolutionDetail } from "@/components/site/SolutionDetail";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { getPublicSolutionSlug, getSolutionIdFromSlug } from "@/lib/solution-slugs";

export const Route = createFileRoute("/solucion/$solutionId")({
  beforeLoad: ({ params }) => {
    if (params.solutionId === "sdd") {
      throw redirect({
        to: "/solucion/$solutionId",
        params: { solutionId: "criteria" },
        replace: true,
      });
    }
  },
  loader: ({ params }) => {
    const product = getContent("ES").solutions.products.find(
      (item) => item.id === getSolutionIdFromSlug(params.solutionId),
    );
    if (!product) throw notFound();
    return {
      id: product.id,
      slug: getPublicSolutionSlug(product.id),
      name: product.name,
      description: product.short,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Solución"} | AR IT Services` },
      { name: "description", content: loaderData?.description ?? "Soluciones de AR IT Services" },
      { property: "og:title", content: `${loaderData?.name ?? "Solución"} | AR IT Services` },
      {
        property: "og:description",
        content: loaderData?.description ?? "Soluciones de AR IT Services",
      },
    ],
    links: loaderData
      ? [{ rel: "canonical", href: `https://ar-itservices.com/solucion/${loaderData.slug}` }]
      : [],
  }),
  component: SolutionPage,
});

function SolutionPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const s = c.solutions;
  const { id, slug } = Route.useLoaderData();
  const product = s.products.find((item) => item.id === id)!;
  const [requestOpen, setRequestOpen] = useState<string | null>(null);
  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      {/* Misma barra que la home; acá visible desde arriba, con el logo hacia el inicio. */}
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logoHref="/"
        activeHref={`/solucion/${slug}`}
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

      <main className="px-5 pt-24 pb-8 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <SolutionDetail
            product={product}
            labels={s.labels}
            logoAlt={s.logoAlt(product.name)}
            contactCta={s.contactCta}
            onRequest={setRequestOpen}
          />
        </div>
      </main>

      <FrameworkRequestModal
        open={requestOpen !== null}
        onClose={() => setRequestOpen(null)}
        frameworkTitle={requestOpen ?? ""}
      />

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
