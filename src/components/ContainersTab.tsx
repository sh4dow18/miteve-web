import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Folder, Plus, Edit2 } from "lucide-react";
import { ContainerRequest, MiniContainer } from "../types";
import { ContainerModal } from "./ContainerModal";

interface ContainersTabProps {
  containers: MiniContainer[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: (data: ContainerRequest) => void;
  onEdit: (id: number | string, data: ContainerRequest) => void;
}

export function ContainersTab({
  containers,
  onAdd,
  onEdit,
}: ContainersTabProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Contenedores</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors"
          tabIndex={0}
        >
          <Plus className="w-5 h-5" />
          Agregar Contenedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => (
          <div key={container.id} className="bg-gray-900/50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Folder className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-semibold">{container.name}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(container)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  tabIndex={0}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <ContainerModal
            item={editingItem}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
