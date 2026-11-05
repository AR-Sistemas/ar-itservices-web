import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { FloatingNav } from "@/components/site/FloatingNav";
import { FrameworkRequestModal } from "@/components/site/FrameworkRequestModal";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { ProductVideo } from "@/components/site/ProductVideo";
import { SolutionAnimation } from "@/components/site/SolutionVisual";
import { PRODUCT_LOGOS } from "@/components/site/product-logos";
import { useContactModal } from "@/components/site/ContactModal";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

const PRODUCT_VIDEOS: Record<string, string | undefined> = {
  meetingmate: "/videos/meetingmate.mp4",
};

export const Route = createFileRoute("/soluciones")({
  head: () => ({
    meta: [
      { title: "Soluciones | AR IT Services" },
      { name: "description", content: "Productos propios de AR IT Services." },
    ],
  }),
  component: SolutionsPage,
});

/** Vista integral de desarrollo: el detalle se lee a la izquierda y el visual queda fijo a la derecha. */
function SolutionsPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const s = c.solutions;
  const openContact = useContactModal();
  const [requestOpen, setRequestOpen] = useState<string | null>(null);
  const navItems = c.nav.map((item) =>
    item.href.startsWith("#") ? { ...item, href: `/${item.href}` } : item,
  );
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logoHref="/"
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
      <main className="px-5 pt-24 pb-16 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              {s.heading}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {s.subtitle}
            </p>
          </AnimatedContent>
          {s.products.map((product) => {
            const cta = product.requestCta ? (
              <button
                type="button"
                onClick={() => setRequestOpen(product.name)}
                className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
              >
                {product.requestCta}
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openContact({
                    type: "consulta",
                    allowedTypes: ["empresa", "consulta"],
                    producto: product.name,
                    message: c.contact.productMessage(product.name),
                  })
                }
                className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
              >
                {s.contactCta}
              </button>
            );
            return (
              <section
                key={product.id}
                id={product.id}
                className="mt-14 scroll-mt-28 border-t border-border pt-14 first-of-type:mt-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
                  <AnimatedContent delay={80}>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-lg font-semibold text-brand-text">{product.tagline}</p>
                    <p className="mt-4 text-muted-foreground">{product.short}</p>
                    <div className="mt-8">
                      <h3 className="font-mono text-xs tracking-widest text-brand-text uppercase">
                        {s.labels.problem}
                      </h3>
                      <p className="mt-2 text-foreground">{product.problem}</p>
                      {product.example && (
                        <p className="mt-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {s.labels.example}:{" "}
                          </span>
                          {product.example}
                        </p>
                      )}
                    </div>
                    <div className="mt-8">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="font-mono text-xs tracking-widest text-brand-text uppercase">
                          {product.howLabel ?? s.labels.how}
                        </h3>
                        {cta}
                      </div>
                      <ol className="mt-3 space-y-3">
                        {product.steps.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-bold text-brand-text">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-mono text-xs tracking-widest text-brand-text uppercase">
                        {product.featuresLabel ?? s.labels.features}
                      </h3>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                        {product.features.map((feature) => (
                          <li
                            key={feature.title}
                            className="rounded-xl border border-border bg-card p-4"
                          >
                            <p className="text-sm font-semibold">{feature.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {product.audience && (
                      <div className="mt-8">
                        <h3 className="font-mono text-xs tracking-widest text-brand-text uppercase">
                          {s.labels.audience}
                        </h3>
                        <p className="mt-2 text-muted-foreground">{product.audience}</p>
                      </div>
                    )}
                  </AnimatedContent>
                  <AnimatedContent className="lg:sticky lg:top-28">
                    {PRODUCT_VIDEOS[product.id] ? (
                      <ProductVideo
                        src={PRODUCT_VIDEOS[product.id]!}
                        name={product.name}
                        logo={PRODUCT_LOGOS[product.id]}
                      />
                    ) : (
                      <SolutionAnimation
                        id={product.id}
                        alt={s.logoAlt(product.name)}
                        className="max-w-md lg:max-w-none"
                      />
                    )}
                  </AnimatedContent>
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <FrameworkRequestModal
        open={requestOpen !== null}
        onClose={() => setRequestOpen(null)}
        frameworkTitle={requestOpen ?? ""}
      />
    </div>
  );
}
