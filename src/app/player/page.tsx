// Player Page Requirements
import { FindMoviesByProp } from "@/lib/movies";
import { Metadata } from "next";
// Player Page Props
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
// Generate Metadata Function
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const ID = (await searchParams).id;
  const EPISODE = (await searchParams).episode;
  const TITLE = EPISODE
    ? `Episodio ${EPISODE}`
    : typeof ID === "string"
    ? await FindMoviesByProp("id", ID)[0].title
    : "No Encontrado";
  // Returns Metadata Generated
  return {
    title: TITLE,
    description: "Aqui se puede reproducir el contenido deseado",
  };
}
// Player Page Main Function
async function Player({ searchParams }: Props) {
  // Player Page Main Params
  const TYPE = (await searchParams).type;
  const ID = (await searchParams).id;
  const SEASON = (await searchParams).season;
  const EPISODE = (await searchParams).episode;
  // Return Player Page
  return (
    // Player Page Main Container
    <div className="flex-1 relative">
      {/* Content Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        src={`${
          process.env.PRODUCTION === "true" ? "../public/" : ""
        }/videos/${TYPE}/${ID}${
          TYPE === "movies"
            ? `.webm`
            : `/Temporada ${SEASON}/Episodio ${EPISODE}.webm`
        }`}
        controls
        autoPlay
      />
    </div>
  );
}

export default Player;
