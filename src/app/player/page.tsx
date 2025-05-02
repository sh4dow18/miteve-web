// Player Page Requirements
import { Metadata } from "next";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
// Player Page Props
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export const metadata: Metadata = {
  title: "Reproductor",
  description: "Aqui se puede reproducir el contenido deseado",
};
// Player Page Main Function
async function Player({ searchParams }: Props) {
  // Player Page Main Params
  const TYPE = (await searchParams).type;
  const ID = (await searchParams).id;
  const SEASON = (await searchParams).season;
  const EPISODE = (await searchParams).episode;
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
    // Function that Check if the File Exists in Project
    async function FileExists(): Promise<boolean> {
      const FILE = `/videos/${TYPE}/${ID}${
        TYPE === "movies"
          ? `.webm`
          : `/Temporada ${SEASON}/Episodio ${EPISODE}.webm`
      }`;
      const PATH_WITH_FILE = path.join(process.cwd(), "public", FILE);
      try {
        await fs.access(PATH_WITH_FILE);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
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
  // Return Player Page
  return (await ValidFile()) ? (
    // Player Page Main Container
    <div className="flex-1 relative">
      {/* Content Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        src={`/videos/${TYPE}/${ID}${
          TYPE === "movies"
            ? `.webm`
            : `/Temporada ${SEASON}/Episodio ${EPISODE}.webm`
        }`}
        controls
        autoPlay
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

export default Player;
