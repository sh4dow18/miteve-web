import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/entities/content/model/types";
import type { ContinueWatchingEntry } from "@/widgets/content-detail/model/useContinueWatchingEntry";

interface UseDetailParams {
  content: Content;
  initialSeason?: number;
  cwEntry: ContinueWatchingEntry | null;
}

export function useDetail({ content, initialSeason, cwEntry }: UseDetailParams) {
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

  const isTV = content.type === "tv";
  const hasCW = cwEntry !== null;
  const isCWTV = hasCW && cwEntry!.season > 0 && cwEntry!.episodeNumber > 0;
  const isCWMovie = hasCW && !isCWTV;

  const playButtonLabel = (() => {
    if (content.comingSoon) return "Próximamente";

    if (isCWTV) return `Continuar Viendo T${cwEntry!.season}E${cwEntry!.episodeNumber}`;

    if (isCWMovie) return "Continuar Viendo";

    if (isTV && currentSeasonData && currentSeasonData.episodesList.length > 0) {
      const firstSeason = seasonsList[0];
      const firstEpisode = firstSeason?.episodesList[0];
      if (firstSeason && firstEpisode) {
        return `Reproducir T${firstSeason.seasonNumber} E${firstEpisode.episodeNumber}`;
      }
    }

    return "Reproducir";
  })();

  const playContent = () => {
    if (content.comingSoon) return;

    if (isCWTV) {
      const { season, episodeNumber, time } = cwEntry!;
      router.push(`/player/${content.id}?season=${season}&episode=${episodeNumber}&time=${time}`);
      return;
    }

    if (isCWMovie) {
      router.push(`/player/${content.id}?time=${cwEntry!.time}`);
      return;
    }

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
    playButtonLabel,
  };
}
