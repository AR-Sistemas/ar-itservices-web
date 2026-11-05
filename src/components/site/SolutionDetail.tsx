import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { AriaFramework, useAriaPlayback, useAriaStep } from "@/components/site/AriaFramework";
import { SolutionAnimation } from "@/components/site/SolutionVisual";
import type { SiteContent, SolutionProduct } from "@/i18n/content";
import { useContactModal } from "@/components/site/ContactModal";
import { getContent } from "@/i18n/content";
import { useLang } from "@/i18n/language";

const EYEBROW = "font-mono text-xs tracking-widest text-brand-text uppercase";
const CTA =
  "inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white";

/**
 * Ficha de producto: encabezado con el visual protagonista (el video si el
 * producto tiene uno; si todavía no, su animación), problema y ejemplo, pasos en
 * línea, funcionalidades en grilla y cierre con público y CTA.
 */
export function SolutionDetail({
  product,
  labels,
  logoAlt,
  contactCta,
  onRequest,
}: {
  product: SolutionProduct;
  labels: SiteContent["solutions"]["labels"];
  logoAlt: string;
  contactCta: string;
  onRequest: (name: string) => void;
}) {
  const { lang } = useLang();
  const openContact = useContactModal();
  const isAria = product.id === "aria";

  const cta = product.requestCta ? (
    <button type="button" onClick={() => onRequest(product.name)} className={CTA}>
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
          message: getContent(lang).contact.productMessage(product.name),
        })
      }
      className={`${CTA} cursor-pointer`}
    >
      {contactCta}
    </button>
  );

  return (
    <article id={product.id} className="scroll-mt-40 sm:scroll-mt-28">
      <section className="max-w-3xl">
        <AnimatedContent>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-brand-text">{product.tagline}</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.short}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#como-funciona"
              className="inline-flex rounded-full border border-primary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-brand-text"
            >
              {product.howLabel ?? labels.how}
              <span aria-hidden="true" className="ml-2">
                ↓
              </span>
            </a>
            {cta}
          </div>
        </AnimatedContent>
      </section>
      <AnimatedContent
        className={`mt-14 grid gap-6 border-y border-border py-8 sm:mt-20 ${product.example ? "lg:grid-cols-2 lg:gap-12" : "max-w-3xl"}`}
      >
        <div>
          <h2 className={EYEBROW}>{labels.problem}</h2>
          <p className="mt-4 leading-relaxed text-foreground">{product.problem}</p>
        </div>
        {product.example && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className={EYEBROW}>{labels.example}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{product.example}</p>
          </div>
        )}
      </AnimatedContent>
      <section id="como-funciona" className="scroll-mt-32 pt-14 sm:pt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {product.howLabel ?? labels.how}
        </h2>
        {isAria ? (
          <AriaArticulation steps={product.steps} features={product.features} />
        ) : (
          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
            <AnimatedContent delay={80} className="max-w-3xl">
              <ol className="border-l border-primary/30 pl-6">
                {product.steps.map((step, index) => (
                  <li key={step} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[2.45rem] grid h-7 w-7 place-items-center rounded-full border border-primary/50 bg-background text-xs font-bold text-brand-text">
                      {index + 1}
                    </span>
                    <p className="leading-relaxed text-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </AnimatedContent>
            <AnimatedContent delay={120} className="lg:sticky lg:top-28">
              <SolutionAnimation id={product.id} alt={logoAlt} className="mx-auto max-w-xl" />
            </AnimatedContent>
          </div>
        )}
      </section>
      {!isAria && (
        <AnimatedContent className="mt-14 sm:mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {product.featuresLabel ?? labels.features}
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
      )}
      <AnimatedContent className="mt-14 mb-8 sm:mt-20">
        {product.audience && (
          <>
            <h2 className={EYEBROW}>{labels.audience}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-foreground">{product.audience}</p>
          </>
        )}
        {!product.audience && product.id !== "aria" && (
          <p className="font-display text-xl font-semibold">
            {lang === "EN" ? "Want to see it in action?" : "¿Querés verlo en acción?"}
          </p>
        )}
      </AnimatedContent>
    </article>
  );
}

/**
 * "Cómo se articulan los 9 bloques": una sola lista (1 a 9) sincronizada con la
 * animación. Cada bloque muestra su nombre y cómo se articula con el resto; el
 * activo se despliega con su detalle, así no hace falta una sección aparte que
 * repita los mismos nombres. La animación recorre los pasos sola mientras está
 * a la vista; con el mouse o el foco en un paso se queda en ese bloque, y el
 * scroll sigue al paso activo salvo que la persona esté scrolleando.
 */
function AriaArticulation({
  steps,
  features,
}: {
  steps: string[];
  features: { title: string; desc: string }[];
}) {
  const [hold, setHold] = useState<number | null>(null);
  const { ref, active, reduceMotion } = useAriaPlayback();
  // Cada paso dura según lo que hay que leer; y se reproduce una sola vez por visita
  // (sin loop), así la página nunca tiene que volver sola hacia arriba.
  const durationFor = useCallback((n: number) => 1700 + (steps[n - 1]?.length ?? 0) * 14, [steps]);
  const auto = useAriaStep(active, hold, { loop: false, durationFor });
  const step = reduceMotion ? 10 : auto;
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const manualPauseUntil = useRef(0);
  const autoScrollUntil = useRef(0);

  // Última interacción manual: el scroll automático no pelea con quien está leyendo. Un gesto
  // propio (rueda, toque, teclado o clic) lo pausa 10 s; si la persona sigue, se vuelve a pausar.
  useEffect(() => {
    const mark = () => {
      // Los eventos que dispara el propio scroll automático no cuentan como interacción.
      if (Date.now() < autoScrollUntil.current) return;
      manualPauseUntil.current = Date.now() + 10000;
    };
    const events = ["wheel", "touchstart", "touchmove", "keydown", "pointerdown"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, []);

  // Sigue la lectura con un criterio simple: ver siempre el paso activo y el que viene.
  //  - Si el activo y el siguiente ya están a la vista, no se mueve nada.
  //  - Si el siguiente quedaría fuera de la ventana, se corre lo justo para dejar el activo
  //    arriba (a ~18 % de la altura) y que se vean varios pasos por delante: un salto cada
  //    tantos pasos en vez de un tironcito por cada uno.
  //  - Nunca sube sola: si el activo quedó por encima de la ventana (la persona se adelantó),
  //    no la trae de vuelta; con el paso 1 y la lista ya vista tampoco.
  //  - Se quita si hay un gesto manual reciente, mientras se pasa el mouse por un paso, con la
  //    pestaña oculta o si hay "reducir movimiento" (en todos esos casos \`active\` es falso).
  useEffect(() => {
    if (!active || hold !== null || step < 1 || step > features.length) return;
    const id = window.setTimeout(() => {
      const now = Date.now();
      if (now < manualPauseUntil.current || now < autoScrollUntil.current) return;
      const el = items.current[step - 1];
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const next = items.current[step]?.getBoundingClientRect();
      const needBottom = (next ?? rect).bottom;
      const top = 104; // debajo de la navegación flotante
      if (rect.top < top) return; // ya está por encima: no se sube sola
      if (needBottom <= vh - 24) return; // el activo y el siguiente ya se ven
      const target = Math.max(0, window.scrollY + rect.top - vh * 0.18);
      autoScrollUntil.current = now + 900;
      window.scrollTo({ top: target, behavior: "smooth" });
    }, 180);
    return () => window.clearTimeout(id);
  }, [step, active, hold, features.length]);

  return (
    <div
      ref={ref}
      className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,5fr)] lg:items-start lg:gap-14"
    >
      <AnimatedContent delay={80} className="order-2 lg:order-1">
        <ol className="space-y-1">
          {steps.map((text, index) => {
            const n = index + 1;
            const on = step === n;
            const feature = features[index];
            // El paso arranca con el nombre del bloque ("EA · Estrategia + IA es el núcleo…"): se muestra aparte.
            const title = feature?.title ?? "";
            const detail = title && text.startsWith(title) ? text.slice(title.length).trim() : text;
            return (
              <li
                key={text}
                ref={(el) => {
                  items.current[index] = el;
                }}
                tabIndex={0}
                onMouseMove={() => hold !== n && setHold(n)}
                onMouseLeave={() => setHold(null)}
                onFocus={() => setHold(n)}
                onBlur={() => setHold(null)}
                className={`flex cursor-default gap-3 rounded-xl border px-3 py-2.5 transition-colors outline-none focus-visible:border-primary ${
                  on ? "border-primary/50 bg-primary/10" : "border-transparent"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors ${
                    on || step > n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/50 text-brand-text"
                  }`}
                >
                  {n}
                </span>
                <div className="min-w-0">
                  <p
                    className={`leading-relaxed transition-colors ${on ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {title && <strong className="font-semibold text-foreground">{title} </strong>}
                    {detail}
                  </p>
                  {feature && (
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                        <span className="block pt-2">{feature.desc}</span>
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </AnimatedContent>
      {/* La animación solo se ve en pantallas grandes; en celular el efecto lo lleva la lista. */}
      <AnimatedContent delay={120} className="hidden lg:sticky lg:top-28 lg:order-2 lg:block">
        <AriaFramework step={step} className="max-w-md" />
      </AnimatedContent>
    </div>
  );
}
