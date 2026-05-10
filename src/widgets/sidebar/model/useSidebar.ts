import { useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTES_LIST, ROUTES_MAP, routeToHref } from "@/shared/config/routes";

export const menuItems = ROUTES_LIST.filter((route) => route.inHome).map(
  (route) => ({
    icon: route.Icon,
    label: route.title,
    path: routeToHref(route.path),
  })
);

export const authItem = {
  icon: ROUTES_MAP.login.Icon,
  label: ROUTES_MAP.login.title,
  path: routeToHref(ROUTES_MAP.login.path),
};

export function useSidebar() {
  const location = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return {
    menuItems,
    authItem,
    drawerOpen,
    isActive,
    openDrawer,
    closeDrawer,
  };
}
