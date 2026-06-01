"use client";

import { AnimatePresence } from "framer-motion";
import { Edit2, Plus, Search, Trash2, Users } from "lucide-react";
import { useUsersTab } from "@/features/admin/model/tabs/useUsersTab";
import { UserModal } from "@/features/admin/ui/UserModal";

export function UsersTab() {
  const {
    items,
    roles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSaveAdd,
    handleSaveEdit,
    handleDelete,
  } = useUsersTab();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por email…"
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
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No se encontraron usuarios.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Perfiles</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{user.id}</td>
                  <td className="px-4 py-3 text-gray-200">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600/15 border border-purple-600/25 text-purple-400 text-xs font-medium">
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {Array.isArray(user.profilesList) ? user.profilesList.length : 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        aria-label="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleDelete(user.id)}
                        className="p-2 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <UserModal
            item={editingItem}
            roles={roles}
            onSaveAdd={handleSaveAdd}
            onSaveEdit={handleSaveEdit}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
