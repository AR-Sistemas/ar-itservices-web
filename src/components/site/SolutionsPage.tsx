import { useState } from "react";
import type { SolutionProduct } from "@/i18n/content";
import { BackButton } from "@/components/site/BackButton";
import { FrameworkRequestModal } from "@/components/site/FrameworkRequestModal";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { SolutionsNav } from "@/components/site/SolutionsNav";
import { ProductDetail } from "@/components/site/ProductDetail";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export function SolutionsPage({
  productId,
  fromQr = false,
}: {
  productId: SolutionProduct["id"];
  fromQr?: boolean;
}) {
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
        fromQr={fromQr}
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
            {fromQr ? (
              <BackButton to="/qr" label={lang === "ES" ? "Volver al menu" : "Back to menu"} />
            ) : (
              <BackButton
                to="/"
                hash="soluciones"
                label={lang === "ES" ? "Volver a soluciones" : "Back to solutions"}
              />
            )}
          </div>

          {s.products
            .filter((product) => product.id === productId)
            .map((product) => (
              <ProductDetail
                key={product.id}
                product={product}
                content={s}
                lang={lang}
                onRequest={setRequestOpen}
              />
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
