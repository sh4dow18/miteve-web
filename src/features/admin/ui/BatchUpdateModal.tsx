import { motion } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { FullEpisode, MiniSeason } from "@/entities/content/model/types";
import { useBatchUpdateModal } from "@/features/admin/model/modals/useBatchUpdateModal";

interface Props {
  seriesId: string;
  seriesName: string;
  seasons: MiniSeason[];
  onClose: () => void;
  reloadEpisodes: (episodesList: FullEpisode[]) => void;
}

export default function BatchUpdateModal({
  seriesId,
  seriesName,
  seasons,
  onClose,
  reloadEpisodes,
}: Props) {
  const { error, loading, formData, handleSubmit, setField } =
    useBatchUpdateModal({ seriesId, seasons, onClose, reloadEpisodes });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-t-2xl sm:rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Actualizar Episodios en Lote
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              Define el rango de episodios (por temporada y numero) y los valores de tiempo que se aplicaran en lote.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Serie
            </label>
            <input
              type="text"
              readOnly
              value={seriesName}
              className="w-full px-4 py-3 bg-gray-800/50 rounded border border-gray-700 text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-semibold">Rango de Episodios</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Temporada Inicio *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.startSeason}
                  onChange={(e) =>
                    setField("startSeason", parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Episodio Inicio *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.startEpisode}
                  onChange={(e) =>
                    setField("startEpisode", parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Temporada Fin *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.endSeason}
                  onChange={(e) =>
                    setField("endSeason", parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Episodio Fin *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.endEpisode}
                  onChange={(e) =>
                    setField("endEpisode", parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Marcadores de Tiempo</h3>
              <p className="text-sm text-gray-400 mt-1">
                Formato: MM:SS o HH:MM:SS (Ejemplo: 01:30 o 01:15:30)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Resumen: Inicio
                </label>
                <input
                  type="text"
                  value={formData.beginSummary}
                  onChange={(e) => setField("beginSummary", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Resumen: Fin
                </label>
                <input
                  type="text"
                  value={formData.endSummary}
                  onChange={(e) => setField("endSummary", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Intro: Inicio
                </label>
                <input
                  type="text"
                  value={formData.beginIntro}
                  onChange={(e) => setField("beginIntro", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Intro: Fin
                </label>
                <input
                  type="text"
                  value={formData.endIntro}
                  onChange={(e) => setField("endIntro", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Duracion del Ending
                </label>
                <input
                  type="text"
                  value={formData.endingDuration}
                  onChange={(e) => setField("endingDuration", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Actualizando..." : "Actualizar en Lote"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
