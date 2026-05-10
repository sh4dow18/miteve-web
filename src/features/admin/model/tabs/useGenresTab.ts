import { useState } from "react";
import { Genre, GenreRequest } from "@/entities/content/model/types";

interface UseGenresTabParams {
  onAdd: (data: GenreRequest) => void;
  onEdit: (id: number | string, data: GenreRequest) => void;
}

export function useGenresTab({ onAdd, onEdit }: UseGenresTabParams) {
  const [editingItem, setEditingItem] = useState<Genre | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: Genre) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = (data: GenreRequest) => {
    if (editingItem) {
      onEdit(editingItem.id, data);
    } else {
      onAdd(data);
    }
    handleClose();
  };

  return {
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  };
}
