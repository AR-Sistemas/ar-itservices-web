import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  estadoSesionReuniones,
  guardarReunion,
  salirReuniones,
  verificarClaveReuniones,
} from "@/lib/reuniones.server";

export const Route = createFileRoute("/reuniones")({
  head: () => ({
    meta: [
      { title: "Registro de reuniones | AR IT Services" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Reuniones,
});

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const diasCortos = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const franjas = ["Mañana", "Tarde", "Noche"] as const;
const input =
  "mt-1 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-2 focus-visible:outline-primary";
const button =
  "rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60";

function Reuniones() {
  const [clave, setClave] = useState("");
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [semana, setSemana] = useState("");

  useEffect(() => {
    let active = true;
    estadoSesionReuniones()
      .then((result) => {
        if (active) setAutorizado(result.ok);
      })
      .catch(() => {
        if (active) setAutorizado(false);
      });
    const lunes = new Date();
    lunes.setDate(lunes.getDate() + ((8 - lunes.getDay()) % 7 || 7));
    const year = lunes.getFullYear();
    const month = String(lunes.getMonth() + 1).padStart(2, "0");
    const day = String(lunes.getDate()).padStart(2, "0");
    setSemana(`${year}-${month}-${day}`);
    return () => {
      active = false;
    };
  }, []);

  async function ingresar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviando(true);
    setMensaje("");
    try {
      const result = await verificarClaveReuniones({ data: { clave } });
      if (result.ok) {
        setClave("");
        setAutorizado(true);
      } else setMensaje("No se pudo ingresar. Revisá la clave e intentá nuevamente.");
    } catch {
      setMensaje("No se pudo ingresar. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const disponibilidad = dias.map(
      (_, index) => data.getAll(`dia${index}`).map(String) as (typeof franjas)[number][],
    );
    if (!disponibilidad.some((dia) => dia.length)) {
      setMensaje("Marcá al menos una franja de disponibilidad.");
      return;
    }
    if (new Date(`${semana}T00:00:00Z`).getUTCDay() !== 1) {
      setMensaje("Elegí un lunes como inicio de semana.");
      return;
    }
    setEnviando(true);
    setMensaje("");
    try {
      const result = await guardarReunion({
        data: {
          nombre: String(data.get("nombre") ?? ""),
          telefono: String(data.get("telefono") ?? ""),
          semana: String(data.get("semana") ?? ""),
          descripcion: String(data.get("descripcion") ?? ""),
          disponibilidad,
        },
      });
      if (result.ok) {
        form.reset();
        setMensaje("Registro guardado en la planilla.");
      } else if (result.error === "clave") {
        setMensaje("La sesión venció. Sacá capturas de los datos antes de volver a ingresar.");
      } else
        setMensaje(
          "No se pudo confirmar el guardado. Sacá capturas de los datos y avisá al equipo. Podría haberse guardado: no lo envíes otra vez sin comprobarlo.",
        );
    } catch {
      setMensaje(
        "No se pudo confirmar el guardado. Sacá capturas de los datos y avisá al equipo. Podría haberse guardado: no lo envíes otra vez sin comprobarlo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Reuniones</h1>
          {autorizado === true && (
            <button
              type="button"
              className="ml-auto min-h-11 px-2 text-sm text-muted-foreground underline"
              onClick={async () => {
                try {
                  await salirReuniones();
                  setClave("");
                  setAutorizado(false);
                  setMensaje("");
                } catch {
                  setMensaje("No se pudo cerrar la sesión. Intentá nuevamente.");
                }
              }}
            >
              Salir
            </button>
          )}
        </div>
        {autorizado === false && mensaje && (
          <p role="status" className="mt-4 rounded-lg border border-border bg-card p-3 text-sm">
            {mensaje}
          </p>
        )}
        {autorizado === null ? (
          <p role="status" className="mt-5 text-sm">
            Cargando…
          </p>
        ) : autorizado === false ? (
          <form key="ingreso" onSubmit={ingresar} className="mt-6 space-y-4">
            <label className="block font-semibold">
              Clave del equipo
              <input
                className={input}
                type="password"
                autoComplete="current-password"
                value={clave}
                maxLength={256}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </label>
            <button className={button} disabled={enviando}>
              {enviando ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        ) : (
          <form key="registro" onSubmit={guardar} className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block font-semibold">
                Nombre
                <input
                  className={input}
                  name="nombre"
                  autoComplete="off"
                  enterKeyHint="next"
                  maxLength={150}
                  required
                />
              </label>
              <label className="block font-semibold">
                Teléfono
                <input
                  className={input}
                  name="telefono"
                  type="tel"
                  autoComplete="off"
                  enterKeyHint="next"
                  maxLength={80}
                  required
                />
              </label>
            </div>
            <label className="block font-semibold">
              Semana del lunes
              <input
                className={input}
                name="semana"
                type="date"
                value={semana}
                onChange={(event) => setSemana(event.target.value)}
                required
              />
            </label>
            <fieldset>
              <legend className="font-semibold">Disponibilidad</legend>
              <div className="mt-2 grid grid-cols-[3rem_repeat(3,minmax(0,1fr))] gap-1 sm:grid-cols-[5rem_repeat(3,minmax(0,1fr))]">
                <span />
                {franjas.map((franja) => (
                  <span
                    key={franja}
                    className="py-1 text-center text-xs font-semibold text-muted-foreground sm:text-sm"
                  >
                    {franja}
                  </span>
                ))}
                {dias.map((dia, i) => (
                  <div key={dia} className="contents">
                    <span className="flex items-center text-sm font-semibold">
                      <span className="sm:hidden">{diasCortos[i]}</span>
                      <span className="hidden sm:inline">{dia}</span>
                    </span>
                    {franjas.map((franja) => (
                      <label key={franja} className="relative block cursor-pointer">
                        <input
                          type="checkbox"
                          name={`dia${i}`}
                          value={franja}
                          aria-label={`${dia}, ${franja}`}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="flex min-h-11 items-center justify-center rounded-md border border-border bg-card text-lg font-bold text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
                        >
                          ✓
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </fieldset>
            <label className="block font-semibold">
              Descripción <span className="font-normal text-muted-foreground">(opcional)</span>
              <textarea className={input} name="descripcion" maxLength={3000} rows={2} />
            </label>
            {mensaje && (
              <p role="status" className="rounded-lg border border-border bg-card p-3 text-sm">
                {mensaje}
              </p>
            )}
            <button className={`${button} min-h-12 w-full sm:w-auto`} disabled={enviando}>
              {enviando ? "Guardando…" : "Guardar registro"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
