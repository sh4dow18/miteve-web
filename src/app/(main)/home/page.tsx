import HomeFeaturePage from "@/features/home/page";
import { getHomePageData } from "@/features/home/model/getHomePageData";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.home.metadata.title,
	description: ROUTES_MAP.home.metadata.description,
};
export const dynamic = "force-dynamic";

export default async function HomePage() {
	const data = await getHomePageData();
	return <HomeFeaturePage data={data} />;
}
