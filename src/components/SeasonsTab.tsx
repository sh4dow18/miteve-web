import { FindSeasonsByContentId } from "@/services/api";
import { MiniSeason, ShortContent } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SeasonsModal from "./SeasonsModal";

interface SeasonsTabProps {
  contents: ShortContent[];
}

export default function SeasonsTab({ contents }: SeasonsTabProps) {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [seasons, setSeasons] = useState<MiniSeason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const seriesContents = contents.filter((c) => c.type === "tv-show");

  const selectedContent = selectedContentId
    ? contents.find((c) => c.id === selectedContentId)
    : null;

  const handleContentSelection = async (contentId: string) => {
    setSelectedContentId(contentId);
    setSeasons([]);
    setError(null);
    setLoading(true);

    try {
      const fetchedSeasons = await FindSeasonsByContentId(contentId);
      setSeasons(fetchedSeasons || []);
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las temporadas"
      );
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Temporadas</h2>

        {selectedContentId && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Temporadas desde TMDB
          </button>
        )}
      </div>

      {/* CONTENT SELECT */}
      <div className="bg-gray-900/50 rounded-lg p-6">
        <label className="block text-sm text-gray-400 mb-3">
          Seleccionar Serie
        </label>

        {seriesContents.length === 0 ? (
          <p className="text-gray-400">No hay series disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesContents.map((content) => (
              <button
                key={content.id}
                onClick={() => handleContentSelection(content.id)}
                disabled={loading && selectedContentId !== content.id}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedContentId === content.id
                    ? "border-red-600 bg-red-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                } ${
                  loading && selectedContentId !== content.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <h3 className="font-semibold">{content.title}</h3>
                <p className="text-sm text-gray-400">{content.year}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-gray-900/50 rounded-lg p-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Cargando temporadas...</p>
          </div>
        </div>
      )}

      {/* SEASONS */}
      {selectedContent && !loading && (
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Temporadas de "{selectedContent.title}"
          </h3>

          {seasons.length === 0 ? (
            <p className="text-gray-400">No hay temporadas agregadas aún.</p>
          ) : (
            <div className="grid gap-4">
              {seasons.map((season) => (
                <div key={season.id} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-semibold">
                      Temporada {season.seasonNumber}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {showAddModal && selectedContent && (
          <SeasonsModal
            content={selectedContent}
            onClose={handleClose}
            reloadSeasons={setSeasons}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
