import SearchFeaturePage from "@/features/search/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP.search.metadata.title,
  description: ROUTES_MAP.search.metadata.description,
};

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return <SearchFeaturePage />;
}
