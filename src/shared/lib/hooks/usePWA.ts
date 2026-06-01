"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the app is running as an installed PWA
 * (standalone / fullscreen display mode).
 */
export function usePWA(): { isPWA: boolean; mounted: boolean } {
  const [isPWA, setIsPWA] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    // Also handle iOS Safari which uses navigator.standalone
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone = mq.matches || nav.standalone === true;
    setIsPWA(standalone);
    // Set cookie so Edge Runtime proxy can detect PWA mode
    document.cookie = `miteve_pwa=${standalone ? "1" : "0"}; path=/; SameSite=Strict`;
    setMounted(true);

    const onChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches);
      document.cookie = `miteve_pwa=${e.matches ? "1" : "0"}; path=/; SameSite=Strict`;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { isPWA, mounted };
}
