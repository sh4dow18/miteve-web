import { AnimatePresence } from "framer-motion";
import { Tag, Plus, Edit2 } from "lucide-react";
import { Genre, GenreRequest } from "@/entities/content/model/types";
import { GenreModal } from "@/features/admin/ui/GenreModal";
import { useGenresTab } from "@/features/admin/model/tabs/useGenresTab";

interface Props {
  genres: Genre[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: (data: GenreRequest) => void;
  onEdit: (id: number | string, data: GenreRequest) => void;
}

export function GenresTab({
  genres,
  onAdd,
  onEdit,
}: Props) {
  const {
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  } = useGenresTab({ onAdd, onEdit });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Géneros</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors"
          tabIndex={0}
        >
          <Plus className="w-5 h-5" />
          Agregar Género
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <div key={genre.id} className="bg-gray-900/50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold">{genre.name}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(genre)}
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
          <GenreModal
            item={editingItem}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}