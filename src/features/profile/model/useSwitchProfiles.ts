import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken, getUserId, setMainProfile } from "@/shared/lib/auth";

export const MAX_PROFILES = 5;

export type ProfileItem = {
  id: string;
  name: string;
  avatar?: string;
};

export function useSwitchProfiles() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const userId = getUserId(token);
    if (!userId) {
      setError("Token inválido. Por favor inicia sesión de nuevo.");
      setLoading(false);
      return;
    }

    fetch(`${API_HOST_IP}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo obtener los perfiles.");
        return res.json() as Promise<{ profilesList: ProfileItem[] }>;
      })
      .then((data) => setProfiles(data.profilesList ?? []))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error de conexión.")
      )
      .finally(() => setLoading(false));
  }, [router]);

  function selectProfile(profile: ProfileItem) {
    setMainProfile({ id: profile.id, name: profile.name, avatar: profile.avatar });
    router.push("/home");
  }

  function openModal() {
    setNewName("");
    setAddError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setNewName("");
    setAddError(null);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
    if (addError) setAddError(null);
  }

  async function handleAddProfile(e: FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();

    if (profiles.length >= MAX_PROFILES) {
      setAddError(`Solo se permiten ${MAX_PROFILES} perfiles por cuenta.`);
      return;
    }

    if (!trimmed) {
      setAddError("El nombre del perfil es requerido.");
      return;
    }
    if (trimmed.length < 2) {
      setAddError("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (trimmed.length > 50) {
      setAddError("El nombre no puede exceder 50 caracteres.");
      return;
    }

    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const userId = getUserId(token);
    setAdding(true);
    setAddError(null);

    try {
      const res = await fetch(`${API_HOST_IP}/profiles/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "No se pudo crear el perfil.");
      }

      const created = (await res.json()) as ProfileItem;
      setProfiles((prev) => [...prev, created]);
      closeModal();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Error al crear el perfil.");
    } finally {
      setAdding(false);
    }
  }

  const canAddProfile = profiles.length < MAX_PROFILES;

  return {
    profiles,
    loading,
    error,
    canAddProfile,
    modalOpen,
    newName,
    addError,
    adding,
    selectProfile,
    openModal,
    closeModal,
    handleNameChange,
    handleAddProfile,
  };
}
