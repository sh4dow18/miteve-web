"use client";

import { useState } from "react";

function isTVDevice(): boolean {
  if (typeof window === "undefined") return false;
  if ((window as { AndroidApp?: { isAndroidApp: () => boolean } }).AndroidApp?.isAndroidApp()) return true;
  return navigator.userAgent.toLowerCase().includes("aft");
}

export function useTV(): boolean {
  const [isTV] = useState(() => isTVDevice());
  return isTV;
}
