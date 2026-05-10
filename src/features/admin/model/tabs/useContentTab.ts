import { useMemo, useState } from "react";
import {
  ContentRequest,
  Genre,
  MiniContainer,
  ShortContent,
} from "@/entities/content/model/types";

interface UseContentTabParams {
  contents: ShortContent[];
  searchTerm: string;
  onAdd: (data: ContentRequest) => void;
  onEdit: (id: string, data: ContentRequest) => void;
  containers: MiniContainer[];
  genres: Genre[];
}

export function useContentTab({
  contents,
  searchTerm,
  onAdd,
  onEdit,
  containers,
  genres,
}: UseContentTabParams) {
  const [editingItem, setEditingItem] = useState<ShortContent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      contents.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [contents, searchTerm]
  );

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
    filtered,
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
