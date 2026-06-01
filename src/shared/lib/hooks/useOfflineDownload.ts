"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { STREAM_HOST_IP } from "@/shared/config/env";
import {
  saveDownload,
  getDownload,
  removeDownload,
  buildDownloadKey,
  type OfflineDownload,
} from "@/shared/lib/offline-db";

export type DownloadState =
  | "idle"
  | "downloading"
  | "done"
  | "error"
  | "removing";

interface UseOfflineDownloadParams {
  contentId: string;
  contentTitle: string;
  cover: string;
  type: "movie" | "tv-show";
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

interface ShakaOfflineStorage {
  configure: (config: {
    offline?: {
      progressCallback?: (content: unknown, progress: number) => void;
      trackSelectionCallback?: (tracks: Array<{ type: string; bandwidth: number }>) => Array<{ type: string; bandwidth: number }>;
    };
  }) => void;
  store: (uri: string, metadata?: Record<string, unknown>) => { promise: Promise<{ offlineUri: string; size?: number }> } | Promise<{ offlineUri: string; size?: number }>;
  remove: (offlineUri: string) => Promise<void>;
  destroy: () => Promise<void>;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shaka?: any;
  }
}

export function useOfflineDownload(params: UseOfflineDownloadParams) {
  const {
    contentId,
    contentTitle,
    cover,
    type,
    seasonNumber,
    episodeNumber,
    episodeTitle,
  } = params;

  const key = buildDownloadKey(contentId, seasonNumber, episodeNumber);
  const [state, setState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [existingDownload, setExistingDownload] =
    useState<OfflineDownload | null>(null);
  const storageRef = useRef<ShakaOfflineStorage | null>(null);

  // Check if already downloaded on mount
  useEffect(() => {
    getDownload(key)
      .then((d) => {
        if (d) {
          setExistingDownload(d);
          setState("done");
        }
      })
      .catch(() => {});
  }, [key]);

  const buildManifestUrl = (): string => {
    const path =
      seasonNumber !== undefined && episodeNumber !== undefined
        ? `${contentId}/season-${seasonNumber}/episode-${episodeNumber}/manifest.mpd`
        : `${contentId}/manifest.mpd`;
    return `${STREAM_HOST_IP}/${path}`;
  };

  const download = useCallback(async () => {
    if (state === "downloading") return;
    setState("downloading");
    setProgress(0);

    try {
      // Lazy-load Shaka
      const shaka = await import("shaka-player/dist/shaka-player.compiled");
      shaka.default.polyfill.installAll();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const storage = new shaka.default.offline.Storage() as unknown as ShakaOfflineStorage;
      storageRef.current = storage;

      storage.configure({
        offline: {
          progressCallback: (_content: unknown, pct: number) => {
            setProgress(Math.round(pct * 100));
          },
          // Select only the single highest-bandwidth video+audio track for download
          trackSelectionCallback: (allTracks: Array<{ type: string; bandwidth: number }>) => {
            const videoTracks = allTracks.filter((t) => t.type === "variant");
            if (videoTracks.length > 0) {
              const best = videoTracks.reduce((a, b) =>
                b.bandwidth > a.bandwidth ? b : a
              );
              // Also include all text/image tracks (subtitles, thumbnails)
              const extras = allTracks.filter(
                (t) => t.type === "text" || t.type === "image"
              );
              return [best, ...extras];
            }
            return allTracks;
          },
        },
      });

      const src = buildManifestUrl();
      const storeResult = storage.store(src, {
        contentId,
        title: contentTitle,
      });
      // Shaka returns IAbortableOperation which has a .promise property
      const result = await (
        typeof storeResult === "object" && storeResult !== null && "promise" in storeResult
          ? (storeResult as { promise: Promise<{ offlineUri: string; size?: number }> }).promise
          : (storeResult as Promise<{ offlineUri: string; size?: number }>)
      );

      const download: OfflineDownload = {
        key,
        contentId,
        contentTitle,
        cover,
        type,
        seasonNumber,
        episodeNumber,
        episodeTitle,
        offlineUri: result.offlineUri,
        downloadedAt: Date.now(),
        sizeBytes: result.size,
      };

      await saveDownload(download);
      setExistingDownload(download);
      setState("done");
      setProgress(100);
    } catch (err) {
      console.error("[OfflineDownload] Error:", err);
      setState("error");
    } finally {
      if (storageRef.current) {
        await storageRef.current.destroy().catch(() => {});
        storageRef.current = null;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, key, contentId, contentTitle, cover, type, seasonNumber, episodeNumber, episodeTitle]);

  const remove = useCallback(async () => {
    if (!existingDownload) return;
    setState("removing");

    try {
      const shaka = await import("shaka-player/dist/shaka-player.compiled");
      shaka.default.polyfill.installAll();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const storage = new shaka.default.offline.Storage() as unknown as ShakaOfflineStorage;
      await storage.remove(existingDownload.offlineUri);
      await storage.destroy().catch(() => {});
      await removeDownload(key);
      setExistingDownload(null);
      setState("idle");
      setProgress(0);
    } catch (err) {
      console.error("[OfflineDownload] Remove error:", err);
      setState("error");
    }
  }, [existingDownload, key]);

  return { state, progress, existingDownload, download, remove };
}
