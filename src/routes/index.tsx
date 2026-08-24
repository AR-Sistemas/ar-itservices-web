import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import logoColor from "@/assets/ar-logo-color.jpg.asset.json";
import { Reveal } from "@/components/site/Reveal";
import { TeamBuilder } from "@/components/site/TeamBuilder";

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
  { value: "25+", label: "años de trayectoria" },
  { value: "2.000+", label: "proyectos entregados" },
  { value: "3", label: "países con oficina propia" },
  { value: "2M+", label: "horas-hombre con Claro" },
];

const SERVICES = [
  {
    title: "Desarrollo Web & Mobile",
    desc: ".NET, React, iOS y Android. Productos que salen a producción y se mantienen.",
  },
  {
    title: "Ciencia de Datos & BI",
    desc: "Modelos predictivos, machine learning aplicado y tableros en Power BI.",
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
    quote: "Empezamos hace 25 años haciendo el trabajo. Seguimos haciéndolo.",
  },
  {
    name: "Jose Romanutti",
    role: "Socio & CEO",
    quote: "El cliente no compra tecnología: compra un resultado que se pueda medir.",
  },
  {
    name: "Adrián Ferrari",
    role: "Socio & Director de Operaciones",
    quote: "Un equipo bien armado resuelve más que cualquier metodología de moda.",
  },
  {
    name: "Constanza Giordano",
    role: "Directora de Talento",
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
          <a href="#top" className="flex min-w-0 items-center p-3" aria-label="AR IT Services">
            <img
              src={logoColor.url}
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
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="font-mono text-xs tracking-widest text-primary uppercase">
                AR IT Services · Dallas · Córdoba · Asunción
              </p>
              <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
                Armamos el equipo exacto que tu producto necesita,{" "}
                <span className="text-primary">con datos e IA en el flujo</span>, no como promesa.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                25 años desarrollando software, modelos de datos y equipos dedicados para empresas y
                gobiernos, desde tres países.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href="#contacto"
                  className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                >
                  Hablemos de tu proyecto
                </a>
                <a
                  href="#casos"
                  className="rounded-full border border-ink/25 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-ink"
                >
                  Ver casos de éxito
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Métricas */}
        <section className="relative -mt-28 px-5">
          <Reveal className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-card px-8 py-10 shadow-[0_20px_60px_-30px_rgba(35,34,52,0.45)] lg:grid-cols-4">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
                    {m.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Servicios */}
        <section id="servicios" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Qué hacemos
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 60}>
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sección firma */}
        <section className="bg-ink px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <TeamBuilder />
            </Reveal>
          </div>
        </section>

        {/* Casos */}
        <section id="casos" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Casos de éxito</h2>
            </Reveal>
            <div className="mt-12 space-y-14">
              {CASES.map((c, i) => (
                <Reveal key={c.client} delay={i * 80}>
                  <article className="grid gap-6 border-t border-border pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
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
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="border-y border-border bg-secondary px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight">Stack con el que trabajamos</h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {STACK.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border bg-card px-4 py-2 font-mono text-sm text-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Nuestra gente */}
        <section id="nosotros" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestra gente</h2>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PEOPLE.map((p, i) => (
                <Reveal key={p.name} delay={i * 60}>
                  <figure>
                    <div
                      className="aspect-4/5 w-full rounded-xl bg-secondary"
                      role="img"
                      aria-label={`Retrato de ${p.name}`}
                    />
                    <figcaption className="mt-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.role}</p>
                    </figcaption>
                    <blockquote className="mt-3 text-sm text-foreground italic">
                      “{p.quote}”
                    </blockquote>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-primary px-5 py-20">
          <Reveal className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              ¿Armamos el equipo que tu proyecto necesita?
            </h2>
            <a
              href="#contacto"
              className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Escribinos
            </a>
          </Reveal>
        </section>

        {/* Contacto */}
        <section id="contacto" className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <Reveal>
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
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
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
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
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
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="carreras" className="bg-ink px-5 py-16 text-white/70">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            {/* Logo sobre placa blanca: nunca se altera el logo original sobre fondo oscuro */}
            <div className="inline-flex rounded-xl bg-white p-4">
              <img
                src={logoColor.url}
                alt="AR IT Services"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="mt-5 text-sm">
              Software, datos y equipos dedicados desde 2001.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Oficinas</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <span className="text-white">{o.city}</span> — {o.address}, {o.country}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Secciones</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Seguinos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {["LinkedIn", "Instagram", "WhatsApp"].map((s) => (
                <li key={s}>
                  <a href="#contacto" className="transition-colors hover:text-white">
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
        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
      />
    </div>
  );
}
