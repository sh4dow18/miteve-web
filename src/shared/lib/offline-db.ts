// ── Offline Downloads DB ──────────────────────────────────────────────────────
// Persists download metadata in IndexedDB.
// Shaka Player stores the actual video segments in its own IndexedDB database.
// We only store the metadata needed to list and play downloads.

export interface OfflineDownload {
  /** Unique key composed as: contentId or contentId-sN-eN */
  key: string;
  contentId: string;
  contentTitle: string;
  cover: string;
  type: "movie" | "tv-show";
  /** For tv-show episodes */
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  /** The offline URI returned by Shaka after download completes */
  offlineUri: string;
  /** Timestamp when download was stored */
  downloadedAt: number;
  /** Approximate size in bytes */
  sizeBytes?: number;
}

const DB_NAME = "miteve-offline";
const DB_VERSION = 1;
const STORE = "downloads";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDownload(download: OfflineDownload): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(download);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDownloads(): Promise<OfflineDownload[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as OfflineDownload[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getDownload(key: string): Promise<OfflineDownload | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as OfflineDownload) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function removeDownload(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function buildDownloadKey(
  contentId: string,
  seasonNumber?: number,
  episodeNumber?: number
): string {
  if (seasonNumber !== undefined && episodeNumber !== undefined) {
    return `${contentId}-s${seasonNumber}-e${episodeNumber}`;
  }
  return contentId;
}
