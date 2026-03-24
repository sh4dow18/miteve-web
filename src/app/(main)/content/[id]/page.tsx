import { default as DetailComponent } from "@/components/Detail"
import { FindContentById } from "@/services/api";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

// Generate Metadata Function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Generate Metadata Main Params
  const { id } = await params;
  // Generate Metadata Constants
  const EXISTING_CONTENT = await FindContentById(id);
  // const CONTENT = await FindTMDBMovieById(id);
  const TITLE = EXISTING_CONTENT.title;
  // Returns Metadata Generated
  return {
    title: EXISTING_CONTENT ? TITLE : "No Encontrado",
    description: EXISTING_CONTENT
      ? `Aqui se pueden encontrar toda la información referente del contenido '${TITLE}'`
      : "No Encontrado",
  };
}

export default async function Detail({ params }: Props) {
  const { id } = await params;
  const content = await FindContentById(id);
  return <DetailComponent content={content} />
}
