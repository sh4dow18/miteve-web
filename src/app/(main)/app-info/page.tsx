import { AppInfoFeaturePage } from "@/features/app-info/page";
import { ROUTES_MAP, ROUTES_LIST } from "@/shared/config/routes";

const appInfoRoute =
  ROUTES_MAP["app-info"] ?? ROUTES_LIST.find((route) => route.path === "app-info");

export const metadata = {
  title: appInfoRoute?.metadata.title ?? "Informacion de la aplicacion",
  description:
    appInfoRoute?.metadata.description ?? "Detalles sobre la aplicacion Miteve.",
};

export default function AppInfoPage() {
  return <AppInfoFeaturePage />;
}
