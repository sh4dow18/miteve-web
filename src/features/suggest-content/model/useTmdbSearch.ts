"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  media_type?: string;
}

export function useTmdbSearch(activeTab: "movies" | "tv") {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      debounceRef.current = setTimeout(() => {
        setResults([]);
        setOpen(false);
      }, 0);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const type = activeTab === "movies" ? "movie" : "tv";
        const trimmed = query.trim();
        const isNumericId = /^\d+$/.test(trimmed);

        let res: Response;
        if (isNumericId) {
          res = await fetch(`/api/tmdb?id=${trimmed}&type=${type}`);
        } else {
          res = await fetch(
            `/api/tmdb?query=${encodeURIComponent(trimmed)}&type=${type}`
          );
        }

        if (!res.ok) throw new Error();
        const data = await res.json();

        if (isNumericId) {
          if (data.success === false) {
            setResults([]);
          } else {
            setResults([data].slice(0, 1));
          }
        } else {
          setResults((data.results ?? []).slice(0, 8));
        }
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
  }, [query, activeTab]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (result: TmdbResult) => {
      const type = result.media_type === "tv" ? "tv" : activeTab === "tv" ? "tv" : "movie";
      setOpen(false);
      setQuery("");
      router.push(`/browse/${result.id}?type=${type}`);
    },
    [activeTab, router]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    searching,
    open,
    setOpen,
    containerRef,
    handleSelect,
    handleClear,
  };
}
