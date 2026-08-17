"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/shared/lib/auth";

type TabType = "movies" | "tv";

export function useSuggestContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("movies");
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  return {
    activeTab,
    setActiveTab,
    hasToken,
  };
}
