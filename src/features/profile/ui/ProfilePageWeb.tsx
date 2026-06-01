"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Eye, Pencil, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../model/useProfile";
import { useUpdateProfile } from "../model/useUpdateProfile";
import { useProfileHistory } from "../model/useProfileHistory";
import { ContentCard } from "@/shared/ui/ContentCard";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import { GetTmdbImage } from "@/shared/api/tmdb";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function ProfilePageWeb({ id }: { id: string }) {
  const { profile, setProfile, loading, error } = useProfile(id);
  const { save, saving, saveError } = useUpdateProfile(id, setProfile);
  const { items: history, loading: historyLoading } = useProfileHistory(id);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const {
    scrollContainerRef: histScrollRef,
    focusedIndex: histFocused,
    setFocusedIndex: setHistFocused,
    handleCardKeyDown: histKeyDown,
    scroll: histScroll,
  } = useContentRow({ rowIndex: 0, totalRows: 1, contentLength: history.length });

  function startEditName() {
    setNameInput(profile?.name ?? "");
    setEditingName(true);
  }

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === profile?.name) { setEditingName(false); return; }
    await save({ name: trimmed });
    setEditingName(false);
  }

  async function toggle(field: "autoSkip" | "lowQuality" | "disableSubtitles" | "adultProfile" | "allowPersonalizedRecommendations") {
    if (!profile) return;
    await save({ [field]: !profile[field] });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          <p className="text-sm text-gray-400">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-8 py-10 text-center"
        >
          <p className="text-sm text-[#e50914]">{error ?? "Perfil no encontrado."}</p>
          <Link
            href="/home"
            className="mt-5 inline-block text-xs font-medium text-gray-400 underline underline-offset-4 hover:text-white"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -right-24 -top-20 size-[560px] rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.13) 0%,transparent 70%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 left-0 size-[440px] rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.08) 0%,transparent 70%)",
            animation: "breathe 11s 2s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-16 sm:px-8 sm:pt-14">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-5">

          {/* ── Hero banner ── */}
          <motion.div
            variants={item}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl"
          >
            {/* Cover */}
            <div
              className="relative h-36 w-full sm:h-48"
              style={{
                background:
                  "linear-gradient(135deg,rgba(229,9,20,.4) 0%,rgba(181,6,14,.25) 40%,rgba(5,5,7,.85) 100%)",
              }}
            >
              {/* Badge top-left */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e50914]/90 backdrop-blur-sm">
                <User className="size-3" />
                Perfil activo
              </div>
            </div>

            {/* Avatar + name row */}
            <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8">
              <div className="-mt-14 shrink-0 sm:-mt-16">
                {profile.avatar ? (
                  <div className="relative size-28 overflow-hidden rounded-full border-4 border-[#050507] sm:size-32">
                    <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="flex size-28 items-center justify-center rounded-full border-4 border-[#050507] text-4xl font-bold text-white sm:size-32"
                    style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                  >
                    {initials(profile.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {profile.name}
                </h1>
                <p className="mt-1 text-sm text-gray-400">Perfil seleccionado actualmente</p>
              </div>
            </div>
          </motion.div>

          {/* ── Info + Actions (2-col) ── */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Profile info */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Información del perfil
              </h2>
              <div className="space-y-3">
                {/* Name row */}
                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <User className="size-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">
                      Nombre del perfil
                    </p>
                    {editingName ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          autoFocus
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") void saveName(); if (e.key === "Escape") setEditingName(false); }}
                          className="flex-1 min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-[#e50914]/50"
                        />
                        <button
                          onClick={() => void saveName()}
                          disabled={saving}
                          className="shrink-0 rounded-md bg-[#e50914] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[#b5060e] disabled:opacity-50"
                        >
                          {saving ? "…" : "Guardar"}
                        </button>
                        <button
                          onClick={() => setEditingName(false)}
                          className="shrink-0 rounded-md border border-white/10 px-2 py-1 text-[11px] text-gray-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{profile.name}</p>
                        <button
                          onClick={startEditName}
                          className="text-gray-500 hover:text-gray-300 transition-colors"
                          aria-label="Editar nombre"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                      </div>
                    )}
                    {saveError && <p className="mt-1 text-[10px] text-[#e50914]">{saveError}</p>}
                  </div>
                </div>
                {/* ID row */}
                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <span className="text-[10px] font-bold text-gray-400">#</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">
                      ID del perfil
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-gray-300">{profile.id}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Acciones
              </h2>
              <div className="flex flex-col gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  <Link
                    href="/account"
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <User className="size-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Mi cuenta</p>
                      <p className="text-xs text-gray-500">Ver información de la cuenta</p>
                    </div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  <Link
                    href="/profile/switch"
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <RefreshCw className="size-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">Cambiar perfil</p>
                      <p className="text-xs text-gray-500">Seleccionar otro perfil</p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Profile Settings ── */}
          <motion.div variants={item} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
              Configuración del perfil
            </h2>
            <div className="space-y-2">
              {([
                { field: "autoSkip", label: "Saltar automáticamente intros y resúmenes", desc: "El reproductor salta intro y resumen sin necesidad de confirmación" },
                { field: "lowQuality", label: "Calidad reducida por defecto (SD)", desc: "El reproductor inicia siempre en calidad SD independientemente de la conexión" },
                { field: "disableSubtitles", label: "Subtítulos desactivados por defecto", desc: "El reproductor inicia sin subtítulos aunque el contenido los tenga" },
                { field: "adultProfile", label: "Perfil adulto", desc: "Permite ver contenido para adultos en este perfil" },
                { field: "allowPersonalizedRecommendations", label: "Recomendaciones personalizadas", desc: "Muestra contenido recomendado según tu historial en el inicio" },
              ] as const).map(({ field, label, desc }) => (
                <button
                  key={field}
                  onClick={() => void toggle(field)}
                  disabled={saving}
                  className="w-full flex items-center justify-between gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5 text-left transition-colors hover:border-white/12 hover:bg-white/[0.04] disabled:opacity-60"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-200">{label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
                  </div>
                  {/* Toggle */}
                  <div className={`relative shrink-0 h-6 w-11 rounded-full transition-colors duration-200 ${profile[field] ? "bg-[#e50914]" : "bg-white/10"}`}>
                    <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ${profile[field] ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Watch History ── */}
          <motion.div variants={item} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="size-4 text-gray-400" />
              <h2 className="text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Historial de visualización
              </h2>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-8">
                <div className="size-6 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No hay contenido en el historial.</p>
            ) : (
              <div className="relative group/hist">
                <button
                  onClick={() => histScroll("left")}
                  tabIndex={-1}
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 z-20 w-8 bg-black/50
                             opacity-0 group-hover/hist:opacity-100 transition-opacity
                             flex items-center justify-center hover:bg-black/70 focus:outline-none rounded-l-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={histScrollRef}
                  className="flex gap-3 overflow-x-auto py-1 scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {history.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="shrink-0 flex flex-col gap-1.5"
                      onKeyDown={(e) => histKeyDown(e, index)}
                    >
                      <ContentCard
                        content={entry.content}
                        index={index}
                        rowIndex={0}
                        isFocused={histFocused === index}
                        href={`/content/${entry.content.id}`}
                        onFocus={() => setHistFocused(index)}
                        onBlur={() => setHistFocused(-1)}
                        onMouseEnter={() => setHistFocused(index)}
                        onMouseLeave={() => setHistFocused(-1)}
                      />
                      <div className="flex items-center gap-1.5 px-0.5">
                        <Eye className="w-3 h-3 text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">
                          {entry.viewCount === 1 ? "1 vez" : `${entry.viewCount} veces`}
                          {" · "}
                          {new Date(entry.viewedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => histScroll("right")}
                  tabIndex={-1}
                  aria-hidden
                  className="absolute right-0 top-0 bottom-0 z-20 w-8 bg-black/50
                             opacity-0 group-hover/hist:opacity-100 transition-opacity
                             flex items-center justify-center hover:bg-black/70 focus:outline-none rounded-r-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
