import {
  FindContentById,
  FindEpisodeMetadataById,
  FindNextEpisodeById,
} from "@/entities/content/api";

interface PlayerQuery {
  season?: string;
  episode?: string;
}

export async function getPlayerData(id: string, query: PlayerQuery) {
  const content = await FindContentById(id);
  if (!content) throw new Error("Contenido no encontrado");

  if (
    content.type === "tv-show" &&
    query.season !== undefined &&
    query.episode !== undefined
  ) {
    const seasonNumber = Number(query.season);
    const episodeNumber = Number(query.episode);
    const seasonData = content.seasonsList.find((s) => s.seasonNumber === seasonNumber);
    const episodeData = seasonData?.episodesList.find(
      (e) => e.episodeNumber === episodeNumber
    );

    if (episodeData) {
      const episodeMetadata = await FindEpisodeMetadataById(episodeData.id);
      const nextEpisode = await FindNextEpisodeById(episodeData.id);

      return {
        content,
        tvShow: {
          season: seasonNumber,
          episode: episodeMetadata,
          nextEpisode,
        },
      };
    }
  }

  return {
    content,
    tvShow: null,
  };
}
