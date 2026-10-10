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
import { getMainProfile, getToken } from "@/shared/lib/auth";
import type { ProfileInfo } from "@/features/profile/model/useProfile";

declare global {
  interface Window {
    AndroidApp?: {
      isAndroidApp: () => boolean;
    };
  }
}

// Tipos para los prefijos webkit de Safari / iOS (sin lib DOM oficial)
type WebkitVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

type WebkitContainer = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};

interface UsePlayerParams {
  content?: Content | null;
  tvShow?: {
    season: number;
    episode: EpisodeMetadata;
    nextEpisode: NextEpisode | null;
  };
  startAtTime?: number | null;
  /** If provided, Shaka loads this offline URI instead of the stream URL */
  offlineUri?: string;
}

interface UsePlayerPageDataParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; time?: string }>;
}

export type PlayerData = Awaited<globalThis.ReturnType<typeof getPlayerData>>;

export function usePlayerPageData({
  params,
  searchParams,
}: UsePlayerPageDataParams) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startAtTime, setStartAtTime] = useState<number | null>(null);
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
        resolvedSearchParams.time ?? "",
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
      const rawTime = resolvedSearchParams.time;
      const parsedTime = rawTime ? parseFloat(rawTime) : null;
      setStartAtTime(parsedTime && parsedTime > 0 ? parsedTime : null);
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
    startAtTime,
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
    video.textTracks[i].mode = "disabled";
  }
}

export type UsePlayerReturn = {
  qualityMenuOpen: boolean;
  qualityMenuRef: RefObject<HTMLDivElement | null>;
  qualityButtonRef: RefObject<HTMLButtonElement | null>;
  playButtonRef: RefObject<HTMLButtonElement | null>;
  seekbarRef: RefObject<HTMLInputElement | null>;
  backButtonRef: RefObject<HTMLAnchorElement | null>;
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
  handleDpadNav: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  toggleQualityMenu: () => void;
  onToggleQualityMenu: () => void;
  closeQualityMenu: () => void;
  selectAutoQuality: () => void;
  selectQuality: (qualityId: number) => void;
  navigateToNextEpisode: () => void;
  skip: () => void;
  fmt: (t: number) => string;
  isTVOrAndroid: () => boolean;
  endTimeOverlay: boolean;
  dismissEndTimeOverlay: () => void;
};

type ShakaPlayer = {
  destroy: () => Promise<void> | void;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
  getVariantTracks: () => VariantTrack[];
  load: (source: string) => Promise<void>;
  retryStreaming?: () => Promise<boolean> | boolean;
};

type QualityCapablePlayer = ShakaPlayer & {
  configure: (config: Record<string, unknown>) => void;
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
  videoCodec?: string | null;
  audioCodec?: string | null;
  frameRate?: number | null;
  mimeType?: string | null;
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

// ─── Modo supervivencia low-end (cajas MiMo / AV1 por software) ───────────────
// AV1 sin decodificador hardware en cajas de 1-2GB vive al límite: cualquier
// pico de CPU/RAM (cambio de variante con clearBuffer, ABR subiendo a FHD o
// 30s de buffer) congela el WebView y Android mata la app (ANR/OOM).
// Estas ayudas detectan la caja débil y la dejan clavada en la variante más
// liviana con buffers cortos, sin vaciar el buffer al cambiar de calidad.
function isLowEndDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined")
    return false;
  try {
    try {
      if (localStorage.getItem("miteve-force-lowend") === "1") return true;
    } catch {
      /* storage no disponible */
    }
    const ua = (navigator.userAgent || "").toLowerCase();
    if (
      /mimo|mibox|mi box|s905|s905x|s905w|allwinner|rk3229|rk3318|h313|android.*box|aosp.*tv/.test(
        ua
      )
    )
      return true;
    const dm = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    if (typeof dm === "number" && dm <= 3) return true;
    const cores = (navigator as Navigator & { hardwareConcurrency?: number })
      .hardwareConcurrency;
    const isTvLike =
      /android|aft|tv|crkey|googletv|tizen|webos/.test(ua) ||
      (typeof window !== "undefined" && !!window.AndroidApp);
    if (isTvLike && typeof cores === "number" && cores <= 4) return true;
  } catch {
    /* noop */
  }
  return false;
}

function pickLowestVariant(tracks: VariantTrack[]): VariantTrack | null {
  const variants = tracks.filter((t) => t.type === "variant");
  if (variants.length === 0) return null;
  return (
    [...variants].sort(
      (a, b) =>
        (a.height ?? Number.MAX_SAFE_INTEGER) -
          (b.height ?? Number.MAX_SAFE_INTEGER) || a.bandwidth - b.bandwidth
    )[0] ?? null
  );
}

export function usePlayer({
  content,
  tvShow,
  startAtTime,
  offlineUri,
}: UsePlayerParams): UsePlayerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const shakaPlayerRef = useRef<ShakaPlayer | null>(null);
  const profileSettingsRef = useRef<Pick<ProfileInfo, "autoSkip" | "lowQuality" | "disableSubtitles"> | null>(null);

  // Load profile settings once on mount
  useEffect(() => {
    const mainProfile = getMainProfile();
    if (!mainProfile) return;
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_HOST_IP}/profiles/${mainProfile.id}`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data: ProfileInfo | null) => {
        if (data) {
          profileSettingsRef.current = {
            autoSkip: data.autoSkip,
            lowQuality: data.lowQuality,
            disableSubtitles: data.disableSubtitles,
          };
        }
      })
      .catch(() => {});
  }, []);

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
  const seekbarRef = useRef<HTMLInputElement | null>(null);
  const backButtonRef = useRef<HTMLAnchorElement | null>(null);
  const [qualityFocusedIndex, setQualityFocusedIndex] = useState(0);
  const [seekPreviewPercent, setSeekPreviewPercent] = useState<number | null>(
    null
  );
  const [hasSubtitles, setHasSubtitles] = useState(false);
  const navigatingRef = useRef(false);
  const loadRequestIdRef = useRef(0);
  // Cache del modo supervivencia: se calcula una vez por montaje.
  const lowEndRef = useRef<boolean | null>(null);
  const getLowEnd = () => {
    if (lowEndRef.current === null) lowEndRef.current = isLowEndDevice();
    return lowEndRef.current;
  };
  // Watchdog anti-congelamiento para AV1 por software (máx 3 rescates).
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stallRetriesRef = useRef(0);

  // ─── Continue-watching tracking ───────────────────────────────────────────────
  const playedSecondsRef = useRef(0);
  const continueWatchingIdRef = useRef<string | null>(null);
  const cwCreatedRef = useRef(false);
  const lastCwPutRef = useRef(0);

  // Always-fresh refs so the interval closure never reads stale closures
  const contentRef = useRef(content);
  const tvShowRef = useRef(tvShow);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  useEffect(() => {
    tvShowRef.current = tvShow;
  }, [tvShow]);
  const [skips, setSkips] = useState({
    summary: false,
    intro: false,
    credits: false,
  });
  const [endTimeOverlay, setEndTimeOverlay] = useState(false);
  const endTimeTriggeredRef = useRef(false);

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

    // Register the next episode as the new continue-watching entry
    const profile = getMainProfile();
    if (profile) {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      fetch(`${API_HOST_IP}/continue-watching`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          profileId: Number(profile.id),
          contentId: content.id,
          episodeId: tvShow.nextEpisode.id,
          time: 0,
        }),
      }).catch(() => { /* silent */ });
    }

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
    // En caja débil el "Automático" se capa a SD para que el ABR nunca
    // salte a un FHD AV1 que la congelaría.
    if (lowEndRef.current) {
      player.configure({
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 600000,
          restrictions: { maxHeight: 480, maxBandwidth: 1500000 },
        },
      });
    } else {
      player.configure({ abr: { enabled: true } });
    }
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
    // En caja débil NO vaciar el buffer: el flush + re-append de AV1 por
    // software es lo que pega el WebView y provoca el cierre (ANR/OOM).
    const clearBuffer = !lowEndRef.current;
    player.selectVariantTrack(selectedTrack, clearBuffer);
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
      const nextSummary =
        beginSummary !== null && endSummary !== null
          ? CURRENT_TIME > beginSummary && CURRENT_TIME < endSummary
          : false;
      const nextIntro =
        beginIntro !== null && endIntro !== null
          ? CURRENT_TIME > beginIntro && CURRENT_TIME < endIntro
          : false;
      const nextCredits = beginCredits !== null ? CURRENT_TIME > beginCredits : false;

      // autoSkip: jump automatically without showing the button
      if (profileSettingsRef.current?.autoSkip) {
        if (nextSummary && endSummary !== null) {
          VIDEO.currentTime = endSummary;
          return;
        }
        if (nextIntro && endIntro !== null) {
          VIDEO.currentTime = endIntro;
          return;
        }
      }

      setSkips({ summary: nextSummary, intro: nextIntro, credits: nextCredits });
    };
    VIDEO.addEventListener("timeupdate", manageSkips);
    VIDEO.addEventListener("seeked", manageSkips);
    return () => {
      VIDEO.removeEventListener("timeupdate", manageSkips);
      VIDEO.removeEventListener("seeked", manageSkips);
    };
  }, [tvShow]);

  // ─── EndTime overlay ─────────────────────────────────────────────────────────
  useEffect(() => {
    const VIDEO = videoRef.current;
    const endTime = content?.endTime;
    if (!VIDEO || !endTime) return;

    endTimeTriggeredRef.current = false;

    const checkEndTime = () => {
      if (endTimeTriggeredRef.current) return;
      if (VIDEO.currentTime >= endTime) {
        endTimeTriggeredRef.current = true;
        setEndTimeOverlay(true);
        VIDEO.pause();
      }
    };

    VIDEO.addEventListener("timeupdate", checkEndTime);
    return () => VIDEO.removeEventListener("timeupdate", checkEndTime);
  }, [content?.id, content?.endTime]);

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

      // ── Offline mode: skip speed test and use stored offlineUri ─────────────
      if (offlineUri) {
        setIsAutoQuality(true);
        setQualityMenuOpen(false);
        setQualityOptions([]);

        const loadOffline = async (attempts = 3, delay = 1500) => {
          for (let i = 0; i < attempts; i++) {
            if (!isCurrentRequest()) return;
            try {
              const shaka = await import("shaka-player/dist/shaka-player.compiled");
              if (!isCurrentRequest()) return;
              shaka.default.polyfill.installAll();

              if (shakaPlayerRef.current) await shakaPlayerRef.current.destroy();
              if (!isCurrentRequest()) return;

              const player = new shaka.default.Player();
              shakaPlayerRef.current = player;
              if (!isCurrentRequest()) { await player.destroy(); return; }

              await player.attach(VIDEO);
              if (!isCurrentRequest()) { await player.destroy(); return; }

              player.addEventListener("error", (e: unknown) => {
                console.warn("Shaka offline error", e);
              });

              await player.load(offlineUri);
              if (!isCurrentRequest()) return;

              await new Promise<void>((resolve) => {
                if (VIDEO.readyState >= 3) resolve();
                else VIDEO.addEventListener("canplay", () => resolve(), { once: true });
              });

              if (startAtTime && startAtTime > 0) {
                VIDEO.currentTime = startAtTime;
              }

              VIDEO.play()
                .then(() => isCurrentRequest() && setVideoStates((p) => ({ ...p, paused: false, waiting: false })))
                .catch(() => isCurrentRequest() && setVideoStates((p) => ({ ...p, paused: true, waiting: false })));

              return;
            } catch (e) {
              if (!isCurrentRequest()) return;
              console.warn(`Shaka offline intento ${i + 1} fallido`, e);
              if (i < attempts - 1) {
                await new Promise((r) => setTimeout(r, delay));
              }
            }
          }
          if (isCurrentRequest()) {
            setVideoStates((p) => ({ ...p, paused: true, waiting: false }));
          }
        };

        void loadOffline();
        return;
      }

      // En caja débil se omite el speedTest (ahorra CPU/red y arranque):
      // se asume red lenta y se clava el SD desde el inicio.
      const lowEndDevice = getLowEnd();
      const speed = lowEndDevice ? 0 : await speedTest();
      if (!isCurrentRequest()) return;

      const slow = speed < 4;
      const lowQ =
        lowEndDevice ||
        profileSettingsRef.current?.lowQuality ||
        videoStates.resolution === "SD" ||
        slow;

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

                const player = new shaka.default.Player();
                shakaPlayerRef.current = player;
                if (!isCurrentRequest()) {
                  await player.destroy();
                  return;
                }
                await player.attach(VIDEO);
                if (!isCurrentRequest()) {
                  await player.destroy();
                  return;
                }

                // ── Supervivencia low-end / AV1 por software ─────────────────
                // Buffers cortos (menos RAM), tope en 480p y ABR arrancando
                // conservador. Sin esto el ABR puede subir a FHD AV1 y la
                // caja MiMo se congela y Android la cierra.
                if (lowEndDevice) {
                  try {
                    (player as unknown as QualityCapablePlayer).configure({
                      streaming: {
                        bufferingGoal: 12,
                        rebufferingGoal: 4,
                        bufferBehind: 15,
                        segmentPrefetchLimit: 1,
                        retryParameters: {
                          timeout: 15000,
                          maxAttempts: 4,
                          baseDelay: 500,
                          backoffFactor: 2,
                        },
                      },
                      abr: {
                        enabled: true,
                        defaultBandwidthEstimate: 600000,
                        restrictions: {
                          maxHeight: 480,
                          maxBandwidth: 1500000,
                        },
                      },
                    });
                  } catch {
                    /* config no crítica */
                  }
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

                // Esperar a que el video pueda reproducirse antes de hacer seek.
                // canplay garantiza que Shaka ha terminado su inicialización y que
                // el seek a cualquier posición será aceptado y no sobreescrito.
                await new Promise<void>((resolve) => {
                  if (VIDEO.readyState >= 3) resolve();
                  else
                    VIDEO.addEventListener("canplay", () => resolve(), {
                      once: true,
                    });
                });

                // ── Auto-activar subtítulos ─────────────────────────────────
                // Intentar activar inmediatamente
                const subtitleTrack = getSubtitleTrack(VIDEO);
                const subsDisabled = profileSettingsRef.current?.disableSubtitles ?? false;
                if (subtitleTrack) {
                  if (subsDisabled) {
                    disableSubtitles(VIDEO);
                    setHasSubtitles(true);
                    setVideoStates((p) => ({ ...p, subtitlesOn: false }));
                  } else {
                    enableSubtitles(VIDEO);
                    setHasSubtitles(true);
                    setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                  }
                } else {
                  // Shaka puede tardar un tick en añadir los tracks
                  const trackTimeoutRef = { current: null as NodeJS.Timeout | null };
                  const onTrackAdded = () => {
                    const t = getSubtitleTrack(VIDEO);
                    if (t) {
                      if (subsDisabled) {
                        disableSubtitles(VIDEO);
                        setHasSubtitles(true);
                        setVideoStates((p) => ({ ...p, subtitlesOn: false }));
                      } else {
                        enableSubtitles(VIDEO);
                        setHasSubtitles(true);
                        setVideoStates((p) => ({ ...p, subtitlesOn: true }));
                      }
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

                // Resume from saved position (takes priority over intro skip)
                if (startAtTime && startAtTime > 0) {
                  VIDEO.currentTime = startAtTime;
                } else if (tvShow !== undefined) {
                  // Skip intro/summary al inicio
                  // Recopila los segmentos definidos y construye la cadena de saltos
                  // que comienza en el segundo 0, incluyendo segmentos consecutivos
                  // (con hasta 1 segundo de diferencia entre el fin de uno y el inicio del siguiente).
                  const { beginSummary, endSummary, beginIntro, endIntro } =
                    tvShow.episode;
                  const segments: Array<{ begin: number; end: number }> = [];
                  if (beginSummary !== null && endSummary !== null) {
                    segments.push({ begin: beginSummary, end: endSummary });
                  }
                  if (beginIntro !== null && endIntro !== null) {
                    segments.push({ begin: beginIntro, end: endIntro });
                  }
                  const hasZeroStart = segments.some((s) => s.begin === 0);
                  if (hasZeroStart) {
                    let chainEnd = 0;
                    let extended = true;
                    while (extended) {
                      extended = false;
                      for (const seg of segments) {
                        if (seg.begin <= chainEnd + 1 && seg.end > chainEnd) {
                          chainEnd = seg.end;
                          extended = true;
                        }
                      }
                    }
                    if (chainEnd > 0) {
                      VIDEO.currentTime = chainEnd;
                    }
                  }
                }

                // Resolución inicial
                const tracks = player.getVariantTracks();
                syncQualityState(tracks);

                if (profileSettingsRef.current?.lowQuality || lowEndDevice) {
                  // Clavar la variante más liviana (menor alto + menor bitrate)
                  // y apagar el ABR: en AV1 por software cualquier salto a una
                  // variante mayor congela la caja débil.
                  const sdTrack = pickLowestVariant(tracks);
                  if (sdTrack) {
                    player.configure({ abr: { enabled: false } });
                    // Sin clearBuffer en low-end: evita el flush que pega el WebView.
                    (player as unknown as QualityCapablePlayer).selectVariantTrack(
                      sdTrack,
                      !lowEndDevice
                    );
                    setIsAutoQuality(false);
                    setVideoStates((p) => ({ ...p, resolution: "SD" }));
                    // Re-sync so the quality menu shows the forced track as selected
                    syncQualityState(player.getVariantTracks());
                  }
                } else {
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
  }, [content, offlineUri]);

  // ─── Watchdog anti-pegue solo low-end ──────────────────────────────────────
  // Si el AV1 por software se queda en "waiting" >10s, intenta un rescate
  // suave (play + retryStreaming) en vez de dejar el spinner pegado hasta
  // el ANR. Máximo 3 intentos por contenido para no entrar en loop.
  useEffect(() => {
    stallRetriesRef.current = 0;
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    const VIDEO = videoRef.current;
    if (!VIDEO || !getLowEnd()) return;
    const scheduleRescue = () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
      stallTimerRef.current = setTimeout(() => {
        if (stallRetriesRef.current >= 3) return;
        if (VIDEO.paused || VIDEO.readyState >= 3) return;
        stallRetriesRef.current += 1;
        try {
          const p = shakaPlayerRef.current;
          p?.retryStreaming?.();
        } catch {
          /* noop */
        }
        VIDEO.play().catch(() => {});
      }, 10000);
    };
    const onWait = () => scheduleRescue();
    const onPlayable = () => {
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
    };
    VIDEO.addEventListener("waiting", onWait);
    VIDEO.addEventListener("playing", onPlayable);
    VIDEO.addEventListener("canplay", onPlayable);
    return () => {
      VIDEO.removeEventListener("waiting", onWait);
      VIDEO.removeEventListener("playing", onPlayable);
      VIDEO.removeEventListener("canplay", onPlayable);
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
    };
  }, [content?.id, tvShow?.season, tvShow?.episode.episodeNumber]);

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
    const v = videoRef.current as WebkitVideoElement | null;
    if (!c) return;

    const doc = document as WebkitDocument;
    const containerEl = c as WebkitContainer;

    const nativeFsElement =
      document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    const isFakeFs = c.dataset.fakeFullscreen === "true";
    const isVideoNativeFs = v?.webkitDisplayingFullscreen === true;

    const lockLandscape = () => {
      try {
        type LockableOrientation = ScreenOrientation & {
          lock?: (type: string) => Promise<void>;
        };
        const orientation =
          typeof screen !== "undefined"
            ? (screen.orientation as LockableOrientation | undefined)
            : undefined;
        orientation?.lock?.("landscape")?.catch(() => {});
      } catch {
        /* iOS no soporta orientation.lock: se ignora */
      }
    };
    const unlockOrientation = () => {
      try {
        type UnlockableOrientation = ScreenOrientation & {
          unlock?: () => void;
        };
        const orientation =
          typeof screen !== "undefined"
            ? (screen.orientation as UnlockableOrientation | undefined)
            : undefined;
        orientation?.unlock?.();
      } catch {
        /* noop */
      }
    };

    const enterFakeFullscreen = () => {
      if (c.dataset.fakeFullscreen === "true") return;
      c.dataset.fakeFullscreen = "true";
      c.dataset.prevBodyOverflow = document.body.style.overflow;
      c.dataset.prevDocOverflow = document.documentElement.style.overflow;
      c.dataset.prevPosition = c.style.position;
      c.dataset.prevInset = c.style.inset;
      c.dataset.prevZIndex = c.style.zIndex;
      c.dataset.prevWidth = c.style.width;
      c.dataset.prevHeight = c.style.height;
      c.dataset.prevMinHeight = c.style.minHeight;
      c.dataset.prevBackground = c.style.background;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      c.style.position = "fixed";
      c.style.inset = "0";
      c.style.zIndex = "9999";
      c.style.width = "100vw";
      c.style.height = "100dvh";
      c.style.minHeight = "100dvh";
      c.style.background = "#000";
      if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
      try {
        c.focus({ preventScroll: true } as FocusOptions);
      } catch {
        c.focus();
      }
      lockLandscape();
      setVideoStates((p) => ({ ...p, fullscreen: true }));
    };

    const exitFakeFullscreen = () => {
      delete c.dataset.fakeFullscreen;
      document.body.style.overflow = c.dataset.prevBodyOverflow ?? "";
      document.documentElement.style.overflow = c.dataset.prevDocOverflow ?? "";
      c.style.position = c.dataset.prevPosition ?? "";
      c.style.inset = c.dataset.prevInset ?? "";
      c.style.zIndex = c.dataset.prevZIndex ?? "";
      c.style.width = c.dataset.prevWidth ?? "";
      c.style.height = c.dataset.prevHeight ?? "";
      c.style.minHeight = c.dataset.prevMinHeight ?? "";
      c.style.background = c.dataset.prevBackground ?? "";
      unlockOrientation();
      setVideoStates((p) => ({ ...p, fullscreen: false }));
    };

    // ── SALIR ──────────────────────────────────────────────
    if (nativeFsElement || isFakeFs || isVideoNativeFs) {
      if (isFakeFs) {
        exitFakeFullscreen();
        return;
      }
      if (isVideoNativeFs && v?.webkitExitFullscreen) {
        try {
          v.webkitExitFullscreen();
        } catch {
          /* noop */
        }
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (typeof doc.webkitExitFullscreen === "function") {
        try {
          doc.webkitExitFullscreen();
        } catch {
          /* noop */
        }
      }
      unlockOrientation();
      // El estado se sincroniza vía fullscreenchange/webkitfullscreenchange.
      // Fallback por si el evento no dispara (iOS antiguo):
      setVideoStates((p) => ({ ...p, fullscreen: false }));
      return;
    }

    // ── ENTRAR ─────────────────────────────────────────────
    // 1) Fullscreen API estándar (Android, desktop, iPad)
    const requestContainerFs =
      typeof c.requestFullscreen === "function"
        ? c.requestFullscreen.bind(c)
        : typeof containerEl.webkitRequestFullscreen === "function"
          ? containerEl.webkitRequestFullscreen.bind(containerEl)
          : null;

    if (requestContainerFs) {
      if (!c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
      try {
        const result = requestContainerFs() as Promise<void> | void;
        if (
          result &&
          typeof (result as Promise<void>).then === "function"
        ) {
          (result as Promise<void>)
            .then(() => {
              lockLandscape();
            })
            .catch(() => {
              // El request nativo falló (p. ej. iOS lo rechaza):
              // si el vídeo soporta fullscreen nativo de iOS, usarlo;
              // si no, fallback CSS para no dejar el botón muerto.
              const stillOutside =
                !document.fullscreenElement &&
                !(document as WebkitDocument).webkitFullscreenElement;
              if (!stillOutside) return;
              if (
                v &&
                typeof v.webkitEnterFullscreen === "function"
              ) {
                try {
                  v.webkitEnterFullscreen();
                  return;
                } catch {
                  /* cae al fake */
                }
              }
              enterFakeFullscreen();
            });
        } else {
          lockLandscape();
        }
        // No se marca fullscreen aquí: lo confirman los eventos
        // fullscreenchange / webkitfullscreenchange.
        return;
      } catch {
        // Sigue a los fallbacks de iOS
      }
    }

    // 2) iOS iPhone: el contenedor no soporta requestFullscreen.
    //    El vídeo sí expone webkitEnterFullscreen → pantalla completa real.
    if (v && typeof v.webkitEnterFullscreen === "function") {
      try {
        v.webkitEnterFullscreen();
        return;
      } catch {
        /* cae al fake */
      }
    }

    // 3) Último recurso: pseudo-fullscreen CSS (conserva controles propios)
    enterFakeFullscreen();
  };

  const saveCwTime = useCallback((time: number) => {
    const currentContent = contentRef.current;
    const profile = getMainProfile();
    if (!currentContent || !profile) return;
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (cwCreatedRef.current && continueWatchingIdRef.current) {
      fetch(`${API_HOST_IP}/continue-watching/${continueWatchingIdRef.current}/time`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ time: Math.floor(time) }),
      }).catch(() => { /* silent */ });
      return;
    }

    if (!cwCreatedRef.current) {
      cwCreatedRef.current = true;
      const currentTvShow = tvShowRef.current;
      fetch(`${API_HOST_IP}/continue-watching`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          profileId: Number(profile.id),
          contentId: currentContent.id,
          episodeId: currentTvShow?.episode.id ?? null,
          time: Math.floor(time),
        }),
      })
        .then((res) => {
          if (!res.ok) { cwCreatedRef.current = false; return null; }
          return res.json();
        })
        .then((data: { id: string | number } | undefined | null) => {
          if (data?.id != null) {
            continueWatchingIdRef.current = String(data.id);
            lastCwPutRef.current = playedSecondsRef.current;
          }
        })
        .catch(() => { cwCreatedRef.current = false; });
    }
  }, []);

  const seek = (secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + secs), v.duration);
    saveCwTime(v.currentTime);
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
      const hasTvLayoutRefs =
        seekbarRef.current !== null &&
        backButtonRef.current !== null &&
        playButtonRef.current !== null;
      const isPlayerFocused =
        activeElement instanceof Node &&
        (containerRef.current?.contains(activeElement) ?? false);
      const useTvDpadNavigation = hasTvLayoutRefs && isPlayerFocused;

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
          if (useTvDpadNavigation) break;
          if (!tv && !isSeekbarFocused) {
            e.preventDefault();
            adjustVolumeByStep(5);
          }
          break;
        case "ArrowDown":
          if (useTvDpadNavigation) break;
          if (!tv && !isSeekbarFocused) {
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
    const onFS = () => {
      const d = document as WebkitDocument;
      const nativeEl =
        document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
      const isFake =
        containerRef.current?.dataset.fakeFullscreen === "true";
      const isVideoNative =
        (videoRef.current as WebkitVideoElement | null)
          ?.webkitDisplayingFullscreen === true;
      setVideoStates((p) => ({
        ...p,
        fullscreen: !!nativeEl || isFake || isVideoNative,
      }));
    };
    const onVideoBeginFs = () =>
      setVideoStates((p) => ({ ...p, fullscreen: true }));
    const onVideoEndFs = () => {
      const d = document as WebkitDocument;
      const nativeEl =
        document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
      const isFake =
        containerRef.current?.dataset.fakeFullscreen === "true";
      setVideoStates((p) => ({
        ...p,
        fullscreen: !!nativeEl || isFake,
      }));
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFS);
    document.addEventListener("webkitfullscreenchange", onFS);
    const vidEl = videoRef.current as WebkitVideoElement | null;
    vidEl?.addEventListener?.(
      "webkitbeginfullscreen" as keyof HTMLVideoElementEventMap,
      onVideoBeginFs as EventListener
    );
    vidEl?.addEventListener?.(
      "webkitendfullscreen" as keyof HTMLVideoElementEventMap,
      onVideoEndFs as EventListener
    );
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFS);
      document.removeEventListener("webkitfullscreenchange", onFS);
      vidEl?.removeEventListener?.(
        "webkitbeginfullscreen" as keyof HTMLVideoElementEventMap,
        onVideoBeginFs as EventListener
      );
      vidEl?.removeEventListener?.(
        "webkitendfullscreen" as keyof HTMLVideoElementEventMap,
        onVideoEndFs as EventListener
      );
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

  // ─── Limpieza del pseudo-fullscreen iOS al desmontar ─────────────────────────
  useEffect(() => {
    const C = containerRef.current;
    return () => {
      if (C?.dataset.fakeFullscreen === "true") {
        document.body.style.overflow = C.dataset.prevBodyOverflow ?? "";
        document.documentElement.style.overflow =
          C.dataset.prevDocOverflow ?? "";
      }
    };
  }, []);

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
    saveCwTime(v.currentTime);
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
    saveCwTime(v.currentTime);
  };

  // ─── TV-like D-pad navigation handler (attached via JSX onKeyDown) ───────────
  const handleDpadNav = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    const activeEl = document.activeElement as HTMLElement | null;
    if (!activeEl) return;

    const hasTvLayoutRefs =
      seekbarRef.current !== null &&
      backButtonRef.current !== null &&
      playButtonRef.current !== null;
    if (!hasTvLayoutRefs) return;

    const inPlayer = containerRef.current?.contains(activeEl) ?? false;
    if (!inPlayer) return;

    const isButtonFocused = activeEl.tagName === "BUTTON";
    const isSeekbarFocused = activeEl === seekbarRef.current;
    const isBackFocused = activeEl === backButtonRef.current;

    if (e.key === "ArrowUp") {
      if (isSeekbarFocused) {
        e.preventDefault();
        backButtonRef.current?.focus();
        return;
      }

      if (isButtonFocused) {
        e.preventDefault();
        seekbarRef.current?.focus();
        return;
      }
    }

    if (e.key === "ArrowDown") {
      if (isBackFocused) {
        e.preventDefault();
        seekbarRef.current?.focus();
        return;
      }

      if (isSeekbarFocused) {
        e.preventDefault();
        playButtonRef.current?.focus();
        return;
      }
    }
  }, []);

  const handleTVNav = (e: ReactKeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
    const v = videoRef.current;
    const input = e.currentTarget as HTMLInputElement | HTMLButtonElement;
    const isSeekbarInput = (input as HTMLInputElement).type === "range";

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
        saveCwTime(nextTime);
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

  // ─── Continue-watching effect ────────────────────────────────────────────────
  // Reset counters whenever the content or episode changes
  useEffect(() => {
    playedSecondsRef.current = 0;
    continueWatchingIdRef.current = null;
    cwCreatedRef.current = false;
    lastCwPutRef.current = 0;
  }, [content?.id, tvShow?.season, tvShow?.episode.episodeNumber]);

  // Persistent interval — mounts once, reads fresh values via refs
  useEffect(() => {
    const interval = setInterval(() => {
      const VIDEO = videoRef.current;
      const currentContent = contentRef.current;
      if (!VIDEO || !currentContent) return;
      const profile = getMainProfile();
      if (!profile) return;

      // Only count seconds of actual playback, but allow PUT/POST to fire even while paused
      if (!VIDEO.paused) playedSecondsRef.current += 1;
      const played = playedSecondsRef.current;
      // ── Initial POST after 30s of actual playback ──
      if (!cwCreatedRef.current && played >= 30) {
        cwCreatedRef.current = true;
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const currentTvShow = tvShowRef.current;
        fetch(`${API_HOST_IP}/continue-watching`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            profileId: Number(profile.id),
            contentId: currentContent.id,
            episodeId: currentTvShow?.episode.id ?? null,
            time: 30,
          }),
        })
          .then((res) => {
            if (!res.ok) { cwCreatedRef.current = false; return; }
            return res.json();
          })
          .then((data: { id: string | number } | undefined) => {
            if (data?.id != null) {
              continueWatchingIdRef.current = String(data.id);
              lastCwPutRef.current = played;
            }
          })
          .catch(() => { cwCreatedRef.current = false; });
        return;
      }
      // ── PUT every 30s after creation ──
      if (
        cwCreatedRef.current &&
        continueWatchingIdRef.current &&
        played - lastCwPutRef.current >= 30
      ) {
        lastCwPutRef.current = played;
        const cwId = continueWatchingIdRef.current;
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        fetch(`${API_HOST_IP}/continue-watching/${cwId}/time`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ time: Math.floor(VIDEO.currentTime) }),
        }).catch(() => { /* silent */ });
      }
    }, 1000);
    return () => clearInterval(interval);
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
    saveCwTime(VIDEO.currentTime);
  };

  return {
    qualityMenuOpen,
    qualityMenuRef,
    qualityButtonRef,
    playButtonRef,
    seekbarRef,
    backButtonRef,
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
    handleDpadNav,
    toggleQualityMenu,
    onToggleQualityMenu,
    closeQualityMenu,
    selectAutoQuality,
    selectQuality,
    navigateToNextEpisode,
    skip,
    fmt,
    isTVOrAndroid,
    endTimeOverlay,
    dismissEndTimeOverlay: () => {
      setEndTimeOverlay(false);
      videoRef.current?.play();
    },
  };
}
