import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/entities/content/model/types";

interface UseDetailParams {
  content: Content;
  initialSeason?: number;
}

export function useDetail({ content, initialSeason }: UseDetailParams) {
  const router = useRouter();
  const seasonsList = Array.isArray(content.seasonsList)
    ? content.seasonsList
    : [];

  const [isMuted, setIsMuted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(() => {
    if (initialSeason !== undefined) {
      const exists = seasonsList.some((s) => s.seasonNumber === initialSeason);
      if (exists) return initialSeason;
    }
    return seasonsList[0] ? seasonsList[0].seasonNumber : undefined;
  });

  const currentSeasonData = seasonsList.find(
    (s) => s.seasonNumber === selectedSeason
  );

  const toggleMuted = () => setIsMuted((prev) => !prev);
  const selectSeason = (seasonNumber: number) => setSelectedSeason(seasonNumber);

  const playContent = () => {
    if (content.comingSoon) return;

    if (currentSeasonData && currentSeasonData.episodesList.length > 0) {
      router.push(
        `/player/${content.id}?season=${currentSeasonData.seasonNumber}&episode=${currentSeasonData.episodesList[0].episodeNumber}`
      );
      return;
    }

    if (content.type === "movie") {
      router.push(`/player/${content.id}`);
    }
  };

  return {
    seasonsList,
    isMuted,
    toggleMuted,
    selectedSeason,
    selectSeason,
    currentSeasonData,
    playContent,
  };
}
