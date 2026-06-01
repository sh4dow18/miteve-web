"use client";

import { useEffect, useState } from "react";
import { Bug, ChevronDown, Loader2 } from "lucide-react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { BugReportResponse } from "@/entities/content/model/types";

const STATUS_OPTIONS = [
  { id: 1, label: "Solicitado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: 2, label: "En Proceso", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: 3, label: "Resuelto", color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

function statusStyle(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.color ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

function statusLabel(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.label ?? "Desconocido";
}

export function BugReportsTab() {
  const [reports, setReports] = useState<BugReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    void loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/bug-reports`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setReports((await res.json()) as BugReportResponse[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: number, statusId: number) {
    setUpdating(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/bug-reports/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ statusId }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, statusId, statusName: statusLabel(statusId) }
              : r
          )
        );
      }
    } finally {
      setUpdating(null);
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
          <h2 className="text-2xl font-semibold">Reportes de Bug</h2>
          <p className="text-sm text-gray-400 mt-1">{reports.length} reporte{reports.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
          <Bug className="w-12 h-12 opacity-30" />
          <p>No hay reportes de bugs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-gray-900/50 rounded-lg p-5 border border-white/5 flex flex-col sm:flex-row sm:items-start gap-4"
            >
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
              </div>

              {/* Status selector */}
              <div className="shrink-0 relative">
                {updating === report.id ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Actualizando…</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={report.statusId}
                      onChange={(e) => void handleUpdateStatus(report.id, Number(e.target.value))}
                      className={`appearance-none pr-8 pl-3 py-2 rounded-md border text-sm font-medium cursor-pointer bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${statusStyle(report.statusId)}`}
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
          ))}
        </div>
      )}
    </div>
  );
}
