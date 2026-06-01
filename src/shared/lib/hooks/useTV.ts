"use client";

import { useEffect, useState } from "react";

function isTVDevice(): boolean {
  if (typeof window === "undefined") return false;
  if ((window as { AndroidApp?: { isAndroidApp: () => boolean } }).AndroidApp?.isAndroidApp()) return true;
  return navigator.userAgent.toLowerCase().includes("aft");
}

export function useTV(): boolean {
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    setIsTV(isTVDevice());
  }, []);

  return isTV;
}
