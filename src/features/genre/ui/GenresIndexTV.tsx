"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Tag } from "lucide-react";
import { FindAllGenres } from "@/entities/content/api";
import type { Genre } from "@/entities/content/model/types";

const COLORS = [
  "from-rose-700 to-rose-500",
  "from-purple-700 to-purple-500",
  "from-blue-700 to-blue-500",
  "from-emerald-700 to-emerald-500",
  "from-amber-700 to-amber-500",
  "from-pink-700 to-pink-500",
  "from-cyan-700 to-cyan-500",
  "from-indigo-700 to-indigo-500",
  "from-orange-700 to-orange-500",
  "from-teal-700 to-teal-500",
];

function colorFor(id: number) {
  return COLORS[id % COLORS.length];
}

function getColumns(): number {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth >= 1280) return 6;
  if (window.innerWidth >= 1024) return 5;
  if (window.innerWidth >= 768) return 4;
  return 3;
}

export function GenresIndexTV() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const backRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    FindAllGenres()
      .then(setGenres)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => backRef.current?.focus(), 80);
    }
  }, [loading]);

  const focusCard = useCallback((idx: number) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    el.focus({ preventScroll: false });
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    setFocusedIndex(idx);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    const cols = getColumns();
    const last = genres.length - 1;
    const onBack = document.activeElement === backRef.current;

    if (onBack) {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          if (genres.length > 0) focusCard(0);
          break;
      }
      return;
    }

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        focusCard(Math.min(focusedIndex + 1, last));
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (focusedIndex === 0) {
          backRef.current?.focus();
          setFocusedIndex(-1);
        } else {
          focusCard(Math.max(focusedIndex - 1, 0));
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const below = focusedIndex + cols;
        if (below <= last) focusCard(below);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const above = focusedIndex - cols;
        if (above >= 0) {
          focusCard(above);
        } else {
          backRef.current?.focus();
          setFocusedIndex(-1);
        }
        break;
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-10 pb-16 pt-10 select-none"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-4 mb-10">
        <Link
          ref={backRef}
          href="/search"
          tabIndex={0}
          className="p-3 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/15 transition-colors
            outline-none focus-visible:ring-4 focus-visible:ring-white"
          aria-label="Volver a búsqueda"
        >
          <ChevronLeft className="w-7 h-7" />
        </Link>
        <h1 className="text-4xl font-bold">Géneros</h1>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {genres.map((genre, i) => (
          <Link
            key={genre.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            href={`/genre/${genre.id}`}
            tabIndex={0}
            onFocus={() => setFocusedIndex(i)}
            className={`flex flex-col items-center justify-center gap-3 h-28 rounded-xl bg-gradient-to-br ${colorFor(genre.id)} text-white font-bold text-lg text-center px-3
              outline-none ring-4 transition-all duration-150 ${
                focusedIndex === i
                  ? "ring-white scale-110 shadow-2xl shadow-white/20"
                  : "ring-transparent"
              }`}
          >
            <Tag className="w-7 h-7 opacity-80" />
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
