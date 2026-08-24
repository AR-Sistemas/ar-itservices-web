import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { Counter } from "@/components/site/Counter";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { TiltedCard } from "@/components/site/TiltedCard";
import { useSpringPress } from "@/components/site/useSpringPress";
import { Beams } from "@/components/site/Beams";
import { BlurText } from "@/components/site/BlurText";
import { LogoDraw } from "@/components/site/LogoDraw";
import { LogoLoop } from "@/components/site/LogoLoop";
import { MagicBento, type BentoCard } from "@/components/site/MagicBento";
import { StarBorder } from "@/components/site/StarBorder";
import { TeamBuilder } from "@/components/site/TeamBuilder";
import felixPhoto from "@/assets/felix-melinsky.png.asset.json";
import josePhoto from "@/assets/jose-romanutti.png.asset.json";
import adrianPhoto from "@/assets/adrian-ferrari.png.asset.json";
import constanzaPhoto from "@/assets/constanza-giordano.png.asset.json";

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

/* ---- Contenido editable ---- */

const NAV = [
  { label: "Servicios", href: "#servicios" },
  { label: "Casos de éxito", href: "#casos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Carreras", href: "#carreras" },
];

const METRICS = [
  { value: 25, suffix: "+", label: "años de trayectoria" },
  { value: 2000, suffix: "+", label: "proyectos entregados" },
  { value: 3, suffix: "", label: "países con oficina propia" },
  { value: 2, suffix: "M+", label: "horas-hombre con Claro" },
];

const SERVICES: BentoCard[] = [
  {
    title: "Desarrollo Web & Mobile",
    desc: ".NET, React, iOS y Android. Productos que salen a producción y se mantienen, con equipos que conocen el negocio del cliente.",
    label: "Producto",
    span: "large",
  },
  {
    title: "Ciencia de Datos & BI",
    desc: "Modelos predictivos, machine learning aplicado y tableros en Power BI que se usan todos los días.",
    label: "Datos e IA",
    span: "large",
  },
  {
    title: "QA & Testing",
    desc: "Automatización de pruebas y control de calidad integrado al ciclo de desarrollo.",
  },
  {
    title: "Equipos dedicados & Scrum",
    desc: "Perfiles seleccionados, on-boarding rápido y ceremonias que se cumplen.",
  },
  {
    title: "Automatización",
    desc: "Flujos con n8n, pipelines de DevOps y despliegues repetibles.",
  },
  {
    title: "Consultoría & Project Management",
    desc: "Planificamos, medimos y reportamos avance con números, no con impresiones.",
  },
];

const CASES = [
  {
    client: "Dirección de Inteligencia Fiscal de Córdoba",
    challenge:
      "Detectar patrones de fraude fiscal sobre grandes volúmenes de datos tributarios sin depender de revisiones manuales.",
    result:
      "Modelos de machine learning en producción que priorizan casos sospechosos y ordenan el trabajo de los equipos de fiscalización.",
  },
  {
    client: "Claro",
    challenge:
      "Sostener una demanda continua de desarrollo y soporte en múltiples países de LATAM con equipos que puedan escalar.",
    result:
      "Más de 2.000 proyectos entregados y 2M+ horas-hombre acumuladas trabajando junto a sus equipos en toda la región.",
  },
];

const STACK = [
  ".NET",
  "React",
  "TypeScript",
  "Angular",
  "Python",
  "Node.js",
  "Swift",
  "Kotlin",
  "Power BI",
  "n8n",
  "AWS",
  "Azure",
  "GCP",
  "Jira",
];

const PEOPLE = [
  {
    name: "Felix Melinsky",
    role: "Fundador & Presidente",
    photo: felixPhoto.url,
    quote: "Empezamos hace 25 años haciendo el trabajo. Seguimos haciéndolo.",
  },
  {
    name: "Jose Romanutti",
    role: "Socio & CEO",
    photo: josePhoto.url,
    quote: "El cliente no compra tecnología: compra un resultado que se pueda medir.",
  },
  {
    name: "Adrián Ferrari",
    role: "Socio & Director de Operaciones",
    photo: adrianPhoto.url,
    quote: "Un equipo bien armado resuelve más que cualquier metodología de moda.",
  },
  {
    name: "Constanza Giordano",
    role: "Directora de Talento",
    photo: constanzaPhoto.url,
    quote: "Buscamos gente que quiera quedarse, no perfiles que encajen en una grilla.",
  },
];


const OFFICES = [
  { city: "Dallas", country: "Estados Unidos", address: "Dallas, Texas" },
  { city: "Córdoba", country: "Argentina", address: "Córdoba Capital" },
  { city: "Asunción", country: "Paraguay", address: "Asunción" },
];

/* ---- Página ---- */

function Home() {
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const [sent, setSent] = useState(false);
  const headerCta = useSpringPress<HTMLAnchorElement>();
  const finalCta = useSpringPress<HTMLAnchorElement>();
  const submitCta = useSpringPress<HTMLButtonElement>();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
          <a href="#top" className="flex min-w-0 items-center p-3" aria-label="AR IT Services">
            <img
              src="/ar-logo-white.png"
              alt="AR IT Services"
              className="h-11 w-auto shrink-0 object-contain"
            />
          </a>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div
              className="hidden items-center gap-1 text-xs font-semibold sm:flex"
              role="group"
              aria-label="Idioma"
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
            <a
              ref={headerCta.ref}
              onMouseDown={headerCta.press}
              href="#contacto"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
            >
              Hablemos
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative px-5 pt-20 pb-40 sm:pt-28">
          <Beams />
          <div className="relative mx-auto max-w-4xl text-center">
            <LogoDraw className="mx-auto h-16 w-auto text-primary" />
            <p className="mt-6 font-mono text-xs tracking-widest text-primary uppercase">
              AR IT Services · Dallas · Córdoba · Asunción
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
              <BlurText
                text="Armamos el equipo exacto que tu producto necesita, con datos e IA en el flujo, no como promesa."
                highlightFrom={8}
                highlightTo={15}
              />
            </h1>
            <AnimatedContent delay={400} distance={24}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                25 años desarrollando software, modelos de datos y equipos dedicados para empresas y
                gobiernos, desde tres países.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <StarBorder href="#contacto" className="group">
                  Hablemos de tu proyecto
                </StarBorder>
                <a
                  href="#casos"
                  className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/30"
                >
                  Ver casos de éxito
                </a>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Métricas */}
        <section className="relative -mt-28 px-5">
          <AnimatedContent className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-card px-8 py-10 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] lg:grid-cols-4">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
                    <Counter value={m.value} />
                    {m.suffix}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </AnimatedContent>
        </section>

        {/* Servicios */}
        <section id="servicios" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Qué hacemos
              </h2>
            </AnimatedContent>
            <AnimatedContent className="mt-12" distance={30}>
              <MagicBento cards={SERVICES} />
            </AnimatedContent>
          </div>
        </section>

        {/* Sección firma */}
        <section className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <TeamBuilder />
            </AnimatedContent>
          </div>
        </section>

        {/* Casos */}
        <section id="casos" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Casos de éxito</h2>
            </AnimatedContent>
            <div className="mt-12 space-y-14">
              {CASES.map((c, i) => (
                <AnimatedContent key={c.client} delay={i * 80}>
                  <SpotlightCard
                    as="article"
                    className="rounded-2xl border border-border bg-card p-8"
                  >
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <h3 className="text-xl font-bold">{c.client}</h3>
                    <div className="space-y-5">
                      <div>
                        <p className="font-mono text-xs tracking-widest text-primary uppercase">
                          Desafío
                        </p>
                        <p className="mt-2 text-muted-foreground">{c.challenge}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs tracking-widest text-primary uppercase">
                          Resultado
                        </p>
                        <p className="mt-2 text-foreground">{c.result}</p>
                      </div>
                    </div>
                    </div>
                  </SpotlightCard>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="border-y border-border px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <AnimatedContent>
              <h2 className="text-2xl font-bold tracking-tight">Stack con el que trabajamos</h2>
              <div className="mt-8">
                <LogoLoop
                  speed={40}
                  direction="left"
                  pauseOnHover
                  fadeOut
                  fadeOutColor="var(--background)"
                  logos={STACK.map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-full border border-border bg-card px-4 py-2 font-mono text-sm text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                />
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Nuestra gente */}
        <section id="nosotros" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestra gente</h2>
            </AnimatedContent>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PEOPLE.map((p, i) => (
                <AnimatedContent key={p.name} delay={i * 60}>
                  <figure>
                    <TiltedCard>
                      <div className="flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded-xl bg-secondary p-5">
                        <img
                          src={p.photo}
                          alt={`Retrato de ${p.name}`}
                          loading="lazy"
                          className="aspect-square w-full rounded-full object-cover ring-1 ring-primary/25"
                        />
                      </div>
                    </TiltedCard>
                    <figcaption className="mt-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.role}</p>
                    </figcaption>
                    <blockquote className="mt-3 text-sm text-foreground italic">
                      “{p.quote}”
                    </blockquote>
                  </figure>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-primary px-5 py-20">
          <AnimatedContent className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              ¿Armamos el equipo que tu proyecto necesita?
            </h2>
            <a
              ref={finalCta.ref}
              onMouseDown={finalCta.press}
              href="#contacto"
              className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Escribinos
            </a>
          </AnimatedContent>
        </section>

        {/* Contacto */}
        <section id="contacto" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contanos tu proyecto</h2>
              <p className="mt-3 text-muted-foreground">
                Respondemos con una propuesta de equipo, no con un folleto.
              </p>
              <form
                className="mt-10 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id="nombre" label="Nombre" />
                <Field id="email" label="Email" type="email" />
                <Field id="empresa" label="Empresa" />
                <Field id="pais" label="País" />
                <div className="sm:col-span-2">
                  <label htmlFor="tipo" className="text-sm font-medium">
                    Tipo de proyecto
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
                  >
                    <option>Desarrollo web/mobile</option>
                    <option>Data &amp; BI</option>
                    <option>Staffing / equipo dedicado</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="mensaje" className="text-sm font-medium">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={5}
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
                    Enviar consulta
                  </button>
                  {sent && (
                    <p className="mt-4 text-sm text-muted-foreground" role="status">
                      Gracias. Te vamos a contactar a la brevedad.
                    </p>
                  )}
                </div>
              </form>
            </AnimatedContent>
          </div>
        </section>
      </main>

      <footer id="carreras" className="px-5 py-16 text-muted-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <img
              src="/ar-logo-white.png"
              alt="AR IT Services"
              className="h-14 w-auto object-contain"
            />
            <p className="mt-5 text-sm">
              Software, datos y equipos dedicados desde 2001.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Oficinas</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <span className="text-foreground">{o.city}</span> — {o.address}, {o.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Secciones</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Seguinos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {["LinkedIn", "Instagram", "WhatsApp"].map((s) => (
                <li key={s}>
                  <a href="#contacto" className="transition-colors hover:text-foreground">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs">
          © 2026 AR Consultores SRL. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

function Field({ id, label, type = "text" }: { id: string; label: string; type?: string }) {
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
        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
      />
    </div>
  );
}
