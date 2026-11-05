import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Layers3, MessageCircle, X } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { useContactModal } from "@/components/site/ContactModal";
import { CodeGridSpotlight } from "@/components/site/CodeGridSpotlight";
import { Beams } from "@/components/site/Beams";
import { PRODUCT_LOGO_SCALE, PRODUCT_LOGOS } from "@/components/site/product-logos";
import { getPublicSolutionSlug } from "@/lib/solution-slugs";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [{ title: "AR IT Services" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: QrPage,
});

/** Landing a la que apuntan los QR impresos. */
function QrPage() {
  const { lang, setLang } = useLang();
  const openContact = useContactModal();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const c = getContent(lang);
  const en = lang === "EN";
  const options = [
    {
      label: en ? "Contact us" : "Contactanos",
      icon: MessageCircle,
      action: () => openContact({ type: "empresa", allowedTypes: ["empresa", "consulta"] }),
    },
    {
      label: en ? "Work with us" : "Trabajá con nosotros",
      icon: BriefcaseBusiness,
      action: () => openContact({ type: "postulante", hideTypeSelector: true }),
    },
    {
      label: en ? "Solutions" : "Soluciones",
      icon: Layers3,
      action: () => setSolutionsOpen(true),
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-clip bg-background px-5 py-10 sm:py-16">
      <CodeGridSpotlight />
      <Beams />
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="AR IT Services" className="inline-flex items-center gap-3">
            <LogoMark className="h-11 w-auto text-foreground" />
            <LogoWordmark className="h-4 w-auto text-foreground" />
          </Link>
          <div
            role="group"
            aria-label={en ? "Language" : "Idioma"}
            className="flex gap-1 text-xs font-semibold"
          >
            {(["ES", "EN"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={lang === language}
                onClick={() => setLang(language)}
                className={`rounded px-2 py-2 ${lang === language ? "text-brand-text" : "text-muted-foreground"}`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
        <h1 className="mt-16 text-3xl font-bold tracking-tight sm:text-4xl">
          {en ? "How can we help you?" : "¿Cómo podemos ayudarte?"}
        </h1>
        <div className="mt-8 grid gap-4">
          {options.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="group flex min-h-20 w-full items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 text-left text-lg font-semibold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-brand-text" />
              <span className="flex-1">{label}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-brand-text"
              />
            </button>
          ))}
          <a
            href="https://boletin-ar-consultores.vercel.app/"
            className="group flex min-h-20 w-full items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 text-left text-lg font-semibold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <BookOpen aria-hidden="true" className="h-6 w-6 shrink-0 text-brand-text" />
            <span className="flex-1">{en ? "AI Magazine" : "Revista de IA"}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-brand-text"
            />
          </a>
        </div>
      </div>

      {solutionsOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={en ? "Explore our solutions" : "Conocé nuestras soluciones"}
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold">
                {en ? "Explore our solutions" : "Conocé nuestras soluciones"}
              </h2>
              <button
                type="button"
                onClick={() => setSolutionsOpen(false)}
                aria-label={en ? "Close" : "Cerrar"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 divide-y divide-border">
              {c.solutions.products.map((product) => (
                <Link
                  key={product.id}
                  to="/solucion/$solutionId"
                  params={{ solutionId: getPublicSolutionSlug(product.id) }}
                  onClick={() => setSolutionsOpen(false)}
                  className="group flex min-h-20 items-center gap-4 rounded-lg px-1 py-4 transition-colors hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden">
                    <img
                      src={PRODUCT_LOGOS[product.id]}
                      alt=""
                      className={`h-full w-full object-contain ${PRODUCT_LOGO_SCALE[product.id]}`}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground">{product.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {product.tagline}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-brand-text"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
