// Series Content Page Requirements
import { ContentOverview, Slider } from "@/components";
import {
  FindCastFromSeries,
  FindCertificationFromSeries,
  FindRecomendationsBySeries,
  FindSeriesById,
  FindSeriesTrailerById,
  FindTMDBSeriesById,
} from "@/lib/series";
import { Metadata } from "next";
import Link from "next/link";
// Series Content Page  Props
interface Props {
  params: Promise<{ id: string }>;
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
async function SeriesContentPage({ params }: Props) {
  // Series Content Page Constants
  const { id } = await params;
  // Series Content Page Constants
  const EXISTING_MOVIE = FindSeriesById(id);
  const CONTENT = await FindTMDBSeriesById(id);
  const CERTIFICATION = await FindCertificationFromSeries(id);
  const CREDITS = await FindCastFromSeries(id);
  const TRAILER = FindSeriesTrailerById(id);
  const RECOMENDATIONS = FindRecomendationsBySeries(id);
  // Returns Series Content Page
  return EXISTING_MOVIE ? (
    // Series Content Main Container
    <div className="flex flex-col gap-3 p-10 max-w-4xl min-[897px]:mx-auto">
      <ContentOverview
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
      {/* Recomendations Slider */}
      <Slider
        title="Recomendaciones"
        contentList={RECOMENDATIONS}
        type="series"
        lessSlides
      />
    </div>
  ) : (
    // Not Found Container
    <div className="text-center px-10">
      {/* Not Found Code */}
      <span className="text-primary-light font-semibold mb-2 text-center">
        404
      </span>
      {/* Not Found information section */}
      <section className="flex flex-col gap-5 items-center">
        {/* Not Found Title */}
        <h1 className="text-gray-300 text-[2.5rem] leading-none font-bold min-[351px]:text-5xl min-[420px]:text-6xl">
          Página No Encontrada
        </h1>
        {/* Not Found Description */}
        <p>Lo sentimos, no se pudo encontrar la página que está buscando.</p>
        {/* Not Found Link */}
        <Link
          href="/series"
          className="w-fit bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
        >
          Volver a Series
        </Link>
      </section>
    </div>
  );
}

export default SeriesContentPage;
