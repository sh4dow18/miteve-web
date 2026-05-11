import AdminFeaturePage from "@/features/admin/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.appInfo.metadata.title,
	description: ROUTES_MAP.appInfo.metadata.description,
};

export default function AdminPage() {
	return <AdminFeaturePage />;
}
