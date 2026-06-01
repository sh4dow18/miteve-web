"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Eye, Pencil, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../model/useProfile";
import { useUpdateProfile } from "../model/useUpdateProfile";
import { useProfileHistory } from "../model/useProfileHistory";
import { ContentCardTV } from "@/shared/ui/ContentCardTV";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilePageTV({ id }: { id: string }) {
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
        <div className="flex flex-col items-center gap-6">
          <div className="size-14 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          <p className="text-xl text-gray-400">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-12">
        <div className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-12 py-14 text-center">
          <p className="text-lg text-[#e50914]">{error ?? "Perfil no encontrado."}</p>
          <Link
            href="/home"
            className="mt-6 inline-block text-base font-medium text-gray-400 underline underline-offset-4"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] px-10 py-8">

      {/* ── Hero banner (full width) ── */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
        {/* Cover */}
        <div
          className="relative h-44 w-full"
          style={{
            background:
              "linear-gradient(135deg,rgba(229,9,20,.4) 0%,rgba(181,6,14,.25) 40%,rgba(5,5,7,.85) 100%)",
          }}
        >
          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-black/40 px-5 py-2 text-sm font-semibold uppercase tracking-[.15em] text-[#e50914]/90 backdrop-blur-sm">
            <User className="size-4" />
            Perfil activo
          </div>
        </div>

        {/* Avatar + name */}
        <div className="flex items-end gap-8 px-10 pb-8">
          <div className="-mt-16 shrink-0">
            {profile.avatar ? (
              <div className="relative size-36 overflow-hidden rounded-full border-[5px] border-[#050507]">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
              </div>
            ) : (
              <div
                className="flex size-36 items-center justify-center rounded-full border-[5px] border-[#050507] text-5xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
              >
                {initials(profile.name)}
              </div>
            )}
          </div>
          <div className="pb-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white">{profile.name}</h1>
            <p className="mt-1.5 text-base text-gray-400">Perfil seleccionado actualmente</p>
          </div>
        </div>
      </div>

      {/* ── Info + Actions (2-col) ── */}
      <div className="grid grid-cols-2 gap-5">
        {/* Profile info */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
            Información del perfil
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-5 rounded-xl border border-white/6 bg-white/[0.02] px-6 py-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <User className="size-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[.08em] text-gray-500">
                  Nombre del perfil
                </p>
                {editingName ? (
                  <div className="mt-1.5 flex items-center gap-3">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") void saveName(); if (e.key === "Escape") setEditingName(false); }}
                      className="flex-1 min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-base text-white outline-none focus:border-[#e50914]/50 focus:ring-2 focus:ring-[#e50914]/30"
                    />
                    <button
                      onClick={() => void saveName()}
                      disabled={saving}
                      className="shrink-0 rounded-lg bg-[#e50914] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#b5060e] focus:outline-none focus:ring-2 focus:ring-[#e50914]/50 disabled:opacity-50"
                    >
                      {saving ? "…" : "Guardar"}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="shrink-0 rounded-lg border border-white/10 px-4 py-1.5 text-sm text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-lg font-medium text-white">{profile.name}</p>
                    <button
                      onClick={startEditName}
                      className="text-gray-500 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
                      aria-label="Editar nombre"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                )}
                {saveError && <p className="mt-1 text-xs text-[#e50914]">{saveError}</p>}
              </div>
            </div>
            <div className="flex items-center gap-5 rounded-xl border border-white/6 bg-white/[0.02] px-6 py-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <span className="text-sm font-bold text-gray-400">#</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[.08em] text-gray-500">ID del perfil</p>
                <p className="mt-1 truncate font-mono text-sm text-gray-300">{profile.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-7">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
            Acciones
          </h2>
          <div className="flex flex-col gap-4">
            <Link
              href="/account"
              className="flex items-center gap-5 rounded-xl border border-white/8 bg-white/[0.03] px-6 py-5 text-lg font-medium text-gray-300 focus:border-[#e50914]/50 focus:bg-[#e50914]/[0.08] focus:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/30"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <User className="size-5 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-200">Mi cuenta</p>
                <p className="text-sm text-gray-500">Ver información de la cuenta</p>
              </div>
            </Link>
            <Link
              href="/profile/switch"
              className="flex items-center gap-5 rounded-xl border border-white/8 bg-white/[0.03] px-6 py-5 text-lg font-medium text-gray-300 focus:border-[#e50914]/50 focus:bg-[#e50914]/[0.08] focus:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/30"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <RefreshCw className="size-5 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-200">Cambiar perfil</p>
                <p className="text-sm text-gray-500">Seleccionar otro perfil</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Profile Settings ── */}
      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-7">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
          Configuración del perfil
        </h2>
        <div className="space-y-3">
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
              className="w-full flex items-center justify-between gap-6 rounded-xl border border-white/6 bg-white/[0.02] px-6 py-5 text-left transition-colors hover:border-white/12 hover:bg-white/[0.04] focus:border-[#e50914]/50 focus:outline-none focus:ring-2 focus:ring-[#e50914]/30 disabled:opacity-60"
            >
              <div>
                <p className="text-base font-medium text-gray-200">{label}</p>
                <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
              </div>
              <div className={`relative shrink-0 h-7 w-13 rounded-full transition-colors duration-200 ${profile[field] ? "bg-[#e50914]" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-200 ${profile[field] ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Watch History ── */}
      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-7">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="size-5 text-gray-400" />
          <h2 className="text-sm font-semibold uppercase tracking-[.12em] text-gray-400">
            Historial de visualización
          </h2>
        </div>

        {historyLoading ? (
          <div className="flex justify-center py-10">
            <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-base text-gray-500 text-center py-10">No hay contenido en el historial.</p>
        ) : (
          <div className="relative">
            <button
              onClick={() => histScroll("left")}
              tabIndex={-1}
              aria-hidden
              className="absolute left-0 top-0 bottom-0 z-20 w-12
                         bg-black/50 flex items-center justify-center
                         hover:bg-black/70 focus:outline-none"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <div
              ref={histScrollRef}
              className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="shrink-0 flex flex-col gap-2"
                  onKeyDown={(e) => histKeyDown(e, index)}
                >
                  <ContentCardTV
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
                    <Eye className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-500 truncate">
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
              className="absolute right-0 top-0 bottom-0 z-20 w-12
                         bg-black/50 flex items-center justify-center
                         hover:bg-black/70 focus:outline-none"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
