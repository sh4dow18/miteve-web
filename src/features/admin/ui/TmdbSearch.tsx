"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Search, X } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
}

interface Props {
  typeId: number;
  loadingDetail: boolean;
  onSelect: (id: number) => void;
}

export function TmdbSearch({ typeId, loadingDetail, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const type = typeId === 1 ? "movie" : "tv";
        const res = await fetch(
          `/api/tmdb?query=${encodeURIComponent(query.trim())}&type=${type}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults((data.results ?? []).slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, typeId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (result: TmdbResult) => {
    setOpen(false);
    setQuery(result.title ?? result.name ?? "");
    onSelect(result.id);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={`Buscar ${typeId === 1 ? "película" : "serie"} en TMDB…`}
          className="w-full pl-9 pr-10 py-3 bg-gray-800 rounded border border-gray-700 focus:border-white focus:outline-none"
          autoComplete="off"
        />
        <div className="absolute right-3 flex items-center">
          {(searching || loadingDetail) ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : query ? (
            <button type="button" onClick={handleClear}>
              <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          {results.map((result) => {
            const title = result.title ?? result.name ?? "Sin título";
            const year = (result.release_date ?? result.first_air_date ?? "").slice(0, 4);

            return (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
              >
                {/* Poster */}
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

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{title}</p>
                  <p className="text-xs text-gray-400">
                    {year && <span className="mr-2">{year}</span>}
                    <span className="text-gray-500">ID: {result.id}</span>
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
