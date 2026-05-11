import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTES_LIST, ROUTES_MAP, routeToHref } from "@/shared/config/routes";
import { getToken, hasAuthority, getMainProfile, type MainProfile } from "@/shared/lib/auth";

export const menuItems = ROUTES_LIST.filter((route) => route.inHome).map(
  (route) => ({
    icon: route.Icon,
    label: route.title,
    path: routeToHref(route.path),
  })
);

const loginItem = {
  icon: ROUTES_MAP.login.Icon,
  label: ROUTES_MAP.login.title,
  path: routeToHref(ROUTES_MAP.login.path),
};

const accountItem = {
  icon: ROUTES_MAP.account.Icon,
  label: ROUTES_MAP.account.title,
  path: routeToHref(ROUTES_MAP.account.path),
};

const adminNavItem = {
  icon: ROUTES_MAP.admin.Icon,
  label: ROUTES_MAP.admin.title,
  path: routeToHref(ROUTES_MAP.admin.path),
};

export function useSidebar() {
  const location = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mainProfile, setMainProfileState] = useState<MainProfile | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(hasAuthority(token, "read-admin-page"));
      setMainProfileState(getMainProfile());
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setMainProfileState(null);
    }
  }, [location]);

  const authItem = isLoggedIn ? accountItem : loginItem;
  const dynamicMenuItems = isAdmin
    ? [...menuItems, adminNavItem]
    : menuItems;

  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return {
    menuItems: dynamicMenuItems,
    authItem,
    mainProfile,
    isLoggedIn,
    drawerOpen,
    isActive,
    openDrawer,
    closeDrawer,
  };
}
