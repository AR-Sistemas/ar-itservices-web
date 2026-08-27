import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ES" | "EN";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<Ctx>({ lang: "ES", setLang: () => {} });

const STORAGE_KEY = "ar-lang";

/**
 * Detecta el idioma del navegador. Si el visitante navega con un idioma que no
 * es español (ej. un browser configurado en otro país), devolvemos inglés.
 */
function detectFromBrowser(): Lang {
  try {
    const nav =
      (typeof navigator !== "undefined" &&
        (navigator.languages?.[0] || navigator.language)) ||
      "";
    return nav.toLowerCase().startsWith("es") ? "ES" : "EN";
  } catch {
    return "ES";
  }
}

/**
 * Proveedor de idioma para toda la app.
 *  - Primera visita: autodetecta el idioma del navegador (no-español → inglés).
 *  - Recuerda la elección manual del usuario en localStorage.
 *  - SSR-safe: en el server arranca en ES y el cliente ajusta tras montar.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ES");

  useEffect(() => {
    let initial: Lang | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ES" || stored === "EN") initial = stored;
    } catch {
      /* localStorage no disponible */
    }
    if (!initial) initial = detectFromBrowser();
    setLangState(initial);
    try {
      document.documentElement.lang = initial === "EN" ? "en" : "es";
    } catch {
      /* noop */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l === "EN" ? "en" : "es";
    } catch {
      /* noop */
    }
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
