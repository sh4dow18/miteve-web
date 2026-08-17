import SuggestContentPage from "@/features/suggest-content/page";
import {
  getSuggestContentPageData,
  getSuggestContentPageDataTV,
} from "@/features/suggest-content/model/getSuggestContentPageData";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP["suggest-content"].metadata.title,
  description: ROUTES_MAP["suggest-content"].metadata.description,
};
export const dynamic = "force-dynamic";

export default async function SuggestContentRoutePage() {
  const [moviesData, tvData] = await Promise.all([
    getSuggestContentPageData(),
    getSuggestContentPageDataTV(),
  ]);
  return <SuggestContentPage moviesData={moviesData} tvData={tvData} />;
}
