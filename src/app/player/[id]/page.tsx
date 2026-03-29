import { default as PlayerComponent } from "@/components/Player";
import {
  FindContentById,
  FindEpisodeMetadataById,
  FindNextEpisodeById,
} from "@/services/api";
import { Metadata } from "next";

// Movies Page Metadata
export const metadata: Metadata = {
  title: "Reproductor",
  description: "Aquí se puede visualizar el contenido seleccionado",
};

type Props = {
  params: {
    id: string;
  };
  searchParams: { season?: string; episode?: string };
};

export default async function Player({ params, searchParams }: Props) {
  const { id } = await params;
  const { season, episode } = await searchParams;
  const content = await FindContentById(id);
  const episodeMetadata = await FindEpisodeMetadataById(
    `${id}-${season}-${episode}`
  );
  const nextEpisode = await FindNextEpisodeById(`${id}-${season}-${episode}`);
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PlayerComponent
        content={content}
        tvShow={
          content.type !== "movie" && season && episodeMetadata
            ? {
                season: Number.parseInt(season),
                episode: episodeMetadata,
                nextEpisode: nextEpisode
              }
            : undefined
        }
      />
    </div>
  );
}
