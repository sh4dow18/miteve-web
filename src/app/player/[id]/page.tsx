import { default as PlayerComponent } from "@/components/Player"
import { FindContentById } from "@/services/api";

type Props = {
  params: {
    id: string;
  };
};

export default async function Player({ params }: Props) {
  const { id } = await params;
  const content = await FindContentById(id);
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PlayerComponent content={content} />
    </div>
  );
}