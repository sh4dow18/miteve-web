import RegisterFeaturePage from "@/features/register/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP.register.metadata.title,
  description: ROUTES_MAP.register.metadata.description,
};

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return <RegisterFeaturePage />;
}
