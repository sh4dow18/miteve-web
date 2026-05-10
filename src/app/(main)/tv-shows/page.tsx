import TvShowsFeaturePage from "@/features/tv-shows/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP["tv-shows"].metadata.title,
	description: ROUTES_MAP["tv-shows"].metadata.description,
};
export const dynamic = "force-dynamic";

export default function TvShowsPage() {
	return <TvShowsFeaturePage />;
}
