import { useState } from "react";

export function useRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí iría la lógica de registro real
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
  };
}
