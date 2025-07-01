// Series Content Page Requirements
import { ContentOverview, NotFound, Seasons, Slider } from "@/components";
import {
  FindRecomendationsBySeries,
  FindSeasonByNumber,
  FindSeriesById,
} from "@/lib/series";
import { Metadata } from "next";
// Series Content Page  Props
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
// Generate Metadata Function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const { id } = await params;
  // Generate Metadata Constants
  const CONTENT = await FindSeriesById(id);
  const TITLE = CONTENT.title;
  // Returns Metadata Generated
  return {
    title: CONTENT ? TITLE : "No Encontrado",
    description: CONTENT
      ? `Aqui se pueden encontrar toda la información referente a la película '${TITLE}'`
      : "No Encontrado",
  };
}
// Series Content Page Main Function
async function SeriesContentPage({ params, searchParams }: Props) {
  // Series Content Page Constants
  const { id } = await params;
  const SEASON = (await searchParams).season;
  // Series Content Page Constants
  const CONTENT = await FindSeriesById(id);
  const RECOMENDATIONS = await FindRecomendationsBySeries(id);
  const FIRST_SEASON =
    CONTENT.id !== undefined && CONTENT.seasonsList.length > 0
      ? await FindSeasonByNumber(id, CONTENT.seasonsList[0])
      : { seasonNumber: 1, episodesList: [{ episodeNumber: 1 }] };
  const FIRST_EPISODE = FIRST_SEASON.episodesList[0]
    ? FIRST_SEASON.episodesList[0].episodeNumber
    : undefined;
  // Returns Series Content Page
  return CONTENT.id !== undefined ? (
    // Series Content Main Container
    <div className="flex flex-col gap-5 p-10 max-w-4xl min-[897px]:mx-auto">
      <ContentOverview
        player={{
          id: id,
          series: {
            season: `${FIRST_SEASON.seasonNumber}`,
            episode: `${FIRST_EPISODE}`,
          },
        }}
        title={CONTENT.title}
        image={CONTENT.cover}
        background={CONTENT.background}
        date={CONTENT.year}
        genres={CONTENT.genres}
        tagline={CONTENT.tagline}
        overview={CONTENT.description}
        rating={CONTENT.rating}
        certification={CONTENT.classification}
        credits={{
          names: CONTENT.cast,
          href: `/series/${id}/cast`,
        }}
        trailer={CONTENT.trailer}
        soon={CONTENT.soon}
        note={CONTENT.note}
      />
      {CONTENT.seasonsList.length > 0 && CONTENT.soon === false && (
        // Display Seasons Component
        <Seasons
          seriesId={id}
          seasonsList={CONTENT.seasonsList}
          displaySeason={
            typeof SEASON === "string" &&
            Number.isNaN(Number.parseInt(SEASON)) === false
              ? Number.parseInt(SEASON)
              : undefined
          }
        />
      )}
      {RECOMENDATIONS.length > 0 && (
        // Recomendations Slider
        <Slider
          title="Recomendaciones"
          contentList={RECOMENDATIONS}
          type="series"
          lessSlides
        />
      )}
    </div>
  ) : (
    <NotFound
      backTo={{
        name: "Series",
        href: "/series",
      }}
    />
  );
}

export default SeriesContentPage;
