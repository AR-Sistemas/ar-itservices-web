import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PublicEditorialPayload } from "./editorial";

const EDITORIAL_ENDPOINT = "https://boletin-ar-consultores.vercel.app/api/public/editorial";
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_RESPONSE_BYTES = 100_000;

const publicEditorialItemSchema = z.object({
  slug: z.string().regex(/^\d{4}-\d{2}$/),
  title: z.string().min(1).max(180),
  period: z.string().min(1).max(80),
  summary: z.string().min(80).max(1200),
  highlights: z.tuple([
    z.string().min(8).max(180),
    z.string().min(8).max(180),
    z.string().min(8).max(180),
  ]),
  magazineUrl: z.string().url().refine((value) => new URL(value).protocol === "https:"),
  podcast: z.object({ episodeId: z.string().min(1).max(100) }).nullable(),
  updatedAt: z.string().datetime({ offset: true }),
});

const publicEditorialPayloadSchema = z.object({
  current: publicEditorialItemSchema.nullable(),
  archive: z.array(publicEditorialItemSchema).max(24),
});

let cachedEditorial: { payload: PublicEditorialPayload; expiresAt: number } | undefined;

function emptyEditorial(): PublicEditorialPayload {
  return { current: null, archive: [] };
}

async function fetchEditorial(): Promise<PublicEditorialPayload> {
  const response = await fetch(EDITORIAL_ENDPOINT, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(4_000),
  });

  if (!response.ok) throw new Error(`Editorial endpoint responded ${response.status}`);

  const body = await response.text();
  if (new TextEncoder().encode(body).byteLength > MAX_RESPONSE_BYTES) {
    throw new Error("Editorial endpoint response is too large");
  }

  return publicEditorialPayloadSchema.parse(JSON.parse(body));
}

export const getPublicEditorial = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cachedEditorial && cachedEditorial.expiresAt > now) return cachedEditorial.payload;

  try {
    const payload = await fetchEditorial();
    cachedEditorial = { payload, expiresAt: now + CACHE_TTL_MS };
    return payload;
  } catch (error) {
    console.error("No se pudo cargar la editorial pública.", error);
    return cachedEditorial?.payload ?? emptyEditorial();
  }
});
