"use client";

import { AnimatePresence } from "framer-motion";
import { Edit2, Plus, Search, Trash2, UserCog } from "lucide-react";
import { useRolesTab } from "@/features/admin/model/tabs/useRolesTab";
import { RoleModal } from "@/features/admin/ui/RoleModal";

export function RolesTab() {
  const {
    items,
    privileges,
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
  } = useRolesTab();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Roles</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Agregar Rol
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre…"
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
          <UserCog className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron roles.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((role) => (
            <div
              key={role.id}
              className="bg-gray-900/50 rounded-lg p-5 flex flex-col gap-3 border border-white/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <UserCog className="w-5 h-5 text-purple-400 shrink-0" />
                  <h3 className="text-base font-semibold truncate">{role.name}</h3>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(role)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(role.id)}
                    className="p-2 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Privileges list */}
              {role.privilegesList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {role.privilegesList.map((p) => (
                    <span
                      key={p.id}
                      className="px-2.5 py-0.5 rounded-full bg-green-600/15 border border-green-600/25 text-green-400 text-xs font-medium"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">Sin privilegios asignados.</p>
              )}

              <p className="text-xs text-gray-500">ID: {role.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <RoleModal
            item={editingItem}
            privileges={privileges}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
