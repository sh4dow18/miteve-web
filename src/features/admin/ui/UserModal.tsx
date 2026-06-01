"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Save, X } from "lucide-react";
import type { AppUser, MiniRole } from "@/entities/content/model/types";

interface AddData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

interface EditData {
  email?: string;
  password?: string;
  roleId?: number;
}

interface Props {
  item: AppUser | null;
  roles: MiniRole[];
  onSaveAdd: (data: AddData) => Promise<void>;
  onSaveEdit: (id: number, data: EditData) => Promise<void>;
  onClose: () => void;
}

export function UserModal({ item, roles, onSaveAdd, onSaveEdit, onClose }: Props) {
  const isEdit = item !== null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number>(roles[0]?.id ?? 2);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName("");
    setEmail(item?.email ?? "");
    setPassword("");
    setRoleId(item?.role.id ?? roles[0]?.id ?? 2);
    setError(null);
    setShowPassword(false);
  }, [item, roles]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEdit) {
      if (!name.trim()) { setError("El nombre es obligatorio."); return; }
      if (!email.trim()) { setError("El email es obligatorio."); return; }
      if (!password) { setError("La contraseña es obligatoria."); return; }
    }

    setSaving(true);
    try {
      if (isEdit) {
        const data: EditData = {};
        if (email.trim() && email !== item.email) data.email = email.trim();
        if (password) data.password = password;
        if (roleId !== item.role.id) data.roleId = roleId;
        await onSaveEdit(item.id, data);
      } else {
        await onSaveAdd({ name: name.trim(), email: email.trim(), password, roleId });
      }
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
            {isEdit ? "Editar" : "Agregar"} Usuario
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Cerrar">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {error && (
            <div className="bg-red-600/10 border border-red-600/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Name — only on create */}
          {!isEdit && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
                placeholder="Nombre completo"
                autoFocus
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email {isEdit ? "(dejar vacío para no cambiar)" : "*"}
            </label>
            <input
              type="email"
              required={!isEdit}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
              placeholder="usuario@email.com"
              autoFocus={isEdit}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Contraseña {isEdit ? "(dejar vacío para no cambiar)" : "*"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!isEdit}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
                placeholder={isEdit ? "Nueva contraseña…" : "Contraseña"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rol *</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none transition-colors"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
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
