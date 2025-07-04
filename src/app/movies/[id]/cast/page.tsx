// Movies Cast Page Requirements
import { Cast } from "@/components";
import { FindAllMovieCastFromTMDB } from "@/lib/movies";
import { Metadata } from "next";
// Movies Cast Page Metadata
export const metadata: Metadata = {
  title: "Créditos",
  description:
    "Aquí se pueden ver todos los créditos de la película seleccionada",
};
// Movies Cast Page Props
interface Props {
  params: Promise<{ id: string }>;
}
// Movies Cast Page Main Function
async function MoviesCastPage({ params }: Props) {
  // Movies Cast Page Main Constants
  const { id } = await params;
  const CREDITS = (await FindAllMovieCastFromTMDB(id)).cast;
  // Returns Movies Cast Page
  return (
    <Cast
      type="movies"
      credits={CREDITS}
      contentId={id}
    />
  );
}

export default MoviesCastPage;
