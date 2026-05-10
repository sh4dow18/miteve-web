"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP, STREAM_HOST_IP } from "@/shared/config/env";
import { Content, EpisodeMetadata, NextEpisode } from "@/entities/content/model/types";
import { getPlayerData } from "@/features/player/model/getPlayerData";

declare global {
  interface Window {
    AndroidApp?: {
      isAndroidApp: () => boolean;
    };
  }
}

interface UsePlayerParams {
  content?: Content | null;
  tvShow?: {
    season: number;
    episode: EpisodeMetadata;
    nextEpisode: NextEpisode | null;
  };
}

interface UsePlayerPageDataParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export type PlayerData = Awaited<globalThis.ReturnType<typeof getPlayerData>>;

export function usePlayerPageData({
  params,
  searchParams,
}: UsePlayerPageDataParams) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);
  const lastRouteKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      const requestId = ++requestIdRef.current;
      const [resolvedParams, resolvedSearchParams] = await Promise.all([
        params,
        searchParams,
      ]);

      const routeKey = [
        resolvedParams.id,
        resolvedSearchParams.season ?? "",
        resolvedSearchParams.episode ?? "",
      ].join("|");

      if (lastRouteKeyRef.current === routeKey) {
        return;
      }

      setIsLoading(true);

      const playerData = await getPlayerData(
        resolvedParams.id,
        resolvedSearchParams
      );

      if (!isActive || requestId !== requestIdRef.current) return;

      lastRouteKeyRef.current = routeKey;
      setData(playerData);
      setIsLoading(false);
    };

    void loadData();

    return () => {
      isActive = false;
    };
  }, [params, searchParams]);

  return {
    data,
    isLoading,
  };
}

function getSubtitleTrack(video: HTMLVideoElement): TextTrack | null {
  for (let i = 0; i < video.textTracks.length; i++) {
    const t = video.textTracks[i];
    if (t.kind === "subtitles" || t.kind === "captions") return t;
  }
  return null;
}

function enableSubtitles(video: HTMLVideoElement) {
  for (let i = 0; i < video.textTracks.length; i++) {
    const t = video.textTracks[i];
    if (t.kind === "subtitles" || t.kind === "captions") {
      t.mode = "showing";
    } else {
      t.mode = "disabled";
    }
  }
}

function disableSubtitles(video: HTMLVideoElement) {
  for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = "hidden";
  }
}

export type UsePlayerReturn = {
  qualityMenuOpen: boolean;
  qualityMenuRef: RefObject<HTMLDivElement | null>;
  qualityButtonRef: RefObject<HTMLButtonElement | null>;
  playButtonRef: RefObject<HTMLButtonElement | null>;
  qualityFocusedIndex: number;
  isAutoQuality: boolean;
  qualityOptions: Array<{
    id: number;
    label: string;
    bitrateText: string;
    isActive: boolean;
  }>;
  videoRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  controlsRef: RefObject<HTMLDivElement | null>;
  videoStates: {
    paused: boolean;
    muted: boolean;
    fullscreen: boolean;
    controlsHidden: boolean;
    currentTime: string;
    duration: string;
    progress: number;
    waiting: boolean;
    resolution: string;
    subtitlesOn: boolean;
    volume: number;
  };
  rangeStates: {
    hoverTime: number;
    isHovering: boolean;
    hoverX: number;
    hoverPercent: number;
    buffered: number;
  };
  seekPreviewPercent: number | null;
  volumeFeedback: {
    visible: boolean;
    value: number;
  };
  isPip: boolean;
  hasSubtitles: boolean;
  skips: {
    summary: boolean;
    intro: boolean;
    credits: boolean;
  };
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  seek: (secs: number) => void;
  toggleSubtitles: () => void;
  togglePiP: () => Promise<void>;
  onVolumeBarChange: (e: ReactChangeEvent<HTMLInputElement>) => void;
  onSeekBar: (e: ReactChangeEvent<HTMLInputElement>) => void;
  onSeekBarMouseMove: (e: ReactMouseEvent<HTMLElement>) => void;
  onSeekBarMouseLeave: () => void;
  onSeekBarTrackClick: (e: ReactMouseEvent<HTMLElement>) => void;
  handleTVNav: (e: ReactKeyboardEvent<HTMLInputElement | HTMLButtonElement>) => void;
  toggleQualityMenu: () => void;
  onToggleQualityMenu: () => void;
  closeQualityMenu: () => void;
  selectAutoQuality: () => void;
  selectQuality: (qualityId: number) => void;
  navigateToNextEpisode: () => void;
  skip: () => void;
  fmt: (t: number) => string;
  isTVOrAndroid: () => boolean;
};

type ShakaPlayer = {
  destroy: () => Promise<void> | void;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
  getVariantTracks: () => VariantTrack[];
  load: (source: string) => Promise<void>;
};

type QualityCapablePlayer = ShakaPlayer & {
  configure: (config: { abr: { enabled: boolean } }) => void;
  selectVariantTrack: (
    track: VariantTrack,
    clearBuffer?: boolean,
    safeMargin?: number
  ) => void;
};

type VariantTrack = {
  id: number;
  active: boolean;
  bandwidth: number;
  height: number | null;
  type: string;
};

type QualityOption = {
  id: number;
  label: string;
  bitrateText: string;
  isActive: boolean;
};

function formatHms(t: number) {
  const safe = Number.isFinite(t) && t > 0 ? t : 0;
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = Math.floor(safe % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

export function usePlayer({
  content,
  tvShow,
}: UsePlayerParams): UsePlayerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const shakaPlayerRef = useRef<ShakaPlayer | null>(null);

  const [videoStates, setVideoStates] = useState({
    paused: true,
    muted: false,
    fullscreen: false,
    controlsHidden: false,
    currentTime: "00:00:00",
    duration: "00:00:00",
    progress: 0,
    waiting: true,
    resolution: "HD",
    subtitlesOn: true,
    volume: 100,
  });
  const lastVolumeRef = useRef(1);

  const [rangeStates, setRangeStates] = useState({
    hoverTime: 0,
    isHovering: false,
    hoverX: 0,
    hoverPercent: 0,
    buffered: 0,
  });

  const [isPip, setIsPiP] = useState(false);
  const [volumeFeedback, setVolumeFeedback] = useState({
    visible: false,
    value: 100,
  });
  const volumeFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [isAutoQuality, setIsAutoQuality] = useState(true);
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
  const qualityMenuRef = useRef<HTMLDivElement | null>(null);
  const qualityButtonRef = useRef<HTMLButtonElement | null>(null);
  const playButtonRef = useRef<HTMLButtonElement | null>(null);
  const [qualityFocusedIndex, setQualityFocusedIndex] = useState(0);
  const [seekPreviewPercent, setSeekPreviewPercent] = useState<number | null>(
    null
  );
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const navigatingRef = useRef(false);
  const loadRequestIdRef = useRef(0);
  const [skips, setSkips] = useState({
    summary: false,
    intro: false,
    credits: false,
  });

  const syncQualityState = useCallback((tracks: VariantTrack[]) => {
    const variantTracks = tracks.filter((track) => track.type === "variant");
    const tracksByHeight = new Map<number, VariantTrack>();

    for (const track of variantTracks) {
      if (track.height === null) continue;
      const previous = tracksByHeight.get(track.height);
      if (!previous || track.bandwidth > previous.bandwidth) {
        tracksByHeight.set(track.height, track);
      }
    }

    const sortedTracks = Array.from(tracksByHeight.values()).sort(
      (a, b) => (b.height ?? 0) - (a.height ?? 0)
    );

    const activeTrack = variantTracks.find((track) => track.active);

    const nextOptions: QualityOption[] = sortedTracks.map((track) => ({
      id: track.id,
      label: `${track.height ?? 0}p`,
      bitrateText: `${(track.bandwidth / 1_000_000).toFixed(1)} Mbps`,
      isActive: track.id === activeTrack?.id,
    }));

    setQualityOptions(nextOptions);

    const activeHeight = activeTrack?.height;
    if (typeof activeHeight === "number") {
      setVideoStates((prev) => ({
        ...prev,
        resolution: activeHeight > 720 ? "FHD" : "SD",
      }));
    }
  }, []);

  async function speedTest(): Promise<number> {
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

  useEffect(() => {
    navigatingRef.current = false;
  }, [content?.id, tvShow?.episode.episodeNumber, tvShow?.season]);

  const navigateToNextEpisode = () => {
    if (navigatingRef.current || !tvShow?.nextEpisode || !content) return;
    navigatingRef.current = true;
    setSkips((p) => ({ ...p, credits: false }));
    router.push(
      `/player/${content.id}?season=${tvShow.nextEpisode.seasonNumber}&episode=${tvShow.nextEpisode.episodeNumber}`
    );
  };

  const togglePiP = async () => {
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

  const setVolumePercent = (nextPercent: number) => {
    const v = videoRef.current;
    if (!v) return;

    const normalized = Math.min(Math.max(nextPercent, 0), 100);
    const nextVolume = normalized / 100;
    v.volume = nextVolume;
    v.muted = nextVolume === 0;

    if (nextVolume > 0) {
      lastVolumeRef.current = nextVolume;
    }
  };

  const showVolumeFeedback = (value: number) => {
    if (volumeFeedbackTimeoutRef.current) {
      clearTimeout(volumeFeedbackTimeoutRef.current);
    }

    setVolumeFeedback({ visible: true, value });

    volumeFeedbackTimeoutRef.current = setTimeout(() => {
      setVolumeFeedback((prev) => ({ ...prev, visible: false }));
    }, 1200);
  };

  const adjustVolumeByStep = (deltaPercent: number) => {
    const v = videoRef.current;
    if (!v) return;

    const currentPercent = Math.round(v.volume * 100);
    const nextPercent = Math.min(Math.max(currentPercent + deltaPercent, 0), 100);
    setVolumePercent(nextPercent);
    showVolumeFeedback(nextPercent);
  };

  const onVolumeBarChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    setVolumePercent(parseFloat(e.target.value));
  };

  const toggleQualityMenu = () => {
    setQualityMenuOpen((prev) => !prev);
  };

  const closeQualityMenu = () => {
    setQualityMenuOpen(false);
  };

  const totalQualityItems = qualityOptions.length + 1;

  const getInitialFocusedQualityIndex = () => {
    if (isAutoQuality) return 0;
    const selectedIndex = qualityOptions.findIndex((quality) => quality.isActive);
    return selectedIndex >= 0 ? selectedIndex + 1 : 0;
  };

  const onToggleQualityMenu = () => {
    if (!qualityMenuOpen) {
      setQualityFocusedIndex(getInitialFocusedQualityIndex());
    }
    toggleQualityMenu();
  };

  const selectAutoQuality = useCallback(() => {
    const player = shakaPlayerRef.current as QualityCapablePlayer | null;
    if (!player) return;
    player.configure({ abr: { enabled: true } });
    setIsAutoQuality(true);
    setQualityMenuOpen(false);
    syncQualityState(player.getVariantTracks());
  }, [syncQualityState]);

  const selectQuality = useCallback((qualityId: number) => {
    const player = shakaPlayerRef.current as QualityCapablePlayer | null;
    if (!player) return;

    const tracks = player.getVariantTracks();
    const selectedTrack = tracks.find((track) => track.id === qualityId);
    if (!selectedTrack) return;

    player.configure({ abr: { enabled: false } });
    player.selectVariantTrack(selectedTrack, true);
    setIsAutoQuality(false);
    setQualityMenuOpen(false);
    syncQualityState(player.getVariantTracks());
  }, [syncQualityState]);

  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null || tvShow === undefined) return;
    const manageSkips = () => {
      if (navigatingRef.current) return;
      const CURRENT_TIME = VIDEO.currentTime;
      const { beginSummary, endSummary, beginIntro, endIntro, beginCredits } =
        tvShow.episode;
      setSkips({
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
    VIDEO.addEventListener("timeupdate", manageSkips);
    VIDEO.addEventListener("seeked", manageSkips);
    return () => {
      VIDEO.removeEventListener("timeupdate", manageSkips);
      VIDEO.removeEventListener("seeked", manageSkips);
    };
  }, [tvShow]);

  useEffect(() => {
    if (!qualityMenuOpen) return;

    const onPointerDownOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedMenu = qualityMenuRef.current?.contains(target) ?? false;
      const clickedButton = qualityButtonRef.current?.contains(target) ?? false;

      if (!clickedMenu && !clickedButton) {
        closeQualityMenu();
      }
    };

    document.addEventListener("mousedown", onPointerDownOutside);
    document.addEventListener("touchstart", onPointerDownOutside, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousedown", onPointerDownOutside);
      document.removeEventListener("touchstart", onPointerDownOutside);
    };
  }, [qualityMenuOpen]);

  useEffect(() => {
    if (!qualityMenuOpen) return;

    const onQualityMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setQualityFocusedIndex((prev) => (prev + 1) % totalQualityItems);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setQualityFocusedIndex((prev) =>
          prev === 0 ? totalQualityItems - 1 : prev - 1
        );
        return;
      }

      if (event.key !== "Enter") return;
      event.preventDefault();

      if (qualityFocusedIndex === 0) {
        selectAutoQuality();
        return;
      }

      const selectedQuality = qualityOptions[qualityFocusedIndex - 1];
      if (!selectedQuality) return;
      selectQuality(selectedQuality.id);
    };

    document.addEventListener("keydown", onQualityMenuKeyDown);
    return () => document.removeEventListener("keydown", onQualityMenuKeyDown);
  }, [
    qualityMenuOpen,
    qualityFocusedIndex,
    qualityOptions,
    totalQualityItems,
    selectAutoQuality,
    selectQuality,
  ]);

  // ─── Shaka init + source load ────────────────────────────────────────────────
  useEffect(() => {
    const requestId = ++loadRequestIdRef.current;
    const isCurrentRequest = () => requestId === loadRequestIdRef.current;

    const loadVideo = async () => {
      if (!videoRef.current || !content) return;
      const VIDEO = videoRef.current;

      const speed = await speedTest();
      if (!isCurrentRequest()) return;

      const slow = speed < 4;
      const lowQ = videoStates.resolution === "SD" || slow;

      const API = `${
        tvShow
          ? `${content.id}/season-${tvShow.season}/episode-${tvShow.episode.episodeNumber}`
          : content.id
      }/manifest.mpd`;
      setIsAutoQuality(true);
      setQualityMenuOpen(false);
      setQualityOptions([]);
      setVideoStates((p) => ({ ...p, resolution: lowQ ? "SD" : "HD" }));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      let ip = API_HOST_IP;

      fetch(`${ip}/${API}`, { method: "HEAD", signal: controller.signal })
        .catch(() => {
          ip = API_HOST_IP;
        })
        .finally(async () => {
          if (!isCurrentRequest()) return;
          clearTimeout(timeout);
          const src = `${STREAM_HOST_IP}/${API}`;

          const loadWithRetry = async (attempts = 3, delay = 1500) => {
            for (let i = 0; i < attempts; i++) {
              if (!isCurrentRequest()) return;

              try {
                const shaka = await import(
                  "shaka-player/dist/shaka-player.compiled"
                );
                if (!isCurrentRequest()) return;

                shaka.default.polyfill.installAll();
                if (!shaka.default.Player.isBrowserSupported()) {
                  if (!isCurrentRequest()) return;
                  setVideoStates((p) => ({
                    ...p,
                    paused: true,
                    waiting: false,
                  }));
                  return;
                }
                if (!isCurrentRequest()) return;

                if (shakaPlayerRef.current)
                  await shakaPlayerRef.current.destroy();

                if (!isCurrentRequest()) return;

                const player = new shaka.default.Player(VIDEO);
                shakaPlayerRef.current = player;
                if (!isCurrentRequest()) {
                  await player.destroy();
                  return;
                }

                // ── Calidad en tiempo real ──────────────────────────────────
                player.addEventListener("adaptation", () => {
                  if (!isCurrentRequest()) return;
                  const tracks = player.getVariantTracks();
                  const track = tracks.find((t) => t.active);
                  if (!track) return;
                  setVideoStates((p) => ({
                    ...p,
                    resolution: (track.height ?? 0) > 720 ? "FHD" : "SD",
                  }));
                  syncQualityState(tracks);
                });

                player.addEventListener("error", (e: unknown) => {
                  console.warn("Shaka player error", e);
                });

                await player.load(src);
                if (!isCurrentRequest()) return;

                // Esperar metadatos antes de hacer seek
                await new Promise<void>((resolve) => {
                  if (VIDEO.readyState >= 1) resolve();
                  else
                    VIDEO.addEventListener("loadedmetadata", () => resolve(), {
                      once: true,
                    });
                });

                // ── Auto-activar subtítulos ─────────────────────────────────
                // Intentar activar inmediatamente
                const subtitleTrack = getSubtitleTrack(VIDEO);
                if (subtitleTrack) {
                  enableSubtitles(VIDEO);
                  setHasSubtitles(true);
                  setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                } else {
                  // Shaka puede tardar un tick en añadir los tracks
                  const trackTimeoutRef = { current: null as NodeJS.Timeout | null };
                  const onTrackAdded = () => {
                    const t = getSubtitleTrack(VIDEO);
                    if (t) {
                      enableSubtitles(VIDEO);
                      setHasSubtitles(true);
                      setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                      VIDEO.textTracks.removeEventListener(
                        "addtrack",
                        onTrackAdded
                      );
                      if (trackTimeoutRef.current) {
                        clearTimeout(trackTimeoutRef.current);
                      }
                    }
                  };
                  VIDEO.textTracks.addEventListener("addtrack", onTrackAdded);
                  // Si en 3s no aparece ningún track, este contenido no tiene subs
                  trackTimeoutRef.current = setTimeout(() => {
                    VIDEO.textTracks.removeEventListener(
                      "addtrack",
                      onTrackAdded
                    );
                    setHasSubtitles(false);
                    setVideoStates((p) => ({ ...p, subtitlesOn: false }));
                  }, 3000);
                }

                // Skip intro/summary al inicio
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

                // Resolución inicial
                const tracks = player.getVariantTracks();
                syncQualityState(tracks);

                const track = tracks.find((t) => t.active);
                if (track?.height) {
                  setVideoStates((p) => ({
                    ...p,
                    resolution:
                      track.height !== null && track.height > 720
                        ? "FHD"
                        : "SD",
                  }));
                }

                VIDEO.play()
                  .then(() =>
                    isCurrentRequest() &&
                    setVideoStates((p) => ({
                      ...p,
                      paused: false,
                      waiting: false,
                    }))
                  )
                  .catch(() =>
                    isCurrentRequest() &&
                    setVideoStates((p) => ({
                      ...p,
                      paused: true,
                      waiting: false,
                    }))
                  );

                return;
              } catch (e) {
                if (!isCurrentRequest()) return;
                console.warn(`Shaka intento ${i + 1} fallido`, e);
                if (i < attempts - 1) {
                  await new Promise((res) => setTimeout(res, delay));
                } else {
                  if (!isCurrentRequest()) return;
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
      loadRequestIdRef.current += 1;
      shakaPlayerRef.current?.destroy();
      shakaPlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    const VIDEO = videoRef.current;
    if (!VIDEO) return;

    const syncTimeline = () => {
      const duration = Number.isFinite(VIDEO.duration) ? VIDEO.duration : 0;
      const current = Number.isFinite(VIDEO.currentTime) ? VIDEO.currentTime : 0;
      setVideoStates((p) => ({
        ...p,
        currentTime: formatHms(current),
        duration: formatHms(duration),
        progress: duration > 0 ? (current / duration) * 100 : 0,
      }));
    };

    const onWaiting = () => setVideoStates((p) => ({ ...p, waiting: true }));
    const onCanPlay = () => setVideoStates((p) => ({ ...p, waiting: false }));
    const onPlay = () => setVideoStates((p) => ({ ...p, paused: false }));
    const onPause = () =>
      setVideoStates((p) => ({ ...p, paused: true, controlsHidden: false }));
    const onVolumeChange = () => {
      const volumePercent = Math.round(VIDEO.volume * 100);
      if (VIDEO.volume > 0) {
        lastVolumeRef.current = VIDEO.volume;
      }
      setVideoStates((p) => ({
        ...p,
        muted: VIDEO.muted || volumePercent === 0,
        volume: volumePercent,
      }));
    };

    VIDEO.addEventListener("timeupdate", syncTimeline);
    VIDEO.addEventListener("loadedmetadata", syncTimeline);
    VIDEO.addEventListener("durationchange", syncTimeline);
    VIDEO.addEventListener("seeked", syncTimeline);
    VIDEO.addEventListener("waiting", onWaiting);
    VIDEO.addEventListener("canplay", onCanPlay);
    VIDEO.addEventListener("playing", onCanPlay);
    VIDEO.addEventListener("play", onPlay);
    VIDEO.addEventListener("pause", onPause);
    VIDEO.addEventListener("volumechange", onVolumeChange);
    onVolumeChange();

    return () => {
      VIDEO.removeEventListener("timeupdate", syncTimeline);
      VIDEO.removeEventListener("loadedmetadata", syncTimeline);
      VIDEO.removeEventListener("durationchange", syncTimeline);
      VIDEO.removeEventListener("seeked", syncTimeline);
      VIDEO.removeEventListener("waiting", onWaiting);
      VIDEO.removeEventListener("canplay", onCanPlay);
      VIDEO.removeEventListener("playing", onCanPlay);
      VIDEO.removeEventListener("play", onPlay);
      VIDEO.removeEventListener("pause", onPause);
      VIDEO.removeEventListener("volumechange", onVolumeChange);
    };
  }, [content?.id, tvShow?.season, tvShow?.episode.episodeNumber]);

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  function isTVOrAndroid() {
    if (typeof window === "undefined") return false;
    if (window.AndroidApp?.isAndroidApp()) return true;
    return navigator.userAgent.toLowerCase().includes("aft");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (qualityMenuOpen) {
        if (e.key === "Escape") {
          setQualityMenuOpen(false);
        }
        return;
      }

      const tv = isTVOrAndroid();
      const activeElement = document.activeElement;
      const isSeekbarFocused =
        activeElement instanceof HTMLInputElement &&
        activeElement.type === "range";

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
        case "ArrowRight":
          if (!tv && !isSeekbarFocused) seek(10);
          break;
        case "ArrowLeft":
          if (!tv && !isSeekbarFocused) seek(-10);
          break;
        case "ArrowUp":
          if (!isSeekbarFocused) {
            e.preventDefault();
            adjustVolumeByStep(5);
          }
          break;
        case "ArrowDown":
          if (!isSeekbarFocused) {
            e.preventDefault();
            adjustVolumeByStep(-5);
          }
          break;
        case " ":
          togglePlay();
          break;
        case "Escape":
          setQualityMenuOpen(false);
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
  }, [hasSubtitles, qualityMenuOpen]);

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
    if (videoStates.paused) {
      show();
    } else {
      timer = setTimeout(hide, 5000);
    }

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
    if (v.muted || v.volume === 0) {
      v.muted = false;
      const restoredVolume = Math.max(lastVolumeRef.current, 0.05);
      v.volume = restoredVolume;
    } else {
      if (v.volume > 0) {
        lastVolumeRef.current = v.volume;
      }
      v.muted = true;
    }
  };

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
    const VIDEO = videoRef.current;
    if (!VIDEO) return;
    const newState = !videoStates.subtitlesOn;
    if (newState) {
      enableSubtitles(VIDEO);
    } else {
      disableSubtitles(VIDEO);
    }
    setVideoStates((p) => ({ ...p, subtitlesOn: newState }));
  };

  const fmt = (t: number) => {
    return formatHms(t);
  };

  const onSeekBar = (e: ReactChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const nextPercent = parseFloat(e.target.value);

    if (seekPreviewPercent !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSeekPreviewPercent(nextPercent);
      setRangeStates((p) => ({
        ...p,
        hoverTime: (nextPercent / 100) * v.duration,
        isHovering: true,
        hoverX: (nextPercent / 100) * rect.width,
        hoverPercent: nextPercent,
      }));
      return;
    }

    v.currentTime = (nextPercent / 100) * v.duration;
    setSeekPreviewPercent(null);
    setRangeStates((p) => ({ ...p, isHovering: false }));
    setVideoStates((p) => ({ ...p, currentTime: fmt(v.currentTime) }));
  };

  const onSeekBarMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);

    setRangeStates((p) => ({
      ...p,
      hoverTime: v.duration * pct,
      isHovering: true,
      hoverX: x,
      hoverPercent: pct * 100,
    }));
  };

  const onSeekBarMouseLeave = () => {
    if (seekPreviewPercent !== null) return;
    setRangeStates((p) => ({ ...p, isHovering: false }));
  };

  const onSeekBarTrackClick = (e: ReactMouseEvent<HTMLElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = pct * v.duration;
    setSeekPreviewPercent(null);
    setRangeStates((p) => ({ ...p, isHovering: false }));
    setVideoStates((p) => ({
      ...p,
      progress: pct * 100,
      currentTime: fmt(v.currentTime),
    }));
  };

  // ─── Global TV navigation (ArrowUp/ArrowDown between focusable elements) ─────
  useEffect(() => {
    const onArrowNav = (e: KeyboardEvent) => {
      if (!isTVOrAndroid()) return;

      const activeEl = document.activeElement;
      if (!activeEl || !(activeEl as HTMLElement).hasAttribute("data-focusable")) {
        return;
      }

      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-focusable]")
      );
      const currentIndex = els.indexOf(activeEl as HTMLElement);
      if (currentIndex === -1) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, els.length - 1);
        els[nextIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIndex = Math.max(currentIndex - 1, 0);
        els[nextIndex]?.focus();
      }
    };

    const C = containerRef.current;
    if (C) {
      C.addEventListener("keydown", onArrowNav);
      return () => C.removeEventListener("keydown", onArrowNav);
    }
  }, []);

  const handleTVNav = (e: ReactKeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
    const v = videoRef.current;
    const input = e.currentTarget as HTMLInputElement | HTMLButtonElement;
    const isSeekbarInput = (input as HTMLInputElement).type === "range";

    // Obtener todos los elementos focusables en orden del DOM
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-focusable]")
    );
    const currentIndex = els.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    // Navegación vertical (ArrowUp/ArrowDown) — Navega entre elementos focusables
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < els.length) {
        els[nextIndex]?.focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        els[prevIndex]?.focus();
      }
    }

    // Navegación horizontal (ArrowLeft/ArrowRight) — Solo en seekbar
    if (isSeekbarInput) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!v || !v.duration) return;
        const baseTime =
          seekPreviewPercent !== null
            ? (seekPreviewPercent / 100) * v.duration
            : v.currentTime;
        const nextTime = Math.max(0, baseTime - 10);
        const nextPercent = (nextTime / v.duration) * 100;
        const rect = input.getBoundingClientRect();
        setSeekPreviewPercent(nextPercent);
        setRangeStates((p) => ({
          ...p,
          hoverTime: nextTime,
          isHovering: true,
          hoverX: (nextPercent / 100) * rect.width,
          hoverPercent: nextPercent,
        }));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!v || !v.duration) return;
        const baseTime =
          seekPreviewPercent !== null
            ? (seekPreviewPercent / 100) * v.duration
            : v.currentTime;
        const nextTime = Math.min(v.duration, baseTime + 10);
        const nextPercent = (nextTime / v.duration) * 100;
        const rect = input.getBoundingClientRect();
        setSeekPreviewPercent(nextPercent);
        setRangeStates((p) => ({
          ...p,
          hoverTime: nextTime,
          isHovering: true,
          hoverX: (nextPercent / 100) * rect.width,
          hoverPercent: nextPercent,
        }));
      }

      // Enter en seekbar — Confirmar selección
      if (e.key === "Enter") {
        if (!v || !v.duration || seekPreviewPercent === null) return;
        e.preventDefault();
        const nextTime = (seekPreviewPercent / 100) * v.duration;
        v.currentTime = nextTime;
        setVideoStates((p) => ({
          ...p,
          progress: seekPreviewPercent,
          currentTime: fmt(nextTime),
        }));
        setSeekPreviewPercent(null);
        setRangeStates((p) => ({ ...p, isHovering: false }));
      }
    }

    // Escape — Cancelar preview de seekbar
    if (e.key === "Escape") {
      setSeekPreviewPercent(null);
      setRangeStates((p) => ({ ...p, isHovering: false }));
    }
  };

  // Manejador global de Enter para mostrar controles cuando estén ocultos
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      const isConfirmKey = e.key === "Enter" || e.key === " ";

      if (isConfirmKey && videoStates.controlsHidden) {
        e.preventDefault();
        e.stopPropagation();
        setVideoStates((p) => ({ ...p, controlsHidden: false }));

        // Esperar al siguiente frame para asegurar que los controles ya son visibles.
        requestAnimationFrame(() => {
          playButtonRef.current?.focus();
        });
      }
    };

    document.addEventListener("keydown", onGlobalKeyDown);
    return () => document.removeEventListener("keydown", onGlobalKeyDown);
  }, [videoStates.controlsHidden]);

  useEffect(() => {
    return () => {
      if (volumeFeedbackTimeoutRef.current) {
        clearTimeout(volumeFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const skip = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null || tvShow === undefined) return;
    if (skips.summary && tvShow.episode.endSummary !== null) {
      VIDEO.currentTime = tvShow.episode.endSummary;
      setSkips((p) => ({ ...p, summary: false }));
    }
    if (skips.intro && tvShow.episode.endIntro !== null) {
      VIDEO.currentTime = tvShow.episode.endIntro;
      setSkips((p) => ({ ...p, intro: false }));
    }
  };

  return {
    qualityMenuOpen,
    qualityMenuRef,
    qualityButtonRef,
    playButtonRef,
    qualityFocusedIndex,
    isAutoQuality,
    qualityOptions,
    // Refs
    videoRef,
    containerRef,
    controlsRef,
    // States
    videoStates,
    rangeStates,
    seekPreviewPercent,
    volumeFeedback,
    isPip,
    hasSubtitles,
    skips,
    // Actions
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seek,
    toggleSubtitles,
    togglePiP,
    onVolumeBarChange,
    onSeekBar,
    onSeekBarMouseMove,
    onSeekBarMouseLeave,
    onSeekBarTrackClick,
    handleTVNav,
    toggleQualityMenu,
    onToggleQualityMenu,
    closeQualityMenu,
    selectAutoQuality,
    selectQuality,
    navigateToNextEpisode,
    skip,
    fmt,
    isTVOrAndroid,
  };
}
