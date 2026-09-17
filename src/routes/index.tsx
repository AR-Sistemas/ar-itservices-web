import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { Counter } from "@/components/site/Counter";
import { SpotlightCard } from "@/components/site/SpotlightCard";

import { useSpringPress } from "@/components/site/useSpringPress";
import { Beams } from "@/components/site/Beams";
import { LogoDraw } from "@/components/site/LogoDraw";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoLoop } from "@/components/site/LogoLoop";
import { MagicBento } from "@/components/site/MagicBento";
import { StarBorder } from "@/components/site/StarBorder";
import { StarBorderCard } from "@/components/site/StarBorderCard";
import { IsoBadge } from "@/components/site/IsoBadge";
import { TeamBuilder } from "@/components/site/TeamBuilder";
import { SocialLinks } from "@/components/site/SocialLinks";
import { NewsMagazineCover } from "@/components/site/NewsMagazineCover";
import { CodeGridSpotlight } from "@/components/site/CodeGridSpotlight";
import { DepthCarousel } from "@/components/site/DepthCarousel";
import { HeroHeadlineCarousel } from "@/components/site/HeroHeadlineCarousel";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { NEWSLETTER_ISSUE } from "@/data/newsletter";
import { isIntermedio } from "@/lib/site-mode";
import claroLogo from "@/assets/clients/claro.png";
import naranjaLogo from "@/assets/clients/naranja.png";
import stellantisLogo from "@/assets/clients/stellantis.png";
import agdLogo from "@/assets/clients/agd.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AR IT Services | Software, datos e IA con equipos dedicados" },
      {
        name: "description",
        content:
          "25+ años armando equipos de desarrollo, ciencia de datos y QA. Oficinas en Dallas, Córdoba y Asunción. Clientes como Claro y la Dirección de Inteligencia Fiscal de Córdoba.",
      },
      { property: "og:title", content: "AR IT Services | Software, datos e IA" },
      {
        property: "og:description",
        content:
          "Armamos el equipo exacto que tu producto necesita, con datos e IA en el flujo de trabajo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

/* ---- Datos no traducibles (logos de marca y fotos) ---- */

const TECH = [
  { name: ".NET", src: "/logos/dotnet.svg" },
  { name: "React", src: "/logos/react.svg" },
  { name: "TypeScript", src: "/logos/typescript.svg" },
  { name: "Angular", src: "/logos/angular.svg" },
  { name: "Python", src: "/logos/python.svg" },
  { name: "Node.js", src: "/logos/nodejs.svg" },
  { name: "Swift", src: "/logos/swift.svg" },
  { name: "Kotlin", src: "/logos/kotlin.svg" },
  { name: "Power BI", src: "/logos/powerbi.svg" },
  { name: "n8n", src: "/logos/n8n.svg" },
  { name: "AWS", src: "/logos/aws.svg" },
  { name: "Azure", src: "/logos/azure.svg" },
  { name: "GCP", src: "/logos/gcp.svg" },
  { name: "Jira", src: "/logos/jira.svg" },
];

const CLIENTS = [
  { name: "Claro", src: claroLogo },
  { name: "Naranja", src: naranjaLogo },
  { name: "Stellantis", src: stellantisLogo },
  { name: "AGD", src: agdLogo },
];

/* ---- Página ---- */

type ContactType = "empresa" | "postulante" | "consulta";

function Home() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const [sent, setSent] = useState(false);
  const [contactType, setContactType] = useState<ContactType>("empresa");
  const [selectedPosition, setSelectedPosition] = useState("");
  // Levantados a estado (en vez de no controlados) para que no se pierdan si
  // el visitante cambia de pestaña de tipo de consulta y vuelve.
  const [empresaValue, setEmpresaValue] = useState("");
  const [paisValue, setPaisValue] = useState("");
  const [tipoValue, setTipoValue] = useState("");
  const [telefonoValue, setTelefonoValue] = useState("");
  const finalCta = useSpringPress<HTMLAnchorElement>();
  const submitCta = useSpringPress<HTMLButtonElement>();

  // Si venimos de "Postularme" en /trabaja-con-nosotros, precargamos el
  // formulario en modo postulante con el puesto ya seleccionado.
  useEffect(() => {
    const puesto = new URLSearchParams(window.location.search).get("puesto");
    if (puesto) {
      setContactType("postulante");
      setSelectedPosition(puesto);
    }
  }, []);

  // El puesto puede venir de un link generado en otro idioma (o de una
  // posición que ya no existe): si no matchea ninguna opción actual del
  // idioma activo, mostramos "otro" en vez de dejar el select en blanco.
  const puestoSelectValue =
    selectedPosition && !c.careers.positions.some((p) => p.title === selectedPosition)
      ? "otro"
      : selectedPosition;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <CodeGridSpotlight />
      <FloatingNav
        items={c.nav}
        ctaLabel={c.cta.talk}
        ctaHref="#contacto"
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline
              play={visible}
              className="h-8 w-auto shrink-0 text-foreground sm:h-9"
            />
            <LogoWordmark className="h-[13px] w-auto shrink-0 text-foreground sm:h-3.5" />
          </span>
        )}
        rightSlot={
          <div
            className="hidden items-center gap-1 text-xs font-semibold sm:flex"
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

      <main id="top">
        {/* Hero */}
        <section className="relative px-5 pt-20 pb-40 sm:pt-28">
          <Beams />
          <div className="relative mx-auto max-w-4xl text-center">
            <LogoDraw className="mx-auto h-16 w-auto text-primary" />
            <p className="mt-6 font-mono text-xs tracking-widest text-primary uppercase">
              {c.hero.eyebrow}
            </p>
            {/* Frases pedidas por gerencia: rotan y se traducen con el idioma del sitio */}
            <HeroHeadlineCarousel phrases={c.hero.phrases} className="mt-6" />
            <AnimatedContent delay={400} distance={24}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                {c.hero.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <StarBorder href="#contacto" className="group">
                  {c.hero.ctaPrimary}
                </StarBorder>
                <a
                  href="#casos"
                  className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/30"
                >
                  {c.hero.ctaSecondary}
                </a>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Métricas */}
        <section className="relative -mt-28 px-5">
          <AnimatedContent className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-card px-8 py-10 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] lg:grid-cols-5">
              {c.metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
                    <Counter value={m.value} />
                    {m.suffix}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
              <IsoBadge label={c.iso.certified} />
            </div>
          </AnimatedContent>
        </section>

        {/* Servicios */}
        <section id="servicios" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                {c.services.heading}
              </h2>
            </AnimatedContent>
            <AnimatedContent className="mt-12" distance={30}>
              <MagicBento cards={c.services.cards} />
            </AnimatedContent>
          </div>
        </section>

        {/* Sección firma */}
        {!isIntermedio && (
          <section className="px-5 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
              <AnimatedContent>
                <TeamBuilder />
              </AnimatedContent>
            </div>
          </section>
        )}

        {/* Clientes */}
        <section className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {c.clients.heading}
              </h2>
            </AnimatedContent>
            <AnimatedContent className="mt-12" distance={30}>
              <div className="h-[500px]">
                <DepthCarousel
                  items={CLIENTS.map((cl) => ({ image: cl.src, alt: c.clients.logoAlt(cl.name) }))}
                  cardWidth={380}
                  cardHeight={280}
                  autoplay
                  autoplayDelay={4500}
                />
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Casos */}
        <section id="casos" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.cases.heading}</h2>
            </AnimatedContent>
            <div className="mt-12 space-y-14">
              {c.cases.items.map((cs, i) => (
                <AnimatedContent key={cs.client} delay={i * 80}>
                  <StarBorderCard>
                    <SpotlightCard
                      as="article"
                      className="rounded-2xl border border-border bg-card p-8"
                    >
                      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                        <h3 className="text-xl font-bold">{cs.client}</h3>
                        <div className="space-y-5">
                          <div>
                            <p className="font-mono text-xs tracking-widest text-primary uppercase">
                              {c.cases.challengeLabel}
                            </p>
                            <p className="mt-2 text-muted-foreground">{cs.challenge}</p>
                          </div>
                          <div>
                            <p className="font-mono text-xs tracking-widest text-primary uppercase">
                              {c.cases.resultLabel}
                            </p>
                            <p className="mt-2 text-foreground">{cs.result}</p>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </StarBorderCard>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="border-y border-border px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <AnimatedContent>
              <h2 className="text-2xl font-bold tracking-tight">{c.stack.heading}</h2>
              <div className="mt-8">
                <LogoLoop
                  speed={40}
                  direction="left"
                  pauseOnHover
                  fadeOut
                  fadeOutColor="var(--background)"
                  logos={TECH.map((t) => (
                    <span
                      key={t.name}
                      className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground"
                    >
                      <img
                        src={t.src}
                        alt={c.stack.logoAlt(t.name)}
                        loading="lazy"
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      {t.name}
                    </span>
                  ))}
                />
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Portada del boletín de novedades */}
        {!isIntermedio && (
          <section className="px-5 py-24 sm:py-32">
            <div className="mx-auto max-w-4xl">
              <AnimatedContent>
                <NewsMagazineCover
                  kicker={NEWSLETTER_ISSUE.kicker}
                  title={NEWSLETTER_ISSUE.title}
                  subtitle={NEWSLETTER_ISSUE.subtitle}
                  eyebrow={c.newsTeaser.eyebrow}
                  cta={c.newsTeaser.cta}
                />
              </AnimatedContent>
            </div>
          </section>
        )}

        {/* Nuestra gente — frase misión/visión + link a la página del equipo */}
        <section className="px-5 py-24 sm:py-32">
          <AnimatedContent className="mx-auto max-w-3xl text-center">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
              {c.people.heading}
            </h2>
            <p className="mt-6 text-3xl leading-snug font-bold tracking-tight text-balance sm:text-4xl">
              {c.people.statement}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/nosotros"
                className="inline-flex rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/30"
              >
                {c.people.ctaLink}
              </Link>
              {!isIntermedio && (
                <Link
                  to="/trabaja-con-nosotros"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                >
                  {c.people.careersLink} →
                </Link>
              )}
            </div>
          </AnimatedContent>
        </section>

        {/* CTA final */}
        <section className="bg-primary px-5 py-20">
          <AnimatedContent className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              {c.finalCta.heading}
            </h2>
            <a
              ref={finalCta.ref}
              onMouseDown={finalCta.press}
              href="#contacto"
              className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              {c.finalCta.button}
            </a>
          </AnimatedContent>
        </section>

        {/* Contacto */}
        <section id="contacto" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.contact.heading}</h2>
              <p className="mt-3 text-muted-foreground">{c.contact.subtitle}</p>

              <div className="mt-8 inline-flex flex-wrap gap-1.5 rounded-full border border-border bg-card p-1.5">
                {(
                  [
                    ["empresa", c.contact.typeLabels.company],
                    ["postulante", c.contact.typeLabels.candidate],
                    ["consulta", c.contact.typeLabels.general],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setContactType(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      contactType === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form
                className="mt-8 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id="nombre" label={c.contact.fields.name} />
                <Field id="email" label={c.contact.fields.email} type="email" />

                {contactType === "empresa" && (
                  <Field id="empresa" label={c.contact.fields.company} value={empresaValue} onChange={setEmpresaValue} />
                )}
                {contactType === "postulante" && (
                  <Field id="telefono" label={c.contact.fields.phone} type="tel" value={telefonoValue} onChange={setTelefonoValue} />
                )}

                {contactType !== "consulta" && (
                  <SelectField
                    id="pais"
                    label={c.contact.fields.country}
                    options={c.contact.countries}
                    value={paisValue}
                    onChange={setPaisValue}
                  />
                )}

                {contactType === "empresa" && (
                  <div className="sm:col-span-2">
                    <label htmlFor="tipo" className="text-sm font-medium">
                      {c.contact.fields.projectType}
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={tipoValue || c.contact.projectOptions[0]}
                      onChange={(e) => setTipoValue(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                    >
                      {c.contact.projectOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}

                {contactType === "postulante" && (
                  <>
                    <div className="sm:col-span-2">
                      <label htmlFor="puesto" className="text-sm font-medium">
                        {c.contact.fields.position}
                      </label>
                      <select
                        id="puesto"
                        name="puesto"
                        value={puestoSelectValue}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                      >
                        <option value="">—</option>
                        {c.careers.positions.map((p) => (
                          <option key={p.title} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                        <option value="otro">{c.contact.fields.positionOther}</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="cv" className="text-sm font-medium">
                        {c.contact.fields.resume}
                      </label>
                      <input
                        id="cv"
                        name="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label htmlFor="mensaje" className="text-sm font-medium">
                    {c.contact.fields.message}
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={contactType === "consulta" ? 4 : 5}
                    required={contactType !== "postulante"}
                    className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    ref={submitCta.ref}
                    onMouseDown={submitCta.press}
                    type="submit"
                    className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                  >
                    {c.contact.submit}
                  </button>
                  {sent && (
                    <p className="mt-4 text-sm text-muted-foreground" role="status">
                      {c.contact.success}
                    </p>
                  )}
                </div>
              </form>
            </AnimatedContent>
          </div>
        </section>
      </main>

      <footer className="px-5 py-16 text-muted-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <LogoMark className="h-14 w-auto text-foreground" />
            <p className="mt-5 text-sm">{c.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{c.footer.officesHeading}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {c.footer.offices.map((o) => (
                <li key={o.city}>
                  <span className="text-foreground">{o.city}</span> — {o.address}, {o.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{c.footer.sectionsHeading}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {c.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{c.footer.followHeading}</h3>
            <SocialLinks />
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.legal}</p>
          <IsoBadge compact label={c.iso.certified} />
        </div>
      </footer>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
      >
        <option value="" disabled>
          —
        </option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
