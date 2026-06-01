import { useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { ProfileInfo } from "./useProfile";

export type UpdateProfileFields = Partial<Omit<ProfileInfo, "id" | "avatar">>;

export function useUpdateProfile(id: string, onSuccess: (updated: ProfileInfo) => void) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function save(fields: UpdateProfileFields) {
    setSaving(true);
    setSaveError(null);
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_HOST_IP}/profiles/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("No se pudo guardar.");
      const updated: ProfileInfo = await res.json();
      onSuccess(updated);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Error de conexión.");
    } finally {
      setSaving(false);
    }
  }

  return { save, saving, saveError };
}
