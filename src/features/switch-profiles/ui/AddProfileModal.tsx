"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Loader2 } from "lucide-react";

interface Props {
  name: string;
  error: string | null;
  adding: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function AddProfileModal({ name, error, adding, onNameChange, onSubmit, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.querySelector<HTMLElement>("input")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
        'input:not([disabled]), button:not([disabled])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-profile-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111116] p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/8">
              <UserPlus className="size-4 text-white/70" />
            </div>
            <h2 id="add-profile-title" className="text-lg font-semibold text-white">
              Agregar Perfil
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar diálogo"
            className="flex size-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="profile-name" className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Nombre del perfil
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={onNameChange}
              maxLength={50}
              placeholder="Ej: Ana, Juan, Kids…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-gray-600 outline-none transition-all focus:border-white/50 focus:bg-white/8"
            />
            <p className="text-right text-[10px] text-gray-600">{name.length}/50</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/4 py-3 text-sm font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-white focus:border-white/30 focus:text-white focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={adding}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 focus:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111116] disabled:opacity-60"
            >
              {adding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Agregar"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
