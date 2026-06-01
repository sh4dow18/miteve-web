import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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

  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Refs for D-pad / arrow-key navigation (TV remote support)
  const profileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevModalOpen = useRef(false);

  // ── Fetch profiles ────────────────────────────────────────────────────────
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

  // ── Auto-focus first card when page is ready ─────────────────────────────
  useEffect(() => {
    if (!loading && !error) {
      profileRefs.current[0]?.focus();
    }
  }, [loading, error]);

  // ── Return focus to "Add profile" button after modal closes ──────────────
  useEffect(() => {
    if (prevModalOpen.current && !modalOpen) {
      addButtonRef.current?.focus();
    }
    prevModalOpen.current = modalOpen;
  }, [modalOpen]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const canAddProfile = profiles.length < MAX_PROFILES;

  function getAllCards(): HTMLButtonElement[] {
    const cards: (HTMLButtonElement | null)[] = [
      ...profileRefs.current.slice(0, profiles.length),
    ];
    if (canAddProfile) cards.push(addButtonRef.current);
    return cards.filter((c): c is HTMLButtonElement => c !== null);
  }

  function handleCardKeyDown(e: ReactKeyboardEvent, idx: number) {
    const cards = getAllCards();
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      cards[(idx + 1) % cards.length]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      cards[(idx - 1 + cards.length) % cards.length]?.focus();
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────
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
        throw new Error(
          (body as { message?: string }).message ?? "No se pudo crear el perfil."
        );
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

  return {
    profiles,
    loading,
    error,
    canAddProfile,
    modalOpen,
    newName,
    addError,
    adding,
    profileRefs,
    addButtonRef,
    selectProfile,
    openModal,
    closeModal,
    handleNameChange,
    handleAddProfile,
    handleCardKeyDown,
  };
}
