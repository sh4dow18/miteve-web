"use client";

import { Download } from "lucide-react";
import { useDownloads } from "@/features/downloads/model/useDownloads";
import { DownloadCard } from "@/features/downloads/ui/DownloadCard";

export default function DownloadsFeaturePage() {
  const { downloads, loading, remove } = useDownloads();

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 md:pt-8 px-4 sm:px-8 md:pl-28 md:pr-10 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white tracking-widest uppercase mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          Descargas Offline
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Contenido disponible para reproducir sin conexión a internet.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-800/40 animate-pulse"
            />
          ))}
        </div>
      ) : downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="p-5 rounded-full bg-gray-800">
            <Download className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg font-medium">
            No tienes descargas todavía
          </p>
          <p className="text-gray-500 text-sm max-w-xs">
            Descarga películas o episodios desde su página de detalle para
            verlos sin conexión.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {downloads.map((d) => (
            <DownloadCard key={d.key} download={d} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
