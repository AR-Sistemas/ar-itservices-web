import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";

export const Route = createFileRoute("/comunicado-cambio-de-marca")({
  head: () => ({
    meta: [
      { title: "Comunicado de cambio de marca | AR IT Services" },
      {
        name: "description",
        content:
          "Comunicado institucional: AR Consultores pasa a identificarse como AR IT Services.",
      },
      { property: "og:title", content: "AR Consultores es AR IT Services" },
      {
        property: "og:description",
        content: "Comunicado institucional sobre la evolución de nuestra marca.",
      },
      { property: "og:url", content: "https://ar-itservices.com/comunicado-cambio-de-marca" },
    ],
    links: [{ rel: "canonical", href: "https://ar-itservices.com/comunicado-cambio-de-marca" }],
  }),
  component: AnnouncementPage,
});

function AnnouncementPage() {
  return (
    <div className="min-h-screen bg-[#111118] text-white">
      <header className="border-b border-white/10 px-6 sm:px-10">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 sm:h-24">
          <Link
            to="/"
            aria-label="AR IT Services, inicio"
            className="inline-flex items-center gap-3"
          >
            <LogoMark className="h-9 w-auto sm:h-10" />
            <LogoWordmark className="h-3.5 w-auto sm:h-4" />
          </Link>
          <span className="text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50 sm:text-xs">
            Comunicación institucional
          </span>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-10 sm:py-16 lg:py-20">
        <article className="mx-auto max-w-5xl overflow-hidden bg-[#f7f6f3] text-[#1a1b20] shadow-2xl shadow-black/20">
          <div className="h-1.5 bg-[#d4001b]" aria-hidden="true" />
          <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-16">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a31327]">
              <span>Comunicado institucional</span>
              <span className="hidden h-px w-8 bg-[#c9c6c2] sm:block" aria-hidden="true" />
              <span className="text-[#686970]">Identidad de marca</span>
            </div>

            <h1 className="mt-7 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              AR Consultores es ahora <span className="text-[#bd0921]">AR IT Services</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#55565e] sm:text-xl">
              Una evolución de nuestra marca, con la misma dedicación a quienes confían en nosotros.
            </p>

            <div className="my-10 grid gap-5 border-y border-[#d9d7d2] py-7 sm:my-12 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73747a]">
                  Marca anterior
                </p>
                <p className="mt-2 text-lg font-semibold sm:text-xl">AR Consultores</p>
              </div>
              <span className="text-2xl text-[#bd0921]" aria-hidden="true">
                →
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73747a]">
                  Marca actual
                </p>
                <p className="mt-2 text-lg font-semibold sm:text-xl">AR IT Services</p>
              </div>
            </div>

            <div className="max-w-3xl space-y-5 text-base leading-8 text-[#44464e] sm:text-lg">
              <p>
                Comunicamos que <strong className="text-[#1a1b20]">AR Consultores</strong> pasa a
                identificarse comercialmente como{" "}
                <strong className="text-[#1a1b20]">AR IT Services</strong>.
              </p>
              <p>
                Esta evolución de nuestra marca refleja nuestra identidad y nuestro enfoque en
                servicios de tecnología, desarrollo de software, datos e inteligencia artificial.
                Continuamos acompañando a nuestros clientes y trabajando junto a nuestro equipo bajo
                el nuevo nombre.
              </p>
              <p>
                En adelante, nuestras comunicaciones y presencia institucional utilizan la marca AR
                IT Services. Este comunicado deja constancia pública de la transición de AR
                Consultores a AR IT Services.
              </p>
            </div>

            <div className="mt-12 border-t border-[#d9d7d2] pt-7">
              <p className="text-sm font-bold">AR IT Services</p>
              <p className="mt-1 text-sm text-[#73747a]">Comunicación institucional</p>
            </div>
          </div>
        </article>
        <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-white/40 sm:text-left">
          AR IT Services · Sitio institucional
        </p>
      </main>
    </div>
  );
}
