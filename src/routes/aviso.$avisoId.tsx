import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import {
  getAviso,
  formatFecha,
  formatNivelIngles,
  formatSeniority,
  titleCase,
  type AvisoDetalle,
} from "@/lib/avisos.server";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { useState } from "react";
import { useContactModal } from "@/components/site/ContactModal";
import { FloatingNav } from "@/components/site/FloatingNav";
import { IsoBadge } from "@/components/site/IsoBadge";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

/** Descripción corta para meta tags: primer párrafo, sin cortar palabras. */
function resumen(aviso: AvisoDetalle): string {
  const texto = (aviso.descripcion ?? "").split("\n")[0]?.replace(/\s+/g, " ").trim() ?? "";
  if (!texto) return `Búsqueda abierta: ${aviso.nombre_posicion} en AR IT Services.`;
  if (texto.length <= 155) return texto;
  const corte = texto.lastIndexOf(" ", 155);
  return `${texto.slice(0, corte > 100 ? corte : 155).trimEnd()}…`;
}

/** Datos estructurados para que Google muestre la búsqueda como oferta de empleo. */
function jobPosting(aviso: AvisoDetalle, url: string) {
  const [ciudad, pais] = (aviso.ubicacion ?? "").split(",").map((p) => p.trim());
  const remoto = /remot/i.test(aviso.modalidad ?? "");
  const lista = (titulo: string, items: string[]) =>
    items.length > 0 ? [`${titulo}:`, ...items.map((i) => `- ${i}`)].join("\n") : "";
  const description = [
    aviso.descripcion,
    lista("Responsabilidades", aviso.responsabilidades),
    lista("Requisitos", aviso.requisitos_excluyentes),
  ]
    .filter(Boolean)
    .join("\n\n");
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: aviso.nombre_posicion,
    description,
    datePosted: aviso.fecha_publicacion,
    employmentType: "FULL_TIME",
    directApply: false,
    url,
    hiringOrganization: {
      "@type": "Organization",
      name: "AR IT Services",
      sameAs: "https://ar-itservices.com/",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(ciudad ? { addressLocality: ciudad } : {}),
        addressCountry: pais || "AR",
      },
    },
    ...(remoto ? { jobLocationType: "TELECOMMUTE" } : {}),
  };
}

export const Route = createFileRoute("/aviso/$avisoId")({
  loader: ({ params }) => {
    // El `notFound()` va acá y no en el componente: es el loader el que
    // decide el status HTTP de la respuesta. Tirarlo desde el body del
    // componente renderiza el 404 pero responde 200 (mal para SEO y para
    // el cache del proxy).
    //
    // El origen responde 404 para oculto/cubierta/cerrada/Taller y también
    // para un id inexistente. No distinguimos entre "nunca existió" y "se
    // cubrió recién": para el visitante es la misma cosa.
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.avisoId)) {
      throw notFound();
    }
    return getAviso({ data: params.avisoId }).then((result) => {
      if (!result.ok && result.reason === "not-found") throw notFound();
      return result;
    });
  },
  head: ({ params, loaderData }) => {
    const url = `https://ar-itservices.com/aviso/${params.avisoId}`;
    const aviso = loaderData?.ok ? loaderData.aviso : null;
    const title = aviso
      ? `${titleCase(aviso.nombre_posicion)} | AR IT Services`
      : "Búsqueda abierta | AR IT Services";
    const description = aviso
      ? resumen(aviso)
      : "Detalle de una búsqueda abierta en AR IT Services.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // El root trae og:* genéricos del sitio: acá se pisan con los de la vacante.
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: aviso
        ? [{ type: "application/ld+json", children: JSON.stringify(jobPosting(aviso, url)) }]
        : [],
    };
  },
  component: AvisoPage,
});

function AvisoPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const result = Route.useLoaderData();
  const openContact = useContactModal();
  const router = useRouter();
  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));
  const nav = (
    <FloatingNav
      items={navItems}
      ctaLabel={c.cta.talk}
      ctaHref="/#contacto"
      logoHref="/"
      activeHref="/trabaja-con-nosotros"
      revealAt={-1}
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
  );

  // El loader ya tradujo "no existe / oculto / cubierta" a un 404 real, así
  // que lo único que puede llegar acá es un fallo del origen: se muestra
  // inline (con reintento) en vez de caer a la pantalla de error genérica.
  if (!result.ok) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-background">
        {nav}
        <main className="px-5 pt-28 pb-16 sm:pt-32">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8">
            <h1 className="text-2xl font-bold tracking-tight">{c.careers.errorHeading}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{c.careers.errorBody}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void router.invalidate()}
                className="inline-flex cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white"
              >
                {c.careers.refreshLabel}
              </button>
              <Link
                to="/trabaja-con-nosotros"
                className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-white/30"
              >
                {c.careers.positionsHeading}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const aviso = result.aviso;

  const metaLine = [
    aviso.ubicacion && titleCase(aviso.ubicacion),
    aviso.modalidad && titleCase(aviso.modalidad),
    aviso.seniority && formatSeniority(aviso.seniority, lang),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {nav}

      <main className="px-5 pt-28 pb-8 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <AnimatedContent>
            {aviso.area && (
              <p className="font-mono text-xs tracking-widest text-brand-text uppercase">
                {titleCase(aviso.area)}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {aviso.nombre_posicion}
            </h1>
            {metaLine && <p className="mt-3 text-lg text-muted-foreground">{metaLine}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="text-brand-text">
                {aviso.vacantes_disponibles === 1
                  ? c.careers.vacancyOne
                  : `${aviso.vacantes_disponibles} ${c.careers.vacancyMany}`}
              </span>
              <span>
                {c.careers.publishedLabel} {formatFecha(aviso.fecha_publicacion, lang)}
              </span>
              {formatNivelIngles(aviso.nivel_ingles_requerido, lang) && (
                <span>
                  {c.careers.englishLevelLabel}:{" "}
                  {formatNivelIngles(aviso.nivel_ingles_requerido, lang)}
                </span>
              )}
            </div>

            {lang === "EN" && (
              <p className="mt-5 text-xs text-muted-foreground">{c.careers.enNoticeBody}</p>
            )}

            {aviso.stack_evaluado.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {aviso.stack_evaluado.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                type="button"
                onClick={() => openContact({ avisoId: aviso.id, puesto: aviso.nombre_posicion })}
                className="inline-flex cursor-pointer rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark hover:text-white"
              >
                {c.careers.positionCtaLabel}
              </button>
            </div>
          </AnimatedContent>

          {/* Todo el cuerpo va en una tarjeta: contra el fondo de la página
              el texto se perdía y no había referencia de dónde terminaba
              una sección. Las secciones tienen fondo propio y una línea de
              separación, así el ojo las separa sin tener que leer. */}
          <AnimatedContent className="mt-10" distance={24}>
            <article className="overflow-hidden rounded-3xl border border-border bg-card">
              {aviso.descripcion && (
                <div className="border-b border-border px-6 py-7 sm:px-9 sm:py-9">
                  <h2 className="font-mono text-xs tracking-widest text-brand-text uppercase">
                    {c.careers.aboutRoleLabel}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed whitespace-pre-line text-foreground">
                    {aviso.descripcion}
                  </p>
                </div>
              )}

              {aviso.responsabilidades.length > 0 && (
                <div className="border-b border-border px-6 py-7 sm:px-9 sm:py-9">
                  <BulletSection
                    label={c.careers.responsibilitiesLabel}
                    items={aviso.responsabilidades}
                  />
                </div>
              )}

              {/* Los dos bloques de requisitos van en dos columnas desde md:
                  leerlos en vertical era el doble de scroll para el mismo
                  texto. */}
              {(aviso.requisitos_excluyentes.length > 0 ||
                aviso.requisitos_deseables.length > 0) && (
                <div className="grid gap-x-8 gap-y-7 px-6 py-7 sm:px-9 sm:py-9 md:grid-cols-2">
                  {aviso.requisitos_excluyentes.length > 0 && (
                    <BulletSection
                      label={c.careers.mustHaveLabel}
                      items={aviso.requisitos_excluyentes}
                      primary
                    />
                  )}
                  {aviso.requisitos_deseables.length > 0 && (
                    <BulletSection
                      label={c.careers.niceToHaveLabel}
                      items={aviso.requisitos_deseables}
                    />
                  )}
                </div>
              )}
            </article>
          </AnimatedContent>
        </div>
      </main>

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

function BulletSection({
  label,
  items,
  primary = false,
}: {
  label: string;
  items: string[];
  primary?: boolean;
}) {
  return (
    <section>
      <h2 className="font-mono text-xs tracking-widest text-brand-text uppercase">{label}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                primary ? "bg-primary" : "bg-muted-foreground"
              }`}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
