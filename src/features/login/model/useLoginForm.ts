import { useState } from "react";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí iría la lógica de login real
  }

  return {
    showPassword,
    toggleShowPassword,
    form,
    handleChange,
    handleSubmit,
  };
}
