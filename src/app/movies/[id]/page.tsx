// Movie Content Page Requirements
import { ContentOverview, NotFound, Slider } from "@/components";
import { FindMovieById, FindRecomendationsByMovie } from "@/lib/movies";
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
  const EXISTING_MOVIE = await FindMovieById(id);
  // const CONTENT = await FindTMDBMovieById(id);
  const TITLE = EXISTING_MOVIE.title;
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
  const CONTENT = await FindMovieById(id);
  const RECOMENDATIONS = await FindRecomendationsByMovie(id);
  // Returns Movie Content Page
  return CONTENT.id !== undefined ? ( // Movie Content Main Container
    <div className="flex flex-col gap-3 p-10 max-w-4xl min-[897px]:mx-auto">
      <ContentOverview
        player={{
          id: id,
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
          href: `/movies/${id}/cast`,
        }}
        trailer={CONTENT.trailer}
      />
      {RECOMENDATIONS.length > 0 && (
        // Recomendations Slider
        <Slider
          title="Recomendaciones"
          contentList={RECOMENDATIONS}
          type="movies"
          lessSlides
        />
      )}
    </div>
  ) : (
    <NotFound
      backTo={{
        name: "Películas",
        href: "/movies",
      }}
    />
  );
}

export default MovieContentPage;
