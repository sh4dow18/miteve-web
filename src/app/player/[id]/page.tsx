import PlayerFeaturePage from "@/features/player/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP["player/[id]"].metadata.title,
  description: ROUTES_MAP["player/[id]"].metadata.description,
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; time?: string }>;
}

export default function PlayerPage({
	params,
	searchParams,
}: Props) {
	return <PlayerFeaturePage params={params} searchParams={searchParams} />;
}
