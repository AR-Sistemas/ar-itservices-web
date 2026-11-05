import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { sendContactEmail } from "@/lib/contact.server";
import { toast } from "sonner";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { Counter } from "@/components/site/Counter";

import { useSpringPress } from "@/components/site/useSpringPress";
import { Beams } from "@/components/site/Beams";
import { LogoDraw } from "@/components/site/LogoDraw";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoLoop } from "@/components/site/LogoLoop";
import { ServiceAreaCards } from "@/components/site/ServiceAreaCards";
import { StarBorder } from "@/components/site/StarBorder";
import { TeamBuilder } from "@/components/site/TeamBuilder";
import { CONTACT_PREFILL_EVENT } from "@/lib/contact-prefill";
import { SocialLinks } from "@/components/site/SocialLinks";
import { NewsMagazineCover } from "@/components/site/NewsMagazineCover";
import { IsoBadge } from "@/components/site/IsoBadge";
import { NEWSLETTER_ISSUE } from "@/data/newsletter";
import { CodeGridSpotlight } from "@/components/site/CodeGridSpotlight";
import { HOME_PRODUCT_LOGO_SCALE, PRODUCT_LOGOS } from "@/components/site/product-logos";
import { getPublicSolutionSlug } from "@/lib/solution-slugs";
import { HeroHeadlineCarousel } from "@/components/site/HeroHeadlineCarousel";
import { useLang } from "@/i18n/language";
import { getContent, type SolutionProduct } from "@/i18n/content";
import { EventBanner } from "@/components/site/EventBanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPublicEditorial } from "@/lib/editorial.server";
import { getAviso } from "@/lib/avisos.server";
import { isIntermedio } from "@/lib/site-mode";
import claroLogo from "@/assets/clients/claro.png";
import naranjaLogo from "@/assets/clients/naranja.png";
import stellantisLogo from "@/assets/clients/Stellantis-canva.png";
import agdLogo from "@/assets/clients/AGD-canva.png";
import aguasCordobesasLogo from "@/assets/clients/AguasCordobesas-canva.png";
import americaMovilLogo from "@/assets/clients/17-clients-america-movil-uai-516x234.png";
import bancorLogo from "@/assets/clients/Bancor.png";
import ecogasLogo from "@/assets/clients/10-clients-ecogas-uai-516x234.png";
import firenzeLogo from "@/assets/clients/Firenze.svg";
import fcaLogo from "@/assets/clients/FCA-canva.png";
import fiatLogo from "@/assets/clients/2-clients-fiat-uai-516x234.png";
import gamaLogo from "@/assets/clients/Gama-canva.png";
import gobCordobaLogo from "@/assets/clients/16-clients-gobierno-de-cordoba-uai-516x234.png";
import holcimLogo from "@/assets/clients/Holcim-canva.png";
import laVozLogo from "@/assets/clients/11-clients-la-voz-uai-516x234.png";
import mcafeeLogo from "@/assets/clients/McAfee-canva.png";
import minettiLogo from "@/assets/clients/Minetti-canva.png";
import prittyLogo from "@/assets/clients/Pritty.png";
import tipsLogo from "@/assets/clients/Tips-canva.png";
import vitopelLogo from "@/assets/clients/7-clients-vitopel-uai-516x234.png";
import klocknerLogo from "@/assets/clients/13-clients-klockner-uai-516x234.png";

export const Route = createFileRoute("/")({
  loader: () => getPublicEditorial(),
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
      { property: "og:url", content: "https://ar-itservices.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/" }],
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
  { name: "AWS", src: "/logos/aws-dark.svg" },
  { name: "Azure", src: "/logos/azure.svg" },
  { name: "GCP", src: "/logos/gcp.svg" },
  { name: "Jira", src: "/logos/jira.svg" },
];

const CLIENTS: { name: string; src: string; scale?: number; monochrome?: boolean }[] = [
  { name: "Claro", src: claroLogo },
  { name: "Naranja", src: naranjaLogo },
  { name: "Stellantis", src: stellantisLogo, monochrome: true },
  { name: "AGD", src: agdLogo },
  { name: "Aguas Cordobesas", src: aguasCordobesasLogo },
  { name: "América Móvil", src: americaMovilLogo, monochrome: true },
  { name: "Bancor", src: bancorLogo },
  { name: "Ecogas", src: ecogasLogo, scale: 1.35 },
  { name: "Firenze", src: firenzeLogo },
  { name: "FCA", src: fcaLogo },
  { name: "Fiat", src: fiatLogo },
  { name: "Gama", src: gamaLogo },
  { name: "Gobierno de Córdoba", src: gobCordobaLogo },
  { name: "Holcim", src: holcimLogo },
  { name: "La Voz del Interior", src: laVozLogo },
  { name: "McAfee", src: mcafeeLogo },
  { name: "Minetti", src: minettiLogo, monochrome: true },
  { name: "Pritty", src: prittyLogo },
  { name: "Tips", src: tipsLogo },
  { name: "Vitopel", src: vitopelLogo },
  { name: "Klöckner Pentaplast", src: klocknerLogo },
];

/* ---- Página ---- */

type ContactType = "empresa" | "postulante" | "consulta";

function Home() {
  const editorial = Route.useLoaderData();
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sendContact = useServerFn(sendContactEmail);
  const [contactType, setContactType] = useState<ContactType>("empresa");
  const [selectedPosition, setSelectedPosition] = useState("");
  // Id del aviso del feed de AR Recruiting (cuando se postula con ?aviso=).
  const [avisoId, setAvisoId] = useState("");
  // Producto de /soluciones desde el que se llegó al formulario (?producto=ario).
  const [producto, setProducto] = useState<SolutionProduct["id"] | null>(null);
  // Levantados a estado (en vez de no controlados) para que no se pierdan si
  // el visitante cambia de pestaña de tipo de consulta y vuelve.
  const [empresaValue, setEmpresaValue] = useState("");
  const [paisValue, setPaisValue] = useState("");
  const [tipoValue, setTipoValue] = useState("");
  const [telefonoValue, setTelefonoValue] = useState("");
  const [mensajeValue, setMensajeValue] = useState("");
  // Trampa de tiempo anti-bot: momento en que se montó el formulario, para
  // comparar contra cuándo se envía (ver src/lib/contact.server.ts).
  const [formStartedAt] = useState(() => Date.now());
  const submitCta = useSpringPress<HTMLButtonElement>();

  // Si venimos de "Postularme" en /trabaja-con-nosotros, precargamos el
  // formulario en modo postulante con el puesto ya seleccionado.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const puesto = params.get("puesto");
    if (puesto) {
      setContactType("postulante");
      setSelectedPosition(puesto);
    }
    const prod = params.get("producto");
    if (prod === "ario" || prod === "meetingmate" || prod === "sdd") {
      setContactType("empresa");
      setProducto(prod);
      const product = c.solutions.products.find((p) => p.id === prod);
      if (product) setMensajeValue(c.contact.productMessage(product.name));
    }
  }, []);

  // "?aviso={id}" viene del botón Postularme del feed de AR Recruiting. No
  // alcanza con pasar el título: el aviso vive en el otro proyecto y su
  // nombre no siempre coincide con las opciones del select (que hoy son
  // textuales). Traemos el aviso del servidor para mostrar su nombre real y
  // mandar el id como campo propio, que es lo que después puede leer RRHH.
  useEffect(() => {
    // `requestedId` y no `avisoId`: el state `avisoId` es el id ya validado
    // contra el origen (lo devuelve `getAviso`), no el string crudo de la URL.
    // Con el mismo nombre el `setAvisoId(result.aviso.id)` de adentro se
    // leía como un no-op sobre la variable local.
    const requestedId = new URLSearchParams(window.location.search).get("aviso");
    if (!requestedId) return;
    let cancelled = false;
    setContactType("postulante");
    void getAviso({ data: requestedId }).then((result) => {
      if (cancelled || !result.ok) return;
      setAvisoId(result.aviso.id);
      setSelectedPosition(result.aviso.nombre_posicion);
      // Mensaje prellenado: el candidato ve qué va a enviar antes de tocar
      // nada. Es un borrador con huecos para completar, no un texto cerrado:
      // el que sigue escribiendo encima elige replacearlo por completo.
      // Solo si el campo está vacío, para no pisar algo que el visitante ya
      // escribió antes de que llegara la respuesta del origen.
      setMensajeValue((prev) =>
        prev ? prev : c.contact.applicationDraft.replace("{puesto}", result.aviso.nombre_posicion),
      );
    });
    return () => {
      cancelled = true;
    };
    // `c` y `getAviso` son estables; correrlo una vez al montar es lo que
    // queremos (lee la query string una sola vez).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Otras secciones (armado de equipo, "Qué hacemos") precargan el mensaje con
  // un texto según lo que el visitante eligió, en modo empresa.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      if (!message) return;
      setContactType("empresa");
      setMensajeValue(message);
    };
    window.addEventListener(CONTACT_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, onPrefill);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <CodeGridSpotlight />
      <EventBanner />
      <FloatingNav
        items={c.nav}
        ctaLabel={c.cta.talk}
        ctaHref="#contacto"
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline play={visible} className="h-8 w-auto shrink-0 text-foreground sm:h-9" />
            <LogoWordmark className="h-[13px] w-auto shrink-0 text-foreground sm:h-3.5" />
          </span>
        )}
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
                  lang === l ? "text-brand-text" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        }
      />

      <main id="top" className="relative z-10">
        {/* Hero */}
        <section className="relative px-5 pt-10 pb-40 sm:pt-14">
          <Beams />
          <div className="relative mx-auto max-w-4xl text-center">
            <LogoDraw className="mx-auto h-16 w-auto text-brand" />
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
                {!isIntermedio && (
                  <a
                    href="#casos"
                    className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/30"
                  >
                    {c.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Métricas */}
        <section className="relative -mt-28 px-5">
          <AnimatedContent className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-8 border-y border-border py-10 lg:grid-cols-5">
              {c.metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-3xl font-extrabold text-foreground sm:whitespace-nowrap sm:text-5xl lg:text-4xl xl:text-5xl">
                    <Counter value={m.value} />
                    {m.suffix}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
                </div>
              ))}
              <IsoBadge label="" />
            </div>
          </AnimatedContent>
        </section>

        {/* Soluciones — tarjetas con el contexto de cada producto. */}
        <section id="soluciones" className="px-5 pt-24 pb-12 sm:pt-32 sm:pb-16">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {c.solutions.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{c.solutions.subtitle}</p>
            </AnimatedContent>
            {/* Desde sm cada tarjeta es un subgrid de 4 filas (etiqueta, logo, título, descripción) que
                comparte las filas con las demás: título y descripción arrancan a la misma altura. En una
                sola columna (celular) las filas son iguales (auto-rows-fr), así las cuatro miden lo mismo.
                Desde lg (1024 px) las cuatro van una al lado de la otra. */}
            <div className="mt-10 grid auto-rows-fr gap-x-5 gap-y-5 sm:auto-rows-auto sm:grid-cols-2 lg:grid-cols-4">
              {c.solutions.products.map((p, i) => (
                <AnimatedContent
                  key={p.id}
                  delay={i * 80}
                  distance={30}
                  className="h-full sm:row-span-4 sm:grid sm:h-auto sm:grid-rows-subgrid sm:gap-y-0"
                >
                  <Link
                    to="/solucion/$solutionId"
                    params={{ solutionId: getPublicSolutionSlug(p.id) }}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-y-0 bg-card/35 p-5 shadow-[0_8px_24px_rgb(0_0_0_/_0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-text/65 hover:bg-card/80 hover:shadow-[0_18px_42px_rgb(0_0_0_/_0.26)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    aria-label={`${p.name}: ${p.tagline}`}
                  >
                    {/* Etiqueta de clasificación en la esquina superior derecha, en su propia fila para no tocar el logo. */}
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex h-7 items-center rounded-full border px-3 text-xs leading-none font-medium tracking-wide text-foreground ${
                          p.kind === "framework"
                            ? "border-white/15 bg-[#2b2a30]"
                            : "border-[#FF000D]/50 bg-[#3a0b17]"
                        }`}
                      >
                        {c.solutions.kindLabels[p.kind]}
                      </span>
                    </div>
                    <div className="mt-3 flex h-32 items-center justify-center overflow-hidden">
                      <img
                        src={PRODUCT_LOGOS[p.id]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-contain transition duration-300 group-hover:brightness-110 ${HOME_PRODUCT_LOGO_SCALE[p.id]}`}
                      />
                    </div>
                    <h3 className="mt-6 self-start text-[15px] leading-snug font-semibold tracking-tight text-balance text-foreground">
                      {p.tagline}
                    </h3>
                    <p className="mt-3 self-start text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                      {p.short}
                    </p>
                  </Link>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="px-5 pt-12 pb-24 sm:pt-16 sm:pb-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                {c.services.heading}
              </h2>
            </AnimatedContent>
            <AnimatedContent className="mt-12" distance={30}>
              <div>
                <ServiceAreaCards
                  groups={c.services.groups}
                  inquiryMessage={c.services.inquiryMessage}
                />
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Clientes */}
        <section className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.clients.heading}</h2>
            </AnimatedContent>
            <AnimatedContent className="mt-12" distance={30}>
              <LogoLoop
                speed={32}
                pauseOnHover
                fadeOutColor="var(--background)"
                logos={CLIENTS.map((cl) => (
                  <span
                    key={cl.name}
                    className="inline-flex h-24 w-44 items-center justify-center px-5"
                  >
                    <img
                      src={cl.src}
                      alt={c.clients.logoAlt(cl.name)}
                      decoding="async"
                      className={`max-h-14 w-auto max-w-full object-contain ${cl.monochrome ? "brightness-0 invert" : ""}`}
                      style={cl.scale ? { transform: `scale(${cl.scale})` } : undefined}
                    />
                  </span>
                ))}
              />
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
        {!isIntermedio && (
          <section id="casos" className="px-5 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
              <AnimatedContent>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.cases.heading}</h2>
              </AnimatedContent>
              <div className="mt-12 space-y-14">
                {c.cases.items.map((cs, i) => (
                  <AnimatedContent key={cs.client} delay={i * 80}>
                    <article className="border-t border-border pt-8">
                      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                        <h3 className="text-xl font-bold">{cs.client}</h3>
                        <div className="space-y-5">
                          <div>
                            <p className="font-mono text-xs tracking-widest text-brand-text uppercase">
                              {c.cases.challengeLabel}
                            </p>
                            <p className="mt-2 text-muted-foreground">{cs.challenge}</p>
                          </div>
                          <div>
                            <p className="font-mono text-xs tracking-widest text-brand-text uppercase">
                              {c.cases.resultLabel}
                            </p>
                            <p className="mt-2 text-foreground">{cs.result}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </AnimatedContent>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Portada del boletín de novedades */}
        {!isIntermedio && (
          <section className="px-5 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
              <AnimatedContent>
                <NewsMagazineCover
                  kicker="Boletín mensual"
                  title={editorial.current?.title ?? NEWSLETTER_ISSUE.title}
                  subtitle={editorial.current?.period ?? NEWSLETTER_ISSUE.subtitle}
                  eyebrow={c.newsTeaser.eyebrow}
                  cta="Leer resumen editorial"
                />
              </AnimatedContent>
            </div>
          </section>
        )}

        {/* Nuestra gente */}
        <section className="px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl border-t border-border pt-12 sm:pt-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-20">
              <AnimatedContent>
                <h2 className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
                  {c.people.statement}
                </h2>
              </AnimatedContent>
              <AnimatedContent delay={100}>
                <div className="border-l-2 border-brand pl-6">
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {lang === "ES"
                      ? "Cada desafío se construye en equipo. Conocé a las personas que hacen posible nuestro trabajo."
                      : "Every challenge is built together. Meet the people who make our work possible."}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Link
                      to="/nosotros"
                      className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white"
                    >
                      {c.people.ctaLink}
                    </Link>
                    {!isIntermedio && (
                      <Link
                        to="/trabaja-con-nosotros"
                        className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-white/50 hover:bg-white/5"
                      >
                        {c.people.careersLink}
                      </Link>
                    )}
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

        {/* Stack: entre "Nuestra gente" y las oficinas */}
        <section className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <AnimatedContent>
              <h2 className="text-2xl font-bold tracking-tight">{c.stack.heading}</h2>
              <LogoLoop
                className="mt-6"
                speed={38}
                gap={8}
                pauseOnHover
                fadeOutColor="var(--background)"
                logos={TECH.map((t) => (
                  <span
                    key={t.name}
                    className="inline-flex h-28 w-32 flex-col items-center justify-center gap-2.5 px-3"
                  >
                    {/* El nombre ya está en texto: el logo es decorativo. */}
                    <img
                      src={t.src}
                      alt=""
                      decoding="async"
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 object-contain"
                    />
                    <span className="text-xs font-medium text-muted-foreground">{t.name}</span>
                  </span>
                ))}
              />
            </AnimatedContent>
          </div>
        </section>

        {/* Oficinas + certificación — separador entre "Nuestra gente" y el contacto */}
        <section className="border-y border-primary bg-card/50 px-5 py-14">
          <AnimatedContent className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{c.footer.officesHeading}</h2>
            <ul className="grid gap-6 sm:grid-cols-3 lg:gap-14">
              {c.footer.offices.map((o) => (
                <li key={o.city}>
                  <p className="font-display text-lg font-bold">{o.city}</p>
                  <p className="text-sm text-muted-foreground">{o.country}</p>
                </li>
              ))}
            </ul>
          </AnimatedContent>
        </section>

        {/* Contacto */}
        <section id="contacto" className="relative z-10 px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <AnimatedContent>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {contactType === "postulante"
                  ? c.contact.candidateHeading
                  : contactType === "consulta"
                    ? c.contact.generalHeading
                    : c.contact.heading}
              </h2>
              {(() => {
                const sub =
                  contactType === "postulante"
                    ? c.contact.candidateSubtitle
                    : contactType === "consulta"
                      ? c.contact.generalSubtitle
                      : c.contact.subtitle;
                // La bajada de "empresa" se eliminó (queda vacía): no se dibuja un párrafo vacío.
                return sub ? (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{sub}</p>
                ) : null;
              })()}

              <div className="mt-8 inline-flex flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5">
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
                id="formulario-contacto"
                className="mt-8 grid scroll-mt-28 gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formEl = e.currentTarget;
                  const formData = new FormData(formEl);
                  setSendState("sending");
                  sendContact({ data: formData })
                    .then(() => {
                      setSendState("sent");
                      toast.success(c.contact.success);
                      formEl.reset();
                      setContactType("empresa");
                      setProducto(null);
                      setSelectedPosition("");
                      setEmpresaValue("");
                      setPaisValue("");
                      setTipoValue("");
                      setTelefonoValue("");
                      setMensajeValue("");
                    })
                    .catch((err) => {
                      console.error(err);
                      setSendState("error");
                      toast.error(c.contact.error);
                    });
                }}
              >
                <input type="hidden" name="contactType" value={contactType} />
                {/* Id del aviso del feed de AR Recruiting, si la postulación
                    viene de una búsqueda concreta. Vacío = postulación
                    espontánea. */}
                <input type="hidden" name="aviso_id" value={avisoId} />
                {producto && contactType !== "postulante" && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="hidden"
                      name="producto"
                      value={c.solutions.products.find((p) => p.id === producto)?.name ?? ""}
                    />
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card py-1.5 pr-2 pl-4 text-sm">
                      <span className="text-muted-foreground">{c.contact.productLabel}:</span>
                      <span className="font-semibold">
                        {c.solutions.products.find((p) => p.id === producto)?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProducto(null)}
                        aria-label={c.contact.productRemove}
                        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}
                <input type="hidden" name="formStartedAt" value={formStartedAt} />
                {/* Honeypot anti-bot: invisible para personas, los bots que
                    autocompletan todo el formulario sí lo llenan (ver
                    src/lib/contact.server.ts). */}
                <input
                  type="text"
                  name="sitio_web"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <Field
                  id="nombre"
                  label={c.contact.fields.name}
                  placeholder={lang === "ES" ? "Tu nombre completo" : "Your full name"}
                />
                <Field
                  id="email"
                  label={c.contact.fields.email}
                  type="email"
                  placeholder={lang === "ES" ? "nombre@ejemplo.com" : "name@example.com"}
                />

                {(contactType === "empresa" || contactType === "consulta") && (
                  <Field
                    id="empresa"
                    label={c.contact.fields.company}
                    placeholder={lang === "ES" ? "Nombre de tu empresa" : "Your company name"}
                    value={empresaValue}
                    onChange={setEmpresaValue}
                    required={contactType === "empresa"}
                    optionalLabel={
                      contactType === "consulta"
                        ? c.frameworkModal.fields.companyOptional
                        : undefined
                    }
                  />
                )}
                {(contactType === "empresa" ||
                  contactType === "postulante" ||
                  contactType === "consulta") && (
                  <Field
                    id="telefono"
                    label={c.contact.fields.phone}
                    type="tel"
                    placeholder="+54 9 351 123 4567"
                    value={telefonoValue}
                    onChange={setTelefonoValue}
                  />
                )}

                <SelectField
                  id="pais"
                  label={c.contact.fields.country}
                  options={c.contact.countries}
                  value={paisValue}
                  onChange={setPaisValue}
                  className={contactType !== "postulante" ? "sm:col-span-2" : undefined}
                />

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
                      {/* Texto libre: las búsquedas reales viven en el feed y se
                          postula a ellas desde /trabaja-con-nosotros. Con
                          ?aviso= el puesto llega fijo, desde el feed. */}
                      <input
                        id="puesto"
                        name="puesto"
                        type="text"
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        readOnly={avisoId !== ""}
                        placeholder={
                          lang === "ES"
                            ? "Ej.: Desarrollador/a Full Stack"
                            : "e.g. Full Stack Developer"
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm read-only:opacity-70"
                      />
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
                    value={mensajeValue}
                    onChange={(e) => setMensajeValue(e.target.value)}
                    placeholder={
                      lang === "ES" ? "Contanos en qué podemos ayudarte" : "Tell us how we can help"
                    }
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
                    disabled={sendState === "sending"}
                    className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendState === "sending" ? c.contact.submitting : c.contact.submit}
                  </button>
                </div>
              </form>
            </AnimatedContent>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-5 py-16 text-muted-foreground">
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
                  <span className="text-foreground">{o.city}</span>: {o.address}, {o.country}
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
  placeholder,
  value,
  onChange,
  required = true,
  optionalLabel,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  optionalLabel?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {optionalLabel && <span className="text-muted-foreground">{optionalLabel}</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
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
  className,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} name={id} required>
        <SelectTrigger
          id={id}
          className="mt-2 h-auto w-full rounded-lg border-input bg-card px-4 py-3 text-left text-sm"
        >
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent side="bottom" avoidCollisions={false} className="max-h-64">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
