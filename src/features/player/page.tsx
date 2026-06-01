"use client";

import { use } from "react";
import { usePlayer, usePlayerPageData } from "@/features/player/model/usePlayer";
import Player from "@/widgets/player/ui/Player";
import PlayerSkeleton from "@/widgets/player/ui/PlayerSkeleton";
import PlayerTV from "@/widgets/player/ui/PlayerTV";
import OfflinePlayerPage from "@/features/player/OfflinePlayerPage";

export default function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; time?: string; offline?: string }>;
}) {
  const resolvedSearch = use(searchParams);

  if (resolvedSearch.offline === "true") {
    return <OfflinePlayerPage params={params} searchParams={searchParams as Promise<{ season?: string; episode?: string; time?: string }>} />;
  }

  return <OnlinePlayerPage params={params} searchParams={searchParams as Promise<{ season?: string; episode?: string; time?: string }>} />;
}

function OnlinePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; time?: string }>;
}) {
  const { data, isLoading, startAtTime } = usePlayerPageData({ params, searchParams });
  const tvShow = data?.tvShow ?? undefined;
  const player = usePlayer({ content: data?.content, tvShow, startAtTime });

  if (isLoading || !data) {
    return <PlayerSkeleton />;
  }

  if (player.isTVOrAndroid()) {
    return <PlayerTV content={data.content} tvShow={tvShow} player={player} />;
  }

  return <Player content={data.content} tvShow={tvShow} player={player} />;
}
