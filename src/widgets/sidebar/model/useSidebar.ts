import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ROUTES_LIST, ROUTES_MAP, routeToHref } from "@/shared/config/routes";
import { getToken, hasAuthority, getMainProfile } from "@/shared/lib/auth";

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

const downloadsNavItem = {
  icon: ROUTES_MAP.downloads.Icon,
  label: ROUTES_MAP.downloads.title,
  path: routeToHref(ROUTES_MAP.downloads.path),
};

function detectIsTV(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & { AndroidApp?: { isAndroidApp: () => boolean } };
  if (w.AndroidApp?.isAndroidApp()) return true;
  return navigator.userAgent.toLowerCase().includes("aft");
}

function subscribeNothing() {
  return () => {};
}

function getShortScreenSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-height: 779px)").matches;
}

function getVeryShortScreenSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-height: 614px)").matches;
}

function getMountedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useSidebar() {
  const location = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTV] = useState(() => detectIsTV());
  const isShortScreen = useSyncExternalStore(subscribeNothing, getShortScreenSnapshot, getServerSnapshot);
  const isVeryShortScreen = useSyncExternalStore(subscribeNothing, getVeryShortScreenSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(subscribeNothing, getMountedSnapshot, getServerSnapshot);

  const token = getToken();
  const isLoggedIn = !!token;
  const isAdmin = token ? hasAuthority(token, "read-admin-page") : false;
  const mainProfile = token ? getMainProfile() : null;

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const profileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const authLinkRef = useRef<HTMLAnchorElement | null>(null);

  const authItem = isLoggedIn ? accountItem : loginItem;
  const dynamicMenuItems = [
    ...menuItems,
    downloadsNavItem,
    ...(isAdmin ? [adminNavItem] : []),
  ];

  const visibleMenuItems = dynamicMenuItems.filter(
    (item) =>
      !isVeryShortScreen ||
      !["/faq", "/app-info", "/admin"].includes(item.path)
  );

  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    if (drawerOpen && mounted) {
      navLinkRefs.current[0]?.focus();
    }
  }, [drawerOpen, mounted]);

  const handleDrawerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const focusable: HTMLElement[] = [];
      if (closeBtnRef.current) focusable.push(closeBtnRef.current);
      navLinkRefs.current.forEach((el) => {
        if (el) focusable.push(el);
      });
      if (isLoggedIn && mainProfile && profileLinkRef.current) {
        focusable.push(profileLinkRef.current);
      }
      if (authLinkRef.current) focusable.push(authLinkRef.current);

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement
      );
      if (currentIndex === -1) return;

      e.preventDefault();
      const len = focusable.length;
      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % len
          : (currentIndex - 1 + len) % len;
      focusable[nextIndex]?.focus();
    },
    [isLoggedIn, mainProfile]
  );

  return {
    menuItems: dynamicMenuItems,
    visibleMenuItems,
    authItem,
    mainProfile,
    isLoggedIn,
    isTV,
    isShortScreen,
    isVeryShortScreen,
    mounted,
    drawerOpen,
    isActive,
    openDrawer,
    closeDrawer,
    closeBtnRef,
    navLinkRefs,
    profileLinkRef,
    authLinkRef,
    handleDrawerKeyDown,
  };
}
