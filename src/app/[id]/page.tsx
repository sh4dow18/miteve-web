// Content Page Requirements
import Image from "next/image";
import { FindMoviesTrailerById, FindTMDBMovieById } from "@/lib/movies";
import { FindSeriesTrailerById, FindTMDBSeriesById } from "@/lib/series";
import { Stars, YoutubeVideo } from "@/components";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/16/solid";
import { Genre } from "@/lib/types";
import { Metadata } from "next";
// Content Page Props
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
// Generate Metadata Function
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const { id } = await params;
  const TYPE = (await searchParams).type;
  // Generate Metadata Constants
  const CONTENT =
    TYPE === "movies"
      ? await FindTMDBMovieById(id)
      : await FindTMDBSeriesById(id);
  const TITLE = TYPE === "movies" ? CONTENT.title : CONTENT.name;
  // Returns Metadata Generated
  return {
    title: TITLE,
    description: `Aqui se pueden encontrar toda la información referente al título '${TITLE}'`,
  };
}
// Content Page Main Page
async function ContentPage({ params, searchParams }: Props) {
  // Content Page Main Params
  const { id } = await params;
  const TYPE = (await searchParams).type;
  // Content Page Constants
  const CONTENT =
    TYPE === "movies"
      ? await FindTMDBMovieById(id)
      : await FindTMDBSeriesById(id);
  const TITLE = TYPE === "movies" ? CONTENT.title : CONTENT.name;
  const LAST_RELEASE =
    TYPE === "movies" ? CONTENT.release_date : CONTENT.last_air_date;
  const TRAILER =
    TYPE === "movies" ? FindMoviesTrailerById(id) : FindSeriesTrailerById(id);
  // Returns Content Page
  return (
    // Content Page Main Container
    <div className="flex flex-col gap-5 p-10 max-w-4xl mx-auto">
      {/* Content Page Overview Container */}
      <div className="flex flex-col gap-5 min-[600px]:flex-row">
        {/* Content Page Main Image */}
        <Image
          src={`https://image.tmdb.org/t/p/w500/${CONTENT.poster_path}`}
          alt={`${TITLE} Cover`}
          width={600}
          height={635}
          priority
          className="rounded-lg w-full min-[600px]:w-2/4 min-[719px]:w-1/4"
        />
        {/* Content Page Description Container */}
        <section className="flex flex-col gap-3">
          {/* Content Page Overview Main Title */}
          <h1 className="text-2xl text-center leading-14 font-bold text-gray-300 min-[351px]:text-5xl min-[600px]:text-2xl min-[600px]:text-left min-[600px]:leading-8">
            {TITLE} ({LAST_RELEASE.split("-")[0]})
          </h1>
          {/* Content Page Overview Genres */}
          <span className="text-center min-[600px]:text-left">
            {CONTENT.genres.map((genre: Genre) => genre.name).join(", ")}
          </span>
          {/* Content Page Description Container */}
          <section className="flex flex-col gap-1">
            {/* Content Page Description Title */}
            <span className="font-semibold text-gray-300">Descripción</span>
            {/* Content Page Description Paragraph */}
            <p className="leading-7 text-justify hyphens-auto min-[600px]:line-clamp-6">
              {CONTENT.overview}
            </p>
          </section>
          {/* Content Page Overview Rating */}
          <section className="flex flex-col gap-1">
            <span className="font-semibold text-gray-300">Valoración</span>
            <Stars count={5} size={30} value={CONTENT.vote_average / 2} />
          </section>
        </section>
      </div>
      {/* Check if there is a trailer available */}
      {typeof TRAILER === "string" && (
        // Content Page Trailer Section
        <section className="flex flex-col gap-1">
          {/* Content Page Trailer Main Title */}
          <span className="font-semibold text-gray-300 min-[600px]:text-xl">
            Trailer
          </span>
          {/* Content Page Trailer */}
          <YoutubeVideo id={TRAILER} title={TITLE} />
        </section>
      )}
      {/* Check if there is a series or a movie*/}
      {CONTENT.seasons ? (
        // Content Page Seasons Container
        <div className="flex flex-col gap-2">
          {/* Content Page Seasons Title */}
          <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
            Temporadas
          </h2>
          {/* Content Page Seasons Cards Container */}
          <div className="grid grid-cols-2 gap-5 mx-auto min-[490px]:grid-cols-3 min-[700px]:grid-cols-4 min-[870px]:grid-cols-5"></div>
        </div>
      ) : (
        // Content Page Movie Container
        <section className="flex flex-col gap-3">
          {/* Content Page Movie Title */}
          <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
            Contenido
          </h2>
          {/* Content Page Movie Button */}
          <Link
            href={`/player?type=movies&id=${id}`}
            className="flex gap-1 place-content-center p-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            <PlayIcon className="w-8 h-8" />
            <span className="text-lg font-bold pt-0.5">Reproducir</span>
          </Link>
        </section>
      )}
    </div>
  );
}

export default ContentPage;
