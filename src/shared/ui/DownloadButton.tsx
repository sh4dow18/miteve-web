"use client";

import { Download, Check, Trash2, Loader2 } from "lucide-react";
import { useOfflineDownload } from "@/shared/lib/hooks/useOfflineDownload";

interface DownloadButtonProps {
  contentId: string;
  contentTitle: string;
  cover: string;
  type: "movie" | "tv-show";
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  /** Additional Tailwind classes */
  className?: string;
  /** Compact mode: icon-only with tooltip */
  compact?: boolean;
}

export function DownloadButton({
  contentId,
  contentTitle,
  cover,
  type,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  className = "",
  compact = false,
}: DownloadButtonProps) {
  const { state, progress, download, remove } = useOfflineDownload({
    contentId,
    contentTitle,
    cover,
    type,
    seasonNumber,
    episodeNumber,
    episodeTitle,
  });

  if (state === "downloading") {
    return (
      <button
        disabled
        title={`Descargando… ${progress}%`}
        className={`flex items-center justify-center gap-2 bg-gray-800/80 text-white rounded transition-colors disabled:opacity-80 ${className}`}
      >
        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        <span className="text-sm font-medium">{progress}%</span>
      </button>
    );
  }

  if (state === "done") {
    return (
      <button
        onClick={remove}
        title="Eliminar descarga"
        className={`flex items-center justify-center gap-2 bg-green-700/80 hover:bg-red-700/80 text-white rounded transition-colors group ${className}`}
      >
        <Check className="w-5 h-5 group-hover:hidden shrink-0" />
        <Trash2 className="w-5 h-5 hidden group-hover:block shrink-0" />
        {!compact && (
          <span className="text-sm font-medium group-hover:hidden">Descargado</span>
        )}
        {!compact && (
          <span className="text-sm font-medium hidden group-hover:block">Eliminar</span>
        )}
      </button>
    );
  }

  if (state === "removing") {
    return (
      <button
        disabled
        title="Eliminando…"
        className={`flex items-center justify-center gap-2 bg-gray-800/80 text-white rounded transition-colors disabled:opacity-80 ${className}`}
      >
        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        {!compact && <span className="text-sm font-medium">Eliminando…</span>}
      </button>
    );
  }

  // idle or error
  return (
    <button
      onClick={download}
      title="Descargar para ver offline"
      className={`flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded transition-colors ${className}`}
    >
      <Download className="w-5 h-5 shrink-0" />
      {!compact && <span className="text-sm font-medium">{state === "error" ? "Reintentar descarga" : "Descargar"}</span>}
    </button>
  );
}
