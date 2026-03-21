import { default as PlayerComponent } from "@/components/Player";
import { FindContentById, FindEpisodeMetadataById } from "@/services/api";

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
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PlayerComponent
        content={content}
        tvShow={
          content.type !== "movie" && season && episodeMetadata
            ? {
                season: Number.parseInt(season),
                episode: episodeMetadata,
              }
            : undefined
        }
      />
    </div>
  );
}
