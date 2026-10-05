import { createFileRoute, notFound } from "@tanstack/react-router";
import { isIntermedio } from "@/lib/site-mode";
import { getAviso, formatFecha, titleCase } from "@/lib/avisos.server";
import { AnimatedContent } from "@/components/site/AnimatedContent";
import { BackButton } from "@/components/site/BackButton";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { FloatingNav } from "@/components/site/FloatingNav";
import { LogoDrawInline } from "@/components/site/LogoDrawInline";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { LogoMark } from "@/components/site/LogoMark";
import { IsoBadge } from "@/components/site/IsoBadge";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";

export const Route = createFileRoute("/aviso/$avisoId")({
  beforeLoad: () => {
    if (isIntermedio) throw notFound();
  },
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
  head: ({ params }) => {
    // Sin dato del aviso todavía en SSR: el título real lo pone el componente
    // vía head dinámico, acá va algo estable para crawlers que no ejecutan JS.
    return {
      meta: [
        { title: `Búsqueda abierta | AR IT Services` },
        {
          name: "description",
          content: "Detalle de una búsqueda abierta en AR IT Services.",
        },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://ar-itservices.com/aviso/${params.avisoId}`,
        },
      ],
    };
  },
  component: AvisoPage,
});

function AvisoPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const result = Route.useLoaderData();
  // El loader ya tradujo "no existe / oculto / cubierta" a un 404 real, así
  // que lo único que puede llegar acá es un fallo del origen.
  if (!result.ok) {
    throw new Error("No se pudo cargar el aviso");
  }

  const aviso = result.aviso;

  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));

  const metaLine = [aviso.ubicacion, aviso.modalidad, aviso.seniority]
    .filter(Boolean)
    .map((part) => titleCase(part as string))
    .join(" · ");

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <FloatingNav
        items={navItems}
        ctaLabel={c.cta.talk}
        ctaHref="/#contacto"
        logo={(visible) => (
          <span className="flex items-center gap-2.5 sm:gap-3">
            <LogoDrawInline play={visible} className="h-8 w-auto shrink-0 text-foreground sm:h-9" />
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

      <main className="px-5 pt-20 pb-8 sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <AnimatedContent>
            <BackButton label={c.careers.backToPositionsLabel} to="/trabaja-con-nosotros" />

            {aviso.area && (
              <p className="mt-6 font-mono text-[11px] tracking-widest text-primary uppercase">
                {titleCase(aviso.area)}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {aviso.nombre_posicion}
            </h1>
            {metaLine && <p className="mt-3 text-base text-muted-foreground">{metaLine}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="text-primary">
                {aviso.vacantes_disponibles === 1
                  ? c.careers.vacancyOne
                  : `${aviso.vacantes_disponibles} ${c.careers.vacancyMany}`}
              </span>
              <span>
                {c.careers.publishedLabel} {formatFecha(aviso.fecha_publicacion, lang)}
              </span>
              {aviso.nivel_ingles_requerido && (
                <span>
                  {c.careers.englishLevelLabel}: {titleCase(aviso.nivel_ingles_requerido)}
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
                    className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <a
                href={`/?aviso=${encodeURIComponent(aviso.id)}#contacto`}
                className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
              >
                {c.careers.positionCtaLabel}
              </a>
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
                  <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
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
      <h2 className="font-mono text-xs tracking-widest text-primary uppercase">{label}</h2>
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
