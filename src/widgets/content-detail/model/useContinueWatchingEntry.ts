import { useEffect, useState } from "react";
import { getToken, getMainProfile } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

type CWItem = {
  id: string;
  content?: { id: string };
};

/**
 * Looks up whether a content is present in the current profile's
 * continue-watching list and exposes a remove() action.
 */
export function useContinueWatchingEntry(contentId: string) {
  const [cwId, setCwId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const token = getToken();
    const profile = getMainProfile();
    if (!token || !profile) return;

    fetch(`${API_HOST_IP}/profiles/${profile.id}/continue-watching`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CWItem[]) => {
        const entry = Array.isArray(data)
          ? data.find((item) => item.content?.id === contentId)
          : undefined;
        setCwId(entry?.id ?? null);
      })
      .catch(() => {/* silently ignore */});
  }, [contentId]);

  async function remove() {
    if (!cwId) return;
    const token = getToken();
    if (!token) return;
    setRemoving(true);
    try {
      const res = await fetch(`${API_HOST_IP}/continue-watching/${cwId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCwId(null);
    } finally {
      setRemoving(false);
    }
  }

  return { cwId, removing, remove };
}
