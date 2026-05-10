"use client";

import { usePlayer, usePlayerPageData } from "@/features/player/model/usePlayer";
import Player from "@/widgets/player/ui/Player";
import PlayerSkeleton from "@/widgets/player/ui/PlayerSkeleton";
import PlayerTV from "@/widgets/player/ui/PlayerTV";

export default function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}) {
  const { data, isLoading } = usePlayerPageData({ params, searchParams });
  const tvShow = data?.tvShow ?? undefined;
  const player = usePlayer({ content: data?.content, tvShow });

  if (isLoading || !data) {
    return <PlayerSkeleton />;
  }

  if (player.isTVOrAndroid()) {
    return <PlayerTV content={data.content} tvShow={tvShow} player={player} />;
  }

  return <Player content={data.content} tvShow={tvShow} player={player} />;
}
