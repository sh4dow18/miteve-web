import { useCallback, useEffect, useRef, useState } from "react";
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

export function useSidebar() {
  const location = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mainProfile, setMainProfileState] = useState<MainProfile | null>(null);
  const [isTV, setIsTV] = useState(false);
  const [isShortScreen, setIsShortScreen] = useState(false);
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const profileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const authLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-height: 779px)");
    setIsShortScreen(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsShortScreen(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-height: 614px)");
    setIsVeryShortScreen(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsVeryShortScreen(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setIsTV(detectIsTV());
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
    setMounted(true);
  }, [location]);

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
