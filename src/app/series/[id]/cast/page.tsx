// Series Cast Page Requirements
import { Metadata } from "next";
import { Cast } from "@/components";
import { FindAllSeriesCastFromTMDB, FindSeriesByProp } from "@/lib/series";
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
  const EXISTING_SERIES = FindSeriesByProp("id", `${id}`)[0];
  const CREDITS = (await FindAllSeriesCastFromTMDB(id)).cast;
  // Returns Series Cast Page
  return (
    <Cast
      type="series"
      title={EXISTING_SERIES.title}
      credits={CREDITS}
      contentId={id}
    />
  );
}

export default SeriesCastPage;
