// Series Content Page Requirements
import { ContentOverview, NotFound, Seasons, Slider } from "@/components";
import {
  FindCastFromSeries,
  FindCertificationFromSeries,
  FindRecomendationsBySeries,
  FindSeasonsAvailable,
  FindSeriesById,
  FindSeriesTrailerById,
  FindTMDBSeriesById,
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
  const EXISTING_SERIES = FindSeriesById(id);
  const CONTENT = await FindTMDBSeriesById(id);
  const TITLE = CONTENT.name;
  // Returns Metadata Generated
  return {
    title: EXISTING_SERIES ? TITLE : "No Encontrado",
    description: EXISTING_SERIES
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
  const EXISTING_SERIES = FindSeriesById(id);
  const CONTENT = await FindTMDBSeriesById(id);
  const CERTIFICATION = await FindCertificationFromSeries(id);
  const CREDITS = await FindCastFromSeries(id);
  const TRAILER = FindSeriesTrailerById(id);
  const RECOMENDATIONS = FindRecomendationsBySeries(id);
  const SEASONS_AVAILABLE_LIST = FindSeasonsAvailable(id);
  // Returns Series Content Page
  return EXISTING_SERIES ? (
    // Series Content Main Container
    <div className="flex flex-col gap-5 p-10 max-w-4xl min-[897px]:mx-auto">
      <ContentOverview
        player={{
          id: id,
          series: {
            season: `${EXISTING_SERIES.seasons[0]}`,
            episode: `${
              EXISTING_SERIES.uncompleteSeasons &&
              EXISTING_SERIES.uncompleteSeasons[0].number ===
                EXISTING_SERIES.seasons[0]
                ? EXISTING_SERIES.uncompleteSeasons[0].from + 1
                : 1
            }`,
          },
        }}
        title={CONTENT.name}
        image={CONTENT.poster_path}
        background={CONTENT.backdrop_path}
        date={CONTENT.last_air_date.split("-")[0]}
        genresList={CONTENT.genres}
        tagline={CONTENT.tagline}
        overview={CONTENT.overview}
        rating={CONTENT.vote_average}
        certification={CERTIFICATION}
        credits={{
          names: CREDITS,
          href: `/series/${id}/cast`,
        }}
        trailer={TRAILER}
      />
      {/* Display Seasons Component */}
      <Seasons
        seriesId={id}
        seasonsAvailableList={
          SEASONS_AVAILABLE_LIST ? SEASONS_AVAILABLE_LIST : [1]
        }
        displaySeason={
          typeof SEASON === "string" &&
          Number.isNaN(Number.parseInt(SEASON)) === false
            ? Number.parseInt(SEASON)
            : undefined
        }
      />
      {/* Recomendations Slider */}
      <Slider
        title="Recomendaciones"
        contentList={RECOMENDATIONS}
        type="series"
        lessSlides
      />
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
