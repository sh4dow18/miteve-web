import { Stars } from "@/components";
import { FindTMDBSeasonById, FindUncompleteSeason } from "@/lib/series";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string; seasonId: string }>;
}

async function SeasonPage({ params }: Props) {
  const { id, seasonId } = await params;
  const SEASON = await FindTMDBSeasonById(id, seasonId);
  const UNCOMPLETE_SEASON = FindUncompleteSeason(id, seasonId);
  const AVAILABLE_EPISODES =
    UNCOMPLETE_SEASON === undefined
      ? SEASON.episodes.length
      : UNCOMPLETE_SEASON.to - UNCOMPLETE_SEASON.from;
  const EPISODES_LIST =
    UNCOMPLETE_SEASON === undefined
      ? SEASON.episodes
      : SEASON.episodes.slice(UNCOMPLETE_SEASON.from);
  return SEASON ? (
    <div className="flex flex-col gap-5 p-10 max-w-4xl mx-auto">
      <div className="flex flex-col gap-5 place-content-center min-[600px]:flex-row">
        <Image
          src={`https://image.tmdb.org/t/p/w500/${SEASON.poster_path}`}
          alt={SEASON.name}
          width={600}
          height={635}
          priority
          className="rounded-lg w-full min-[600px]:w-30"
        />
        <section className="flex flex-col gap-3">
          <h1 className="text-2xl text-center leading-14 font-bold text-gray-300 min-[351px]:text-5xl min-[600px]:text-2xl min-[600px]:text-left min-[600px]:leading-8">
            {SEASON.name}
          </h1>
          <span className="font-semibold text-gray-300">
            Fecha de Emisión: {SEASON.air_date.split("-")[0]}
          </span>
          <span className="font-semibold text-gray-300">
            Capítulos Disponibles: {AVAILABLE_EPISODES}
          </span>
          <section className="flex flex-col gap-1">
            <span className="font-semibold text-gray-300">Valoración</span>
            <Stars count={5} size={30} value={SEASON.vote_average / 2} />
          </section>
        </section>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
          Episodios
        </h2>
        <div className="flex flex-col gap-7">
          {EPISODES_LIST.map((episode: any, index: number) => (
            <Link
              key={index}
              className="flex flex-col gap-2 w-full bg-gray-900 transition hover:scale-105 min-[600px]:flex-row"
              href={`/player?type=series&id=${id}&season=${seasonId}&episode=${episode.episode_number}`}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                alt={`Episodio ${episode.episode_number} Cover`}
                width={520}
                height={300}
                className="w-full rounded-sm min-[600px]:w-48"
              />
              <section className="flex flex-col gap-1 p-3 min-[600px]:w-3/4">
                <span className="font-semibold text-gray-300 hyphens-auto">
                  Episodio {episode.episode_number}: {episode.name}
                </span>
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
