import { useMemo, useState } from "react";
import { useSpringPress } from "./useSpringPress";
import { useLang } from "@/i18n/language";
import { getContent } from "@/i18n/content";
import { prefillContactMessage } from "@/lib/contact-prefill";

export function TeamBuilder() {
  const { lang } = useLang();
  const t = getContent(lang).team;
  const [selected, setSelected] = useState<string[]>(["dotnet-react", "data-bi"]);
  const cta = useSpringPress<HTMLAnchorElement>();

  const team = useMemo(() => {
    const disciplines = getContent(lang).team.disciplines;
    const map = new Map<string, number>();
    for (const d of disciplines) {
      if (!selected.includes(d.id)) continue;
      for (const r of d.roles) map.set(r.role, (map.get(r.role) ?? 0) + r.qty);
    }
    return [...map.entries()].map(([role, qty]) => ({ role, qty }));
  }, [selected, lang]);

  const total = team.reduce((a, b) => a + b.qty, 0);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <p className="font-mono text-xs tracking-widest text-primary">{t.eyebrow}</p>
        <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">{t.heading}</h2>
        <p className="mt-4 max-w-md text-muted-foreground">{t.paragraph}</p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t.disciplinesAria}>
          {t.disciplines.map((d) => {
            const on = selected.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(d.id)}
                className={`rounded-full border px-4 py-2 font-mono text-sm transition-colors ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">{t.proposed}</p>
          <p className="font-mono text-sm text-muted-foreground">
            {total} {total === 1 ? t.person : t.people}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
          {team.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2">{t.empty}</p>
          )}
          {team.map((tm) => (
            <div
              key={tm.role}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
            >
              <span className="text-sm text-foreground">{tm.role}</span>
              <span className="font-mono text-sm text-primary">×{tm.qty}</span>
            </div>
          ))}
        </div>

        <a
          ref={cta.ref}
          onMouseDown={cta.press}
          onClick={() => {
            // El formulario de #contacto escucha este evento y precarga el mensaje.
            const labels = t.disciplines.filter((d) => selected.includes(d.id)).map((d) => d.label);
            prefillContactMessage(labels.length ? t.proposalMessage(labels, team, total) : "");
          }}
          href="#contacto"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
        >
          {t.cta}
        </a>
      </div>
    </div>
  );
}
