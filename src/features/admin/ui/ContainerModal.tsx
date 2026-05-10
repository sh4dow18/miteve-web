import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { ContainerRequest, MiniContainer } from "@/entities/content/model/types";
import { useContainerModal } from "@/features/admin/model/modals/useContainerModal";

interface Props {
  item: MiniContainer | null;
  onSave: (data: ContainerRequest) => void;
  onClose: () => void;
}

export function ContainerModal({ item, onSave, onClose }: Props) {
  const { formData, error, handleSubmit, handleNameChange } =
    useContainerModal({ item, onSave });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-lg max-w-2xl w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {item ? "Editar" : "Agregar"} Contenedor
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre del Contenedor *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              maxLength={100}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
              placeholder="Ej: Acción, Tendencias, Nuevos Estrenos"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.name.length}/100 caracteres
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              <Save className="w-5 h-5" />
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}