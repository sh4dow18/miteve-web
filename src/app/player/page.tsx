// Player Page Requirements
import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { NotFound, Player } from "@/components";
import { FindMoviesByProp, FindTMDBMovieById } from "@/lib/movies";
import { FindSeriesByProp, FindTMDBSeasonById } from "@/lib/series";
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
    const SEASON_NUMBER = plusSeason
      ? typeof SEASON === "string"
        ? Number.parseInt(SEASON) + plusSeason
        : SEASON
      : SEASON;
    const EPISODE_NUMBER = plusSeason
      ? 1
      : plusEpisode
      ? typeof EPISODE === "string"
        ? Number.parseInt(EPISODE) + plusEpisode
        : EPISODE
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
      name={
        TYPE === "movies"
          ? FindMoviesByProp("id", `${ID}`)[0].title
          : `${
              FindSeriesByProp("id", `${ID}`)[0].title
            }: T${SEASON} E${EPISODE}`
      }
      description={
        TYPE === "movies"
          ? (await FindTMDBMovieById(`${ID}`)).overview
          : EPISODE && typeof EPISODE === "string"
          ? (await FindTMDBSeasonById(`${ID}`, `${SEASON}`)).episodes[
              Number.parseInt(EPISODE) - 1
            ].overview
          : "No Hay Información Disponible"
      }
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
    <NotFound
      backTo={{
        name: "Inicio",
        href: "/",
      }}
    />
  );
}

export default PlayerPage;
