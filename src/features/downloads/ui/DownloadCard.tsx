"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Trash2 } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import type { OfflineDownload } from "@/shared/lib/offline-db";

interface Props {
  download: OfflineDownload;
  onRemove: (download: OfflineDownload) => void;
}

export function DownloadCard({ download, onRemove }: Props) {
  const playHref =
    download.type === "movie"
      ? `/player/${download.contentId}?offline=true`
      : `/player/${download.contentId}?season=${download.seasonNumber}&episode=${download.episodeNumber}&offline=true`;

  const subtitle =
    download.type === "tv-show" && download.seasonNumber !== undefined
      ? `T${download.seasonNumber} · E${download.episodeNumber}${download.episodeTitle ? ` · ${download.episodeTitle}` : ""}`
      : "Película";

  const formattedSize = download.sizeBytes
    ? `${(download.sizeBytes / 1024 / 1024).toFixed(0)} MB`
    : null;

  return (
    <div className="flex gap-4 bg-gray-900/60 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-28 shrink-0 aspect-video bg-gray-800">
        <Image
          src={GetTmdbImage(download.cover)}
          alt={download.contentTitle}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-center gap-1 pr-4 py-3">
        <p className="font-semibold text-white leading-tight line-clamp-2">
          {download.contentTitle}
        </p>
        <p className="text-sm text-gray-400">{subtitle}</p>
        {formattedSize && (
          <p className="text-xs text-gray-500">{formattedSize}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-3 pr-4 shrink-0">
        <Link
          href={playHref}
          className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          title="Reproducir offline"
        >
          <Play className="w-4 h-4" fill="currentColor" />
        </Link>
        <button
          onClick={() => onRemove(download)}
          className="p-2 bg-gray-800 text-gray-400 rounded-full hover:bg-red-900/60 hover:text-red-400 transition-colors"
          title="Eliminar descarga"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
