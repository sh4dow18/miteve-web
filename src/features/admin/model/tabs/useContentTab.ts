import { useState } from "react";
import {
  ContentRequest,
  Genre,
  MiniContainer,
  ShortContent,
} from "@/entities/content/model/types";

interface UseContentTabParams {
  onAdd: (data: ContentRequest) => void;
  onEdit: (id: string, data: ContentRequest) => void;
  containers: MiniContainer[];
  genres: Genre[];
}

export function useContentTab({
  onAdd,
  onEdit,
  containers,
  genres,
}: UseContentTabParams) {
  const [editingItem, setEditingItem] = useState<ShortContent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: ShortContent) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = (data: ContentRequest) => {
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
    containers,
    genres,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  };
}
