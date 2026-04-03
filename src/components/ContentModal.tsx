import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Info, ChevronUp, ChevronDown } from "lucide-react";
import { Genre, ShortContent, ContentRequest, MiniContainer } from "../types";
import { TMDB_API_KEY } from "@/services/admin";
import { FindContentById } from "@/services/api";
import { secondsToTime, timeToSeconds } from "@/libs/utils";

interface ContentModalProps {
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
}: ContentModalProps) {
  const [tmdbId, SetTmdbId] = useState<number | null>(null);
  const [trailerDuration, SetTrailerDuration] = useState<string>("");
  const [formData, setFormData] = useState<ContentRequest>({
    tmdbId: 0,
    title: "",
    year: 0,
    tagline: null,
    description: "",
    rating: 0,
    age: 0,
    cover: "",
    background: "",
    trailer: "",
    trailerDuration: 0,
    comingSoon: false,
    note: null,
    genresList: [],
    typeId: 1,
    containerId: 0,
    containerPosition: 0,
  });

  const [loadingTMDB, setLoadingTMDB] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFromTMDB = async () => {
    if (!tmdbId || tmdbId <= 0) {
      setError("Por favor ingresa un ID de TMDB válido");
      return;
    }

    setLoadingTMDB(true);
    setError(null);

    try {
      const detailsRes = await fetch(
        `/api/tmdb?id=${tmdbId}&type=${formData.typeId === 1 ? "movie" : "tv"}`
      );

      if (!detailsRes.ok) {
        throw new Error(`Error de TMDB: ${detailsRes.status}`);
      }

      const data = await detailsRes.json();

      if (data.success === false) {
        throw new Error(
          data.status_message || "Contenido no encontrado en TMDB"
        );
      }

      // 📅 Año
      const year = (data.release_date || data.first_air_date || "").split(
        "-"
      )[0];

      setFormData((prev) => ({
        ...prev,
        title: data.title || data.name || "",
        year: Number(year) || 0,
        description: data.overview || "",
        tagline: data.tagline || "",
        rating: Number(data.vote_average) || 0,
        cover: data.poster_path || "",
        background: data.backdrop_path || "",
      }));
    } catch (error) {
      console.error("Error fetching TMDB:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al obtener datos de TMDB"
      );
    } finally {
      setLoadingTMDB(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    setFormData({
      ...formData,
      genresList: formData.genresList.includes(genreId)
        ? formData.genresList.filter((g: number) => g !== genreId)
        : [...formData.genresList, genreId],
    });
  };

  useEffect(() => {
    const GetData = async () => {
      if (item === null) {
        return;
      }

      try {
        const existingContent = await FindContentById(item.id);

        if (!existingContent) {
          console.error("Contenido no encontrado");
          return;
        }
        SetTrailerDuration(secondsToTime(existingContent.trailerDuration || 0));
        setFormData({
          tmdbId: existingContent.tmdbId || 0,
          title: existingContent.title || "",
          year: existingContent.year || 0,
          tagline: existingContent.tagline ?? "",
          description: existingContent.description || "",
          rating: existingContent.rating || 0,
          age: existingContent.age || 0,
          cover: existingContent.cover || "",
          background: existingContent.background || "",
          trailer: existingContent.trailer || "",
          trailerDuration: existingContent.trailerDuration || 0,
          comingSoon: existingContent.comingSoon || false,
          note: existingContent.note ?? "",
          genresList: Array.isArray(existingContent.genresList)
            ? existingContent.genresList.map((genre) => genre.id)
            : [],
          typeId: existingContent.type === "movie" ? 1 : 2,
          containerId: existingContent.container?.id || 0,
          containerPosition: existingContent.position || 0,
        });
      } catch (error) {
        console.error("Error cargando contenido:", error);
        setError("Error al cargar el contenido");
      }
    };
    GetData();
  }, [item]);

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    // Validaciones
    if (!formData.title.trim()) {
      setError("El título es requerido");
      return;
    }

    if (!formData.description.trim()) {
      setError("La descripción es requerida");
      return;
    }

    if (formData.year < 1800 || formData.year > 2100) {
      setError("El año debe estar entre 1800 y 2100");
      return;
    }

    const trailerSeconds = timeToSeconds(trailerDuration);

    setError(null);
    onSave({
      ...formData,
      trailerDuration: trailerSeconds !== null ? trailerSeconds : 0,
      tmdbId: tmdbId !== null ? tmdbId : 0,
    });
  };

  const handleNumberInput = (
    value: string,
    field: keyof ContentRequest,
    min?: number,
    max?: number
  ) => {
    const num = Number(value);

    if (isNaN(num)) return;

    let finalValue = num;
    if (min !== undefined && num < min) finalValue = min;
    if (max !== undefined && num > max) finalValue = max;

    setFormData({ ...formData, [field]: finalValue });
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
          {/* Error Display */}
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* TMDB ID */}
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
                    SetTmdbId(val ? Number.parseInt(val) : null);
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

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                  setFormData({
                    ...formData,
                    typeId: Number.parseInt(e.target.value),
                  })
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

            {/* <div>
              <label className="block text-sm text-gray-400 mb-2">
                Duración de Trailer (segundos)
              </label>
              <input
                type="number"
                min="0"
                value={formData.trailerDuration || ""}
                onChange={(e) =>
                  handleNumberInput(e.target.value, "trailerDuration", 0)
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
                placeholder="Ej: 120"
              />
            </div> */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Duración de Trailer
              </label>
              <input
                type="text"
                value={trailerDuration}
                onChange={(e) => SetTrailerDuration(e.target.value)}
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
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
            />
          </div>

          {/* Trailer */}
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              Código de Trailer de YouTube
            </label>
            <input
              type="text"
              value={formData.trailer}
              onChange={(e) =>
                setFormData({ ...formData, trailer: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              placeholder="Ej: dQw4w9WgXcQ"
            />
            <p className="text-xs text-gray-500 mt-2">
              Solo el código, no la URL completa
            </p>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL del Póster
              </label>
              <input
                type="text"
                value={formData.cover}
                onChange={(e) =>
                  setFormData({ ...formData, cover: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, background: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* Container Selection */}
          <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
            <label className="block text-sm text-gray-400 mb-3">
              Contenedor y Posición
            </label>
            <div className="space-y-3">
              <select
                value={formData.containerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    containerId: Number.parseInt(e.target.value),
                  })
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
                      onClick={() =>
                        setFormData({
                          ...formData,
                          containerPosition: Math.max(
                            0,
                            formData.containerPosition - 1
                          ),
                        })
                      }
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-gray-800 rounded">
                      {formData.containerPosition}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          containerPosition: formData.containerPosition + 1,
                        })
                      }
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Genres */}
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

          {/* Note */}
          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Nota (Solo visible para administradores)
            </label>
            <textarea
              rows={3}
              value={formData.note || ""}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none resize-none"
              placeholder="Notas internas sobre este contenido..."
            />
          </div>

          {/* Coming Soon Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
            <div>
              <p className="font-medium">Próximamente</p>
              <p className="text-sm text-gray-400">
                Marcar este contenido como próximo estreno
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  comingSoon: !formData.comingSoon,
                })
              }
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

          {/* Actions */}
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
