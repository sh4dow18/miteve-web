import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MiniSeason, ShortContent } from "@/entities/content/model/types";
import { useSeasonsModal } from "@/features/admin/model/modals/useSeasonsModal";

interface Props {
  content: ShortContent;
  onSave?: () => void;
  onClose: () => void;
  reloadSeasons: (seasons: MiniSeason[]) => void;
}

export default function SeasonsModal({
  content,
  onSave,
  onClose,
  reloadSeasons,
}: Props) {
  const {
    formData,
    handleSubmit,
    setSeasonStart,
    setEpisodeStart,
    setSeasonEnd,
    setEpisodeEnd,
  } = useSeasonsModal({ content, onSave, onClose, reloadSeasons });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-lg max-w-2xl w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Agregar Temporadas desde TMDB
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Serie seleccionada
            </label>
            <input
              type="text"
              value={`${content.title} (${content.year})`}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 rounded border border-gray-700 text-gray-300 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este contenido ya fue seleccionado previamente
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Temporada Inicial
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.seasonStart}
                onChange={(e) => setSeasonStart(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primera temporada disponible
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Episodio Inicial
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.episodeStart}
                onChange={(e) => setEpisodeStart(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primer episodio disponible
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Temporada Final
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.seasonEnd}
                onChange={(e) => setSeasonEnd(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Última temporada disponible
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Episodio Final
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.episodeEnd}
                onChange={(e) => setEpisodeEnd(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Último episodio disponible
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
          >
            Agregar Temporadas
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
