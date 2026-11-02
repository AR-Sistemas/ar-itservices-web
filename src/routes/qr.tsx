import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Layers3, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";
import { LogoWordmark } from "@/components/site/LogoWordmark";
import { useLang } from "@/i18n/language";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [{ title: "AR IT Services" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: QrPage,
});

function QrPage() {
  const { lang, setLang } = useLang();
  const en = lang === "EN";
  const options = [
    {
      label: en ? "Contact us" : "Contactanos",
      href: "/#contacto",
      icon: MessageCircle,
    },
    { label: en ? "Solutions" : "Soluciones", href: "/#soluciones", icon: Layers3 },
    {
      label: en ? "Work with us" : "Trabajá con nosotros",
      href: "/?tipo=postulante#contacto",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-5 py-10 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="AR IT Services" className="inline-flex items-center gap-3">
            <LogoMark className="h-11 w-auto text-foreground" />
            <LogoWordmark className="h-4 w-auto text-foreground" />
          </Link>
          <div
            role="group"
            aria-label={en ? "Language" : "Idioma"}
            className="flex gap-1 text-xs font-semibold"
          >
            {(["ES", "EN"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={lang === language}
                onClick={() => setLang(language)}
                className={`rounded px-2 py-2 ${lang === language ? "text-primary" : "text-muted-foreground"}`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
        <h1 className="mt-16 text-3xl font-bold tracking-tight sm:text-4xl">
          {en ? "How can we help you?" : "¿Cómo podemos ayudarte?"}
        </h1>
        <div className="mt-8 grid gap-4">
          {options.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="group flex min-h-20 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 text-lg font-semibold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />
              <span className="flex-1">{label}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
              />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
