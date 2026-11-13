import { createServerFn } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";
import { createHash, createHmac, createSign, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const clave = z.string().min(1).max(256);
const campos = z
  .object({
    nombre: z.string().trim().min(1).max(150),
    telefono: z.string().trim().min(1).max(80),
    semana: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return (
          !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value &&
          date.getUTCDay() === 1
        );
      }),
    disponibilidad: z.array(z.array(z.enum(["Mañana", "Tarde", "Noche"])).max(3)).length(5),
    descripcion: z.string().trim().max(3000),
  })
  .refine((data) => data.disponibilidad.some((dia) => dia.length > 0));

function autorizada(input: string) {
  const expected = process.env["REUNIONES_CLAVE"];
  if (!expected || expected.length < 16) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(input), digest(expected));
}

const cookieName = "reuniones_sesion";
const sessionLength = 12 * 60 * 60;

function sessionSignature(expiration: string) {
  const secret = process.env["REUNIONES_SESSION_SECRET"];
  const password = process.env["REUNIONES_CLAVE"];
  if (!secret || secret.length < 32 || !password || password.length < 16) return undefined;
  return createHmac("sha256", secret)
    .update(`reuniones:${expiration}:`)
    .update(password)
    .digest("hex");
}

function sesionValida() {
  const token = getCookie(cookieName) ?? "";
  const [expiration, signature, extra] = token.split(".");
  if (
    !expiration ||
    !signature ||
    extra ||
    !/^\d{10}$/.test(expiration) ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  const expiresAt = Number(expiration);
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt <= now || expiresAt > now + sessionLength) return false;
  const expected = sessionSignature(expiration);
  return !!expected && timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
}

export const estadoSesionReuniones = createServerFn({ method: "GET" }).handler(async () => {
  setResponseHeader("cache-control", "no-store");
  return { ok: sesionValida() };
});

export const salirReuniones = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(cookieName, { path: "/" });
  return { ok: true as const };
});

export const verificarClaveReuniones = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ clave }).parse(data))
  .handler(async ({ data }) => {
    if (!autorizada(data.clave)) return { ok: false as const };
    const expiration = String(Math.floor(Date.now() / 1000) + sessionLength);
    const signature = sessionSignature(expiration);
    if (!signature) return { ok: false as const };
    setCookie(cookieName, `${expiration}.${signature}`, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env["NODE_ENV"] === "production",
    });
    return { ok: true as const };
  });

export const guardarReunion = createServerFn({ method: "POST" })
  .validator((data: unknown) => campos.parse(data))
  .handler(async ({ data }) => {
    if (!sesionValida()) return { ok: false as const, error: "clave" as const };
    try {
      const credentials = JSON.parse(process.env["GOOGLE_SERVICE_ACCOUNT_JSON"] ?? "") as {
        client_email: string;
        private_key: string;
      };
      const now = Math.floor(Date.now() / 1000);
      const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
      const assertion = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
        iss: credentials.client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      })}`;
      const signature = createSign("RSA-SHA256")
        .update(assertion)
        .sign(credentials.private_key, "base64url");
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: `${assertion}.${signature}`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!tokenResponse.ok) throw new Error("token");
      const token = (await tokenResponse.json()) as { access_token?: string };
      if (!token.access_token) throw new Error("token");
      const sheetId = process.env["REUNIONES_SHEET_ID"];
      if (!sheetId || !/^[a-zA-Z0-9_-]+$/.test(sheetId)) throw new Error("sheet");
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Reuniones!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token.access_token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            values: [
              [
                data.nombre,
                data.telefono,
                ...data.disponibilidad.map((dia) => dia.join(", ")),
                data.descripcion,
                data.semana,
              ],
            ],
          }),
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok) throw new Error("append");
      const result = (await response.json()) as { updates?: { updatedRows?: number } };
      if (result.updates?.updatedRows !== 1) throw new Error("append");
      return { ok: true as const };
    } catch {
      // No se registran credenciales ni datos personales en logs.
      return { ok: false as const, error: "envio" as const };
    }
  });
