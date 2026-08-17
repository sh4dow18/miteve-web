"use client";

import { useEffect, useState } from "react";

interface TmdbRecommendation {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
  voteAverage: number;
}

export function useTmdbRecommendations(tmdbId: number, type: "movie" | "tv" = "movie") {
  const [items, setItems] = useState<TmdbRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tmdbId) return;

    fetch(`/api/tmdb?id=${tmdbId}&type=${type}&action=similar`)
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => {
        const mapped = (data.results || [])
          .slice(0, 15)
          .map(
            (m: {
              id: number;
              title?: string;
              name?: string;
              poster_path: string | null;
              overview: string;
              vote_average: number;
            }) => ({
              id: m.id,
              title: m.title || m.name || "",
              posterPath: m.poster_path,
              overview: m.overview,
              voteAverage: m.vote_average,
            })
          );
        setItems(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, type]);

  return { items, loading };
}
