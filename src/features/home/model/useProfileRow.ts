import { useEffect, useState } from "react";
import { getMainProfile, getToken } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";
import type { MiniContent } from "@/entities/content/model/types";

type EndpointBuilder =
  | { type: "profile"; path: (profileId: string) => string }
  | { type: "public"; path: string };

async function fetchItems(endpoint: EndpointBuilder): Promise<MiniContent[]> {
  const token = getToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  let url: string;
  if (endpoint.type === "profile") {
    const profile = getMainProfile();
    if (!profile) return [];
    url = `${API_HOST_IP}${endpoint.path(profile.id)}`;
  } else {
    url = `${API_HOST_IP}${endpoint.path}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}

export function useProfileRow(endpoint: EndpointBuilder, requiresProfile = false) {
  const [items, setItems] = useState<MiniContent[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (requiresProfile && !getMainProfile()) {
      setReady(true);
      return;
    }
    fetchItems(endpoint)
      .then(setItems)
      .catch(() => {})
      .finally(() => setReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, ready };
}
