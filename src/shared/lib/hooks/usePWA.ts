"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribePWA() {
  return () => {};
}

function getSnapshot() {
  const mq = window.matchMedia("(display-mode: standalone)");
  const nav = navigator as Navigator & { standalone?: boolean };
  return mq.matches || nav.standalone === true;
}

function getServerSnapshot() {
  return false;
}

function getMountedSnapshot() {
  return true;
}

/**
 * Returns true when the app is running as an installed PWA
 * (standalone / fullscreen display mode).
 */
export function usePWA(): { isPWA: boolean; mounted: boolean } {
  const isPWA = useSyncExternalStore(subscribePWA, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(subscribePWA, getMountedSnapshot, () => false);

  useEffect(() => {
    const standalone = getSnapshot();
    document.cookie = `miteve_pwa=${standalone ? "1" : "0"}; path=/; SameSite=Strict`;

    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = (e: MediaQueryListEvent) => {
      document.cookie = `miteve_pwa=${e.matches ? "1" : "0"}; path=/; SameSite=Strict`;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { isPWA, mounted };
}
