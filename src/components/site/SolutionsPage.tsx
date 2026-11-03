import { useState } from "react";
import type { SolutionProduct } from "@/i18n/content";
import { BackButton } from "@/components/site/BackButton";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { FrameworkRequestModal } from "@/components/site/FrameworkRequestModal";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SolutionAnimation } from "@/components/site/SolutionVisual";
import { SolutionsNav } from "@/components/site/SolutionsNav";
import { SddDetail } from "@/components/site/SddDetail";
import { ArioDetail } from "@/components/site/ArioDetail";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export function SolutionsPage({ productId }: { productId: SolutionProduct["id"] }) {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const s = c.solutions;
  const [requestOpen, setRequestOpen] = useState<string | null>(null);
  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <SolutionsNav
        products={s.products}
        current={productId}
        jumpLabel={s.jumpLabel}
        backLabel={s.backLink}
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
          <div className="mb-8">
            <BackButton
              to="/"
              hash="soluciones"
              label={lang === "ES" ? "Volver a soluciones" : "Back to solutions"}
            />
          </div>

          {s.products
            .filter((p) => p.id === productId)
            .map((p) => p.id === "sdd" ? (
              <SddDetail key={p.id} product={p} content={s} />
            ) : p.id === "ario" ? (
              <ArioDetail key={p.id} product={p} content={s} lang={lang} />
            ) : (
              <section
                key={p.id}
                id={p.id}
                className="mt-14 scroll-mt-40 border-t sm:scroll-mt-28 border-border pt-14 first-of-type:mt-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
                  <AnimatedContent className="lg:sticky lg:top-28">
                    <SolutionAnimation
                      id={p.id}
                      alt={s.logoAlt(p.name)}
                      className="max-w-md lg:max-w-none"
                    />
                  </AnimatedContent>

                  <AnimatedContent delay={80}>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {p.name}
                    </h1>
                    <p className="mt-2 text-lg font-semibold text-primary">{p.tagline}</p>
                    <p className="mt-4 text-muted-foreground">{p.short}</p>

                    <div className="mt-8">
                      <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                        {s.labels.problem}
                      </h3>
                      <p className="mt-2 text-foreground">{p.problem}</p>
                      {p.example && (
                        <p className="mt-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {s.labels.example}:{" "}
                          </span>
                          {p.example}
                        </p>
                      )}
                    </div>

                    <div className="mt-8">
                      <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                        {p.howLabel ?? s.labels.how}
                      </h3>
                      <ol
                        className={
                          p.id === "meetingmate"
                            ? "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
                            : "mt-3 space-y-3"
                        }
                      >
                        {p.steps.map((step, i) => (
                          <li
                            key={step}
                            className={
                              p.id === "meetingmate"
                                ? "flex items-start gap-3 rounded-xl border border-border bg-card p-3"
                                : "flex gap-3"
                            }
                          >
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                            <span className={p.id === "meetingmate" ? "text-sm leading-snug text-muted-foreground" : "text-muted-foreground"}>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                        {p.featuresLabel ?? s.labels.features}
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

                    {p.audience && (
                      <div className="mt-8">
                        <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
                          {s.labels.audience}
                        </h3>
                        <p className="mt-2 text-muted-foreground">{p.audience}</p>
                      </div>
                    )}

                    {p.requestCta ? (
                      <button
                        type="button"
                        onClick={() => setRequestOpen(p.name)}
                        className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                      >
                        {p.requestCta}
                      </button>
                    ) : (
                      <a
                        href={`/?producto=${p.id}#contacto`}
                        className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                      >
                        {s.contactCta}
                      </a>
                    )}
                  </AnimatedContent>
                </div>
              </section>
            ))}
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
