// Player Page Requirements
import { Metadata } from "next";
import { NotFound, Player } from "@/components";
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
  const ID = (await searchParams).id;
  // Check if the content exists
  const EXISTS = await fetch(`http://localhost:8080/api/movies/stream/${ID}`, {
    method: "HEAD",
  });
  const CONTENT = await fetch(`http://localhost:8080/api/movies/${ID}`).then(
    (response) => response.json()
  );
  // Check if exists a low quality version
  const LOW_RESOLUTION = await fetch(
    `http://localhost:8080/api/movies/stream/${ID}?quality=low`,
    {
      method: "HEAD",
    }
  );
  return EXISTS.ok ? (
    <Player
      id={`${ID}`}
      name={CONTENT.title}
      description={CONTENT.description}
      changeQuality={LOW_RESOLUTION.ok === true}
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
