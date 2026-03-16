import { default as DetailComponent } from "@/components/Detail"
import { FindContentById } from "@/services/api";

type Props = {
  params: {
    id: string;
  };
};

export default async function Detail({ params }: Props) {
  const { id } = await params;
  const content = await FindContentById(id);
  return <DetailComponent content={content} />
}
