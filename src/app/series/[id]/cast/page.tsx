// Series Cast Page Requirements
import { Metadata } from "next";
import { Cast } from "@/components";
import { FindAllSeriesCastFromTMDB } from "@/lib/series";
// Series Cast Page Metadata
export const metadata: Metadata = {
  title: "Créditos",
  description:
    "Aquí se pueden ver todos los créditos de la película seleccionada",
};
// Series Cast Page Props
interface Props {
  params: Promise<{ id: string }>;
}
// Series Cast Page Main Function
async function SeriesCastPage({ params }: Props) {
  // Series Cast Page Main Constants
  const { id } = await params;
  const CREDITS = (await FindAllSeriesCastFromTMDB(id)).cast;
  // Returns Series Cast Page
  return (
    <Cast
      type="series"
      credits={CREDITS}
      contentId={id}
    />
  );
}

export default SeriesCastPage;
