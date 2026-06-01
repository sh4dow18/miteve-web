"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import type { Privilege, Role, RoleRequest } from "@/entities/content/model/types";

interface Props {
  item: Role | null;
  privileges: Privilege[];
  onSave: (data: RoleRequest) => Promise<void>;
  onClose: () => void;
}

export function RoleModal({ item, privileges, onSave, onClose }: Props) {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(item?.name ?? "");
    setSelectedIds(item?.privilegesList.map((p) => p.id) ?? []);
    setError(null);
  }, [item]);

  function togglePrivilege(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimName = name.trim();
    if (!trimName) { setError("El nombre es obligatorio."); return; }
    if (selectedIds.length === 0) { setError("Selecciona al menos un privilegio."); return; }
    setSaving(true);
    try {
      await onSave({ name: trimName, privilegeIds: selectedIds });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

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
        className="bg-gray-900 rounded-t-2xl sm:rounded-lg max-w-lg w-full p-4 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">
            {item ? "Editar" : "Agregar"} Rol
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
              placeholder="ej: Administrador"
              autoFocus
            />
          </div>

          <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
            <label className="block text-sm text-gray-400 mb-3">
              Privilegios{" "}
              {selectedIds.length > 0 && (
                <span className="text-green-400">({selectedIds.length} seleccionados)</span>
              )}
            </label>
            {privileges.length === 0 ? (
              <p className="text-xs text-gray-500">No hay privilegios disponibles.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {privileges.map((priv) => (
                  <button
                    key={priv.id}
                    type="button"
                    onClick={() => togglePrivilege(priv.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedIds.includes(priv.id)
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {priv.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
