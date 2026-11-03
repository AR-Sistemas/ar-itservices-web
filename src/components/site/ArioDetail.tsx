import { ArrowRight, FileText, Table2 } from "lucide-react";
import type { SiteContent, SolutionProduct } from "@/i18n/content";
import type { Lang } from "@/i18n/language";
import { AnimatedContent } from "./AnimatedContent";
import { SolutionAnimation } from "./SolutionVisual";

export function ArioDetail({
  product,
  content,
  lang,
}: {
  product: SolutionProduct;
  content: SiteContent["solutions"];
  lang: Lang;
}) {
  return (
    <article id={product.id} className="mt-10 border-t border-border pt-10 sm:pt-14">
      <AnimatedContent className="max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-3 text-lg font-semibold text-primary">{product.tagline}</p>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {product.short}
        </p>
        <a
          href="#ario-como-funciona"
          className="mt-7 inline-flex rounded-full border border-primary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {lang === "ES" ? "Conocé cómo funciona" : "See how it works"}{" "}
          <span aria-hidden="true" className="ml-2">
            ↓
          </span>
        </a>
      </AnimatedContent>

      <AnimatedContent className="mt-14 grid gap-6 border-y border-border py-8 sm:mt-20 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
            {content.labels.problem}
          </h2>
          <p className="mt-4 leading-relaxed text-foreground">{product.problem}</p>
        </div>
        {product.example && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
              {content.labels.example}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{product.example}</p>
            <div className="mt-5 flex items-center gap-3 text-xs font-semibold text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <FileText aria-hidden="true" className="h-5 w-5 text-primary" />
                {lang === "ES" ? "Documentos" : "Documents"}
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
              <span className="inline-flex items-center gap-2">
                <Table2 aria-hidden="true" className="h-5 w-5 text-primary" />
                {lang === "ES" ? "Datos ordenados" : "Organized data"}
              </span>
            </div>
          </div>
        )}
      </AnimatedContent>

      <section id="ario-como-funciona" className="scroll-mt-32 pt-14 sm:pt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {product.howLabel ?? content.labels.how}
        </h2>
        <div className="mt-7 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <AnimatedContent className="lg:sticky lg:top-28">
            <SolutionAnimation
              id={product.id}
              alt={content.logoAlt(product.name)}
              className="mx-auto max-w-md lg:max-w-none"
            />
          </AnimatedContent>
          <AnimatedContent delay={80}>
            <ol className="border-l border-primary/30 pl-6">
              {product.steps.map((step, index) => (
                <li key={step} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[2.45rem] grid h-7 w-7 place-items-center rounded-full border border-primary/50 bg-background text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </AnimatedContent>
        </div>
      </section>

      <AnimatedContent className="mt-14 sm:mt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {product.featuresLabel ?? content.labels.features}
        </h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {product.features.map((feature) => (
            <li
              key={feature.title}
              className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6"
            >
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </li>
          ))}
        </ul>
      </AnimatedContent>

      <AnimatedContent className="mt-14 sm:mt-20">
        {product.audience && (
          <>
            <h2 className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
              {content.labels.audience}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-foreground">{product.audience}</p>
          </>
        )}
        <a
          href={`/?producto=${product.id}#contacto`}
          className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
        >
          {content.contactCta}
        </a>
      </AnimatedContent>
    </article>
  );
}
