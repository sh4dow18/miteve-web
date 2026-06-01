"use client";

import { useCallback, useEffect, useState } from "react";
import { FindAllGenres, FindContentsByGenre } from "@/entities/content/api";
import type { Genre, GenrePageItem } from "@/entities/content/model/types";

const PAGE_SIZE = 20;

export function useGenrePage(genreId: number) {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [items, setItems] = useState<GenrePageItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FindAllGenres()
      .then((genres) => setGenre(genres.find((g) => g.id === genreId) ?? null))
      .catch(() => {});
  }, [genreId]);

  const loadPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const { items: newItems, totalPages: tp } = await FindContentsByGenre(
          genreId,
          p,
          PAGE_SIZE
        );
        setItems(newItems);
        setTotalPages(tp);
        setPage(p);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [genreId]
  );

  useEffect(() => {
    void loadPage(0);
  }, [loadPage]);

  return { genre, items, page, totalPages, loading, loadPage };
}
