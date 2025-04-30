// Movie Content Page Requirements
import { ContentOverview, Slider } from "@/components";
import {
  FindCastFromMovie,
  FindCertificationFromMovie,
  FindMovieById,
  FindMoviesTrailerById,
  FindRecomendationsByMovie,
  FindTMDBMovieById,
} from "@/lib/movies";
import { Metadata } from "next";
import Link from "next/link";
// Movie Content Page  Props
interface Props {
  params: Promise<{ id: string }>;
}
// Generate Metadata Function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const { id } = await params;
  // Generate Metadata Constants
  const EXISTING_MOVIE = FindMovieById(id);
  const CONTENT = await FindTMDBMovieById(id);
  const TITLE = CONTENT.title;
  // Returns Metadata Generated
  return {
    title: EXISTING_MOVIE ? TITLE : "No Encontrado",
    description: EXISTING_MOVIE
      ? `Aqui se pueden encontrar toda la información referente a la película '${TITLE}'`
      : "No Encontrado",
  };
}
// Movie Content Page Main Function
async function MovieContentPage({ params }: Props) {
  // Movie Content Page Constants
  const { id } = await params;
  // Movie Content Page Constants
  const EXISTING_MOVIE = FindMovieById(id);
  const CONTENT = await FindTMDBMovieById(id);
  const CERTIFICATION = await FindCertificationFromMovie(id);
  const CREDITS = await FindCastFromMovie(id);
  const TRAILER = FindMoviesTrailerById(id);
  const RECOMENDATIONS = FindRecomendationsByMovie(id);
  // Returns Movie Content Page
  return EXISTING_MOVIE ? ( // Movie Content Main Container
    <div className="flex flex-col gap-3 p-10 max-w-4xl min-[897px]:mx-auto">
      <ContentOverview
        title={CONTENT.title}
        image={CONTENT.poster_path}
        background={CONTENT.backdrop_path}
        date={CONTENT.release_date.split("-")[0]}
        genresList={CONTENT.genres}
        tagline={CONTENT.tagline}
        overview={CONTENT.overview}
        rating={CONTENT.vote_average}
        certification={CERTIFICATION}
        credits={{
          names: CREDITS,
          href: `/movies/${id}/cast`,
        }}
        trailer={TRAILER}
      />
      {/* Recomendations Slider */}
      <Slider
        title="Recomendaciones"
        contentList={RECOMENDATIONS}
        type="movies"
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
          href="/movies"
          className="w-fit bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
        >
          Volver a Películas
        </Link>
      </section>
    </div>
  );
}

export default MovieContentPage;
