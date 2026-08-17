"use client";

import Image from "next/image";
import { Loader2, Search, X } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { useTmdbSearch } from "@/features/suggest-content/model/useTmdbSearch";

interface Props {
  activeTab: "movies" | "tv";
}

export function TmdbSuggestSearch({ activeTab }: Props) {
  const {
    query,
    setQuery,
    results,
    searching,
    open,
    containerRef,
    handleSelect,
    handleClear,
  } = useTmdbSearch(activeTab);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && undefined}
          placeholder={`Buscar ${activeTab === "movies" ? "película" : "serie"} por nombre o ID…`}
          className="w-full pl-9 pr-9 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:border-white focus:outline-none"
          autoComplete="off"
        />
        <div className="absolute right-3 flex items-center">
          {searching ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            query && (
              <button type="button" onClick={handleClear}>
                <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </button>
            )
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          {results.map((result) => {
            const title = result.title ?? result.name ?? "Sin título";
            const year = (
              result.release_date ?? result.first_air_date ?? ""
            ).slice(0, 4);
            const type = result.media_type === "tv" ? "tv" : "movie";

            return (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
              >
                <div className="relative w-8 h-12 rounded overflow-hidden bg-gray-700 shrink-0">
                  {result.poster_path ? (
                    <Image
                      src={GetTmdbImage(result.poster_path, 92)}
                      alt={title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {year && <span className="mr-2">{year}</span>}
                    <span className="text-gray-500">
                      {type === "tv" ? "Serie" : "Película"}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && !searching && results.length === 0 && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-sm text-gray-400">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
}
