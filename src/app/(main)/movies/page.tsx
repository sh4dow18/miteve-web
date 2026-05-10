import MoviesFeaturePage from "@/features/movies/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.movies.metadata.title,
	description: ROUTES_MAP.movies.metadata.description,
};
export const dynamic = "force-dynamic";

export default function MoviesPage() {
	return <MoviesFeaturePage />;
}
