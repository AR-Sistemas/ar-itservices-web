import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { isIntermedio } from "@/lib/site-mode";
import { getAvisos, formatFecha, titleCase, type AvisoListItem } from "@/lib/avisos.server";
import { useMemo, useState, useTransition } from "react";
import { SearchIcon, XIcon as CloseIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const Route = createFileRoute("/trabaja-con-nosotros")({
  // En la versión intermedia la página no existe: se redirige al inicio.
  beforeLoad: () => {
    if (isIntermedio) throw redirect({ to: "/", replace: true });
  },
  // Las vacantes vienen del feed público de AR Recruiting. El origen no
  // pagina ni cachea, así que cada visita a la ruta vuelve a pegarle: eso
  // mantiene `vacantes_disponibles` al día y hace que un aviso que se acaba
  // de cubrir desaparezca sin necesidad de revalidar a mano.
  loader: () => getAvisos(),
  head: () => ({
    meta: [
      { title: "Trabajá con nosotros | AR IT Services" },
      {
        name: "description",
        content:
          "Sumate al equipo de AR IT Services: 25 años armando equipos que se quedan en software, datos e IA.",
      },
      { property: "og:title", content: "Trabajá con nosotros | AR IT Services" },
      {
        property: "og:description",
        content: "Búsquedas abiertas y postulación espontánea en AR IT Services.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://ar-itservices.com/trabaja-con-nosotros",
      },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/trabaja-con-nosotros" }],
  }),
  component: CareersPage,
});

const SIN_AVISOS: AvisoListItem[] = [];

/** Cuántas tecnologías y ubicaciones se ofrecen como filtros. */
const MAX_FACETS = 12;

/** Cuántos avisos matchea como mínimo un filtro de texto. */
const MIN_TEXT_HITS = 2;

/**
 * Caracteres de descripción que se ven en la card del listado.
 *
 * El corte es por contenido, no por líneas: `line-clamp` corta después de N
 * renglones, así que el mismo texto se cortaba en ~120 chars en una card
 * angosta y en ~250 en una ancha, y siempre en un punto arbitrario. Con un tope
 * de caracteres el recorte es el mismo en cualquier viewport.
 */
const DESCRIPCION_CARD_CHARS = 150;

/**
 * Recorta un texto a N caracteres sin partir palabras y agregando "...".
 *
 * Si el carácter en la posición de corte cae en medio de una palabra, retrocede
 * hasta el último espacio: "automatización de pruebas | end-to-end" se corta en
 * "...automatización de" y no en "...automatización de prueb".
 */
function recortar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const parcial = texto.slice(0, max);
  const ultimoEspacio = parcial.lastIndexOf(" ");
  // `lastIndexOf` devuelve -1 cuando la porción es una sola palabra muy larga
  // (un stack de 160 chars sin espacios, por ejemplo). Ahí cortamos seco.
  const corte = ultimoEspacio > max * 0.6 ? ultimoEspacio : max;
  return `${parcial.slice(0, corte).trimEnd()}…`;
}

/**
 * Normaliza para comparar: sin tildes, sin mayúsculas, sin signos. "Node.js",
 * "node js" y "NODE-JS" tienen que dar el mismo match.
 */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Arma los filtros combinables de la página.
 *
 * Los tres ejes (área, tecnología, ubicación) se acumulan con AND, y el texto
 * libre se aplica encima con OR sobre los campos de texto de cada aviso. Un
 * AND entre ejes y OR dentro del texto es lo que espera alguien buscando: si
 * pide React *y* Córdoba no quiere ver roles de Python en Buenos Aires.
 *
 * Se matchea con `includes` sobre el texto normalizado y no con tokens sueltos
 * para no hacer falsos positivos con palabras muy cortas ("go", "r").
 */
function matchesFilters(
  aviso: AvisoListItem,
  filtros: { texto: string; area: string | null; techs: string[]; ubicaciones: string[] },
): boolean {
  if (filtros.area && aviso.area !== filtros.area) return false;

  // ANY entre las tecnologías elegidas: elegir React y Node tiene que dar los
  // avisos que tienen alguna de las dos, no la intersección (que sería casi
  // siempre vacía). El chip guarda el label original ("Node.js") y el aviso
  // trae el suyo, así que el match es por forma normalizada.
  if (filtros.techs.length > 0) {
    const stack = aviso.stack.map(normalize);
    const tiene = filtros.techs.some((t) => stack.includes(normalize(t)));
    if (!tiene) return false;
  }

  if (filtros.ubicaciones.length > 0) {
    const ubicacion = normalize(aviso.ubicacion ?? "");
    // El feed trae "Buenos Aires, Argentina" / "Córdoba, Argentina": con el
    // filtro puesto en "Buenos Aires" tiene que matchear. Comparamos por
    // substring del inicio, que es el formato del dato, en vez de hacer split
    // por coma (el origen no garantiza dos partes).
    const tiene = filtros.ubicaciones.some((u) => ubicacion.startsWith(normalize(u)));
    if (!tiene) return false;
  }

  if (filtros.texto) {
    const texto = normalize(filtros.texto);
    const tokens = texto.split(" ").filter((t) => t.length > 1);
    if (tokens.length === 0) return true;
    const campos = normalize(
      [
        aviso.nombre_posicion,
        aviso.area,
        aviso.ubicacion,
        aviso.modalidad,
        aviso.seniority,
        aviso.descripcion_corta,
        aviso.stack.join(" "),
      ]
        .filter(Boolean)
        .join(" "),
    );
    if (!tokens.some((t) => campos.includes(t))) return false;
  }

  return true;
}

/**
 * Chips de stack que se ven en la card. El resto aparece en el modal.
 *
 * El tope existe por alineación, no por diseño: si el stack no tiene tope, un
 * aviso con 10 skills y otro con 2 producen cards de altura muy distinta y el
 * grid se ve irregular. 3 chips = una línea con margen en cualquier ancho de
 * columna; el `+N` deja claro que hay más.
 */
const STACK_CHIPS = 3;

/**
 * Select de un eje de filtrado (área, tecnología, ubicación).
 *
 * `value === null` significa "sin filtro" y se muestra como el `allLabel`.
 * El valor guardado es el que viene del feed, no el del label: el match
 * compara normalizado (ver `matchesFilters`), por eso el casing del label
 * puede diferir del valor sin romper nada.
 */
function FacetSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <Select
        value={value ?? ""}
        // El select es controlled: `""` es la opción "todas" y Radix la
        // encuentra por value, no por texto.
        onValueChange={(next) => onChange(next === "" ? null : next)}
      >
        <SelectTrigger
          aria-label={label}
          // `ring-1` (no `focus:ring-1`): el trigger de Radix ya trae un
          // `focus:ring-ring` de shadcn, y con el focus visible quedaba un
          // doble anillo. Anulo el del componente base y dejo este, que es
          // el de la marca.
          className="h-11 w-full rounded-full border-border bg-card px-4 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
        >
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{allLabel}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function CareersPage() {
  const { lang, setLang } = useLang();
  const c = getContent(lang);
  const result = Route.useLoaderData();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // Los tres facets son single-select: `null` = sin filtro. Con el volumen
  // actual de avisos (decenas, no miles) un select por facet se lee más rápido
  // que una hilera de chips, y el multi-select sobre 12 tecnologías llenaba la
  // pantalla de estados activos sin agregar nada.
  const [tecnologia, setTecnologia] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<string | null>(null);

  // Desde esta página, los anchors del nav apuntan a la home.
  const navItems = c.nav.map((n) => (n.href.startsWith("#") ? { ...n, href: `/${n.href}` } : n));

  // Constante de módulo, no un `[]` literal acá: un array nuevo en cada render
  // invalidaría la memo de categories/visibleAvisos y los useMemo de abajo se
  // recalcularían siempre.
  const avisos = result.ok ? result.avisos : SIN_AVISOS;
  const hasError = !result.ok;

  // Las categorías salen del propio feed (área del cliente), no de una lista
  // fija: si recruiters agregan un área nueva aparece sola como filtro.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const a of avisos) {
      if (a.area) seen.add(a.area);
    }
    return [...seen].sort((a, b) => a.localeCompare(b));
  }, [avisos]);

  // Tecnologías y ubicaciones también salen del feed, ordenadas por frecuencia:
  // lo que aparece en más avisos primero, porque es lo que la gente busca. El
  // corte a MAX_FACETS evita una fila de 40 chips cuando el stack del equipo
  // crece; lo que queda fuera sigue alcanzable por el buscador de texto.
  const techs = useMemo(() => {
    // Clave normalizada para agrupar y comparar, valor original para mostrar:
    // "Node.js" y "node js" cuentan como la misma tech pero se muestra
    // "Node.js", no "Node Js" (titleFace destroza los nombres de stack).
    const counts = new Map<string, { label: string; n: number }>();
    for (const a of avisos) {
      const porTech = new Map<string, string>();
      for (const s of a.stack) {
        const key = normalize(s);
        if (key && !porTech.has(key)) porTech.set(key, s);
      }
      for (const [key, label] of porTech) {
        const entry = counts.get(key);
        if (entry) entry.n += 1;
        else counts.set(key, { label, n: 1 });
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].n - a[1].n || a[1].label.localeCompare(b[1].label))
      .slice(0, MAX_FACETS)
      .map(([, v]) => v.label);
  }, [avisos]);

  // Las ubicaciones se agrupan por ciudad, no por el string completo: el feed
  // manda "Buenos Aires, Argentina" y para el filtro alcanza con la ciudad.
  const ubicaciones = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of avisos) {
      const ciudad = (a.ubicacion ?? "").split(",")[0]?.trim();
      if (!ciudad) continue;
      const key = normalize(ciudad);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_FACETS)
      .map(([value]) => titleCase(value));
  }, [avisos]);

  const visibleAvisos = useMemo(() => {
    const filtros = {
      texto: query,
      area: activeCategory,
      techs: tecnologia === null ? [] : [tecnologia],
      ubicaciones: ubicacion === null ? [] : [ubicacion],
    };
    if (
      filtros.texto === "" &&
      filtros.area === null &&
      filtros.techs.length === 0 &&
      filtros.ubicaciones.length === 0
    ) {
      return avisos;
    }
    return avisos.filter((a) => matchesFilters(a, filtros));
  }, [avisos, query, activeCategory, tecnologia, ubicacion]);

  const hayFiltros =
    query !== "" || activeCategory !== null || tecnologia !== null || ubicacion !== null;

  const limpiarFiltros = () => {
    setQuery("");
    setActiveCategory(null);
    setTecnologia(null);
    setUbicacion(null);
  };

  const refresh = () => {
    startTransition(() => {
      void router.invalidate();
    });
  };

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
        <div className="mx-auto max-w-6xl">
          <AnimatedContent>
            <BackButton label={c.careers.backLink} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {c.careers.heading}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">{c.careers.intro}</p>
          </AnimatedContent>

          <AnimatedContent className="mt-14" distance={30}>
            {/* Sin botón de "actualizar": el origen no manda webhooks, pero la
                ruta se re-fetchea en cada visita, así que recargar la
                página alcanza. El botón duplicaba una acción que el browser
                ya resuelve. El refresh manual sigue disponible en el estado
                de error, que es donde sí aporta. */}
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
              {c.careers.positionsHeading}
            </h2>

            {lang === "EN" && !hasError && avisos.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">{c.careers.enNoticeBody}</p>
            )}

            {hasError && (
              <div className="mt-5 rounded-2xl border border-border bg-card p-8">
                <p className="text-lg font-semibold">{c.careers.errorHeading}</p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{c.careers.errorBody}</p>
                <button
                  type="button"
                  onClick={refresh}
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                >
                  {c.careers.refreshLabel}
                </button>
              </div>
            )}

            {!hasError && avisos.length > 0 && (
              <div className="mt-5 space-y-4">
                {/* Buscador de texto. Va primero porque es lo que la
                    gente prueba sin pensarlo: escribe "react" y espera
                    resultados. El placeholder aclara que busca en toda la
                    ficha, no solo en el título. */}
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={c.careers.searchPlaceholder}
                    aria-label={c.careers.searchLabel}
                    className="w-full rounded-full border border-border bg-card py-3 pr-4 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                  />
                  {query !== "" && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label={c.careers.clearSearchLabel}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Los tres facets van como selects en una fila, no como
                    filas de chips: los chips mezclaban tipografías (mono vs
                    sans), tres anchos distintos y comían media pantalla antes
                    de llegar a las cards. Un select por eje se lee de un
                    vistazo y es el patrón que usa cualquier job board. */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <FacetSelect
                    label={c.careers.areaFilterLabel}
                    allLabel={c.careers.filterAllLabel}
                    value={activeCategory}
                    options={categories.map((cat) => ({ value: cat, label: titleCase(cat) }))}
                    onChange={setActiveCategory}
                  />
                  {techs.length > 1 && (
                    <FacetSelect
                      label={c.careers.techFilterLabel}
                      allLabel={c.careers.filterAllLabel}
                      value={tecnologia}
                      // Sin titleCase: el label ya viene con el casing del
                      // feed ("Node.js", no "Node Js").
                      options={techs.map((tech) => ({ value: tech, label: tech }))}
                      onChange={setTecnologia}
                    />
                  )}
                  {ubicaciones.length > 1 && (
                    <FacetSelect
                      label={c.careers.locationFilterLabel}
                      allLabel={c.careers.filterAllLabel}
                      value={ubicacion}
                      options={ubicaciones.map((u) => ({ value: u, label: u }))}
                      onChange={setUbicacion}
                    />
                  )}
                </div>

                {hayFiltros && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {c.careers.resultsCount(visibleAvisos.length)}
                    </span>
                    <button
                      type="button"
                      onClick={limpiarFiltros}
                      className="cursor-pointer text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                    >
                      {c.careers.clearFiltersLabel}
                    </button>
                  </div>
                )}
              </div>
            )}

            {!hasError && visibleAvisos.length === 0 && avisos.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-7">
                <p className="text-base font-semibold">{c.careers.filterEmptyMessage}</p>
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-4 cursor-pointer text-sm font-semibold text-primary transition-colors hover:text-brand-dark"
                >
                  {c.careers.clearFiltersLabel}
                </button>
              </div>
            )}

            {!hasError && visibleAvisos.length > 0 && (
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {visibleAvisos.map((aviso, i) => {
                  const esLaUltima = i === visibleAvisos.length - 1;
                  // Con un número impar de avisos la última card queda sola en
                  // su fila y deja un hueco feo al costado. Le damos las dos
                  // columnas para que se lea como una card destacada en vez de
                  // como un error de layout. Solo desde lg, que es donde el
                  // grid es de 2 columnas: abajo es de 1 y no hay qué spanned.
                  const ocupaDosColumnas = esLaUltima && visibleAvisos.length % 2 === 1;

                  return (
                    <AnimatedContent
                      key={aviso.id}
                      delay={Math.min(i, 4) * 60}
                      className={ocupaDosColumnas ? "lg:col-span-2" : ""}
                    >
                      <SpotlightCard
                        as="article"
                        className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
                        contentClassName="flex flex-1 flex-col"
                      >
                        {/* Toda la card lleva a la página del aviso con el
                            patrón "stretched link": el Link del título estira
                            su zona clickeable con un pseudo-elemento `after`
                            que cubre toda la card. Así no hace falta un
                            <button> absoluto con pointer-events: teclado,
                            readers de pantalla y "abrir en pestaña nueva"
                            funcionan como en cualquier link.

                            El `relative` del article es el ancla del `after`
                            y el `z-10` del botón de postulación lo deja por
                            encima, para que su click vaya al form y no a la
                            ficha. */}
                        {/* Sin `relative` acá a propósito: si lo tuviera, el `::after`
                            del link del título se anclaría a este div y
                            cubriría solo el header, no toda la card. El
                            ancla correcta es el article, que ya es
                            `relative` (viene de SpotlightCard). */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            {aviso.area && (
                              <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                                {titleCase(aviso.area)}
                              </p>
                            )}
                            <h3 className="mt-1 text-lg font-semibold text-balance">
                              <Link
                                to="/aviso/$avisoId"
                                params={{ avisoId: aviso.id }}
                                /* `-inset-7` y no `inset-0`: el pseudo-elemento se ancla al div interno de
                                 SpotlightCard, que ya está adentro del padding `p-7`
                                 de la card. Con inset-0 cubría solo el área de
                                 contenido y el padding (esquinas, pie) quedaba
                                 sin click. El 7 deshace ese padding. */
                                className="after:absolute after:-inset-7 after:rounded-2xl after:content-['']"
                              >
                                {aviso.nombre_posicion}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {[aviso.ubicacion, aviso.modalidad, aviso.seniority]
                                .filter(Boolean)
                                .map((part) => titleCase(part as string))
                                .join(" · ")}
                            </p>
                          </div>
                          <a
                            href={`/?aviso=${encodeURIComponent(aviso.id)}#contacto`}
                            className="relative z-10 inline-flex shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                          >
                            {c.careers.positionCtaLabel}
                          </a>
                        </div>

                        {/* min-h para reservar el espacio aunque el aviso no
                            tenga stack: así todas las cards siguen teniendo la
                            descripción en la misma línea. */}
                        <div className="mt-4 flex min-h-[26px] flex-wrap items-start gap-2">
                          {aviso.stack.slice(0, STACK_CHIPS).map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                            >
                              {s}
                            </span>
                          ))}
                          {aviso.stack.length > STACK_CHIPS && (
                            <span className="px-1 py-1 font-mono text-[11px] text-muted-foreground">
                              +{aviso.stack.length - STACK_CHIPS}
                            </span>
                          )}
                        </div>

                        {aviso.descripcion_corta && (
                          /* Dos cortes, a propósito y con distinto propósito:

                             1. `recortar` a 150 chars: es el corte de contenido
                                que ve la persona, estable entre anchos de
                                columna.
                             2. `line-clamp-3`: red de seguridad. Si el
                                viewport es angosto, 150 chars pueden ocupar 4
                                líneas y desalinear el pie respecto de las cards
                                vecinas. El clamp garantiza la altura aunque
                                eso signifique recortar un poco antes.

                             El texto completo está en la PD del aviso
                             (`aviso.descripcion`, campo aparte, sin tocar). */
                          <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                            {recortar(aviso.descripcion_corta, DESCRIPCION_CARD_CHARS)}
                          </p>
                        )}

                        {/* mt-auto empuja el pie al fondo: con `h-full` en la
                            card y el grid haciendo stretch, todas las cards de
                            una fila terminan con el pie en la misma Y. */}
                        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-xs text-muted-foreground">
                          <span className="text-primary">
                            {aviso.vacantes_disponibles === 1
                              ? c.careers.vacancyOne
                              : `${aviso.vacantes_disponibles} ${c.careers.vacancyMany}`}
                          </span>
                          <span>
                            {c.careers.publishedLabel} {formatFecha(aviso.fecha_publicacion, lang)}
                          </span>
                          <span className="ml-auto font-semibold text-foreground">
                            {c.careers.detailCtaLabel} →
                          </span>
                        </div>
                      </SpotlightCard>
                    </AnimatedContent>
                  );
                })}
              </div>
            )}

            {!hasError && avisos.length === 0 && (
              <div className="mt-5 rounded-2xl border border-border bg-card p-8 sm:p-10">
                <p className="text-lg font-semibold">{c.careers.emptyHeading}</p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{c.careers.emptyBody}</p>
                <a
                  href="/#contacto"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
                >
                  {c.careers.applyCta}
                </a>
              </div>
            )}
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
