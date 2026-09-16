"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Smartphone, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { DownloadQuality } from "@/shared/lib/hooks/useOfflineDownload";
import type { BulkDownloadState, BulkEpisode } from "@/shared/lib/hooks/useBulkOfflineDownload";

interface BulkDownloadModalProps {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentTitle: string;
  seasonNumber: number;
  episodes: { episodeNumber: number; title: string; cover: string }[];
  fromEpisode: number;
  toEpisode: number;
  onFromChange: (v: number) => void;
  onToChange: (v: number) => void;
  minEpisode: number;
  maxEpisode: number;
  bulkState: BulkDownloadState;
  bulkProgress: number;
  currentEpisode: BulkEpisode | null;
  failed: { seasonNumber: number; episodeNumber: number }[];
  succeeded: BulkEpisode[];
  total: number;
  onSelect: (quality: DownloadQuality) => void;
  onClose: () => void;
}

export function BulkDownloadModal({
  isOpen,
  containerRef,
  contentTitle,
  seasonNumber,
  fromEpisode,
  toEpisode,
  onFromChange,
  onToChange,
  minEpisode,
  maxEpisode,
  bulkState,
  bulkProgress,
  currentEpisode,
  failed,
  succeeded,
  total,
  onSelect,
  onClose,
}: BulkDownloadModalProps) {
  const isDownloading = bulkState === "downloading";
  const isDone = bulkState === "done";
  const isPartial = bulkState === "partial";
  const isError = bulkState === "error";

  const requestedCount =
    Number.isFinite(fromEpisode) && Number.isFinite(toEpisode) && toEpisode >= fromEpisode
      ? toEpisode - fromEpisode + 1
      : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            if (!isDownloading) onClose();
          }}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="bulk-modal-title" className="text-lg font-semibold text-white">
                Descargar capítulos
              </h2>
              <button
                onClick={onClose}
                disabled={isDownloading}
                aria-label="Cerrar diálogo"
                className="flex size-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-400">
              {contentTitle} — Temporada {seasonNumber}
            </p>

            {/* Downloading state */}
            {isDownloading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>
                    Descargando {succeeded.length + failed.length + 1}/{total}
                    {currentEpisode ? ` — T${currentEpisode.seasonNumber}E${currentEpisode.episodeNumber}` : ""}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">{bulkProgress}% completado</p>
                {currentEpisode?.episodeTitle && (
                  <p className="text-xs text-gray-500 text-center truncate">
                    {currentEpisode.episodeTitle}
                  </p>
                )}
              </div>
            )}

            {/* Done / Partial / Error summary */}
            {(isDone || isPartial || isError) && !isDownloading && (
              <div className="space-y-4">
                {isDone && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-300">Descarga completada</p>
                      <p className="text-green-200/70">
                        Se descargaron {succeeded.length}/{total} capítulos correctamente.
                      </p>
                    </div>
                  </div>
                )}
                {isPartial && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-300">Descarga parcial</p>
                      <p className="text-amber-200/70">
                        Se descargaron {succeeded.length}/{total} capítulos. No se pudieron descargar:{" "}
                        {failed.map((f) => `E${f.episodeNumber}`).join(", ")}
                      </p>
                      <p className="text-xs text-amber-200/50 mt-1">
                        Los capítulos descargados están disponibles offline.
                      </p>
                    </div>
                  </div>
                )}
                {isError && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-300">No se pudo completar</p>
                      <p className="text-red-200/70">
                        Ningún capítulo se pudo descargar. Fallaron:{" "}
                        {failed.map((f) => `E${f.episodeNumber}`).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Selection state (idle) */}
            {bulkState === "idle" && !isDownloading && (
              <>
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-400">Desde episodio</span>
                      <input
                        type="number"
                        min={minEpisode}
                        max={maxEpisode}
                        value={fromEpisode}
                        onChange={(e) => onFromChange(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-400">Hasta episodio</span>
                      <input
                        type="number"
                        min={minEpisode}
                        max={maxEpisode}
                        value={toEpisode}
                        onChange={(e) => onToChange(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Rango disponible: {minEpisode}–{maxEpisode} · Se descargarán {requestedCount} capítulo
                    {requestedCount !== 1 ? "s" : ""} {requestedCount > 0 ? `(E${fromEpisode} → E${toEpisode})` : ""}
                  </p>
                  {requestedCount <= 0 && (
                    <p className="text-xs text-red-400">El rango no es válido. &quot;Desde&quot; debe ser ≤ &quot;Hasta&quot;.</p>
                  )}
                </div>

                <p className="mb-3 text-sm text-gray-400">Elige la calidad de descarga</p>
                <div className="space-y-3">
                  <button
                    disabled={requestedCount <= 0}
                    onClick={() => onSelect("fhd")}
                    className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                      <Monitor className="size-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Full HD</p>
                      <p className="text-sm text-gray-400">Mayor calidad, mayor tamaño</p>
                    </div>
                  </button>

                  <button
                    disabled={requestedCount <= 0}
                    onClick={() => onSelect("sd")}
                    className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                      <Smartphone className="size-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">SD</p>
                      <p className="text-sm text-gray-400">Calidad estándar, menor tamaño</p>
                    </div>
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
                  Si algún capítulo no está disponible, se descargarán los demás y se te avisará al final cuáles faltaron.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
