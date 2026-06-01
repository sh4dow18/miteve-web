import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { ShortContent, MiniSeason, FullEpisode, EpisodeRequest } from "@/entities/content/model/types";
import { useEpisodeModal } from "@/features/admin/model/modals/useEpisodeModal";

interface Props {
  item: FullEpisode | null;
  seasons: MiniSeason[];
  contents: ShortContent[];
  onSave: (data: EpisodeRequest) => void;
  onClose: () => void;
  reloadEpisodes: (episodesList: FullEpisode[]) => void;
}

export default function EpisodeModal({
  item,
  seasons,
  contents,
  onSave,
  onClose,
  reloadEpisodes,
}: Props) {
  const { error, formData, handleSubmit, setField, getSeasonLabel } =
    useEpisodeModal({ item, onSave, reloadEpisodes });

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
            {item ? "Editar" : "Agregar"} Episodio
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Temporada *
              </label>
              <select
                required
                value={formData.seasonId}
                onChange={(e) => setField("seasonId", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              >
                <option value="">Seleccionar temporada</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {getSeasonLabel(season, contents)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Número de Episodio *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.episodeNumber}
                onChange={(e) =>
                  setField("episodeNumber", parseInt(e.target.value, 10) || 1)
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Título del Episodio *
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              placeholder="Ej: El Principio del Fin"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              value={formData.overview}
              onChange={(e) => setField("overview", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
              placeholder="Descripción del episodio..."
            />
          </div>

          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-6 space-y-4">
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
                  Créditos: Inicio
                </label>
                <input
                  type="text"
                  value={formData.beginCredits}
                  onChange={(e) => setField("beginCredits", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
            </div>
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
