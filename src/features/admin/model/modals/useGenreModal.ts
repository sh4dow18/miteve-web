import { useState, type ChangeEvent, type FormEvent } from "react";
import { Genre, GenreRequest } from "@/entities/content/model/types";

interface UseGenreModalParams {
  item: Genre | null;
  onSave: (data: GenreRequest) => void;
}

export function useGenreModal({ item, onSave }: UseGenreModalParams) {
  const [formData, setFormData] = useState<GenreRequest>({
    name: item?.name || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("El nombre del genero es requerido");
      return;
    }

    if (trimmedName.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (trimmedName.length > 50) {
      setError("El nombre no puede exceder 50 caracteres");
      return;
    }

    const validNamePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/;
    if (!validNamePattern.test(trimmedName)) {
      setError("El nombre solo puede contener letras, espacios y guiones");
      return;
    }

    setError(null);
    onSave({ name: trimmedName });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (error) setError(null);
  };

  const selectExample = (example: string) => {
    setFormData({ name: example });
    if (error) setError(null);
  };

  return {
    formData,
    error,
    handleSubmit,
    handleNameChange,
    selectExample,
  };
}
