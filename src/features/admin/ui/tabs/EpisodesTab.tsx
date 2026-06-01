import { Plus, Edit2 } from "lucide-react";
import {
  ShortContent,
  EpisodeRequest,
} from "@/entities/content/model/types";
import { GetTmdbImage } from "@/shared/api/tmdb";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import EpisodeModal from "@/features/admin/ui/EpisodeModal";
import { useEpisodesTab } from "@/features/admin/model/tabs/useEpisodesTab";

interface Props {
  contents: ShortContent[];
  onEdit: (id: string, data: EpisodeRequest) => Promise<void>;
}

export default function EpisodesTab({ contents, onEdit }: Props) {
  const {
    selectedContentId,
    selectedSeasonId,
    seasons,
    episodes,
    loadingSeasons,
    loadingEpisodes,
    error,
    editingItem,
    showModal,
    seriesContents,
    selectedContent,
    selectedSeason,
    setEpisodes,
    handleContentSelection,
    handleSeasonSelection,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  } = useEpisodesTab({ contents, onEdit });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Episodios</h2>

        {selectedSeasonId && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Agregar Episodio
          </button>
        )}
      </div>

      <div className="bg-gray-900/50 rounded-lg p-6">
        <label className="block text-sm text-gray-400 mb-3">
          1. Seleccionar Serie
        </label>

        {seriesContents.length === 0 ? (
          <p className="text-gray-400">No hay series disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesContents.map((content) => (
              <button
                key={content.id}
                onClick={() => handleContentSelection(content.id)}
                disabled={loadingSeasons && selectedContentId !== content.id}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedContentId === content.id
                    ? "border-red-600 bg-red-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                } ${
                  loadingSeasons && selectedContentId !== content.id
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

      {error && (
        <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loadingSeasons && (
        <div className="bg-gray-900/50 rounded-lg p-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Cargando temporadas...</p>
          </div>
        </div>
      )}

      {selectedContent && !loadingSeasons && seasons.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6">
          <label className="block text-sm text-gray-400 mb-3">
            2. Seleccionar Temporada de &quot;{selectedContent.title}&quot;
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonSelection(season.id)}
                disabled={loadingEpisodes && selectedSeasonId !== season.id}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSeasonId === season.id
                    ? "border-blue-600 bg-blue-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                } ${
                  loadingEpisodes && selectedSeasonId !== season.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <h4 className="font-semibold">
                  Temporada {season.seasonNumber}
                </h4>
              </button>
            ))}
          </div>
        </div>
      )}

      {loadingEpisodes && (
        <div className="bg-gray-900/50 rounded-lg p-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Cargando episodios...</p>
          </div>
        </div>
      )}

      {selectedSeason && !loadingEpisodes && (
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Episodios de &quot;Temporada {selectedSeason.seasonNumber}&quot;
          </h3>

          {episodes.length === 0 ? (
            <p className="text-gray-400">No hay episodios agregados aún.</p>
          ) : (
            <div className="grid gap-4">
              {episodes.map((episode) => (
                <div key={episode.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                  {/* Imagen full-width en móvil, oculta en sm+ */}
                  {episode.cover && (
                    <div className="w-full h-40 sm:hidden">
                      <Image
                        src={GetTmdbImage(episode.cover)}
                        alt={episode.title}
                        width={400}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-4 sm:p-6">
                    {/* Imagen miniatura solo en sm+ */}
                    {episode.cover && (
                      <div className="hidden sm:block w-32 h-20 shrink-0 rounded overflow-hidden bg-gray-700">
                        <Image
                          src={GetTmdbImage(episode.cover)}
                          alt={episode.title}
                          width={128}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium shrink-0 mt-0.5">
                          E{episode.episodeNumber}
                        </span>
                        <h4 className="text-base sm:text-lg font-semibold leading-tight">
                          {episode.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {episode.description && episode.description !== ""
                          ? episode.description
                          : "No hay información de este episodio"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(episode)}
                      className="p-2 hover:bg-white/10 rounded transition-colors shrink-0"
                      aria-label={`Editar episodio ${episode.episodeNumber}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <EpisodeModal
            item={editingItem}
            seasons={seasons}
            contents={contents}
            onSave={handleSave}
            onClose={handleClose}
            reloadEpisodes={setEpisodes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
