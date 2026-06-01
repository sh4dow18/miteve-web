import { AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2 } from "lucide-react";
import { Genre, ShortContent, ContentRequest, MiniContainer } from "@/entities/content/model/types";
import { ContentModal } from "@/features/admin/ui/ContentModal";
import { useContentTab } from "@/features/admin/model/tabs/useContentTab";

interface Props {
  contents: ShortContent[];
  containers: MiniContainer[];
  genres: Genre[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: (data: ContentRequest) => void;
  onEdit: (id: string, data: ContentRequest) => void;
}

export function ContentTab({
  contents,
  containers,
  genres,
  searchTerm,
  setSearchTerm,
  onAdd,
  onEdit,
}: Props) {
  const {
    filtered,
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  } = useContentTab({
    contents,
    searchTerm,
    onAdd,
    onEdit,
    containers,
    genres,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Contenido</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors w-full sm:w-auto"
          tabIndex={0}
        >
          <Plus className="w-5 h-5" />
          Agregar Contenido
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded border border-gray-700 focus:border-white focus:outline-none"
          tabIndex={0}
        />
      </div>

      {/* Vista de tarjetas para móvil */}
      <div className="md:hidden space-y-3">
        {filtered.map((content) => (
          <div key={content.id} className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{content.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {content.type === "movie" ? "Película" : "Serie"} · {content.year} · +{content.age}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-yellow-500 text-sm">★ {content.rating}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      content.comingSoon
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-green-600/20 text-green-400"
                    }`}
                  >
                    {content.comingSoon ? "Próximamente" : "Disponible"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{content.createdDate}</p>
              </div>
              <button
                onClick={() => handleOpenEdit(content)}
                className="p-2 hover:bg-white/10 rounded transition-colors shrink-0"
                tabIndex={0}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista de tabla para escritorio */}
      <div className="hidden md:block bg-gray-900/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left">Título</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Año</th>
              <th className="px-6 py-4 text-left">Rating</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Clasificación</th>
              <th className="px-6 py-4 text-left">Creado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((content) => (
              <tr
                key={content.id}
                className="border-t border-gray-800 hover:bg-gray-800/30"
              >
                <td className="px-6 py-4">{content.title}</td>
                <td className="px-6 py-4 capitalize">{content.type === "movie" ? "Película" : "Serie"}</td>
                <td className="px-6 py-4">{content.year}</td>
                <td className="px-6 py-4">
                  <span className="text-yellow-500">★ {content.rating}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      content.comingSoon
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-green-600/20 text-green-400"
                    }`}
                  >
                    {content.comingSoon ? "Próximamente" : "Disponible"}
                  </span>
                </td>
                <td className="px-6 py-4">+{content.age}</td>
                <td className="px-6 py-4">{content.createdDate}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(content)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                      tabIndex={0}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <ContentModal
            item={editingItem}
            containers={containers}
            genres={genres}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}