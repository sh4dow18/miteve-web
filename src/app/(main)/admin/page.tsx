import AdminFeaturePage from "@/features/admin/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
	title: ROUTES_MAP.admin.metadata.title,
	description: ROUTES_MAP.admin.metadata.description,
};

export default function AdminPage() {
	return <AdminFeaturePage />;
}
