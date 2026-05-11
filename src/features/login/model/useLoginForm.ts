import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP } from "@/shared/config/env";
import { setToken, setMainProfile, getUserId } from "@/shared/lib/auth";

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleShowPassword() {
    setShowPassword((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_HOST_IP}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Credenciales incorrectas. Intenta de nuevo.");
        return;
      }
      const authHeader = res.headers.get("Authorization") ?? res.headers.get("authorization");
      if (authHeader) {
        const raw = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        setToken(raw);
        const userId = getUserId(raw);
        if (userId) {
          fetch(`${API_HOST_IP}/profiles/user/${userId}/main`, {
            headers: { Authorization: `Bearer ${raw}` },
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((profile) => {
              if (profile) setMainProfile(profile);
            })
            .catch(() => {});
        }
      }
      router.push("/home");
    } catch {
      setError("Error de conexión. Verifica tu red e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return {
    showPassword,
    toggleShowPassword,
    form,
    handleChange,
    handleSubmit,
    loading,
    error,
  };
}
