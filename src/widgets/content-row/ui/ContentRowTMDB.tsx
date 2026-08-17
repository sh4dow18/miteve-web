"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import type { TmdbMovieItem } from "@/features/suggest-content/model/getSuggestContentPageData";

interface Props {
  title: string;
  movies: TmdbMovieItem[];
  rowIndex: number;
  totalRows?: number;
  type?: "movie" | "tv";
}

export function ContentRowTMDB({
  title,
  movies,
  rowIndex,
  totalRows = 1,
  type = "movie",
}: Props) {
  const {
    scrollContainerRef,
    focusedIndex,
    setFocusedIndex,
    handleCardKeyDown,
    scroll,
  } = useContentRow({
    rowIndex,
    totalRows,
    contentLength: movies.length,
  });

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row">
      <h2
        className="text-lg font-semibold mb-3 px-4
                     sm:text-xl sm:px-8
                     md:text-2xl md:mb-4 md:px-12"
      >
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          tabIndex={-1}
          aria-hidden
          className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12
                     bg-black/50 opacity-0 group-hover/row:opacity-100
                     transition-opacity flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4
                     sm:gap-4 sm:px-8
                     md:px-12
                     scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
            >
              <Link
                href={`/browse/${movie.id}?type=${type}`}
                className="group/card relative shrink-0 cursor-pointer block
                           w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72
                           outline-none"
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(-1)}
                aria-label={movie.title}
                data-content-card
                data-row={rowIndex}
                data-col={index}
              >
                <div
                  className={`relative overflow-hidden rounded aspect-2/3 bg-white/5 transition-shadow duration-200 ${
                    focusedIndex === index
                      ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.18)]"
                      : ""
                  }`}
                >
                  {movie.posterPath ? (
                    <Image
                      src={GetTmdbImage(movie.posterPath, 500)}
                      alt={movie.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 256px, 288px"
                      priority={rowIndex === 0 && index === 0}
                      className={`object-cover transition-transform duration-300 group-hover/card:scale-105 ${
                        focusedIndex === index ? "scale-105" : ""
                      }`}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      Sin imagen
                    </div>
                  )}

                  <div
                    className={`absolute inset-0 transition-colors duration-300 group-hover/card:bg-black/40 ${
                      focusedIndex === index ? "bg-black/40" : "bg-black/0"
                    }`}
                  />

                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/card:opacity-100 ${
                      focusedIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <Play className="size-4 sm:size-5 fill-black text-black ml-0.5" />
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs font-medium text-gray-300 line-clamp-2 group-hover/card:text-white transition-colors duration-200">
                  {movie.title}
                </p>
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          tabIndex={-1}
          aria-hidden
          className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12
                     bg-black/50 opacity-0 group-hover/row:opacity-100
                     transition-opacity flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}
