import { useEffect, useState } from "react";
import { getToken, getMainProfile } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

type CWEpisode = {
  id: string;
  episodeNumber: number;
};

type CWItem = {
  id: string;
  time: number;
  content?: { id: string };
  episode?: CWEpisode;
};

export type ContinueWatchingEntry = {
  cwId: string;
  time: number;
  season: number;
  episodeNumber: number;
};

function getSeasonFromEpisodeId(episodeId: string): number {
  const parts = episodeId.split("-");
  return Number(parts[parts.length - 2]) || 1;
}

function parseContentId(contentId: string): { isTV: boolean; season: number; episode: number } {
  const parts = contentId.split("-");
  if (parts.length >= 3) {
    const season = Number(parts[parts.length - 2]) || 0;
    const episode = Number(parts[parts.length - 1]) || 0;
    if (season > 0 && episode > 0) {
      return { isTV: true, season, episode };
    }
  }
  return { isTV: false, season: 0, episode: 0 };
}

/**
 * Looks up whether a content is present in the current profile's
 * continue-watching list and exposes a remove() action.
 */
export function useContinueWatchingEntry(contentId: string) {
  const [cwEntry, setCwEntry] = useState<ContinueWatchingEntry | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const token = getToken();
    const profile = getMainProfile();
    if (!token || !profile) return;

    fetch(`${API_HOST_IP}/profiles/${profile.id}/continue-watching`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CWItem[]) => {
        const entry = Array.isArray(data)
          ? data.find((item) => item.content?.id === contentId)
          : undefined;
        if (entry) {
          const parsedId = parseContentId(contentId);
          if (entry.episode) {
            setCwEntry({
              cwId: entry.id,
              time: entry.time,
              season: getSeasonFromEpisodeId(entry.episode.id),
              episodeNumber: entry.episode.episodeNumber,
            });
          } else if (parsedId.isTV) {
            setCwEntry({
              cwId: entry.id,
              time: entry.time,
              season: parsedId.season,
              episodeNumber: parsedId.episode,
            });
          } else {
            setCwEntry({
              cwId: entry.id,
              time: entry.time,
              season: 0,
              episodeNumber: 0,
            });
          }
        } else {
          setCwEntry(null);
        }
      })
      .catch(() => {/* silently ignore */});
  }, [contentId]);

  async function remove() {
    if (!cwEntry) return;
    const token = getToken();
    if (!token) return;
    setRemoving(true);
    try {
      const res = await fetch(`${API_HOST_IP}/continue-watching/${cwEntry.cwId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCwEntry(null);
    } finally {
      setRemoving(false);
    }
  }

  return { cwEntry, removing, remove };
}
