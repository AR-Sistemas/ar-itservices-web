import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Feed público de avisos de AR Recruiting (proyecto `ar-recruiting`).
 *
 * El endpoint vive en el otro proyecto y es solo lectura, sin auth:
 *   GET /api/busquedas       → { avisos: AvisoListItem[] }
 *   GET /api/busquedas/:id   → 17 campos fijos
 *
 * Acá solo lo consumimos. Todas las llamadas salen desde el servidor, así
 * que el browser nunca pega contra el otro proyecto: no depende de CORS ni
 * de que el origen local esté en PUBLIC_SITE_ORIGINS, y las vacantes
 * llegan en el HTML del SSR (indexables).
 *
 * Filtros que aplica el origen y que heredamos sin repetir:
 *   visible_en_web = true AND tipo_busqueda = 'ar' AND estado IN (abierta, en_proceso)
 * Todo lo demás (Taller, cerrada, cubierta, cancelada, pausada) → 404.
 *
 * Límites conocidos del origen que nos afectan: sin paginación, sin webhook
 * ni caché. Para ver cambios hay que re-fetchear; por eso las rutas usan
 * `staleTime: 0` y muestran un botón de recargar.
 *
 * Sobre el payload: el listado trae solo lo que la card muestra (área,
 * título, meta, stack, descripción). Los bloques largos —responsabilidades y
 * los dos de requisitos— se piden aparte contra `/api/busquedas/:id` cuando
 * el visitante abre el modal de una búsqueda. El origen sí los manda en el
 * listado, pero acá no los aceptamos en el schema a propósito: si los
 * tipáramos, el SSR de la página los pagaría en cada visita sin que ninguna
 * vista los lea.
 */

const REQUEST_TIMEOUT_MS = 6000;

function apiBase(): string {
  const raw = process.env["AVISOS_API_URL"] ?? "http://localhost:8080";
  return raw.replace(/\/+$/, "");
}

/* ------------------------------------------------------------------ */
/* Schemas: validamos la respuesta en runtime en vez de asumirla.      */
/* ------------------------------------------------------------------ */

const nullable = z
  .string()
  .nullish()
  .transform((v) => v ?? null);

const avisoListItemSchema = z.object({
  id: z.string().min(1),
  nombre_posicion: z.string().min(1),
  area: nullable,
  descripcion_corta: nullable,
  seniority: nullable,
  modalidad: nullable,
  ubicacion: nullable,
  tipo_busqueda: z.string(),
  vacantes_disponibles: z.number(),
  fecha_publicacion: z.string(),
  stack: z.array(z.string()).default([]),
  // Los 3 bloques de la evaluación los trae el origen pero acá ya no se usan:
  // la card quedó minimalista y el detalle (los bloques completos) se pide
  // on-demand al abrir el modal, contra GET /api/busquedas/:id. Por eso NO
  // están en el tipo: si los aceptamos acá, el payload del listado los
  // pagaría sin que nadie los lea.
});

const avisosResponseSchema = z.object({
  avisos: z.array(avisoListItemSchema),
});

const avisoDetalleSchema = z.object({
  id: z.string().min(1),
  nombre_posicion: z.string().min(1),
  area: nullable,
  descripcion: nullable,
  responsabilidades: z.array(z.string()).default([]),
  requisitos_excluyentes: z.array(z.string()).default([]),
  requisitos_deseables: z.array(z.string()).default([]),
  seniority: nullable,
  modalidad: nullable,
  ubicacion: nullable,
  tipo_busqueda: z.string(),
  vacantes_objetivo: z.number(),
  vacantes_disponibles: z.number(),
  nivel_ingles_requerido: nullable,
  cliente_final: nullable,
  fecha_publicacion: z.string(),
  stack_evaluado: z.array(z.string()).default([]),
});

export type AvisoListItem = z.infer<typeof avisoListItemSchema>;
export type AvisoDetalle = z.infer<typeof avisoDetalleSchema>;

export type AvisosResult =
  | { ok: true; avisos: AvisoListItem[] }
  /** El origen no respondió o respondió algo que no entendemos. */
  | { ok: false; reason: "unreachable" };

export type AvisoResult =
  | { ok: true; aviso: AvisoDetalle }
  /** El origen respondió 404: aviso oculto, cubierto, cerrado o Taller. */
  | { ok: false; reason: "not-found" }
  | { ok: false; reason: "unreachable" };

/**
 * Si el origen es un preview de Vercel con Deployment Protection (p. ej. la
 * homologación del hub), hay que mandar el secreto de bypass o responde 302 al
 * login de Vercel. Solo server-side; si no está definido no se manda nada.
 */
function originHeaders(): Record<string, string> {
  const headers: Record<string, string> = { accept: "application/json" };
  const bypass = process.env["AVISOS_BYPASS_SECRET"];
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  // Clave compartida con AR Recruiting (PUBLIC_SITE_API_KEY allá): el endpoint responde 401
  // sin ella. Sale solo desde el servidor del sitio, nunca llega al navegador.
  const key = process.env["AVISOS_API_KEY"];
  if (key) headers["x-site-key"] = key;
  return headers;
}

async function fetchJson(path: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${apiBase()}${path}`, {
    headers: originHeaders(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (res.status === 404) return { status: 404, body: null };
  if (res.status === 401) {
    console.error(
      "[avisos] el feed rechazó la clave (401): revisar AVISOS_API_KEY / PUBLIC_SITE_API_KEY",
    );
  }
  if (!res.ok) return { status: res.status, body: null };
  return { status: res.status, body: await res.json() };
}

/* ------------------------------------------------------------------ */
/* Listado                                                             */
/* ------------------------------------------------------------------ */

export const getAvisos = createServerFn({ method: "GET" }).handler(
  async (): Promise<AvisosResult> => {
    try {
      const { body } = await fetchJson("/api/busquedas");
      const parsed = avisosResponseSchema.safeParse(body);
      if (!parsed.success) {
        console.error("[avisos] respuesta inesperada de /api/busquedas", parsed.error);
        return { ok: false, reason: "unreachable" };
      }
      return { ok: true, avisos: parsed.data.avisos };
    } catch (error) {
      console.error("[avisos] no se pudo listar", error);
      return { ok: false, reason: "unreachable" };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Detalle                                                             */
/* ------------------------------------------------------------------ */

export const getAviso = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<AvisoResult> => {
    // El origen responde 400 para un id que no es UUID. No le seguimos: lo
    // tratamos como "no existe" para no inventar un error de validación
    // propio que el visitante no puede resolver.
    if (!z.string().uuid().safeParse(id).success) {
      return { ok: false, reason: "not-found" };
    }
    try {
      const { status, body } = await fetchJson(`/api/busquedas/${id}`);
      if (status === 404) return { ok: false, reason: "not-found" };
      const parsed = avisoDetalleSchema.safeParse(body);
      if (!parsed.success) {
        console.error("[avisos] respuesta inesperada de /api/busquedas/:id", parsed.error);
        return { ok: false, reason: "unreachable" };
      }
      return { ok: true, aviso: parsed.data };
    } catch (error) {
      console.error("[avisos] no se pudo obtener el detalle", error);
      return { ok: false, reason: "unreachable" };
    }
  });

/* ------------------------------------------------------------------ */
/* Utilidades compartidas por las rutas                                */
/* ------------------------------------------------------------------ */

/** Palabras de enlace que no se capitalizan ("Datos e IA", "Desarrollo de Software"). */
const ENLACES = new Set([
  "de",
  "del",
  "la",
  "las",
  "el",
  "los",
  "y",
  "e",
  "o",
  "u",
  "en",
  "con",
  "para",
  "por",
  "a",
  "of",
  "and",
  "the",
  "in",
  "for",
  "to",
]);

/** Tildes que el feed suele omitir en valores de uso común. */
const TILDES: Record<string, string> = {
  hibrido: "Híbrido",
  cordoba: "Córdoba",
  asuncion: "Asunción",
  tucuman: "Tucumán",
  ingles: "Inglés",
};

/**
 * "FULL STACK" / "Hibrido" / "SSR" vienen con el casing cargado en el feed, así
 * que los normalizamos para no mezclar "Hibrido" y "Híbrido" en la misma página.
 *
 * Las siglas se respetan: un titleCase ingenuo convertía "SSR" en "Ssr" y "QA"
 * en "Qa". Las palabras de enlace ("DE", "Y", "E") van en minúscula salvo al
 * inicio, y la letra suelta tras una barra ("Ingeniero/a") queda en minúscula.
 */
export function titleCase(value: string): string {
  return value.replace(
    /(^|[\s.,\-/])([^\s.,\-/]+)/g,
    (_match, sep: string, word: string, offset: number) => {
      // Apartamos los delimitadores del token para no perderlos al capitalizar:
      // "(Argentina)" no debe quedar "(argentina)".
      const parts = /^([^A-Za-zÁÉÍÓÚÑÜ]*)(.*?)([^A-Za-zÁÉÍÓÚÑÜ]*)$/.exec(word);
      if (!parts) return sep + word;
      const [, pre, core, post] = parts;
      if (!core) return sep + word;
      const lower = core.toLowerCase();
      if (TILDES[lower]) return sep + pre + TILDES[lower] + post;
      if (sep === "/" && core.length === 1) return sep + pre + lower + post;
      if (offset > 0 && ENLACES.has(lower)) return sep + pre + lower + post;
      // Sigla = todo mayúsculas y de 3 letras o menos (SSR, SR, JR, QA). El
      // límite de 3 es a propósito: con 4, "FULL STACK" se preservaba como
      // sigla y quedaba "FULL Stack" en vez de "Full Stack".
      const esSigla = core.length <= 3 && core === core.toUpperCase();
      const normalizado = esSigla ? core : core.charAt(0).toUpperCase() + lower.slice(1);
      return sep + pre + normalizado + post;
    },
  );
}

const SENIORITY: Record<string, { ES: string; EN: string }> = {
  TRAINEE: { ES: "Trainee", EN: "Trainee" },
  JR: { ES: "Junior", EN: "Junior" },
  SSR: { ES: "Semi Senior", EN: "Mid-level" },
  SR: { ES: "Senior", EN: "Senior" },
  TL: { ES: "Tech Lead", EN: "Tech Lead" },
};

/** "SSR" → "Semi Senior": el feed manda siglas que el visitante no tiene por qué conocer. */
const NIVEL_INGLES: Record<string, { ES: string; EN: string }> = {
  A1: { ES: "A1 · Principiante", EN: "A1 · Beginner" },
  A2: { ES: "A2 · Básico", EN: "A2 · Basic" },
  B1: { ES: "B1 · Intermedio", EN: "B1 · Intermediate" },
  B2: { ES: "B2 · Intermedio alto", EN: "B2 · Upper intermediate" },
  C1: { ES: "C1 · Avanzado", EN: "C1 · Advanced" },
  C2: { ES: "C2 · Proficiente", EN: "C2 · Proficient" },
};

/**
 * El feed manda el código del marco europeo (A1..C2) y "no_requerido" cuando no se exige
 * (hoy el endpoint ya lo convierte en null; se tolera igual por si llega crudo).
 */
export function formatNivelIngles(value: string | null, lang: "ES" | "EN"): string | null {
  if (!value || value === "no_requerido") return null;
  const hit = NIVEL_INGLES[value.trim().toUpperCase()];
  return hit ? hit[lang] : titleCase(value);
}

export function formatSeniority(value: string, lang: "ES" | "EN"): string {
  const hit = SENIORITY[value.trim().toUpperCase()];
  return hit ? hit[lang] : titleCase(value);
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** "2026-10-05" → "5 de octubre de 2026". Ante anything raro devuelve la entrada. */
export function formatFecha(value: string, lang: "ES" | "EN"): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  const dia = Number(d);
  const mes = Number(m);
  if (lang === "EN") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[mes - 1] ?? m} ${dia}, ${y}`;
  }
  return `${dia} de ${MESES[mes - 1] ?? m} de ${y}`;
}
