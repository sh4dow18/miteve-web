"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRequestContent } from "@/features/browse-detail/model/useRequestContent";
import { useTmdbRecommendations } from "@/features/browse-detail/model/useTmdbRecommendations";
import { getToken } from "@/shared/lib/auth";
import type { TmdbMovieDetail } from "@/features/browse-detail/model/getTmdbMovieDetail";

export function useBrowseDetail(movie: TmdbMovieDetail) {
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { message, setMessage, status, submit, reset } = useRequestContent();

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const { items: recommendations } = useTmdbRecommendations(movie.id, movie.type);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  useEffect(() => {
    if (showModal && status === "idle") {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [showModal, status]);

  const toggleMuted = useCallback(() => setIsMuted((prev) => !prev), []);

  const openModal = useCallback(() => {
    reset();
    setShowModal(true);
  }, [reset]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    reset();
  }, [reset]);

  const handleSubmit = useCallback(async () => {
    await submit(movie.id);
    setTimeout(() => {
      setShowModal(false);
      reset();
    }, 2000);
  }, [submit, movie.id, reset]);

  return {
    isMuted,
    toggleMuted,
    showModal,
    hasToken,
    textareaRef,
    message,
    setMessage,
    status,
    year,
    recommendations,
    openModal,
    closeModal,
    handleSubmit,
  };
}
