import { motion } from "framer-motion";
import { X, Save, Info, ChevronUp, ChevronDown } from "lucide-react";
import { Genre, ShortContent, ContentRequest, MiniContainer } from "@/entities/content/model/types";
import { useContentModal } from "@/features/admin/model/modals/useContentModal";

interface Props {
  item: ShortContent | null;
  containers: MiniContainer[];
  genres: Genre[];
  onSave: (data: ContentRequest) => void;
  onClose: () => void;
}

export function ContentModal({
  item,
  containers,
  genres,
  onSave,
  onClose,
}: Props) {
  const {
    tmdbId,
    trailerDuration,
    formData,
    loadingTMDB,
    error,
    setTmdbId,
    setTrailerDuration,
    setField,
    fetchFromTMDB,
    toggleGenre,
    handleSubmit,
    handleNumberInput,
    decrementContainerPosition,
    incrementContainerPosition,
    toggleComingSoon,
  } = useContentModal({ item, onSave, containers, genres });

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
            {item ? "Editar" : "Agregar"} Contenido
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {item === null && (
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
              <label className="block text-sm text-gray-400 mb-2">
                ID de TMDB (Opcional - Autocompletar)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tmdbId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTmdbId(val ? Number.parseInt(val, 10) : null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                  placeholder="Ej: 550"
                  min="1"
                />
                <button
                  type="button"
                  onClick={fetchFromTMDB}
                  disabled={loadingTMDB || !tmdbId}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingTMDB ? "Cargando..." : "Obtener de TMDB"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setField("title", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Año *</label>
              <input
                type="number"
                required
                min="1800"
                max="2100"
                value={formData.year || ""}
                onChange={(e) =>
                  handleNumberInput(e.target.value, "year", 1800, 2100)
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
              <select
                value={formData.typeId}
                onChange={(e) =>
                  setField("typeId", Number.parseInt(e.target.value, 10))
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              >
                <option value="1">Película</option>
                <option value="2">Serie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating || ""}
                onChange={(e) =>
                  handleNumberInput(e.target.value, "rating", 0, 10)
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Clasificación
              </label>
              <input
                type="number"
                min="0"
                value={formData.age || ""}
                onChange={(e) => handleNumberInput(e.target.value, "age", 0)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                placeholder="Ej: 13, 16, 18"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Duración de Trailer
              </label>
              <input
                type="text"
                value={trailerDuration}
                onChange={(e) => setTrailerDuration(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                placeholder="00:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Eslogan</label>
            <input
              type="text"
              value={formData.tagline || ""}
              onChange={(e) => setField("tagline", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              placeholder="Ej: Mischief. Mayhem. Soap."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Descripción *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
            />
          </div>

          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              Código de Trailer de YouTube
            </label>
            <input
              type="text"
              value={formData.trailer}
              onChange={(e) => setField("trailer", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              placeholder="Ej: dQw4w9WgXcQ"
            />
            <p className="text-xs text-gray-500 mt-2">
              Solo el código, no la URL completa
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL del Póster
              </label>
              <input
                type="text"
                value={formData.cover}
                onChange={(e) => setField("cover", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL del Backdrop
              </label>
              <input
                type="text"
                value={formData.background}
                onChange={(e) => setField("background", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
            <label className="block text-sm text-gray-400 mb-3">
              Contenedor y Posición
            </label>
            <div className="space-y-3">
              <select
                value={formData.containerId}
                onChange={(e) =>
                  setField("containerId", Number.parseInt(e.target.value, 10))
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              >
                <option value="0">Sin contenedor</option>
                {containers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {formData.containerId > 0 && (
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">
                    Posición en contenedor:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={decrementContainerPosition}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-gray-800 rounded">
                      {formData.containerPosition}
                    </span>
                    <button
                      type="button"
                      onClick={incrementContainerPosition}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
            <label className="block text-sm text-gray-400 mb-3">Géneros</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.genresList.includes(genre.id)
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Nota (Solo visible para administradores)
            </label>
            <textarea
              rows={3}
              value={formData.note || ""}
              onChange={(e) => setField("note", e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
              placeholder="Notas internas sobre este contenido..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
            <div>
              <p className="font-medium">Próximamente</p>
              <p className="text-sm text-gray-400">
                Marcar este contenido como próximo estreno
              </p>
            </div>
            <button
              type="button"
              onClick={toggleComingSoon}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                formData.comingSoon ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.comingSoon ? "translate-x-7" : ""
                }`}
              />
            </button>
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
