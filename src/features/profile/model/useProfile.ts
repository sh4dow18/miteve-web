import { useEffect, useState } from "react";
import { getToken } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

export type ProfileInfo = {
  id: string;
  name: string;
  avatar?: string;
};

export function useProfile(id: string) {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = getToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch(`${API_HOST_IP}/profiles/${id}`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo obtener la información del perfil.");
        return res.json();
      })
      .then((data: ProfileInfo) => setProfile(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error de conexión.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { profile, loading, error };
}
