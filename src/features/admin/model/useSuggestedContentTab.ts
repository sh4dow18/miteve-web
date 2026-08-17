"use client";

import { useEffect, useState, useCallback } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { getToken } from "@/shared/lib/auth";
import type { SuggestedContentReportResponse } from "@/entities/content/model/types";

const STATUS_OPTIONS = [
  { id: 1, label: "Solicitado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: 2, label: "Aprobado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { id: 3, label: "Rechazado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

export interface TmdbInfo {
  title: string;
  posterPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  type: string;
}

export interface EnrichedReport extends SuggestedContentReportResponse {
  tmdbInfo?: TmdbInfo;
}

export interface PendingDenial {
  reportId: number;
  reason: string;
}

function statusLabel(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.label ?? "Desconocido";
}

function guessType(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("serie") || lower.includes("series")) return "tv";
  return "movie";
}

export function useSuggestedContentTab() {
  const [reports, setReports] = useState<EnrichedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [pendingDenial, setPendingDenial] = useState<PendingDenial | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_HOST_IP}/suggested-content-reports`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = (await res.json()) as SuggestedContentReportResponse[];
          setReports(data);

          const tmdbResults = await Promise.allSettled(
            data
              .filter((r) => r.tmdbId)
              .map(async (r) => {
                const type = guessType(r.message);
                const tmdbRes = await fetch(`/api/tmdb?id=${r.tmdbId}&type=${type}`);
                if (!tmdbRes.ok) return { id: r.id, info: null };
                const tmdbData = await tmdbRes.json();
                if (tmdbData.success === false) return { id: r.id, info: null };
                return {
                  id: r.id,
                  info: {
                    title: tmdbData.title || tmdbData.name || "",
                    posterPath: tmdbData.poster_path || null,
                    overview: tmdbData.overview || "",
                    voteAverage: tmdbData.vote_average || 0,
                    releaseDate: tmdbData.release_date || tmdbData.first_air_date || "",
                    type: tmdbData.title ? "movie" : "tv",
                  } as TmdbInfo,
                };
              })
          );

          const tmdbMap = new Map<number, TmdbInfo>();
          for (const result of tmdbResults) {
            if (result.status === "fulfilled" && result.value.info) {
              tmdbMap.set(result.value.id, result.value.info);
            }
          }

          setReports((prev) =>
            prev.map((r) => (tmdbMap.has(r.id) ? { ...r, tmdbInfo: tmdbMap.get(r.id) } : r))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    void loadReports();
  }, []);

  const handleUpdateStatus = useCallback(
    async (id: number, statusId: number, rejectionReason?: string) => {
      setUpdating(id);
      setPendingDenial(null);
      try {
        const token = getToken();
        const body: { statusId: number; rejectionReason: string | null } = {
          statusId,
          rejectionReason: rejectionReason ?? null,
        };

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
        } else {
          console.error("Error actualizando estado:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Error de red al actualizar estado:", err);
      } finally {
        setUpdating(null);
      }
    },
    []
  );

  const handleSelectStatus = useCallback(
    (reportId: number, statusId: number) => {
      if (statusId === 3) {
        setPendingDenial({ reportId, reason: "" });
      } else {
        void handleUpdateStatus(reportId, statusId);
      }
    },
    [handleUpdateStatus]
  );

  return {
    reports,
    loading,
    updating,
    pendingDenial,
    setPendingDenial,
    handleUpdateStatus,
    handleSelectStatus,
    statusOptions: STATUS_OPTIONS,
  };
}
