import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_HOST_IP } from "@/shared/config/env";

export function useRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const strength = Math.min(
    [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length,
    4
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPassword(value);
  }

  function toggleShowPassword() {
    setShowPassword((v) => !v);
  }

  function toggleAgreed() {
    setAgreed((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const name = form.apellido
      ? `${form.nombre} ${form.apellido}`
      : form.nombre;
    try {
      const res = await fetch(`${API_HOST_IP}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Error al crear la cuenta. Intenta de nuevo.");
        return;
      }
      router.push("/login");
    } catch {
      setError("Error de conexión. Verifica tu red e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return {
    showPassword,
    toggleShowPassword,
    agreed,
    toggleAgreed,
    password,
    setPassword,
    strength,
    form,
    handleChange,
    handleSubmit,
    loading,
    error,
  };
}
