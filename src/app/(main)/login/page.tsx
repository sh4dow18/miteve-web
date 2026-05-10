import LoginFeaturePage from "@/features/login/page";
import { ROUTES_MAP } from "@/shared/config/routes";

export const metadata = {
  title: ROUTES_MAP.login.metadata.title,
  description: ROUTES_MAP.login.metadata.description,
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginFeaturePage />;
}
