import BugReportPage from "@/features/bug-report/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP["bug-report"].metadata.title,
  description: ROUTES_MAP["bug-report"].metadata.description,
};

export default function BugReportRoutePage() {
  return <BugReportPage />;
}
