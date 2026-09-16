"use client";

import { useEffect, useState, useCallback } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { SuggestedContentReportResponse, PageResponse } from "@/entities/content/model/types";

const STATUS_OPTIONS = [
  { id: 1, label: "Solicitado", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: 2, label: "Aprobado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { id: 3, label: "Rechazado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: 4, label: "Subido", color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
];

export interface TmdbInfo {
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  type: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
  status: string | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
}

export interface EnrichedReport extends SuggestedContentReportResponse {
  tmdbInfo?: TmdbInfo;
}

export interface PendingDenial {
  reportId: number;
  reason: string;
}

export type SuggestedSubTab = "active" | "rejected";

function statusLabel(statusId: number) {
  return STATUS_OPTIONS.find((s) => s.id === statusId)?.label ?? "Desconocido";
}

function getTmdbType(contentTypeName: string | null): string {
  if (contentTypeName === "tv-show") return "tv";
  return "movie";
}

async function enrichReports(reports: SuggestedContentReportResponse[]): Promise<EnrichedReport[]> {
  if (reports.length === 0) return reports;
  const tmdbResults = await Promise.allSettled(
    reports
      .filter((r) => r.tmdbId)
      .map(async (r) => {
        const type = getTmdbType(r.contentTypeName);
        const tmdbRes = await fetch(`/api/tmdb?id=${r.tmdbId}&type=${type}`);
        if (!tmdbRes.ok) return { id: r.id, info: null };
        const tmdbData = await tmdbRes.json();
        if (tmdbData.success === false) return { id: r.id, info: null };
                const trans = tmdbData.translations?.translations ?? [];
                const esMx = trans.find((t: { iso_639_1: string; data: { title?: string; name?: string } }) => t.iso_639_1 === "es-MX")?.data;
                const titleEs = esMx?.title || esMx?.name || tmdbData.title || tmdbData.name || "";
                return {
                  id: r.id,
                  info: {
                    title: titleEs,
                    posterPath: tmdbData.poster_path || null,
                    backdropPath: tmdbData.backdrop_path || null,
                    overview: tmdbData.overview || "",
                    voteAverage: tmdbData.vote_average || 0,
                    releaseDate: tmdbData.release_date || tmdbData.first_air_date || "",
                    type: tmdbData.title ? "movie" : "tv",
                    genres: tmdbData.genres || [],
                    runtime: tmdbData.runtime || tmdbData.episode_run_time?.[0] || null,
                    tagline: tmdbData.tagline || null,
                    status: tmdbData.status || null,
                    numberOfSeasons: tmdbData.number_of_seasons || null,
                    numberOfEpisodes: tmdbData.number_of_episodes || null,
                  } as TmdbInfo,
                };
              })
          );
  const tmdbMap = new Map<number, TmdbInfo>();
  for (const result of tmdbResults) {
    if (result.status === "fulfilled" && result.value.info) tmdbMap.set(result.value.id, result.value.info);
  }
  return reports.map((r) => (tmdbMap.has(r.id) ? { ...r, tmdbInfo: tmdbMap.get(r.id) } : r));
}

const PAGE_SIZE = 20;

export function useSuggestedContentTab() {
  const [subTab, setSubTab] = useState<SuggestedSubTab>("active");

  const [activeReports, setActiveReports] = useState<EnrichedReport[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [activeTotalPages, setActiveTotalPages] = useState(0);
  const [activeTotalElements, setActiveTotalElements] = useState(0);
  const [activeLoading, setActiveLoading] = useState(true);

  const [rejectedReports, setRejectedReports] = useState<EnrichedReport[]>([]);
  const [rejectedPage, setRejectedPage] = useState(0);
  const [rejectedTotalPages, setRejectedTotalPages] = useState(0);
  const [rejectedTotalElements, setRejectedTotalElements] = useState(0);
  const [rejectedLoading, setRejectedLoading] = useState(true);

  const [updating, setUpdating] = useState<number | null>(null);
  const [pendingDenial, setPendingDenial] = useState<PendingDenial | null>(null);

  const fetchActive = useCallback(async (page: number) => {
    setActiveLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/suggested-content-reports?page=${page}&size=${PAGE_SIZE}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = (await res.json()) as PageResponse<SuggestedContentReportResponse>;
        const enriched = await enrichReports(data.content);
        setActiveReports(enriched);
        setActivePage(data.number);
        setActiveTotalPages(data.totalPages);
        setActiveTotalElements(data.totalElements);
      }
    } finally {
      setActiveLoading(false);
    }
  }, []);

  const fetchRejected = useCallback(async (page: number) => {
    setRejectedLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/suggested-content-reports/rejected?page=${page}&size=${PAGE_SIZE}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = (await res.json()) as PageResponse<SuggestedContentReportResponse>;
        const enriched = await enrichReports(data.content);
        setRejectedReports(enriched);
        setRejectedPage(data.number);
        setRejectedTotalPages(data.totalPages);
        setRejectedTotalElements(data.totalElements);
      }
    } finally {
      setRejectedLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActive(0);
    void fetchRejected(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [fetchActive, fetchRejected]);

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
          if (statusId === 3) {
            setActiveReports((prev) => prev.filter((r) => r.id !== id));
            setActiveTotalElements((prev) => Math.max(0, prev - 1));
            void fetchRejected(0);
          } else {
            const updater = (prev: EnrichedReport[]) =>
              prev.map((r) =>
                r.id === id ? { ...r, statusId, statusName: statusLabel(statusId), rejectionReason: rejectionReason ?? null } : r
              );
            setActiveReports(updater);
            setRejectedReports(updater);
            if (subTab === "rejected") {
              void fetchActive(0);
              void fetchRejected(rejectedPage);
            }
          }
        } else {
          console.error("Error actualizando estado:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Error de red al actualizar estado:", err);
      } finally {
        setUpdating(null);
      }
    },
    [fetchRejected, fetchActive, rejectedPage, subTab]
  );

  const handleSelectStatus = useCallback(
    (reportId: number, statusId: number) => {
      if (statusId === 3) setPendingDenial({ reportId, reason: "" });
      else void handleUpdateStatus(reportId, statusId);
    },
    [handleUpdateStatus]
  );

  const loading = subTab === "active" ? activeLoading : rejectedLoading;
  const reports = subTab === "active" ? activeReports : rejectedReports;
  const page = subTab === "active" ? activePage : rejectedPage;
  const totalPages = subTab === "active" ? activeTotalPages : rejectedTotalPages;
  const totalElements = subTab === "active" ? activeTotalElements : rejectedTotalElements;

  return {
    subTab,
    setSubTab,
    reports,
    loading,
    page,
    totalPages,
    totalElements,
    pageSize: PAGE_SIZE,
    activeReports,
    activePage,
    activeTotalPages,
    activeTotalElements,
    activeLoading,
    rejectedReports,
    rejectedPage,
    rejectedTotalPages,
    rejectedTotalElements,
    rejectedLoading,
    fetchActive,
    fetchRejected,
    updating,
    pendingDenial,
    setPendingDenial,
    handleUpdateStatus,
    handleSelectStatus,
    statusOptions: STATUS_OPTIONS,
  };
}
