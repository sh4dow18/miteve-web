"use client";

import { API_HOST_IP, STREAM_HOST_IP } from "@/services/admin";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clapperboard,
  FastForward,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture,
  PictureInPicture2,
  Play,
  Rewind,
  RotateCcw,
  RotateCw,
  Subtitles,
  SubtitlesIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    AndroidApp?: {
      isAndroidApp: () => boolean;
    };
  }
}

interface Props {
  content: Content;
  tvShow?: {
    season: number;
    episode: EpisodeMetadata;
    nextEpisode: NextEpisode | null;
  };
}

function Player({ content, tvShow }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shakaPlayerRef = useRef<any>(null);

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
    resolution: "HD",
    subtitlesOn: true,
  });

  const [rangeStates, setRangeStates] = useState({
    hoverTime: 0,
    isHovering: false,
    hoverX: 0,
    buffered: 0,
  });
  const [isPip, setIsPiP] = useState(false);
  const [skips, SetSkips] = useState({
    summary: false,
    intro: false,
    credits: false,
  });
  const togglePiP = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      // Si ya está en PiP → salir
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        // Entrar en PiP
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      console.error("Error con PiP:", error);
    }
  };
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (tvShow === undefined) {
      return;
    }
    // Function that allow to display and hide the skips buttons
    const ManageSkips = () => {
      const CURRENT_TIME = VIDEO.currentTime;
      const BEGIN_SUMMARY = tvShow.episode.beginSummary;
      const END_SUMMARY = tvShow.episode.endSummary;
      const BEGIN_INTRO = tvShow.episode.beginIntro;
      const END_INTRO = tvShow.episode.endIntro;
      const BEGIN_CREDITS = tvShow.episode.beginCredits;
      SetSkips({
        summary:
          BEGIN_SUMMARY !== null && END_SUMMARY !== null
            ? CURRENT_TIME > BEGIN_SUMMARY && CURRENT_TIME < END_SUMMARY
            : false,
        intro:
          BEGIN_INTRO !== null && END_INTRO !== null
            ? CURRENT_TIME > BEGIN_INTRO && CURRENT_TIME < END_INTRO
            : false,
        credits: BEGIN_CREDITS !== null ? CURRENT_TIME > BEGIN_CREDITS : false,
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
    const loadVideo = async () => {
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
        .catch(() => {
          ip = API_HOST_IP;
        })
        .finally(async () => {
          clearTimeout(timeout);
          const src = `${STREAM_HOST_IP}/${API}`;
          const loadWithRetry = async (attempts = 3, delay = 1500) => {
            for (let i = 0; i < attempts; i++) {
              try {
                const shaka = await import(
                  "shaka-player/dist/shaka-player.compiled"
                );
                shaka.default.polyfill.installAll();
                if (!shaka.default.Player.isBrowserSupported()) {
                  setVideoStates((p) => ({
                    ...p,
                    paused: true,
                    waiting: false,
                  }));
                  return;
                }
                if (shakaPlayerRef.current)
                  await shakaPlayerRef.current.destroy();

                const player = new shaka.default.Player(VIDEO);
                shakaPlayerRef.current = player;

                // ── Calidad en tiempo real ──────────────────────────────────
                player.addEventListener("adaptation", () => {
                  const track = player
                    .getVariantTracks()
                    .find((t: { active: boolean }) => t.active);
                  if (!track) return;
                  const height = track.height ?? 0;
                  let label = "SD";
                  if (height > 720) {
                    label = "FHD";
                  }
                  setVideoStates((p) => ({ ...p, resolution: label }));
                });

                player.addEventListener("error", (e: unknown) => {
                  console.warn("Shaka player error", e);
                });

                await player.load(src);
                // Esperar a que el video tenga metadatos antes de hacer seek
                await new Promise<void>((resolve) => {
                  if (VIDEO.readyState >= 1) {
                    resolve();
                  } else {
                    VIDEO.addEventListener("loadedmetadata", () => resolve(), {
                      once: true,
                    });
                  }
                });
                if (tvShow !== undefined) {
                  const { beginSummary, endSummary, beginIntro, endIntro } =
                    tvShow.episode;
                  if (
                    beginSummary === 0 &&
                    endSummary !== null &&
                    beginIntro === endSummary + 1 &&
                    endIntro != null
                  ) {
                    VIDEO.currentTime = endIntro;
                  } else if (
                    beginIntro === 0 &&
                    endIntro !== null &&
                    beginSummary === endIntro + 1 &&
                    endSummary != null
                  ) {
                    VIDEO.currentTime = endSummary;
                  } else if (beginSummary === 0 && endSummary != null) {
                    VIDEO.currentTime = endSummary;
                  } else if (beginIntro === 0 && endIntro != null) {
                    VIDEO.currentTime = endIntro;
                  }
                }

                // Resolución inicial tras cargar
                const track = player
                  .getVariantTracks()
                  .find((t: { active: boolean }) => t.active);
                if (track?.height) {
                  const h = track.height;
                  const label = h > 720 ? "FHD" : "SD";
                  setVideoStates((p) => ({ ...p, resolution: label }));
                }

                VIDEO.play()
                  .then(() =>
                    setVideoStates((p) => ({
                      ...p,
                      paused: false,
                      waiting: false,
                    }))
                  )
                  .catch(() =>
                    setVideoStates((p) => ({
                      ...p,
                      paused: true,
                      waiting: false,
                    }))
                  );

                return; // éxito
              } catch (e) {
                console.warn(`Shaka intento ${i + 1} fallido`, e);
                if (i < attempts - 1) {
                  await new Promise((res) => setTimeout(res, delay));
                } else {
                  console.error("Shaka error tras todos los intentos", e);
                  setVideoStates((p) => ({
                    ...p,
                    paused: true,
                    waiting: false,
                  }));
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

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  function isTVOrAndroid() {
    if (typeof window === "undefined") return false;
    if (window.AndroidApp?.isAndroidApp()) return true;
    return navigator.userAgent.toLowerCase().includes("aft");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tv = isTVOrAndroid();
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
          toggleSubtitles();
          break;
        case "ArrowRight":
          if (!tv) seek(10);
          break;
        case "ArrowLeft":
          if (!tv) seek(-10);
          break;
        case " ":
          togglePlay();
          break;
      }
    };
    const onFS = () =>
      setVideoStates((p) => ({
        ...p,
        fullscreen: !!document.fullscreenElement,
      }));
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFS);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFS);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Controls auto-hide ──────────────────────────────────────────────────────
  useEffect(() => {
    const C = containerRef.current;
    const CTR = controlsRef.current;
    if (!C || !CTR) return;
    let timer: NodeJS.Timeout;

    const hide = () => setVideoStates((p) => ({ ...p, controlsHidden: true }));
    const show = () => {
      setVideoStates((p) => ({ ...p, controlsHidden: false }));
      clearTimeout(timer);
      if (videoStates.paused) return;
      if (!CTR.contains(document.activeElement)) timer = setTimeout(hide, 5000);
    };

    C.addEventListener("mousemove", show);
    C.addEventListener("keydown", show);
    C.addEventListener("focusin", show);
    C.addEventListener("touchstart", show);
    videoStates.paused ? show() : (timer = setTimeout(hide, 5000));

    return () => {
      clearTimeout(timer);
      C.removeEventListener("mousemove", show);
      C.removeEventListener("keydown", show);
      C.removeEventListener("focusin", show);
      C.removeEventListener("touchstart", show);
    };
  }, [videoStates.paused]);

  // ─── Buffer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (!VIDEO) return;
    const update = () => {
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

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const togglePlay = () => {
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

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoStates((p) => ({ ...p, muted: v.muted }));
  };

  // ── Fullscreen fix: no tocar style inline, dejar que fixed inset-0 del padre maneje el tamaño ──
  const toggleFullscreen = () => {
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

  const seek = (secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + secs), v.duration);
  };

  const toggleSubtitles = () => {
    const v = videoRef.current;
    if (!v || !v.textTracks[0]) return;
    const on = v.textTracks[0].mode === "showing";
    v.textTracks[0].mode = on ? "disabled" : "showing";
    setVideoStates((p) => ({ ...p, subtitlesOn: !on }));
  };

  const fmt = (t: number) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  const onSeekBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
    setVideoStates((p) => ({ ...p, currentTime: fmt(v.currentTime) }));
  };

  const handleTVNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-focusable]")
    );
    const i = els.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      els[i + 1]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      els[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      seek(-10);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seek(10);
    }
  };

  const iconBtn =
    "cursor-pointer p-2 rounded-full transition-all duration-150 text-white/70 hover:text-white hover:bg-white/10 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  // ── Colores por calidad ───────────────────────────────────────────────────────
  const resolutionColor: Record<string, string> = {
    FHD: "text-blue-400 border-blue-400/40",
    SD: "text-orange-400 border-orange-400/40",
  };
  const resColor =
    resolutionColor[videoStates.resolution] ?? "text-white/60 border-white/15";
  const Skip = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (tvShow === undefined) {
      return;
    }
    if (skips.summary === true && tvShow.episode.endSummary !== null) {
      VIDEO.currentTime = tvShow.episode.endSummary;
      SetSkips({
        ...skips,
        summary: false,
      });
    }
    if (skips.intro === true && tvShow.episode.endIntro !== null) {
      VIDEO.currentTime = tvShow.episode.endIntro;
      SetSkips({
        ...skips,
        intro: false,
      });
    }
  };
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
          className="h-12 w-12 text-white/50 animate-spin"
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
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft
              className="w-6 h-6 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </Link>

          {/* Título + badge de calidad juntos arriba a la derecha */}
          <div className="flex items-center gap-3">
            {/* Badge calidad — visible siempre cuando los controles están visibles */}
            <div
              className={`flex items-center gap-1.5
                bg-black/40 backdrop-blur-sm border
                text-xs font-bold tracking-widest uppercase
                px-2.5 py-1 rounded-full transition-colors duration-300
                ${resColor}`}
            >
              <Clapperboard className="w-3 h-3" strokeWidth={2} />
              {videoStates.resolution}
            </div>

            <div className="text-right">
              <h1 className="text-white font-semibold text-lg leading-tight min-[865px]:text-2xl">
                {content.title}
              </h1>
              {tvShow && (
                <span className="italic text-gray-300">{`T${tvShow.season}E${tvShow.episode.episodeNumber} «${tvShow.episode.title}»`}</span>
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
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-semibold transition-colors z-40"
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
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-semibold transition-colors z-40"
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
            onClick={() =>
              router.push(
                `/player/${content.id}?season=${tvShow.nextEpisode?.seasonNumber}&episode=${tvShow.nextEpisode?.episodeNumber}`
              )
            }
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-8 py-4 rounded font-semibold transition-colors z-40"
          >
            Siguiente Episodio
          </motion.button>
        )}
      </AnimatePresence>

      {/* BOTTOM CONTROLS */}
      <div
        ref={controlsRef}
        aria-hidden={videoStates.controlsHidden}
        className="absolute bottom-0 inset-x-0 z-20
                   bg-linear-to-t from-black/95 via-black/50 to-transparent
                   px-5 pb-5 pt-20
                   transition-opacity duration-500
                   aria-hidden:opacity-0 aria-hidden:pointer-events-none"
      >
        {/* SEEKBAR */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full h-8 group/bar">
            <div
              className="absolute top-1/2 inset-x-0 h-0.75 -translate-y-1/2 rounded-full bg-white/15
                            group-hover/bar:h-1.25 transition-all duration-150"
            />
            <div
              className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-white/25
                         group-hover/bar:h-1.25 transition-all duration-150"
              style={{ width: `${rangeStates.buffered}%` }}
            />
            <div
              className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-[#e50914]
                         group-hover/bar:h-1.25 transition-all duration-150"
              style={{ width: `${videoStates.progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5
                         rounded-full bg-white shadow-lg pointer-events-none
                         opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150"
              style={{ left: `${videoStates.progress}%` }}
            />
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - r.left;
                const pct = Math.min(Math.max(x / r.width, 0), 1);
                setRangeStates((p) => ({
                  ...p,
                  hoverTime: (videoRef.current?.duration || 0) * pct,
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
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={
                !Number.isNaN(videoStates.progress) ? videoStates.progress : 0
              }
              onChange={onSeekBar}
              onKeyDown={handleTVNav}
              data-focusable
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />
            {rangeStates.isHovering && (
              <div className="pointer-events-none absolute inset-0 z-30">
                <div
                  className="absolute top-0 bottom-0 w-px bg-white/50"
                  style={{ left: rangeStates.hoverX }}
                />
                <div
                  className="absolute -top-8 -translate-x-1/2 bg-black/80 backdrop-blur-sm
                             text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  style={{ left: rangeStates.hoverX }}
                >
                  {fmt(rangeStates.hoverTime)}
                </div>
              </div>
            )}
          </div>

          <div className="hidden min-[581px]:flex items-center gap-1 shrink-0 tabular-nums text-xs select-none">
            <span className="text-white/80">{videoStates.currentTime}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">
              {videoRef.current && !Number.isNaN(videoRef.current.duration)
                ? fmt(videoRef.current.duration)
                : "--:--:--"}
            </span>
          </div>
        </div>

        {/* BUTTON ROW */}
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-0.5 min-[425px]:gap-1">
            <button
              className={iconBtn}
              onClick={togglePlay}
              data-focusable
              tabIndex={0}
              aria-label={videoStates.paused ? "Play" : "Pause"}
            >
              {videoStates.paused ? (
                <Play
                  className="w-7 h-7 min-[865px]:w-9 min-[865px]:h-9"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ) : (
                <Pause
                  className="w-7 h-7 min-[865px]:w-9 min-[865px]:h-9"
                  fill="currentColor"
                  strokeWidth={0}
                />
              )}
            </button>

            <button
              className={`${iconBtn} flex gap-1 items-center`}
              onClick={() => seek(-10)}
              tabIndex={0}
              aria-label="Retroceder 10s"
            >
              <RotateCcw
                className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                strokeWidth={2}
              />
              <span className="text-sm">-10s</span>
            </button>

            <button
              className={`${iconBtn} flex gap-1 items-center`}
              onClick={() => seek(10)}
              tabIndex={0}
              aria-label="Adelantar 10s"
            >
              <RotateCw
                className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                strokeWidth={2}
              />
              <span className="text-sm">-10s</span>
            </button>

            <button
              className={iconBtn}
              onClick={toggleMute}
              tabIndex={0}
              aria-label={videoStates.muted ? "Activar sonido" : "Silenciar"}
            >
              {videoStates.muted ? (
                <VolumeX
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <Volume2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              )}
            </button>

            <span className="text-white/50 text-xs tabular-nums pl-1 min-[581px]:hidden">
              {videoStates.currentTime}
            </span>
          </div>

          {/* Center title */}
          <span className="hidden min-[940px]:block text-white/40 text-sm tracking-wide truncate max-w-xs px-4">
            {content.title}
          </span>

          {/* Right */}
          <div className="flex items-center gap-0.5 min-[425px]:gap-1">
            {tvShow && tvShow.nextEpisode !== null && (
              <button
                className={`${iconBtn} flex gap-1 items-center`}
                onClick={() =>
                  router.push(
                    `/player/${content.id}?season=${tvShow.nextEpisode?.seasonNumber}&episode=${tvShow.nextEpisode?.episodeNumber}`
                  )
                }
                tabIndex={0}
                aria-label="Siguiente Episodio"
              >
                <FastForward
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              </button>
            )}
            <button
              onClick={togglePiP}
              className={iconBtn}
              tabIndex={0}
              aria-label={
                isPip
                  ? "Activar Picture-in-Picture"
                  : "Desactivar Picture-in-Picture"
              }
            >
              {isPip ? (
                <PictureInPicture
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <PictureInPicture2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              )}
            </button>
            <button
              className={iconBtn}
              onClick={toggleSubtitles}
              tabIndex={0}
              aria-label={
                videoStates.subtitlesOn
                  ? "Ocultar subtítulos"
                  : "Mostrar subtítulos"
              }
            >
              {videoStates.subtitlesOn ? (
                <Subtitles
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <SubtitlesIcon
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6 opacity-35"
                  strokeWidth={2}
                />
              )}
            </button>

            <button
              className={iconBtn}
              onClick={toggleFullscreen}
              tabIndex={0}
              aria-label={
                videoStates.fullscreen
                  ? "Salir pantalla completa"
                  : "Pantalla completa"
              }
            >
              {videoStates.fullscreen ? (
                <Minimize2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <Maximize2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
