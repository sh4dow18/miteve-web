import FaqFeaturePage from "@/features/faq/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP.faq.metadata.title,
  description: ROUTES_MAP.faq.metadata.description,
};

export default function FaqPage() {
  return <FaqFeaturePage />;
}
