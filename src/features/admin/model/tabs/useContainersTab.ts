import { useState } from "react";
import {
  ContainerRequest,
  MiniContainer,
} from "@/entities/content/model/types";

interface UseContainersTabParams {
  onAdd: (data: ContainerRequest) => void;
  onEdit: (id: number | string, data: ContainerRequest) => void;
}

export function useContainersTab({ onAdd, onEdit }: UseContainersTabParams) {
  const [editingItem, setEditingItem] = useState<MiniContainer | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: MiniContainer) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = (data: ContainerRequest) => {
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
