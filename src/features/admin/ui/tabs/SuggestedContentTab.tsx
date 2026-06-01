"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Lightbulb, Loader2, XCircle } from "lucide-react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { SuggestedContentReportResponse } from "@/entities/content/model/types";

const STATUS_OPTIONS = [
  { id: 1, label: "Solicitado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: 2, label: "En Proceso", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: 3, label: "Aceptado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { id: 4, label: "Denegado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

function statusStyle(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.color ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

function statusLabel(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.label ?? "Desconocido";
}

interface PendingDenial {
  reportId: number;
  reason: string;
}

export function SuggestedContentTab() {
  const [reports, setReports] = useState<SuggestedContentReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [pendingDenial, setPendingDenial] = useState<PendingDenial | null>(null);

  useEffect(() => {
    void loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/suggested-content-reports`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setReports((await res.json()) as SuggestedContentReportResponse[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: number, statusId: number, rejectionReason?: string) {
    setUpdating(id);
    setPendingDenial(null);
    try {
      const token = getToken();
      const body: { statusId: number; rejectionReason?: string } = { statusId };
      if (rejectionReason) body.rejectionReason = rejectionReason;

      const res = await fetch(`${API_HOST_IP}/suggested-content-reports/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  statusId,
                  statusName: statusLabel(statusId),
                  rejectionReason: rejectionReason ?? null,
                }
              : r
          )
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  function handleSelectStatus(reportId: number, statusId: number) {
    if (statusId === 4) {
      // Denial requires a reason — open inline form
      setPendingDenial({ reportId, reason: "" });
    } else {
      void handleUpdateStatus(reportId, statusId);
    }
  }

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
        <div className="space-y-3">
          {reports.map((report) => {
            const isDenying = pendingDenial?.reportId === report.id;

            return (
              <div
                key={report.id}
                className="bg-gray-900/50 rounded-lg border border-white/5 overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">#{report.id}</span>
                      <span className="text-sm text-gray-300">{report.userEmail}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(report.reportedAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{report.message}</p>

                    {/* Rejection reason badge */}
                    {report.statusId === 4 && report.rejectionReason && (
                      <div className="flex items-start gap-2 mt-2 p-3 bg-red-900/20 border border-red-500/20 rounded-md">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{report.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Status selector */}
                  <div className="shrink-0">
                    {updating === report.id ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Actualizando…</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={isDenying ? 4 : report.statusId}
                          onChange={(e) => handleSelectStatus(report.id, Number(e.target.value))}
                          className={`appearance-none pr-8 pl-3 py-2 rounded-md border text-sm font-medium cursor-pointer bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${statusStyle(isDenying ? 4 : report.statusId)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
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

                {/* Inline denial reason form */}
                {isDenying && (
                  <div className="border-t border-white/5 p-4 bg-red-950/20 space-y-3">
                    <p className="text-sm font-medium text-red-300">Razón de denegación <span className="text-red-500">*</span></p>
                    <textarea
                      autoFocus
                      value={pendingDenial.reason}
                      onChange={(e) => setPendingDenial({ ...pendingDenial, reason: e.target.value })}
                      placeholder="Explica por qué se deniega esta sugerencia…"
                      rows={3}
                      maxLength={500}
                      className="w-full bg-gray-900 border border-red-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setPendingDenial(null)}
                        className="px-4 py-2 text-sm rounded border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        disabled={pendingDenial.reason.trim().length < 5}
                        onClick={() => void handleUpdateStatus(report.id, 4, pendingDenial.reason.trim())}
                        className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Confirmar denegación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
