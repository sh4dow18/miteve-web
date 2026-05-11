import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP } from "@/shared/config/env";
import { clearToken, clearMainProfile, getAuthorities, getToken, getUserId } from "@/shared/lib/auth";


export type MiniProfileResponse = {
  id: string;
  name: string;
  avatar?: string;
};

export type MiniRoleResponse = {
  id: number;
  name: string;
};

export type AccountInfo = {
  id: number;
  email: string;
  profilesList: MiniProfileResponse[];
  role: MiniRoleResponse;
};

export function useAccount() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const userId = getUserId(token);
    setAuthorities(getAuthorities(token));

    if (!userId) {
      setError("Token inválido. Por favor inicia sesión de nuevo.");
      setLoading(false);
      return;
    }

    fetch(`${API_HOST_IP}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo obtener la información de la cuenta.");
        return res.json();
      })
      .then((data: AccountInfo) => setAccount(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error de conexión.")
      )
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    clearToken();
    clearMainProfile();
    router.push("/login");
  }

  return { account, authorities, loading, error, handleLogout };
}
