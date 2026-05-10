import { useState, type ChangeEvent, type FormEvent } from "react";
import { ContainerRequest, MiniContainer } from "@/entities/content/model/types";

interface UseContainerModalParams {
  item: MiniContainer | null;
  onSave: (data: ContainerRequest) => void;
}

export function useContainerModal({ item, onSave }: UseContainerModalParams) {
  const [formData, setFormData] = useState<ContainerRequest>({
    name: item?.name || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("El nombre del contenedor es requerido");
      return;
    }

    if (trimmedName.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (trimmedName.length > 100) {
      setError("El nombre no puede exceder 100 caracteres");
      return;
    }

    setError(null);
    onSave({ name: trimmedName });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (error) setError(null);
  };

  return {
    formData,
    error,
    handleSubmit,
    handleNameChange,
  };
}
