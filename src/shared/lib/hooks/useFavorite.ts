import { useCallback, useEffect, useState } from "react";
import { getMainProfile, getToken } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

export function useFavorite(contentId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = getMainProfile();
    const token = getToken();
    if (!profile || !token) return;

    fetch(`${API_HOST_IP}/profiles/${profile.id}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { id: string }[]) => {
        setIsFavorite(items.some((item) => item.id === contentId));
      })
      .catch(() => {});
  }, [contentId]);

  const toggle = useCallback(async () => {
    const profile = getMainProfile();
    const token = getToken();
    if (!profile || !token || loading) return;

    setLoading(true);
    const method = isFavorite ? "DELETE" : "POST";
    try {
      const res = await fetch(
        `${API_HOST_IP}/profiles/${profile.id}/favorites/${contentId}`,
        { method, headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) setIsFavorite((prev) => !prev);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [contentId, isFavorite, loading]);

  const profile = typeof window !== "undefined" ? getMainProfile() : null;
  const hasProfile = !!profile;

  return { isFavorite, loading, toggle, hasProfile };
}
