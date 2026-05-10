import MaintenanceFeaturePage from "@/features/maintenance/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP.maintenance.metadata.title,
  description: ROUTES_MAP.maintenance.metadata.description,
};

export default function MaintenancePage() {
  return <MaintenanceFeaturePage />;
}
