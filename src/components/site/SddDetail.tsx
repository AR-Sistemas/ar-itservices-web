import type { SiteContent, SolutionProduct } from "@/i18n/content";
import { AnimatedContent } from "./AnimatedContent";
import { SolutionAnimation } from "./SolutionVisual";

export function SddDetail({
  product,
  content,
}: {
  product: SolutionProduct;
  content: SiteContent["solutions"];
}) {
  return (
    <article id={product.id} className="mt-10 border-t border-border pt-10 sm:pt-14">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <AnimatedContent>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-primary">{product.tagline}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.short}
          </p>
        </AnimatedContent>
        <AnimatedContent delay={80}>
          <SolutionAnimation
            id={product.id}
            alt={content.logoAlt(product.name)}
            className="mx-auto max-w-md lg:max-w-none"
          />
        </AnimatedContent>
      </div>

      <AnimatedContent className="mt-14 rounded-2xl border border-border bg-card p-6 sm:mt-20 sm:p-8">
        <h2 className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
          {content.labels.problem}
        </h2>
        <p className="mt-3 max-w-4xl leading-relaxed text-foreground">{product.problem}</p>
      </AnimatedContent>

      <AnimatedContent className="mt-14 sm:mt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {product.howLabel ?? content.labels.how}
        </h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </AnimatedContent>

      <AnimatedContent className="mt-14 sm:mt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {product.featuresLabel ?? content.labels.features}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((feature) => (
            <li key={feature.title} className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </li>
          ))}
        </ul>
      </AnimatedContent>

      {product.audience && (
        <AnimatedContent className="mt-14 border-t border-border pt-8 sm:mt-20">
          <h2 className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
            {content.labels.audience}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-foreground">{product.audience}</p>
          <a
            href={`/?producto=${product.id}#contacto`}
            className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
          >
            {content.contactCta}
          </a>
        </AnimatedContent>
      )}
    </article>
  );
}
