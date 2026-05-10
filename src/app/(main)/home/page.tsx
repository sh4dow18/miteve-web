import HomeFeaturePage from "@/features/home/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.home.metadata.title,
	description: ROUTES_MAP.home.metadata.description,
};
export const dynamic = "force-dynamic";

export default function HomePage() {
	return <HomeFeaturePage />;
}
