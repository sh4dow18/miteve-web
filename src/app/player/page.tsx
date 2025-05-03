// Player Page Requirements
import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Player } from "@/components";
import Link from "next/link";
// Player Page Props
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export const metadata: Metadata = {
  title: "Reproductor",
  description: "Aqui se puede reproducir el contenido deseado",
};
// Player Page Main Function
async function PlayerPage({ searchParams }: Props) {
  // Player Page Main Params
  const TYPE = (await searchParams).type;
  const ID = (await searchParams).id;
  const SEASON = (await searchParams).season;
  const EPISODE = (await searchParams).episode;
  // Function that Check if the File Exists in Project
  async function FileExists(
    plusEpisode?: number,
    plusSeason?: number
  ): Promise<boolean> {
    if (typeof SEASON !== "string") {
      return false;
    }
    if (typeof EPISODE !== "string") {
      return false;
    }
    const SEASON_NUMBER = plusSeason
      ? Number.parseInt(SEASON) + plusSeason
      : SEASON;
    const EPISODE_NUMBER = plusSeason
      ? 1
      : plusEpisode
      ? Number.parseInt(EPISODE) + plusEpisode
      : EPISODE;
    const FILE = `/videos/${TYPE}/${ID}${
      TYPE === "movies"
        ? `.webm`
        : `/Temporada ${SEASON_NUMBER}/Episodio ${EPISODE_NUMBER}.webm`
    }`;
    const PATH_WITH_FILE = path.join(process.cwd(), "public", FILE);
    try {
      await fs.access(PATH_WITH_FILE);
      return true;
    } catch {
      return false;
    }
  }
  // Functions that Check if the params sent are a valid file
  const ValidFile = async (): Promise<boolean> => {
    // Function that Check if the Param Sent is a Valid Code Number
    const ValidNumberParam = (
      param: string | string[] | undefined
    ): boolean => {
      if (typeof param !== "string") {
        return false;
      }
      return /^[0-9]+$/.test(param);
    };
    // Check if Type Exists and it is Movies or Series
    if (TYPE === undefined || !(TYPE === "movies" || TYPE === "series")) {
      return false;
    }
    // If Type is Movies and ID is not a Valid Code Number, return false
    if (TYPE === "movies" && !ValidNumberParam(ID)) {
      return false;
    }
    // If Type is Series and if ID, SEASON or EPISODE are not a Valid Code Numbers, return false
    if (
      TYPE === "series" &&
      (!ValidNumberParam(ID) ||
        !ValidNumberParam(SEASON) ||
        !ValidNumberParam(EPISODE))
    ) {
      return false;
    }

    // If file does not exists, return false
    if ((await FileExists()) === false) {
      return false;
    }
    // If everything is ok, returns true
    return true;
  };
  // Function that check if exists a Next Episode File
  const NextEpisodeFile = async () => {
    if (typeof SEASON !== "string") {
      return 0;
    }
    if (typeof EPISODE !== "string") {
      return 0;
    }
    if ((await FileExists(1, 0)) === true) {
      return Number.parseInt(EPISODE) + 1;
    } else if ((await FileExists(undefined, 1)) === true) {
      return 1;
    }
    return 0;
  };
  // Return Player Page
  return (await ValidFile()) ? (
    <Player
      id={`${ID}`}
      series={
        TYPE === "series"
          ? {
              season: `${SEASON}`,
              episode: `${EPISODE}`,
              nextEpisode: await NextEpisodeFile(),
            }
          : undefined
      }
    />
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
          Contenido No Encontrado
        </h1>
        {/* Not Found Description */}
        <p>Lo sentimos, no se pudo encontrar el contenido que está buscando.</p>
        {/* Not Found Link */}
        <Link
          href="/"
          className="w-fit bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
        >
          Volver al Inicio
        </Link>
      </section>
    </div>
  );
}

export default PlayerPage;
