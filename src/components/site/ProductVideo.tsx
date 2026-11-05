import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLang } from "@/i18n/language";

const TEXT = {
  ES: {
    play: "Reproducir",
    pause: "Pausar",
    replay: "Volver a ver",
    progress: "Progreso del video",
    fullscreen: "Pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    video: (n: string) => `Video explicativo: ${n}`,
    group: (n: string) => `Reproductor de video: ${n}`,
    unsupported: "Tu navegador no puede reproducir este video.",
    loading: "Cargando",
    error: "No se pudo cargar el video.",
    retry: "Reintentar",
    caption: "",
  },
  EN: {
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    progress: "Video progress",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    video: (n: string) => `Explainer video: ${n}`,
    group: (n: string) => `Video player: ${n}`,
    unsupported: "Your browser can't play this video.",
    loading: "Loading",
    error: "The video couldn't be loaded.",
    retry: "Retry",
    caption: "On-screen text is in Spanish.",
  },
} as const;

/** Segundos que saltan las flechas (←/→) y las teclas J/L. */
const SEEK_SMALL = 5;
const SEEK_BIG = 10;
/** Inactividad (ms) tras la cual se ocultan los controles mientras se reproduce. */
const HIDE_AFTER = 2500;

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

const ICON = "h-5 w-5 fill-current";
const BTN =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-white/10 motion-reduce:transition-none";
const PLAY_CIRCLE =
  "grid place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_40px_-10px_rgba(255,0,13,0.55)] transition-colors group-hover:bg-brand-dark motion-reduce:transition-none";

function PlayIcon({ className = ICON }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON}>
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

// Sin `fill-current`: es un ícono de trazo y la clase pisaría su `fill="none"` (se vería como una mancha llena).
function ReplayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5v4.8h4.8" />
    </svg>
  );
}

function ExpandIcon({ exit }: { exit: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {exit ? (
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
      ) : (
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      )}
    </svg>
  );
}

/**
 * Reproductor de video de producto con los controles propios de la marca
 * (superficie #232234, acento rojo, esquinas redondeadas).
 *
 * - Portada de marca antes del primer play (logo a la izquierda, play a la
 *   derecha); toda la portada es el botón de reproducir.
 * - Sin autoplay ni sonido; carga solo los metadatos.
 * - Controles que se ocultan tras 2,5 s de inactividad mientras se reproduce, y
 *   vuelven con el mouse, el toque o el foco del teclado.
 * - Teclado: espacio/K play-pausa, ←/→ ±5 s, J/L ±10 s, 0-9 salta al %, Home/End,
 *   F pantalla completa. Doble clic: pantalla completa.
 * - Barra con carga (buffer) y avance fluido, indicador de carga y estado de error.
 * - Respeta prefers-reduced-motion. Los textos del video están en español.
 */
export function ProductVideo({
  src,
  name,
  logo,
  className = "",
}: {
  src: string;
  name: string;
  logo: string;
  className?: string;
}) {
  const { lang } = useLang();
  const t = TEXT[lang === "EN" ? "EN" : "ES"];
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const overBar = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [full, setFull] = useState(false);
  const [canFull, setCanFull] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  const syncBuffered = (v: HTMLVideoElement) => {
    let end = 0;
    for (let i = 0; i < v.buffered.length; i++) {
      if (v.buffered.start(i) <= v.currentTime + 0.5) end = Math.max(end, v.buffered.end(i));
    }
    setBuffered(end);
  };

  const showUi = useCallback(() => {
    setUiVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      const keyboardOnControls = frameRef.current?.querySelector(":focus-visible") != null;
      if (v && !v.paused && !v.ended && !overBar.current && !keyboardOnControls)
        setUiVisible(false);
    }, HIDE_AFTER);
  }, []);

  // Mientras no se reproduce, los controles siempre se ven; al reproducir arranca el temporizador.
  useEffect(() => {
    if (playing) showUi();
    else {
      clearTimeout(hideTimer.current);
      setUiVisible(true);
    }
    return () => clearTimeout(hideTimer.current);
  }, [playing, showUi]);

  // Avance fluido: el evento timeupdate llega ~4 veces por segundo, así que mientras se
  // reproduce se lee el tiempo en cada cuadro de animación.
  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;
    let id = 0;
    const tick = () => {
      setTime(v.currentTime);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  useEffect(() => {
    // Los metadatos pueden llegar antes de la hidratación: leerlos si ya están.
    const v = videoRef.current as WebkitVideo | null;
    if (v && v.readyState >= 1) {
      setDuration(v.duration);
      syncBuffered(v);
    }
    setCanFull(
      document.fullscreenEnabled === true || typeof v?.webkitEnterFullscreen === "function",
    );
    const onChange = () => setFull(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    // play() devuelve una promesa que se rechaza si se pausa enseguida (AbortError).
    v.play().catch(() => {});
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) play();
    else v.pause();
  };

  const seek = (to: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    const next = Math.min(Math.max(to, 0), v.duration);
    v.currentTime = next;
    setTime(next);
    if (next < v.duration) setEnded(false);
  };

  const toggleFull = () => {
    const el = frameRef.current;
    const v = videoRef.current as WebkitVideo | null;
    if (!el || !v) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.(); // iOS Safari solo permite pantalla completa del <video>
  };

  const retry = () => {
    setError(false);
    videoRef.current?.load();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const v = videoRef.current;
    if (!v) return;
    showUi();
    const onButton = (e.target as HTMLElement).closest("button") !== null;
    const key = e.key.toLowerCase();
    if (key === "k" || (key === " " && !onButton)) toggle();
    else if (key === "arrowleft") seek(v.currentTime - SEEK_SMALL);
    else if (key === "arrowright") seek(v.currentTime + SEEK_SMALL);
    else if (key === "j") seek(v.currentTime - SEEK_BIG);
    else if (key === "l") seek(v.currentTime + SEEK_BIG);
    else if (key === "home") seek(0);
    else if (key === "end") seek(v.duration);
    else if (key === "f") toggleFull();
    else if (/^[0-9]$/.test(key)) seek((Number(key) / 10) * v.duration);
    else return;
    e.preventDefault();
  };

  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  const bufPct = duration > 0 ? Math.min(100, (buffered / duration) * 100) : 0;
  const mainLabel = ended ? t.replay : playing ? t.pause : t.play;
  const barShown = started && (uiVisible || !playing);

  return (
    <figure className={className}>
      <div
        ref={frameRef}
        role="group"
        aria-label={t.group(name)}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onPointerMove={showUi}
        onPointerDown={() => frameRef.current?.focus({ preventScroll: true })}
        className="group relative overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)] outline-none select-none [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      >
        <video
          ref={videoRef}
          className={`aspect-video w-full bg-background object-contain group-[:fullscreen]:aspect-auto group-[:fullscreen]:h-full ${
            playing && !uiVisible ? "cursor-none" : "cursor-pointer"
          }`}
          playsInline
          preload="metadata"
          aria-label={t.video(name)}
          onClick={(e) => {
            if (e.detail === 1) toggle();
          }}
          onDoubleClick={() => {
            toggle(); // el primer clic ya alternó: lo deshace para que la pantalla completa no cambie el estado
            toggleFull();
          }}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            syncBuffered(e.currentTarget);
          }}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onProgress={(e) => syncBuffered(e.currentTarget)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onSeeked={(e) => setTime(e.currentTarget.currentTime)}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onPlaying={() => setBuffering(false)}
          onPlay={() => {
            setStarted(true);
            setPlaying(true);
            setEnded(false);
          }}
          onPause={() => setPlaying(false)}
          onEnded={(e) => {
            setPlaying(false);
            setEnded(true);
            setTime(e.currentTarget.duration);
          }}
          onError={() => setError(true)}
        >
          <source src={`${src}#t=0.1`} type="video/mp4" />
          {t.unsupported}
        </video>

        {!started && !error && (
          // Portada de marca: tapa el primer fotograma hasta que se da play. Toda ella reproduce.
          <button
            type="button"
            onClick={toggle}
            aria-label={`${t.play}: ${t.video(name)}`}
            aria-keyshortcuts="k"
            className="absolute inset-0 z-10 grid grid-cols-2 items-center bg-gradient-to-br from-card via-background to-background"
          >
            <span className="grid place-items-center px-4 sm:px-8">
              <img
                src={logo}
                alt=""
                className="max-h-[7rem] w-full max-w-[14rem] object-contain sm:max-h-[11rem]"
              />
            </span>
            <span className="grid place-items-center">
              <span className={`${PLAY_CIRCLE} h-14 w-14 sm:h-20 sm:w-20`}>
                <PlayIcon className="-ml-0.5 h-6 w-6 fill-current sm:h-8 sm:w-8" />
              </span>
            </span>
          </button>
        )}

        {started && !playing && !error && (
          <button
            type="button"
            onClick={toggle}
            aria-label={mainLabel}
            className={`absolute inset-0 grid place-items-center transition-colors motion-reduce:transition-none ${
              ended ? "bg-background/70" : "bg-background/25 hover:bg-background/10"
            }`}
          >
            <span className={`${PLAY_CIRCLE} h-20 w-20`}>
              {ended ? (
                <ReplayIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="-ml-0.5 h-8 w-8 fill-current" />
              )}
            </span>
          </button>
        )}

        {buffering && playing && !error && (
          <span
            role="status"
            aria-label={t.loading}
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-brand motion-reduce:animate-none" />
          </span>
        )}

        {error && (
          <div
            role="alert"
            className="absolute inset-0 z-20 grid place-content-center justify-items-center gap-4 bg-background px-6 text-center"
          >
            <p className="text-sm text-muted-foreground">{t.error}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-dark"
            >
              {t.retry}
            </button>
          </div>
        )}

        <div
          onPointerEnter={() => {
            overBar.current = true;
          }}
          onPointerLeave={() => {
            overBar.current = false;
            if (playing) showUi();
          }}
          className={`absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-3 pt-10 pb-2.5 transition-opacity duration-300 motion-reduce:transition-none sm:px-4 ${
            barShown ? "opacity-100" : "pointer-events-none opacity-0"
          } ${started ? "" : "hidden"}`}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={mainLabel}
            aria-keyshortcuts="k"
            className={BTN}
          >
            {ended ? <ReplayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <span className="w-[4.6rem] shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
            {fmt(time)} / {fmt(duration)}
          </span>

          <div className="relative flex h-10 min-w-0 flex-1 items-center">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={Math.min(time, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={t.progress}
              aria-valuetext={`${fmt(time)} / ${fmt(duration)}`}
              className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15 transition-[height] peer-hover:h-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-text motion-reduce:transition-none">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                style={{ width: `${bufPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-brand"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-brand-text transition-transform peer-hover:scale-100 peer-focus-visible:scale-100 motion-reduce:transition-none"
              style={{ left: `${pct}%` }}
            />
          </div>

          {canFull && (
            <button
              type="button"
              onClick={toggleFull}
              aria-label={full ? t.exitFullscreen : t.fullscreen}
              aria-keyshortcuts="f"
              className={BTN}
            >
              <ExpandIcon exit={full} />
            </button>
          )}
        </div>
      </div>
      {t.caption && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          {t.caption}
        </figcaption>
      )}
    </figure>
  );
}
