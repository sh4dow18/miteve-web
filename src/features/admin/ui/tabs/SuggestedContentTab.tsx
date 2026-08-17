"use client";

import Image from "next/image";
import { ChevronDown, Lightbulb, Loader2, X, XCircle } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { useSuggestedContentTab } from "@/features/admin/model/useSuggestedContentTab";

export function SuggestedContentTab() {
  const {
    reports,
    loading,
    updating,
    pendingDenial,
    setPendingDenial,
    handleUpdateStatus,
    handleSelectStatus,
    statusOptions,
  } = useSuggestedContentTab();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Sugerencias de Contenido</h2>
          <p className="text-sm text-gray-400 mt-1">{reports.length} sugerencia{reports.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
          <Lightbulb className="w-12 h-12 opacity-30" />
          <p>No hay sugerencias de contenido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const tmdb = report.tmdbInfo;

            return (
              <div
                key={report.id}
                className="bg-gray-900/50 rounded-lg border border-white/5 overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  {/* TMDB Poster */}
                  {tmdb?.posterPath && (
                    <div className="shrink-0">
                      <div className="relative w-24 h-36 rounded-lg overflow-hidden bg-gray-800">
                        <Image
                          src={GetTmdbImage(tmdb.posterPath, 342)}
                          alt={tmdb.title}
                          fill
                          unoptimized
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* TMDB Title + Metadata */}
                    {tmdb && (
                      <div>
                        <h3 className="text-lg font-semibold text-white">{tmdb.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                          <span className="capitalize">{tmdb.type === "tv" ? "Serie" : "Película"}</span>
                          {tmdb.voteAverage > 0 && <span>⭐ {tmdb.voteAverage.toFixed(1)}</span>}
                          {tmdb.releaseDate && <span>{tmdb.releaseDate.slice(0, 4)}</span>}
                          <span className="font-mono text-xs text-gray-500">TMDB #{report.tmdbId}</span>
                        </div>
                      </div>
                    )}

                    {!tmdb && report.tmdbId && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="font-mono text-xs text-gray-500">TMDB #{report.tmdbId}</span>
                        <span className="text-gray-600">(cargando info...)</span>
                      </div>
                    )}

                    {/* Report metadata */}
                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                      <span className="font-mono">#{report.id}</span>
                      <span>{report.userEmail}</span>
                      <span>
                        {new Date(report.reportedAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* User message */}
                    {report.message && (
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        &ldquo;{report.message}&rdquo;
                      </p>
                    )}

                    {/* Rejection reason */}
                    {report.statusId === 3 && report.rejectionReason && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-500/20 rounded-md">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{report.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Status selector */}
                  <div className="shrink-0 self-start">
                    {updating === report.id ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Actualizando…</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={report.statusId}
                          onChange={(e) => handleSelectStatus(report.id, Number(e.target.value))}
                          className={`appearance-none pr-8 pl-3 py-2 rounded-md border text-sm font-medium cursor-pointer bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${
                            statusOptions.find((s) => s.id === report.statusId)?.color ??
                            "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-70" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {pendingDenial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Rechazar solicitud</h3>
              <button
                onClick={() => setPendingDenial(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Indica el motivo por el cual se rechaza esta solicitud.
            </p>

            <textarea
              autoFocus
              value={pendingDenial.reason}
              onChange={(e) => setPendingDenial({ ...pendingDenial, reason: e.target.value })}
              placeholder="Explica por qué se rechaza esta sugerencia…"
              rows={4}
              maxLength={500}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />

            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setPendingDenial(null)}
                className="px-4 py-2 text-sm rounded border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={pendingDenial.reason.trim().length < 5}
                onClick={() => void handleUpdateStatus(pendingDenial.reportId, 3, pendingDenial.reason.trim())}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
