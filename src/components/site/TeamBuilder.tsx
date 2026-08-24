import { useMemo, useState } from "react";
import { useSpringPress } from "./useSpringPress";

/** Disciplinas editables del widget de armado de equipo. */
const DISCIPLINES = [
  {
    id: "dotnet-react",
    label: ".NET & React",
    roles: [
      { role: "Dev .NET Senior", qty: 2 },
      { role: "Dev React", qty: 2 },
    ],
  },
  {
    id: "data-bi",
    label: "Data & Power BI",
    roles: [
      { role: "Data Engineer", qty: 1 },
      { role: "Analista Power BI", qty: 1 },
    ],
  },
  {
    id: "qa",
    label: "QA & Testing",
    roles: [{ role: "QA Automation", qty: 1 }],
  },
  {
    id: "scrum",
    label: "Scrum Master",
    roles: [{ role: "Scrum Master", qty: 1 }],
  },
  {
    id: "mobile",
    label: "Mobile",
    roles: [{ role: "Dev iOS / Android", qty: 2 }],
  },
  {
    id: "devops",
    label: "DevOps & n8n",
    roles: [
      { role: "DevOps Engineer", qty: 1 },
      { role: "Especialista Automatización", qty: 1 },
    ],
  },
  {
    id: "pm",
    label: "Project Manager",
    roles: [{ role: "Project Manager", qty: 1 }],
  },
] as const;

export function TeamBuilder() {
  const [selected, setSelected] = useState<string[]>(["dotnet-react", "data-bi"]);
  const cta = useSpringPress<HTMLAnchorElement>();

  const team = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of DISCIPLINES) {
      if (!selected.includes(d.id)) continue;
      for (const r of d.roles) map.set(r.role, (map.get(r.role) ?? 0) + r.qty);
    }
    return [...map.entries()].map(([role, qty]) => ({ role, qty }));
  }, [selected]);

  const total = team.reduce((a, b) => a + b.qty, 0);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <p className="font-mono text-xs tracking-widest text-primary">
          // selecciona las disciplinas
        </p>
        <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
          Armá el equipo que tu proyecto necesita
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Tocá las disciplinas y mirá cómo se arma el equipo. Es exactamente lo que hacemos con
          nuestros clientes: perfiles concretos, cantidades concretas.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Disciplinas">
          {DISCIPLINES.map((d) => {
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
          <p className="font-mono text-xs tracking-widest text-muted-foreground">// equipo propuesto</p>
          <p className="font-mono text-sm text-muted-foreground">
            {total} {total === 1 ? "persona" : "personas"}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
          {team.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2">
              Seleccioná al menos una disciplina para ver tu equipo.
            </p>
          )}
          {team.map((t) => (
            <div
              key={t.role}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
            >
              <span className="text-sm text-foreground">{t.role}</span>
              <span className="font-mono text-sm text-primary">×{t.qty}</span>
            </div>
          ))}
        </div>

        <a
          ref={cta.ref}
          onMouseDown={cta.press}
          href="#contacto"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
        >
          Agendar una llamada con tu equipo propuesto
        </a>
      </div>
    </div>
  );
}
