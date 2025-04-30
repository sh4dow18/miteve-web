// Movie Content Page Requirements
import { ContentOverview, Slider } from "@/components";
import {
  FindCastFromMovie,
  FindCertificationFromMovie,
  FindMoviesTrailerById,
  FindRecomendationsByMovie,
  FindTMDBMovieById,
} from "@/lib/movies";
import { Metadata } from "next";
// Movie Content Page  Props
interface Props {
  params: Promise<{ id: string }>;
}
// Generate Metadata Function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const { id } = await params;
  // Generate Metadata Constants
  const CONTENT = await FindTMDBMovieById(id);
  const TITLE = CONTENT.title;
  // Returns Metadata Generated
  return {
    title: TITLE,
    description: `Aqui se pueden encontrar toda la información referente a la película '${TITLE}'`,
  };
}
// Movie Content Page Main Function
async function MovieContentPage({ params }: Props) {
  // Movie Content Page Constants
  const { id } = await params;
  // Movie Content Page Constants
  const CONTENT = await FindTMDBMovieById(id);
  const CERTIFICATION = await FindCertificationFromMovie(id);
  const CREDITS = await FindCastFromMovie(id);
  const TRAILER = FindMoviesTrailerById(id);
  const RECOMENDATIONS = FindRecomendationsByMovie(id);
  // Returns Movie Content Page
  return (
    // Movie Content Main Container
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
  );
}

export default MovieContentPage;
