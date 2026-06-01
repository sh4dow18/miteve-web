import TvShowsFeaturePage from "@/features/tv-shows/page";
import { getTvShowsPageData } from "@/features/tv-shows/model/getTvShowsPageData";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP["tv-shows"].metadata.title,
	description: ROUTES_MAP["tv-shows"].metadata.description,
};
export const dynamic = "force-dynamic";

export default async function TvShowsPage() {
	const data = await getTvShowsPageData();
	return <TvShowsFeaturePage data={data} />;
}
