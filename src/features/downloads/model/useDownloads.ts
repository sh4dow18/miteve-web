"use client";

import { useState, useEffect } from "react";
import { getDownloads, removeDownload, type OfflineDownload } from "@/shared/lib/offline-db";

export function useDownloads() {
  const [downloads, setDownloads] = useState<OfflineDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDownloads()
      .then((all) => {
        setDownloads(all.sort((a, b) => b.downloadedAt - a.downloadedAt));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (download: OfflineDownload) => {
    try {
      const shaka = await import("shaka-player/dist/shaka-player.compiled");
      shaka.default.polyfill.installAll();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const storage = new shaka.default.offline.Storage();
      await (storage as { remove: (uri: string) => Promise<void> }).remove(download.offlineUri);
      await (storage as { destroy: () => Promise<void> }).destroy();
      await removeDownload(download.key);
      setDownloads((prev) => prev.filter((d) => d.key !== download.key));
    } catch (err) {
      console.error("[Downloads] Remove error:", err);
    }
  };

  return { downloads, loading, remove };
}
