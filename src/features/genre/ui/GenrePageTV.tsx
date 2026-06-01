"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Film, Tv } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { useGenrePage } from "@/features/genre/model/useGenrePage";

// Columns count driven by viewport (mirrors Tailwind breakpoints)
function getColumns(): number {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth >= 1280) return 6;
  if (window.innerWidth >= 1024) return 5;
  if (window.innerWidth >= 768) return 4;
  return 3;
}

interface Props {
  genreId: number;
}

export function GenrePageTV({ genreId }: Props) {
  const { genre, items, page, totalPages, loading, loadPage } =
    useGenrePage(genreId);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // Focus first card whenever items change
  useEffect(() => {
    if (!loading && items.length > 0) {
      setFocusedIndex(0);
      setTimeout(() => cardRefs.current[0]?.focus(), 80);
    }
  }, [loading, items]);

  const focusCard = useCallback((idx: number) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    el.focus({ preventScroll: false });
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    setFocusedIndex(idx);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    const cols = getColumns();
    const last = items.length - 1;

    // If focus is on prev/next pagination buttons handle separately
    const onPrev = document.activeElement === prevBtnRef.current;
    const onNext = document.activeElement === nextBtnRef.current;

    if (onPrev || onNext) {
      switch (e.key) {
        case "ArrowLeft":
          if (onNext) { e.preventDefault(); prevBtnRef.current?.focus(); }
          break;
        case "ArrowRight":
          if (onPrev) { e.preventDefault(); nextBtnRef.current?.focus(); }
          break;
        case "ArrowUp":
          e.preventDefault();
          focusCard(items.length - 1);
          break;
      }
      return;
    }

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const next = Math.min(focusedIndex + 1, last);
        focusCard(next);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const prev = Math.max(focusedIndex - 1, 0);
        focusCard(prev);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const below = focusedIndex + cols;
        if (below <= last) {
          focusCard(below);
        } else {
          // Move to pagination row
          if (page > 0) prevBtnRef.current?.focus();
          else if (page < totalPages - 1) nextBtnRef.current?.focus();
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const above = focusedIndex - cols;
        if (above >= 0) focusCard(above);
        break;
      }
    }
  }

  function goToPage(p: number) {
    void loadPage(p);
  }

  return (
    <div
      className="min-h-screen px-10 pb-16 pt-10 select-none"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/genre"
          data-focusable
          className="p-3 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/15 transition-colors
            focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          aria-label="Volver"
        >
          <ChevronLeft className="w-7 h-7" />
        </Link>
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
            Género
          </p>
          <h1 className="text-4xl font-bold">
            {genre?.name ?? "Cargando..."}
          </h1>
        </div>
      </div>

      {/* Content grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-center py-32 text-2xl">
          No hay contenido disponible para este género.
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {items.map((item, i) => (
            <Link
              key={item.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              href={`/content/${item.id}`}
              data-focusable
              tabIndex={0}
              onFocus={() => setFocusedIndex(i)}
              className={`block rounded-xl overflow-hidden bg-gray-900 transition-all duration-150 ring-4 outline-none ${
                focusedIndex === i
                  ? "ring-white scale-105 shadow-2xl shadow-white/10"
                  : "ring-transparent"
              }`}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] bg-gray-800">
                {item.cover ? (
                  <Image
                    src={GetTmdbImage(item.cover, 342)}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-900/50 to-purple-900/50">
                    {item.type === "Serie" ? (
                      <Tv className="w-12 h-12 text-white/30" />
                    ) : (
                      <Film className="w-12 h-12 text-white/30" />
                    )}
                  </div>
                )}
                {focusedIndex === i && (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </div>

              {/* Info */}
              <div className="px-3 py-2.5 bg-gray-900">
                <p className="text-white text-sm font-semibold line-clamp-2 leading-tight mb-1">
                  {item.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{item.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            ref={prevBtnRef}
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            data-focusable
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <span className="text-white/60 text-lg font-semibold tabular-nums">
            {page + 1} / {totalPages}
          </span>

          <button
            ref={nextBtnRef}
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages - 1}
            data-focusable
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
