"use client";

import { use, useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/features/player/model/usePlayer";
import Player from "@/widgets/player/ui/Player";
import PlayerSkeleton from "@/widgets/player/ui/PlayerSkeleton";
import PlayerTV from "@/widgets/player/ui/PlayerTV";
import { getDownload, buildDownloadKey, type OfflineDownload } from "@/shared/lib/offline-db";
import type { Content, EpisodeMetadata, NextEpisode } from "@/entities/content/model/types";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; time?: string }>;
}

/**
 * Minimal content shape built from OfflineDownload metadata so that the
 * regular Player widgets can render title, cover, etc. without an API call.
 */
function buildOfflineContent(d: OfflineDownload): Content {
  return {
    id: d.contentId,
    title: d.contentTitle,
    type: d.type,
    cover: d.cover,
    background: d.cover,
    description: "",
    tagline: null,
    rating: 0,
    age: 0,
    year: new Date(d.downloadedAt).getFullYear(),
    trailer: null,
    trailerDuration: null,
    note: null,
    comingSoon: false,
    genresList: [],
    seasonsList: [],
    containersList: [],
  } as unknown as Content;
}

function buildOfflineEpisode(d: OfflineDownload): EpisodeMetadata {
  return {
    id: 0,
    title: d.episodeTitle ?? `Episodio ${d.episodeNumber ?? 1}`,
    episodeNumber: d.episodeNumber ?? 1,
    description: "",
    cover: d.cover,
    duration: null,
    beginSummary: null,
    endSummary: null,
    beginIntro: null,
    endIntro: null,
    beginCredits: null,
  } as unknown as EpisodeMetadata;
}

export default function OfflinePlayerPage({ params, searchParams }: Props) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);
  const [download, setDownload] = useState<OfflineDownload | null | undefined>(undefined);

  useEffect(() => {
    const key = buildDownloadKey(
      resolvedParams.id,
      resolvedSearch.season ? Number(resolvedSearch.season) : undefined,
      resolvedSearch.episode ? Number(resolvedSearch.episode) : undefined
    );
    getDownload(key)
      .then(setDownload)
      .catch(() => setDownload(null));
  }, [resolvedParams.id, resolvedSearch.season, resolvedSearch.episode]);

  if (download === undefined) return <PlayerSkeleton />;
  if (download === null) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <p className="text-gray-400">Esta descarga ya no está disponible.</p>
      </div>
    );
  }

  return (
    <OfflinePlayerInner
      download={download}
      startAtTime={resolvedSearch.time ? parseFloat(resolvedSearch.time) : null}
    />
  );
}

function OfflinePlayerInner({
  download,
  startAtTime,
}: {
  download: OfflineDownload;
  startAtTime: number | null;
}) {
  // Memoize to avoid new object references on every render,
  // which would cause usePlayer's loadVideo effect to loop infinitely.
  const content = useMemo(() => buildOfflineContent(download), [download]);
  const tvShow = useMemo(
    () =>
      download.type === "tv-show" && download.seasonNumber !== undefined
        ? {
            season: download.seasonNumber,
            episode: buildOfflineEpisode(download),
            nextEpisode: null as NextEpisode | null,
          }
        : undefined,
    [download]
  );

  const player = usePlayer({
    content,
    tvShow,
    startAtTime,
    offlineUri: download.offlineUri,
  });

  if (player.isTVOrAndroid()) {
    return <PlayerTV content={content} tvShow={tvShow} player={player} />;
  }

  return <Player content={content} tvShow={tvShow} player={player} />;
}
