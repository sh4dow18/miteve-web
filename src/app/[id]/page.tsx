import Image from "next/image";
import { FindMoviesTrailerById, FindTMDBMovieById } from "@/lib/movies";
import {
  FindSeasonsAvailable,
  FindSeriesTrailerById,
  FindTMDBSeriesById,
} from "@/lib/series";
import { Stars, YoutubeVideo } from "@/components";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/16/solid";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ContentPage({ params, searchParams }: Props) {
  const { id } = await params;
  const TYPE = (await searchParams).type;
  const CONTENT =
    TYPE === "movies"
      ? await FindTMDBMovieById(id)
      : await FindTMDBSeriesById(id);
  const TITLE = TYPE === "movies" ? CONTENT.title : CONTENT.name;
  const LAST_RELEASE =
    TYPE === "movies" ? CONTENT.release_date : CONTENT.last_air_date;
  const TRAILER =
    TYPE === "movies" ? FindMoviesTrailerById(id) : FindSeriesTrailerById(id);
  return (
    <div className="flex flex-col gap-5 p-10 max-w-4xl mx-auto">
      <div className="flex flex-col gap-5 min-[600px]:flex-row">
        <Image
          src={`https://image.tmdb.org/t/p/w500/${CONTENT.poster_path}`}
          alt={`${TITLE} Cover`}
          width={600}
          height={635}
          priority
          className="rounded-lg w-full min-[600px]:w-2/4 min-[719px]:w-1/4"
        />
        <section className="flex flex-col gap-3">
          <h1 className="text-2xl text-center leading-14 font-bold text-gray-300 min-[351px]:text-5xl min-[600px]:text-2xl min-[600px]:text-left min-[600px]:leading-8">
            {TITLE} ({LAST_RELEASE.split("-")[0]})
          </h1>
          <span className="text-center min-[600px]:text-left">
            {CONTENT.genres.map((genre: any) => genre.name).join(", ")}
          </span>
          <section className="flex flex-col gap-1">
            <span className="font-semibold text-gray-300">Descripción</span>
            <p className="leading-7 text-justify hyphens-auto min-[600px]:line-clamp-6">
              {CONTENT.overview}
            </p>
          </section>
          <section className="flex flex-col gap-1">
            <span className="font-semibold text-gray-300">Valoración</span>
            <Stars count={5} size={30} value={CONTENT.vote_average / 2} />
          </section>
        </section>
      </div>
      {typeof TRAILER === "string" && (
        <section className="flex flex-col gap-1">
          <span className="font-semibold text-gray-300 min-[600px]:text-xl">
            Trailer
          </span>
          <YoutubeVideo id={TRAILER} title={TITLE} />
        </section>
      )}
      {CONTENT.seasons ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
            Temporadas
          </h2>
          <div className="grid grid-cols-2 gap-5 mx-auto min-[490px]:grid-cols-3 min-[700px]:grid-cols-4 min-[870px]:grid-cols-5">
            {FindSeasonsAvailable(id, CONTENT.seasons).map(
              (season: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <Link
                    className="overflow-hidden"
                    href={`/${CONTENT.id}/${season.season_number}`}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
                      alt={`${season.name} Cover`}
                      width={176}
                      height={200}
                      className="rounded-sm transition-all ease-in-out hover:scale-110"
                    />
                  </Link>
                  <span className="font-semibold">{season.name}</span>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
            Contenido
          </h2>
          <div>
            <Link
              href={`/player?type=movies&id=${id}`}
              className="flex gap-1 place-content-center p-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700"
            >
              <PlayIcon className="w-8 h-8" />
              <span className="text-lg font-bold pt-0.5">Reproducir</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default ContentPage;
