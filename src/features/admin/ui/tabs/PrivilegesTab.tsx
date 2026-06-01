"use client";

import { AnimatePresence } from "framer-motion";
import { Edit2, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { usePrivilegesTab } from "@/features/admin/model/tabs/usePrivilegesTab";
import { PrivilegeModal } from "@/features/admin/ui/PrivilegeModal";

export function PrivilegesTab() {
  const {
    items,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
    handleDelete,
  } = usePrivilegesTab();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Privilegios</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Agregar Privilegio
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o slug…"
          className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded focus:border-white focus:outline-none text-sm transition-colors"
        />
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron privilegios.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((privilege) => (
            <div
              key={privilege.id}
              className="bg-gray-900/50 rounded-lg p-5 flex flex-col gap-3 border border-white/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <h3 className="text-base font-semibold truncate">{privilege.name}</h3>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(privilege)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(privilege.id)}
                    className="p-2 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-gray-800 border border-white/8 px-2.5 py-1 rounded text-gray-300 truncate">
                  {privilege.slug}
                </span>
              </div>

              <p className="text-xs text-gray-500">ID: {privilege.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <PrivilegeModal
            item={editingItem}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
