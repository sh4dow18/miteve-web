import MoviesFeaturePage from "@/features/movies/page";
import { getMoviesPageData } from "@/features/movies/model/getMoviesPageData";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.movies.metadata.title,
	description: ROUTES_MAP.movies.metadata.description,
};
export const dynamic = "force-dynamic";

export default async function MoviesPage() {
	const data = await getMoviesPageData();
	return <MoviesFeaturePage data={data} />;
}
