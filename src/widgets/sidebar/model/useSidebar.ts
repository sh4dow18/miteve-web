import { useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTES_LIST, routeToHref } from "@/shared/config/routes";

export const menuItems = ROUTES_LIST.filter((route) => route.inHome).map(
  (route) => ({
    icon: route.Icon,
    label: route.title,
    path: routeToHref(route.path),
  })
);

export function useSidebar() {
  const location = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return {
    menuItems,
    drawerOpen,
    isActive,
    openDrawer,
    closeDrawer,
  };
}
