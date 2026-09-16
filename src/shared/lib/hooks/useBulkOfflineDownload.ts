"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { STREAM_HOST_IP } from "@/shared/config/env";
import {
  saveDownload,
  getDownload,
  buildDownloadKey,
  type OfflineDownload,
} from "@/shared/lib/offline-db";
import type { DownloadQuality } from "@/shared/lib/hooks/useOfflineDownload";

export type BulkDownloadState =
  | "idle"
  | "downloading"
  | "done"
  | "partial"
  | "error";

export interface BulkEpisode {
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle?: string;
  cover: string;
}

interface ShakaTrack {
  type: string;
  bandwidth: number;
  height?: number;
  label?: string;
}

interface ShakaOfflineStorage {
  configure: (config: {
    offline?: {
      progressCallback?: (content: unknown, progress: number) => void;
      trackSelectionCallback?: (tracks: ShakaTrack[]) => ShakaTrack[];
    };
  }) => void;
  store: (
    uri: string,
    metadata?: Record<string, unknown>
  ) =>
    | { promise: Promise<{ offlineUri: string; size?: number }> }
    | Promise<{ offlineUri: string; size?: number }>;
  destroy: () => Promise<void>;
}

interface FailedEpisode {
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle?: string;
  error: unknown;
}

interface UseBulkOfflineDownloadParams {
  contentId: string;
  contentTitle: string;
  type: "tv-show";
  episodes: BulkEpisode[];
}

interface UseBulkOfflineDownloadReturn {
  state: BulkDownloadState;
  progress: number;
  currentEpisode: BulkEpisode | null;
  succeeded: BulkEpisode[];
  failed: FailedEpisode[];
  total: number;
  download: (quality?: DownloadQuality) => Promise<void>;
  reset: () => void;
}

function buildManifestUrl(
  contentId: string,
  seasonNumber: number,
  episodeNumber: number
): string {
  return `${STREAM_HOST_IP}/${contentId}/season-${seasonNumber}/episode-${episodeNumber}/manifest.mpd`;
}

async function downloadSingleEpisode(
  contentId: string,
  contentTitle: string,
  cover: string,
  episode: BulkEpisode,
  quality: DownloadQuality,
  onProgress?: (pct: number) => void
): Promise<{ offlineUri: string; size?: number }> {
  const shaka = await import("shaka-player/dist/shaka-player.compiled");
  shaka.default.polyfill.installAll();

  const storage = new shaka.default.offline.Storage() as unknown as ShakaOfflineStorage;

  storage.configure({
    offline: {
      progressCallback: (_content: unknown, pct: number) => {
        onProgress?.(Math.round(pct * 100));
      },
      trackSelectionCallback: (allTracks: ShakaTrack[]) => {
        const videoTracks = allTracks.filter((t) => t.type === "variant");
        if (videoTracks.length > 0) {
          let selected: ShakaTrack;
          if (quality === "sd") {
            const target = videoTracks.find(
              (t) => t.height != null && t.height <= 720
            );
            selected =
              target ??
              videoTracks.reduce((a, b) =>
                b.bandwidth < a.bandwidth ? b : a
              );
          } else {
            selected = videoTracks.reduce((a, b) =>
              b.bandwidth > a.bandwidth ? b : a
            );
          }
          const extras = allTracks.filter(
            (t) => t.type === "text" || t.type === "image"
          );
          return [selected, ...extras];
        }
        return allTracks;
      },
    },
  });

  try {
    const src = buildManifestUrl(
      contentId,
      episode.seasonNumber,
      episode.episodeNumber
    );
    const storeResult = storage.store(src, {
      contentId,
      title: contentTitle,
    });
    const result = await (
      typeof storeResult === "object" &&
      storeResult !== null &&
      "promise" in storeResult
        ? (storeResult as { promise: Promise<{ offlineUri: string; size?: number }> })
            .promise
        : (storeResult as Promise<{ offlineUri: string; size?: number }>)
    );
    return result;
  } finally {
    await storage.destroy().catch(() => {});
  }
}

function cachePlayerUrl(
  contentId: string,
  seasonNumber: number,
  episodeNumber: number
) {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller)
    return;
  const url = `/player/${contentId}?season=${seasonNumber}&episode=${episodeNumber}&offline=true`;
  navigator.serviceWorker.controller.postMessage({
    type: "CACHE_URLS",
    urls: [url],
  });
}

/**
 * Pure helper for testing: given a list of episodes and a download function,
 * attempts each one, collects successes/failures and never aborts early.
 * This embodies the requirement: "aunque no pueda descargar todos, descargue los que pueda".
 */
export async function downloadBulkWithHandler<T extends BulkEpisode>(
  episodes: T[],
  handler: (episode: T) => Promise<void>
): Promise<{ succeeded: T[]; failed: { episode: T; error: unknown }[] }> {
  const succeeded: T[] = [];
  const failed: { episode: T; error: unknown }[] = [];
  for (const ep of episodes) {
    try {
      await handler(ep);
      succeeded.push(ep);
    } catch (err) {
      failed.push({ episode: ep, error: err });
    }
  }
  return { succeeded, failed };
}

export function useBulkOfflineDownload(
  params: UseBulkOfflineDownloadParams
): UseBulkOfflineDownloadReturn {
  const { contentId, contentTitle, episodes } = params;

  const [state, setState] = useState<BulkDownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState<BulkEpisode | null>(null);
  const [succeeded, setSucceeded] = useState<BulkEpisode[]>([]);
  const [failed, setFailed] = useState<FailedEpisode[]>([]);

  const abortRef = useRef(false);

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setCurrentEpisode(null);
    setSucceeded([]);
    setFailed([]);
    abortRef.current = false;
  }, []);

  const download = useCallback(
    async (quality: DownloadQuality = "fhd") => {
      if (state === "downloading") return;
      if (episodes.length === 0) {
        toast.error("No hay episodios para descargar");
        return;
      }

      setState("downloading");
      setProgress(0);
      setSucceeded([]);
      setFailed([]);
      abortRef.current = false;

      const total = episodes.length;
      const localSucceeded: BulkEpisode[] = [];
      const localFailed: FailedEpisode[] = [];

      for (let i = 0; i < total; i++) {
        if (abortRef.current) break;
        const ep = episodes[i];
        setCurrentEpisode(ep);

        const key = buildDownloadKey(
          contentId,
          ep.seasonNumber,
          ep.episodeNumber
        );

        // If already downloaded, count as success without re-downloading
        try {
          const existing = await getDownload(key);
          if (existing) {
            localSucceeded.push(ep);
            setSucceeded([...localSucceeded]);
            const baseProgress = Math.round(((i + 1) / total) * 100);
            setProgress(baseProgress);
            continue;
          }
        } catch {
          // ignore check error, try to download
        }

        let episodeProgress = 0;
        const onEpisodeProgress = (pct: number) => {
          episodeProgress = pct;
          const base = i / total;
          const overall = Math.round((base + pct / 100 / total) * 100);
          // Actually: completed + pct/100 divided by total
          const correct = Math.round(((i + pct / 100) / total) * 100);
          setProgress(correct);
          void overall;
          void episodeProgress;
        };

        try {
          const result = await downloadSingleEpisode(
            contentId,
            contentTitle,
            ep.cover,
            ep,
            quality,
            onEpisodeProgress
          );

          const offlineDownload: OfflineDownload = {
            key,
            contentId,
            contentTitle,
            cover: ep.cover,
            type: "tv-show",
            seasonNumber: ep.seasonNumber,
            episodeNumber: ep.episodeNumber,
            episodeTitle: ep.episodeTitle,
            offlineUri: result.offlineUri,
            downloadedAt: Date.now(),
            sizeBytes: result.size,
          };

          await saveDownload(offlineDownload);
          cachePlayerUrl(contentId, ep.seasonNumber, ep.episodeNumber);
          localSucceeded.push(ep);
          setSucceeded([...localSucceeded]);
        } catch (err) {
          console.error(
            `[BulkOfflineDownload] Error S${ep.seasonNumber}E${ep.episodeNumber}:`,
            err
          );
          localFailed.push({
            seasonNumber: ep.seasonNumber,
            episodeNumber: ep.episodeNumber,
            episodeTitle: ep.episodeTitle,
            error: err,
          });
          setFailed([...localFailed]);
        }

        const completed = localSucceeded.length + localFailed.length;
        const baseProgress = Math.round((completed / total) * 100);
        setProgress(baseProgress);
      }

      setCurrentEpisode(null);

      if (localFailed.length === 0 && localSucceeded.length === total) {
        setState("done");
        setProgress(100);
        toast.success(
          `Descarga completada: ${localSucceeded.length}/${total} capítulos descargados`
        );
      } else if (
        localSucceeded.length > 0 &&
        localFailed.length > 0
      ) {
        setState("partial");
        setProgress(100);
        const failedLabels = localFailed
          .map((f) => `T${f.seasonNumber}E${f.episodeNumber}`)
          .join(", ");
        toast.warning(
          `Descarga parcial: ${localSucceeded.length}/${total} capítulos descargados. No se pudieron descargar: ${failedLabels}`,
          { duration: 6000 }
        );
      } else if (localSucceeded.length === 0 && localFailed.length > 0) {
        setState("error");
        const failedLabels = localFailed
          .map((f) => `T${f.seasonNumber}E${f.episodeNumber}`)
          .join(", ");
        toast.error(
          `No se pudo descargar ningún capítulo. Fallaron: ${failedLabels}`
        );
      } else {
        // Edge: no episodes?
        setState("idle");
      }
    },
    [contentId, contentTitle, episodes, state]
  );

  return {
    state,
    progress,
    currentEpisode,
    succeeded,
    failed,
    total: episodes.length,
    download,
    reset,
  };
}
