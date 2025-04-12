// Season Page Requirements
import { Stars } from "@/components";
import { FindTMDBSeasonById, FindUncompleteSeason } from "@/lib/series";
import { Episode } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// Season Page Metadata
export const metadata: Metadata = {
  title: "Episodios",
  description:
    "Aquí se podran ver todas los Episodios que ofrece Miteve para reproducir del Contenido Seleccionado",
};
// Season Page Props
interface Props {
  params: Promise<{ id: string; seasonId: string }>;
}
// Season Page Main Function
async function SeasonPage({ params }: Props) {
  // Season Page Main Params
  const { id, seasonId } = await params;
  // Season Page Constants
  const SEASON = await FindTMDBSeasonById(id, seasonId);
  const UNCOMPLETE_SEASON = FindUncompleteSeason(id, seasonId);
  const EPISODES_LIST =
    UNCOMPLETE_SEASON === undefined
      ? SEASON.episodes
      : SEASON.episodes.slice(UNCOMPLETE_SEASON.from, UNCOMPLETE_SEASON.to);
  // Returns Season Page
  return SEASON ? (
    // Season Page Main Container
    <div className="flex flex-col gap-5 p-10 max-w-4xl mx-auto">
      {/* Season Overview Container */}
      <div className="flex flex-col gap-5 place-content-center min-[600px]:flex-row">
        {/* Season Main Image */}
        <Image
          src={`https://image.tmdb.org/t/p/w500/${SEASON.poster_path}`}
          alt={SEASON.name}
          width={600}
          height={635}
          priority
          className="rounded-lg w-full min-[600px]:w-30"
        />
        {/* Season Overview Main Information Section */}
        <section className="flex flex-col gap-3">
          {/* Season Overview Name */}
          <h1 className="text-2xl text-center leading-14 font-bold text-gray-300 min-[351px]:text-5xl min-[600px]:text-2xl min-[600px]:text-left min-[600px]:leading-8">
            {SEASON.name}
          </h1>
          {/* Season Overview Release Date */}
          <span className="font-semibold text-gray-300">
            Fecha de Emisión: {SEASON.air_date.split("-")[0]}
          </span>
          {/* Season Overview Available Episodes */}
          <span className="font-semibold text-gray-300">
            Capítulos Disponibles: {EPISODES_LIST.length}
          </span>
          {/* Season Overview Rating Section */}
          <section className="flex flex-col gap-1">
            <span className="font-semibold text-gray-300">Valoración</span>
            <Stars count={5} size={30} value={SEASON.vote_average / 2} />
          </section>
        </section>
      </div>
      {/* Season Episodes Container */}
      <div className="flex flex-col gap-2">
        {/* Season Episodes Title */}
        <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
          Episodios
        </h2>
        {/* Season Episodes Display Cards Container */}
        <div className="flex flex-col gap-7">
          {EPISODES_LIST.map((episode: Episode, index: number) => (
            // Season Episode Card Link Container
            <Link
              key={index}
              className="flex flex-col gap-2 w-full bg-gray-900 transition hover:scale-105 min-[600px]:flex-row"
              href={`/player?type=series&id=${id}&season=${seasonId}&episode=${episode.episode_number}`}
            >
              {/* Season Episode Image */}
              <Image
                src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                alt={`Episodio ${episode.episode_number} Cover`}
                width={520}
                height={300}
                className="w-full rounded-sm min-[600px]:w-48"
              />
              {/* Season Episode Overview */}
              <section className="flex flex-col gap-1 p-3 min-[600px]:w-3/4">
                {/* Season Episode Number and Name */}
                <span className="font-semibold text-gray-300 hyphens-auto">
                  Episodio {episode.episode_number}: {episode.name}
                </span>
                {/* Season Episode Description */}
                <p className="line-clamp-4">
                  {episode.overview ? episode.overview : "Sin Información"}
                </p>
              </section>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <h1>
      No se ha podido Encontrar la Temporada para la Serie, intente nuevamente
    </h1>
  );
}
export default SeasonPage;
