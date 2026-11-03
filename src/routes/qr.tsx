import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Layers3, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { useLang } from "@/i18n/language";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { QrContactForm } from "@/components/site/QrContactForm";
import { CodeGridSpotlight } from "@/components/site/CodeGridSpotlight";
import { Beams } from "@/components/site/Beams";
import { getContent } from "@/i18n/content";
import { PRODUCT_LOGOS } from "@/components/site/product-logos";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [{ title: "AR IT Services" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: QrPage,
});

function QrPage() {
  const { lang, setLang } = useLang();
  const en = lang === "EN";
  const [formType, setFormType] = useState<"empresa" | "postulante" | null>(null);
  const [sending, setSending] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const options = [
    {
      label: en ? "Contact us" : "Contactanos",
      formType: "empresa" as const,
      icon: MessageCircle,
    },
    {
      label: en ? "Work with us" : "Trabajá con nosotros",
      formType: "postulante" as const,
      icon: BriefcaseBusiness,
    },
    { label: en ? "Solutions" : "Soluciones", formType: "soluciones" as const, icon: Layers3 },
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
                className={`rounded px-2 py-2 ${lang === language ? "text-primary" : "text-muted-foreground"}`}
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
          {options.map(({ label, formType: type, icon: Icon }) => {
            const content = (
              <>
                <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />
                <span className="flex-1">{label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                />
              </>
            );
            const className =
              "group flex min-h-20 w-full items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 text-left text-lg font-semibold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
            return (
              <button
                key={label}
                type="button"
                className={className}
                onClick={() => (type === "soluciones" ? setSolutionsOpen(true) : setFormType(type))}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
      <Dialog
        open={formType !== null}
        onOpenChange={(open) => {
          if (!open && !sending) setFormType(null);
        }}
      >
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
          aria-describedby={undefined}
        >
          <DialogTitle className="pr-8 text-xl">
            {formType === "postulante"
              ? en
                ? "Work with us"
                : "Trabajá con nosotros"
              : en
                ? "Contact us"
                : "Contactanos"}
          </DialogTitle>
          {formType && (
            <QrContactForm
              contactType={formType}
              onSuccess={() => setFormType(null)}
              onSendingChange={setSending}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={solutionsOpen} onOpenChange={setSolutionsOpen}>
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl p-6 sm:p-8"
          aria-describedby={undefined}
        >
          <DialogTitle className="pr-8 text-xl">
            {en ? "Explore our solutions" : "Conocé nuestras soluciones"}
          </DialogTitle>
          <div className="mt-2 divide-y divide-border">
            {getContent(lang).solutions.products.map((product) => (
              <Link
                key={product.id}
                to="/soluciones/$productId"
                params={{ productId: product.id }}
                search={{ origen: "qr" }}
                className="group flex min-h-20 items-center gap-4 rounded-lg px-1 py-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <img
                  src={PRODUCT_LOGOS[product.id]}
                  alt=""
                  className="h-12 w-16 shrink-0 object-contain"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{product.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {product.tagline}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary"
                />
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
