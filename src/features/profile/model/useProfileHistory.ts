import { useEffect, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { MiniContent } from "@/entities/content/model/types";

export interface HistoryItem {
  id: number;
  content: MiniContent;
  time: number;
  viewedAt: string;
  viewCount: number;
}

export function useProfileHistory(profileId: string) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    const token = getToken();
    fetch(`${API_HOST_IP}/history/profile/${profileId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: HistoryItem[]) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  return { items, loading };
}
