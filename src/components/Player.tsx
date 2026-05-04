"use client";

import { API_HOST_IP, STREAM_HOST_IP } from "@/services/admin";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Clapperboard,
  FastForward,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Content, EpisodeMetadata, NextEpisode } from "@/types";

declare global {
  interface Window {
    AndroidApp?: {
      isAndroidApp: () => boolean;
    };
  }
}

// ── Tipos explícitos para Shaka Player ───────────────────────────────────────

interface ShakaVariantTrack {
  id: number;
  active: boolean;
  height: number | null;
  bandwidth: number;
}

interface ShakaAdaptationEvent extends Event {
  type: "adaptation";
}

interface ShakaErrorEvent extends Event {
  type: "error";
  detail: {
    code: number;
    message: string;
  };
}

interface ShakaPlayer {
  destroy(): Promise<void>;
  load(url: string): Promise<void>;
  getVariantTracks(): ShakaVariantTrack[];
  selectVariantTrack(track: ShakaVariantTrack, clearBuffer?: boolean): void;
  configure(config: Record<string, unknown>): void;
  addEventListener(event: "adaptation", handler: (e: ShakaAdaptationEvent) => void): void;
  addEventListener(event: "error", handler: (e: ShakaErrorEvent) => void): void;
}

interface ShakaModule {
  default: {
    polyfill: { installAll(): void };
    Player: {
      isBrowserSupported(): boolean;
      new (video: HTMLVideoElement): ShakaPlayer;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  content: Content;
  tvShow?: {
    season: number;
    episode: EpisodeMetadata;
    nextEpisode: NextEpisode | null;
  };
}

interface QualityOption {
  height: number;
  bitrate: number;
  id: number;
}

type Resolution = "4K" | "FHD" | "HD" | "SD";

interface SeekPreview {
  active: boolean;
  targetTime: number;
  targetProgress: number;
  direction: "left" | "right" | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function heightToResolution(height: number): Resolution {
  if (height >= 2160) return "4K";
  if (height >= 1080) return "FHD";
  if (height >= 720) return "HD";
  return "SD";
}

function getSubtitleTrack(video: HTMLVideoElement): TextTrack | null {
  for (let i = 0; i < video.textTracks.length; i++) {
    const t = video.textTracks[i];
    if (t.kind === "subtitles" || t.kind === "captions") return t;
  }
  return null;
}

function enableSubtitles(video: HTMLVideoElement): void {
  for (let i = 0; i < video.textTracks.length; i++) {
    const t = video.textTracks[i];
    if (t.kind === "subtitles" || t.kind === "captions") {
      t.mode = "showing";
    } else {
      t.mode = "disabled";
    }
  }
}

function disableSubtitles(video: HTMLVideoElement): void {
  for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = "hidden";
  }
}

function isTVOrAndroid(): boolean {
  if (typeof window === "undefined") return false;
  if (window.AndroidApp?.isAndroidApp()) return true;
  return navigator.userAgent.toLowerCase().includes("aft");
}

function fmt(t: number): string {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function qualityLabel(height: number): string {
  return `${height}p`;
}

// ─────────────────────────────────────────────────────────────────────────────

function Player({ content, tvShow }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const qualityMenuRef = useRef<HTMLDivElement | null>(null);
  const shakaPlayerRef = useRef<ShakaPlayer | null>(null);
  const seekPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  async function SpeedTest(): Promise<number> {
    const results: number[] = [];
    for (let i = 0; i < 2; i++) {
      const start = performance.now();
      const res = await fetch(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pierre-Person.jpg/320px-Pierre-Person.jpg",
        { cache: "no-store" }
      );
      await res.blob();
      const secs = (performance.now() - start) / 1000;
      results.push((0.105 / secs) * 8);
    }
    return Math.max(...results);
  }

  const [videoStates, setVideoStates] = useState({
    paused: true,
    muted: false,
    fullscreen: false,
    controlsHidden: false,
    currentTime: "00:00:00",
    progress: 0,
    waiting: true,
    resolution: "HD" as Resolution,
    subtitlesOn: true,
  });

  const [rangeStates, setRangeStates] = useState({
    hoverTime: 0,
    isHovering: false,
    hoverX: 0,
    buffered: 0,
  });

  // Seek preview: permite previsualizar el destino con D-pad / teclado
  // sin ejecutar el seek hasta que el usuario pulse Enter.
  const [seekPreview, setSeekPreview] = useState<SeekPreview>({
    active: false,
    targetTime: 0,
    targetProgress: 0,
    direction: null,
  });

  const [isPip, setIsPiP] = useState(false);
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [qualityMenu, setQualityMenu] = useState(false);
  const [qualityFocusIndex, setQualityFocusIndex] = useState(0);

  const navigatingRef = useRef(false);
  const isTV = isTVOrAndroid();

  const [skips, SetSkips] = useState({ summary: false, intro: false, credits: false });

  // ─── Reset al cambiar de episodio ────────────────────────────────────────────
  useEffect(() => {
    navigatingRef.current = false;
  }, [content.id, tvShow?.episode.episodeNumber, tvShow?.season]);

  const navigateToNextEpisode = (): void => {
    if (navigatingRef.current || !tvShow?.nextEpisode) return;
    navigatingRef.current = true;
    SetSkips((p) => ({ ...p, credits: false }));
    router.push(
      `/player/${content.id}?season=${tvShow.nextEpisode.seasonNumber}&episode=${tvShow.nextEpisode.episodeNumber}`
    );
  };

  const togglePiP = async (): Promise<void> => {
    try {
      const video = videoRef.current;
      if (!video) return;
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      console.error("Error con PiP:", error);
    }
  };

  // ─── Quality control ─────────────────────────────────────────────────────────
  const changeQuality = (height: number | null): void => {
    const player = shakaPlayerRef.current;
    if (!player) return;

    if (height === null) {
      // Modo automático: ABR retoma el control; el badge se actualizará con el evento "adaptation"
      player.configure({ abr: { enabled: true } });
      setSelectedQuality(null);
    } else {
      const tracks = player.getVariantTracks();
      const filtered = tracks.filter((t) => t.height === height);
      const track = filtered.sort((a, b) => b.bandwidth - a.bandwidth)[0];
      if (!track) return;
      player.configure({ abr: { enabled: false } });
      player.selectVariantTrack(track, true);
      setSelectedQuality(height);
      // Actualizar el badge de resolución de inmediato sin esperar al evento "adaptation"
      setVideoStates((p) => ({ ...p, resolution: heightToResolution(height) }));
    }

    setQualityMenu(false);
  };

  // ─── Skips ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null || tvShow === undefined) return;

    const ManageSkips = (): void => {
      if (navigatingRef.current) return;
      const CURRENT_TIME = VIDEO.currentTime;
      const { beginSummary, endSummary, beginIntro, endIntro, beginCredits } =
        tvShow.episode;
      SetSkips({
        summary:
          beginSummary !== null && endSummary !== null
            ? CURRENT_TIME > beginSummary && CURRENT_TIME < endSummary
            : false,
        intro:
          beginIntro !== null && endIntro !== null
            ? CURRENT_TIME > beginIntro && CURRENT_TIME < endIntro
            : false,
        credits: beginCredits !== null ? CURRENT_TIME > beginCredits : false,
      });
    };

    VIDEO.addEventListener("timeupdate", ManageSkips);
    VIDEO.addEventListener("seeked", ManageSkips);
    return () => {
      VIDEO.removeEventListener("timeupdate", ManageSkips);
      VIDEO.removeEventListener("seeked", ManageSkips);
    };
  }, [tvShow]);

  // ─── Shaka init + source load ────────────────────────────────────────────────
  useEffect(() => {
    const loadVideo = async (): Promise<void> => {
      if (!videoRef.current) return;
      const VIDEO = videoRef.current;

      const speed = await SpeedTest();
      const slow = speed < 4;
      const lowQ = videoStates.resolution === "SD" || slow;

      const API = `${
        tvShow
          ? `${content.id}/season-${tvShow.season}/episode-${tvShow.episode.episodeNumber}`
          : content.id
      }/manifest.mpd`;
      setVideoStates((p) => ({ ...p, resolution: lowQ ? "SD" : "HD" }));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      let ip = API_HOST_IP;

      fetch(`${ip}/${API}`, { method: "HEAD", signal: controller.signal })
        .catch(() => { ip = API_HOST_IP; })
        .finally(async () => {
          clearTimeout(timeout);
          const src = `${STREAM_HOST_IP}/${API}`;

          const loadWithRetry = async (attempts = 3, delay = 1500): Promise<void> => {
            for (let i = 0; i < attempts; i++) {
              try {
                const shaka = (await import(
                  "shaka-player/dist/shaka-player.compiled"
                )) as ShakaModule;

                shaka.default.polyfill.installAll();
                if (!shaka.default.Player.isBrowserSupported()) {
                  setVideoStates((p) => ({ ...p, paused: true, waiting: false }));
                  return;
                }
                if (shakaPlayerRef.current) await shakaPlayerRef.current.destroy();

                const player = new shaka.default.Player(VIDEO);
                shakaPlayerRef.current = player;

                // Calidad en tiempo real (solo efectivo en modo Auto)
                player.addEventListener("adaptation", (_e: ShakaAdaptationEvent) => {
                  const active = player.getVariantTracks().find((t) => t.active);
                  if (!active?.height) return;
                  setVideoStates((p) => ({
                    ...p,
                    resolution: heightToResolution(active.height as number),
                  }));
                });

                player.addEventListener("error", (e: ShakaErrorEvent) => {
                  console.warn("Shaka player error", e.detail);
                });

                await player.load(src);

                await new Promise<void>((resolve) => {
                  if (VIDEO.readyState >= 1) resolve();
                  else VIDEO.addEventListener("loadedmetadata", () => resolve(), { once: true });
                });

                // Poblar lista de calidades únicas por altura
                const tracks = player.getVariantTracks();
                const uniqueMap = new Map<number, ShakaVariantTrack>();
                tracks.forEach((t) => {
                  if (
                    t.height !== null &&
                    (!uniqueMap.has(t.height) ||
                      t.bandwidth > (uniqueMap.get(t.height)?.bandwidth ?? 0))
                  ) {
                    uniqueMap.set(t.height, t);
                  }
                });
                const uniqueQualities: QualityOption[] = Array.from(uniqueMap.values())
                  .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
                  .map((t) => ({
                    height: t.height as number,
                    bitrate: t.bandwidth,
                    id: t.id,
                  }));
                setQualities(uniqueQualities);
                setSelectedQuality(null);

                // Auto-activar subtítulos
                const subtitleTrack = getSubtitleTrack(VIDEO);
                if (subtitleTrack) {
                  enableSubtitles(VIDEO);
                  setHasSubtitles(true);
                  setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                } else {
                  let trackTimeout: NodeJS.Timeout;
                  const onTrackAdded = (): void => {
                    const t = getSubtitleTrack(VIDEO);
                    if (t) {
                      enableSubtitles(VIDEO);
                      setHasSubtitles(true);
                      setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                      VIDEO.textTracks.removeEventListener("addtrack", onTrackAdded);
                      clearTimeout(trackTimeout);
                    }
                  };
                  VIDEO.textTracks.addEventListener("addtrack", onTrackAdded);
                  trackTimeout = setTimeout(() => {
                    VIDEO.textTracks.removeEventListener("addtrack", onTrackAdded);
                    setHasSubtitles(false);
                    setVideoStates((p) => ({ ...p, subtitlesOn: false }));
                  }, 3000);
                }

                // Skip intro/summary al inicio
                if (tvShow !== undefined) {
                  const { beginSummary, endSummary, beginIntro, endIntro } = tvShow.episode;
                  if (beginSummary === 0 && endSummary !== null && beginIntro === endSummary + 1 && endIntro != null) {
                    VIDEO.currentTime = endIntro;
                  } else if (beginIntro === 0 && endIntro !== null && beginSummary === endIntro + 1 && endSummary != null) {
                    VIDEO.currentTime = endSummary;
                  } else if (beginSummary === 0 && endSummary != null) {
                    VIDEO.currentTime = endSummary;
                  } else if (beginIntro === 0 && endIntro != null) {
                    VIDEO.currentTime = endIntro;
                  }
                }

                // Resolución inicial desde la pista activa
                const activeTrack = player.getVariantTracks().find((t) => t.active);
                if (activeTrack?.height) {
                  setVideoStates((p) => ({
                    ...p,
                    resolution: heightToResolution(activeTrack.height as number),
                  }));
                }

                VIDEO.play()
                  .then(() => setVideoStates((p) => ({ ...p, paused: false, waiting: false })))
                  .catch(() => setVideoStates((p) => ({ ...p, paused: true, waiting: false })));

                return;
              } catch (e) {
                console.warn(`Shaka intento ${i + 1} fallido`, e);
                if (i < attempts - 1) {
                  await new Promise((res) => setTimeout(res, delay));
                } else {
                  console.error("Shaka error tras todos los intentos", e);
                  setVideoStates((p) => ({ ...p, paused: true, waiting: false }));
                }
              }
            }
          };

          loadWithRetry();
        });
    };

    loadVideo();
    return () => {
      shakaPlayerRef.current?.destroy();
      shakaPlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // ─── Keyboard global ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (qualityMenu) {
        const totalItems = qualities.length + 1;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setQualityFocusIndex((p) => (p + 1) % totalItems);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setQualityFocusIndex((p) => (p - 1 + totalItems) % totalItems);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (qualityFocusIndex === 0) changeQuality(null);
          else changeQuality(qualities[qualityFocusIndex - 1].height);
        } else if (e.key === "Escape" || e.key === "Backspace" || e.key === "GoBack") {
          e.preventDefault();
          setQualityMenu(false);
        }
        return;
      }

      switch (e.key) {
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "c":
        case "C":
          if (hasSubtitles) toggleSubtitles();
          break;
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        default:
          break;
      }
    };

    const onFS = (): void =>
      setVideoStates((p) => ({ ...p, fullscreen: !!document.fullscreenElement }));

    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFS);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFS);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubtitles, qualityMenu, qualityFocusIndex, qualities]);

  // ─── Controls auto-hide ──────────────────────────────────────────────────────
  useEffect(() => {
    const C = containerRef.current;
    const CTR = controlsRef.current;
    if (!C || !CTR) return;
    let timer: NodeJS.Timeout;
    const HIDE_DELAY = isTV ? 8000 : 5000;

    const hide = (): void => setVideoStates((p) => ({ ...p, controlsHidden: true }));
    const show = (): void => {
      setVideoStates((p) => ({ ...p, controlsHidden: false }));
      clearTimeout(timer);
      if (videoStates.paused) return;
      if (!CTR.contains(document.activeElement)) timer = setTimeout(hide, HIDE_DELAY);
    };

    C.addEventListener("mousemove", show);
    C.addEventListener("keydown", show);
    C.addEventListener("focusin", show);
    C.addEventListener("touchstart", show);
    videoStates.paused ? show() : (timer = setTimeout(hide, HIDE_DELAY));

    return () => {
      clearTimeout(timer);
      C.removeEventListener("mousemove", show);
      C.removeEventListener("keydown", show);
      C.removeEventListener("focusin", show);
      C.removeEventListener("touchstart", show);
    };
  }, [videoStates.paused, isTV]);

  // ─── Buffer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (!VIDEO) return;
    const update = (): void => {
      const buf = VIDEO.buffered;
      if (!buf.length) return;
      const t = VIDEO.currentTime;
      const d = VIDEO.duration || 1;
      let ahead = 0;
      for (let i = 0; i < buf.length; i++) {
        if (t >= buf.start(i) && t <= buf.end(i)) {
          ahead = buf.end(i) - t;
          break;
        }
      }
      setRangeStates((p) => ({ ...p, buffered: ((t + ahead) / d) * 100 }));
    };
    VIDEO.addEventListener("progress", update);
    return () => VIDEO.removeEventListener("progress", update);
  }, []);

  // ─── Cerrar menú calidad al clic fuera ───────────────────────────────────────
  useEffect(() => {
    if (!qualityMenu) return;
    const close = (e: MouseEvent): void => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(e.target as Node)) {
        setQualityMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [qualityMenu]);

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const togglePlay = (): void => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setVideoStates((p) => ({ ...p, paused: false }));
    } else {
      v.pause();
      setVideoStates((p) => ({ ...p, paused: true, controlsHidden: false }));
    }
  };

  const toggleMute = (): void => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoStates((p) => ({ ...p, muted: v.muted }));
  };

  const toggleFullscreen = (): void => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
      c.requestFullscreen();
      setVideoStates((p) => ({ ...p, fullscreen: true }));
    } else {
      document.exitFullscreen();
      setVideoStates((p) => ({ ...p, fullscreen: false }));
    }
  };

  const seekImmediate = (secs: number): void => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + secs), v.duration);
  };

  const toggleSubtitles = (): void => {
    const VIDEO = videoRef.current;
    if (!VIDEO) return;
    const newState = !videoStates.subtitlesOn;
    if (newState) enableSubtitles(VIDEO);
    else disableSubtitles(VIDEO);
    setVideoStates((p) => ({ ...p, subtitlesOn: newState }));
  };

  const onSeekBar = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
    setVideoStates((p) => ({ ...p, currentTime: fmt(v.currentTime) }));
  };

  // ─── Seek preview helpers ────────────────────────────────────────────────────
  const cancelSeekPreview = (): void => {
    if (seekPreviewTimerRef.current) clearTimeout(seekPreviewTimerRef.current);
    setSeekPreview({ active: false, targetTime: 0, targetProgress: 0, direction: null });
  };

  const commitSeekPreview = (): void => {
    const v = videoRef.current;
    if (!v || !seekPreview.active) return;
    v.currentTime = seekPreview.targetTime;
    if (seekPreviewTimerRef.current) clearTimeout(seekPreviewTimerRef.current);
    setSeekPreview({ active: false, targetTime: 0, targetProgress: 0, direction: null });
  };

  // ─── Seekbar keyboard handler ─────────────────────────────────────────────────
  //
  // ArrowLeft / ArrowRight  → acumula un preview de ±10 s sin hacer seek
  // Enter                   → confirma el seek (o play/pause si no hay preview)
  // Escape                  → cancela el preview sin seek
  // ArrowUp / ArrowDown     → mueve el foco al elemento data-focusable anterior/siguiente
  //
  // Funciona igual en TV (D-pad) y en PC (teclado). Tab se encarga de la
  // navegación estándar entre botones en PC.

  const handleSeekbarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const v = videoRef.current;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      cancelSeekPreview();
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-focusable]"));
      const idx = els.indexOf(document.activeElement as HTMLElement);
      if (idx === -1) return;
      if (e.key === "ArrowDown") els[idx + 1]?.focus();
      else els[idx - 1]?.focus();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (seekPreview.active) commitSeekPreview();
      else togglePlay();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelSeekPreview();
      return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      if (!v || !v.duration) return;

      const delta = e.key === "ArrowRight" ? 10 : -10;
      const base = seekPreview.active ? seekPreview.targetTime : v.currentTime;
      const targetTime = Math.min(Math.max(0, base + delta), v.duration);
      const targetProgress = (targetTime / v.duration) * 100;

      // Reiniciar auto-cancelación: si el usuario para 3 s sin confirmar, se cancela
      if (seekPreviewTimerRef.current) clearTimeout(seekPreviewTimerRef.current);
      seekPreviewTimerRef.current = setTimeout(cancelSeekPreview, 3000);

      setSeekPreview({
        active: true,
        targetTime,
        targetProgress,
        direction: e.key === "ArrowRight" ? "right" : "left",
      });
    }
  };

  const Skip = (): void => {
    const VIDEO = videoRef.current;
    if (VIDEO === null || tvShow === undefined) return;
    if (skips.summary && tvShow.episode.endSummary !== null) {
      VIDEO.currentTime = tvShow.episode.endSummary;
      SetSkips((p) => ({ ...p, summary: false }));
    }
    if (skips.intro && tvShow.episode.endIntro !== null) {
      VIDEO.currentTime = tvShow.episode.endIntro;
      SetSkips((p) => ({ ...p, intro: false }));
    }
  };

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const iconBtn = isTV
    ? "cursor-pointer p-3 rounded-xl transition-all duration-150 text-white/70 hover:text-white hover:bg-white/15 active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:bg-white/15 focus-visible:text-white"
    : "cursor-pointer p-2 rounded-full transition-all duration-150 text-white/70 hover:text-white hover:bg-white/10 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  const resolutionColor: Record<Resolution, string> = {
    "4K": "text-purple-400 border-purple-400/40",
    FHD: "text-blue-400 border-blue-400/40",
    HD: "text-green-400 border-green-400/40",
    SD: "text-orange-400 border-orange-400/40",
  };
  const resColor = resolutionColor[videoStates.resolution];

  const iconSm = "w-5 h-5 min-[865px]:w-6 min-[865px]:h-6";
  const iconLg = "w-7 h-7 min-[865px]:w-9 min-[865px]:h-9";

  // La barra de progreso muestra el punto destino cuando hay preview activo
  const displayProgress = seekPreview.active
    ? seekPreview.targetProgress
    : videoStates.progress;

  const displayTime = seekPreview.active
    ? fmt(seekPreview.targetTime)
    : videoStates.currentTime;

  return (
    <div
      ref={containerRef}
      id="video-container"
      className={`relative h-full w-full bg-black overflow-hidden select-none ${
        videoStates.controlsHidden ? "cursor-none" : "cursor-default"
      }`}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain z-0 max-[1024px]:object-cover"
        playsInline
        data-focusable
        onClick={togglePlay}
        onSeeking={() => setVideoStates((p) => ({ ...p, waiting: true }))}
        onPlaying={() => setVideoStates((p) => ({ ...p, waiting: false }))}
        onCanPlay={() => setVideoStates((p) => ({ ...p, waiting: false }))}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setVideoStates((p) => ({
            ...p,
            currentTime: fmt(v.currentTime),
            progress: (v.currentTime / v.duration) * 100,
          }));
        }}
      />

      {/* LOADING */}
      <div
        aria-hidden={!videoStates.waiting}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none aria-hidden:hidden"
      >
        <Loader2
          className={`text-white/50 animate-spin ${isTV ? "h-20 w-20" : "h-12 w-12"}`}
          strokeWidth={1.5}
        />
      </div>

      {/* TOP GRADIENT + HEADER */}
      <div
        aria-hidden={videoStates.controlsHidden}
        className="absolute top-0 inset-x-0 z-20
                   bg-linear-to-b from-black/80 via-black/20 to-transparent
                   px-6 pt-6 pb-20
                   transition-opacity duration-500
                   aria-hidden:opacity-0 aria-hidden:pointer-events-none"
      >
        <div className="flex items-start justify-between">
          <Link
            href={`/content/${content.id}`}
            className={`flex items-center gap-2 text-white/80 hover:text-white transition-colors group rounded-xl
              ${isTV ? "p-2 focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none focus-visible:bg-white/15" : ""}`}
          >
            <ArrowLeft
              className={`transition-transform group-hover:-translate-x-0.5 ${isTV ? "w-8 h-8" : "w-6 h-6"}`}
              strokeWidth={2}
            />
          </Link>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5
                bg-black/40 backdrop-blur-sm border
                font-bold tracking-widest uppercase
                rounded-full transition-colors duration-300
                ${isTV ? "text-sm px-3.5 py-1.5" : "text-xs px-2.5 py-1"}
                ${resColor}`}
            >
              <Clapperboard className={isTV ? "w-4 h-4" : "w-3 h-3"} strokeWidth={2} />
              {videoStates.resolution}
            </div>

            <div className="text-right">
              <h1
                className={`text-white font-semibold leading-tight ${
                  isTV ? "text-3xl" : "text-lg min-[865px]:text-2xl"
                }`}
              >
                {content.title}
              </h1>
              {tvShow && (
                <span className={`italic text-gray-300 ${isTV ? "text-lg" : ""}`}>
                  {`T${tvShow.season}E${tvShow.episode.episodeNumber} «${tvShow.episode.title}»`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skip Buttons */}
      <AnimatePresence>
        {skips.intro && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={Skip}
            data-focusable
            className={`absolute right-12 z-40 bg-white/90 hover:bg-white text-black font-semibold transition-colors
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white rounded
              ${isTV ? "bottom-40 px-10 py-5 text-xl" : "bottom-32 px-6 py-3"}`}
          >
            Omitir Intro
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {skips.summary && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={Skip}
            data-focusable
            className={`absolute right-12 z-40 bg-white/90 hover:bg-white text-black font-semibold transition-colors
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white rounded
              ${isTV ? "bottom-40 px-10 py-5 text-xl" : "bottom-32 px-6 py-3"}`}
          >
            Omitir Resumen
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {skips.credits && tvShow && tvShow.nextEpisode !== null && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={navigateToNextEpisode}
            data-focusable
            className={`absolute right-12 z-40 bg-white/90 hover:bg-white text-black font-semibold transition-colors
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white rounded
              ${isTV ? "bottom-40 px-12 py-6 text-xl" : "bottom-32 px-8 py-4"}`}
          >
            Siguiente Episodio
          </motion.button>
        )}
      </AnimatePresence>

      {/* BOTTOM CONTROLS */}
      <div
        ref={controlsRef}
        aria-hidden={videoStates.controlsHidden}
        className={`absolute bottom-0 inset-x-0 z-20
                   bg-linear-to-t from-black/95 via-black/50 to-transparent
                   transition-opacity duration-500
                   aria-hidden:opacity-0 aria-hidden:pointer-events-none
                   ${isTV ? "px-10 pb-10 pt-24" : "px-5 pb-5 pt-20"}`}
      >
        {/* SEEKBAR */}
        <div className={`flex items-center gap-3 ${isTV ? "mb-6" : "mb-4"}`}>
          <div className={`relative w-full group/bar ${isTV ? "h-10" : "h-8"}`}>

            {/* Track base */}
            <div
              className={`absolute top-1/2 inset-x-0 -translate-y-1/2 rounded-full bg-white/15
                          transition-all duration-150
                          ${isTV ? "h-1.5 group-hover/bar:h-2" : "h-0.75 group-hover/bar:h-1.25"}`}
            />

            {/* Buffered */}
            <div
              className={`absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white/25
                         transition-all duration-150
                         ${isTV ? "h-1.5 group-hover/bar:h-2" : "h-0.75 group-hover/bar:h-1.25"}`}
              style={{ width: `${rangeStates.buffered}%` }}
            />

            {/* Progress — rojo normal; blanco semitransparente en preview */}
            <div
              className={`absolute top-1/2 left-0 -translate-y-1/2 rounded-full transition-all duration-100
                         ${isTV ? "h-1.5 group-hover/bar:h-2" : "h-0.75 group-hover/bar:h-1.25"}
                         ${seekPreview.active ? "bg-white/60" : "bg-[#e50914]"}`}
              style={{ width: `${displayProgress}%` }}
            />

            {/* Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                         rounded-full shadow-lg pointer-events-none transition-opacity duration-150
                         ${seekPreview.active ? "bg-white opacity-100" : "bg-white opacity-0 group-hover/bar:opacity-100"}
                         ${isTV ? "w-5 h-5" : "w-3.5 h-3.5"}`}
              style={{ left: `${displayProgress}%` }}
            />

            {/* Mouse hover overlay — solo en PC */}
            {!isTV && (
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - r.left;
                  const pct = Math.min(Math.max(x / r.width, 0), 1);
                  setRangeStates((p) => ({
                    ...p,
                    hoverTime: (videoRef.current?.duration ?? 0) * pct,
                    isHovering: true,
                    hoverX: x,
                  }));
                }}
                onMouseLeave={() =>
                  setRangeStates((p) => ({ ...p, isHovering: false }))
                }
                onClick={(e) => {
                  const v = videoRef.current;
                  if (!v) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  v.currentTime =
                    Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) *
                    v.duration;
                }}
              />
            )}

            {/* Input range (accesible; navegación con teclado/D-pad en onKeyDown) */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={!Number.isNaN(videoStates.progress) ? videoStates.progress : 0}
              onChange={onSeekBar}
              onKeyDown={handleSeekbarKeyDown}
              data-focusable
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />

            {/* Tooltip hover con ratón (PC, sin preview activo) */}
            {!isTV && rangeStates.isHovering && !seekPreview.active && (
              <div className="pointer-events-none absolute inset-0 z-30">
                <div
                  className="absolute top-0 bottom-0 w-px bg-white/40"
                  style={{ left: rangeStates.hoverX }}
                />
                <div
                  className="absolute -top-9 -translate-x-1/2 bg-black/85 backdrop-blur-sm
                             text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg"
                  style={{ left: rangeStates.hoverX }}
                >
                  {fmt(rangeStates.hoverTime)}
                </div>
              </div>
            )}

            {/* Preview de seek por teclado / D-pad */}
            <AnimatePresence>
              {seekPreview.active && (
                <motion.div
                  key="seek-preview"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute inset-0 z-30"
                >
                  {/* Línea vertical en el punto destino */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/60 rounded-full"
                    style={{ left: `${seekPreview.targetProgress}%` }}
                  />
                  {/* Tooltip con tiempo destino */}
                  <div
                    className={`absolute -translate-x-1/2 bg-black/90 backdrop-blur-md
                               text-white font-semibold rounded-xl whitespace-nowrap shadow-2xl
                               border border-white/10 flex items-center gap-1.5
                               ${isTV ? "-top-16 text-xl px-5 py-2.5" : "-top-10 text-sm px-3 py-1.5"}`}
                    style={{ left: `${seekPreview.targetProgress}%` }}
                  >
                    <span className="text-white/40 text-xs">
                      {seekPreview.direction === "right" ? "▶" : "◀"}
                    </span>
                    {fmt(seekPreview.targetTime)}
                  </div>
                  {/* Hint solo en TV */}
                  {isTV && (
                    <div
                      className="absolute -top-28 -translate-x-1/2 text-white/40 text-sm whitespace-nowrap"
                      style={{ left: `${seekPreview.targetProgress}%` }}
                    >
                      Presiona Enter para ir
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tiempo actual / duración — muestra tiempo destino durante preview */}
          <div
            className={`hidden items-center gap-1 shrink-0 tabular-nums select-none
              ${isTV ? "flex text-base" : "min-[581px]:flex text-xs"}`}
          >
            <span className={`font-medium ${seekPreview.active ? "text-white" : "text-white/90"}`}>
              {displayTime}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/50">
              {videoRef.current && !Number.isNaN(videoRef.current.duration)
                ? fmt(videoRef.current.duration)
                : "--:--:--"}
            </span>
          </div>
        </div>

        {/* BUTTON ROW */}
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className={`flex items-center gap-0.5 min-[425px]:gap-1`}>
            <button
              className={iconBtn}
              onClick={togglePlay}
              data-focusable
              tabIndex={0}
              aria-label={videoStates.paused ? "Play" : "Pause"}
            >
              {videoStates.paused ? (
                <Play className={iconLg} fill="currentColor" strokeWidth={0} />
              ) : (
                <Pause className={iconLg} fill="currentColor" strokeWidth={0} />
              )}
            </button>

            <button
              className={`${iconBtn} flex gap-1.5 items-center`}
              onClick={() => seekImmediate(-10)}
              tabIndex={0}
              data-focusable
              aria-label="Retroceder 10s"
            >
              <RotateCcw className={iconSm} strokeWidth={2} />
              <span className={"text-sm"}>-10s</span>
            </button>

            <button
              className={`${iconBtn} flex gap-1.5 items-center`}
              onClick={() => seekImmediate(10)}
              tabIndex={0}
              data-focusable
              aria-label="Adelantar 10s"
            >
              <RotateCw className={iconSm} strokeWidth={2} />
              <span className={"text-sm"}>+10s</span>
            </button>

            <button
              className={iconBtn}
              onClick={toggleMute}
              tabIndex={0}
              data-focusable
              aria-label={videoStates.muted ? "Activar sonido" : "Silenciar"}
            >
              {videoStates.muted ? (
                <VolumeX className={iconSm} strokeWidth={2} />
              ) : (
                <Volume2 className={iconSm} strokeWidth={2} />
              )}
            </button>

            {/* Tiempo visible en TV siempre; en PC solo en pantallas pequeñas */}
            {isTV ? (
              <span className="text-white/60 text-base tabular-nums pl-2">
                {displayTime}
              </span>
            ) : (
              <span className="text-white/50 text-xs tabular-nums pl-1 min-[581px]:hidden">
                {videoStates.currentTime}
              </span>
            )}
          </div>

          {/* Center title */}
          <span
            className={`hidden text-white/40 tracking-wide truncate px-4
              ${isTV ? "min-[940px]:block text-base max-w-sm" : "min-[940px]:block text-sm max-w-xs"}`}
          >
            {content.title}
          </span>

          {/* Right */}
          <div className={`flex items-center ${isTV ? "gap-2" : "gap-0.5 min-[425px]:gap-1"}`}>
            {/* Siguiente Episodio */}
            {tvShow && tvShow.nextEpisode !== null && (
              <button
                className={iconBtn}
                onClick={navigateToNextEpisode}
                tabIndex={0}
                data-focusable
                aria-label="Siguiente Episodio"
              >
                <FastForward className={iconSm} strokeWidth={2} />
              </button>
            )}

            {/* PiP — solo en no-TV */}
            {!isTV && (
              <button
                onClick={togglePiP}
                className={iconBtn}
                tabIndex={0}
                aria-label={isPip ? "Salir de Picture-in-Picture" : "Picture-in-Picture"}
              >
                {isPip ? (
                  <PictureInPicture className={iconSm} strokeWidth={2} />
                ) : (
                  <PictureInPicture2 className={iconSm} strokeWidth={2} />
                )}
              </button>
            )}

            {/* Subtítulos */}
            {hasSubtitles && (
              <button
                className={`${iconBtn} ${videoStates.subtitlesOn ? "text-white" : "text-white/40"}`}
                onClick={toggleSubtitles}
                tabIndex={0}
                data-focusable
                aria-label={videoStates.subtitlesOn ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              >
                {videoStates.subtitlesOn ? (
                  <Captions className={iconSm} strokeWidth={2} />
                ) : (
                  <CaptionsOff className={iconSm} strokeWidth={2} />
                )}
              </button>
            )}

            {/* Quality Selector */}
            {qualities.length > 0 && (
              <div className="relative" ref={qualityMenuRef}>
                <button
                  className={`${iconBtn} ${qualityMenu ? "text-white bg-white/15" : ""}`}
                  onClick={() => {
                    setQualityMenu((p) => !p);
                    setQualityFocusIndex(
                      selectedQuality === null
                        ? 0
                        : qualities.findIndex((q) => q.height === selectedQuality) + 1
                    );
                  }}
                  tabIndex={0}
                  data-focusable
                  aria-label="Calidad de video"
                  aria-expanded={qualityMenu}
                >
                  <Settings
                    className={`${iconSm} transition-transform duration-300 ${qualityMenu ? "rotate-45" : ""}`}
                    strokeWidth={2}
                  />
                </button>

                <AnimatePresence>
                  {qualityMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`absolute bottom-full right-0 mb-3
                                 bg-black/95 backdrop-blur-xl border border-white/10
                                 rounded-2xl overflow-hidden shadow-2xl z-50
                                 ${isTV ? "w-64" : "w-48"}`}
                    >
                      <div
                        className={`px-4 py-3 text-white/40 font-semibold uppercase tracking-widest
                                   border-b border-white/10 ${isTV ? "text-sm" : "text-xs"}`}
                      >
                        Calidad de video
                      </div>

                      {/* Auto */}
                      <button
                        onClick={() => changeQuality(null)}
                        onMouseEnter={() => setQualityFocusIndex(0)}
                        className={`w-full flex items-center justify-between transition-colors
                                   ${isTV ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"}
                                   ${qualityFocusIndex === 0
                                     ? "bg-white/15 text-white"
                                     : "hover:bg-white/10 text-white/70 hover:text-white"}
                                   ${selectedQuality === null ? "font-semibold" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedQuality === null && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#e50914]" />
                          )}
                          <span>Automático</span>
                        </div>
                        {selectedQuality === null && (
                          <span className={`font-bold ${resColor.split(" ")[0]}`}>
                            {videoStates.resolution}
                          </span>
                        )}
                      </button>

                      {/* Calidades fijas */}
                      {qualities.map((q, idx) => {
                        const isActive = selectedQuality === q.height;
                        const isFocused = qualityFocusIndex === idx + 1;
                        return (
                          <button
                            key={q.height}
                            onClick={() => changeQuality(q.height)}
                            onMouseEnter={() => setQualityFocusIndex(idx + 1)}
                            className={`w-full flex items-center justify-between transition-colors
                                       ${isTV ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"}
                                       ${isFocused
                                         ? "bg-white/15 text-white"
                                         : "hover:bg-white/10 text-white/70 hover:text-white"}
                                       ${isActive ? "font-semibold" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#e50914]" />
                              )}
                              <span>{qualityLabel(q.height)}</span>
                            </div>
                            <span className="text-white/30 text-xs">
                              {(q.bitrate / 1_000_000).toFixed(1)} Mbps
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Fullscreen — solo en no-TV */}
            {!isTV && (
              <button
                className={iconBtn}
                onClick={toggleFullscreen}
                tabIndex={0}
                aria-label={videoStates.fullscreen ? "Salir pantalla completa" : "Pantalla completa"}
              >
                {videoStates.fullscreen ? (
                  <Minimize2 className={iconSm} strokeWidth={2} />
                ) : (
                  <Maximize2 className={iconSm} strokeWidth={2} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;