import SuggestContentPage from "@/features/suggest-content/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP["suggest-content"].metadata.title,
  description: ROUTES_MAP["suggest-content"].metadata.description,
};

export default function SuggestContentRoutePage() {
  return <SuggestContentPage />;
}
