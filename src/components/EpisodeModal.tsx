import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { ShortContent, MiniSeason, FullEpisode, EpisodeRequest } from "@/types";
import { FindEpisodesBySeasonId } from "@/services/api";
import { secondsToTime, timeToSeconds } from "@/libs/utils";

interface EpisodeFormState {
  seasonId: string;
  episodeNumber: number;
  name: string;
  overview: string;
  beginIntro: string;
  endIntro: string;
  beginSummary: string;
  endSummary: string;
  beginCredits: string;
}

interface EpisodeModalProps {
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
}: EpisodeModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EpisodeFormState>({
    seasonId: item?.id.split("-").slice(0, -1).join("-") || "",
    episodeNumber: item?.episodeNumber || 1,
    name: item?.title || "",
    overview: item?.description || "",
    beginIntro:
      item?.beginIntro !== null && item?.beginIntro !== undefined
        ? secondsToTime(item.beginIntro)
        : "",
    endIntro:
      item?.endIntro !== null && item?.endIntro !== undefined
        ? secondsToTime(item.endIntro)
        : "",
    beginSummary:
      item?.beginSummary !== null && item?.beginSummary !== undefined
        ? secondsToTime(item.beginSummary)
        : "",
    endSummary:
      item?.endSummary !== null && item?.endSummary !== undefined
        ? secondsToTime(item.endSummary)
        : "",
    beginCredits:
      item?.beginCredits !== null && item?.beginCredits !== undefined
        ? secondsToTime(item.beginCredits)
        : "",
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.seasonId) {
      setError("Debe seleccionar una temporada");
      return;
    }

    if (formData.episodeNumber < 1) {
      setError("El número de episodio debe ser mayor a 0");
      return;
    }

    if (!formData.name.trim()) {
      setError("El título del episodio es requerido");
      return;
    }

    if (!formData.overview.trim()) {
      setError("La descripción es requerida");
      return;
    }

    // Validar formato de tiempos
    const timeFields = [
      { name: "beginIntro", value: formData.beginIntro },
      { name: "endIntro", value: formData.endIntro },
      { name: "beginSummary", value: formData.beginSummary },
      { name: "endSummary", value: formData.endSummary },
      { name: "beginCredits", value: formData.beginCredits },
    ];

    for (const field of timeFields) {
      if (field.value && timeToSeconds(field.value) === undefined) {
        setError(
          `Formato de tiempo inválido en ${field.name}. Use MM:SS o HH:MM:SS`
        );
        return;
      }
    }

    const data: EpisodeRequest = {
      episodeNumber: formData.episodeNumber,
      title: formData.name.trim(),
      description: formData.overview.trim(),
      beginIntro: timeToSeconds(formData.beginIntro),
      endIntro: timeToSeconds(formData.endIntro),
      beginSummary: timeToSeconds(formData.beginSummary),
      endSummary: timeToSeconds(formData.endSummary),
      beginCredits: timeToSeconds(formData.beginCredits),
    };
    await onSave(data);
    reloadEpisodes(await FindEpisodesBySeasonId(formData.seasonId));
  };

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
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold">
            {item ? "Editar" : "Agregar"} Episodio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Temporada *
              </label>
              <select
                required
                value={formData.seasonId}
                onChange={(e) =>
                  setFormData({ ...formData, seasonId: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              >
                <option value="">Seleccionar temporada</option>
                {seasons.map((season) => {
                  const tvShowId = season.id.split("-").slice(0, -1).join("-");
                  const content = contents.find((c) => c.id === tvShowId);
                  return (
                    <option key={season.id} value={season.id}>
                      {content?.title || "Serie"} - Temporada{" "}
                      {season.seasonNumber}
                    </option>
                  );
                })}
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
                  setFormData({
                    ...formData,
                    episodeNumber: parseInt(e.target.value) || 1,
                  })
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
              placeholder="Descripción del episodio..."
            />
          </div>

          {/* Marcadores de Tiempo */}
          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Marcadores de Tiempo</h3>
              <p className="text-sm text-gray-400 mt-1">
                Formato: MM:SS o HH:MM:SS (Ejemplo: 01:30 o 01:15:30)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Resumen: Inicio
                </label>
                <input
                  type="text"
                  value={formData.beginSummary}
                  onChange={(e) =>
                    setFormData({ ...formData, beginSummary: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, endSummary: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, beginIntro: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, endIntro: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="00:00"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Créditos: Inicio
                </label>
                <input
                  type="text"
                  value={formData.beginCredits}
                  onChange={(e) =>
                    setFormData({ ...formData, beginCredits: e.target.value })
                  }
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
