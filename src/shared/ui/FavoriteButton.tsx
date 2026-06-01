"use client";

import { Heart, Loader2 } from "lucide-react";
import { useFavorite } from "@/shared/lib/hooks/useFavorite";

interface Props {
  contentId: string;
  className?: string;
  /** TV mode: larger icon, ring focus style */
  tv?: boolean;
}

export function FavoriteButton({ contentId, className = "", tv = false }: Props) {
  const { isFavorite, loading, toggle, hasProfile } = useFavorite(contentId);

  if (!hasProfile) return null;

  if (tv) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        className={`flex items-center justify-center gap-2 bg-transparent border-2 text-white rounded transition-colors
          focus:outline-none focus-visible:ring-4 focus-visible:ring-white disabled:opacity-50
          ${isFavorite
            ? "border-red-500 text-red-400 focus-visible:ring-red-400"
            : "border-gray-400 hover:border-red-500 hover:text-red-400"
          } ${className}`}
      >
        {loading
          ? <Loader2 className="w-6 h-6 animate-spin shrink-0" />
          : <Heart className={`w-6 h-6 shrink-0 ${isFavorite ? "fill-red-500" : ""}`} />
        }
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex w-full sm:w-auto items-center justify-center gap-3 bg-transparent border-2 text-white rounded transition-colors disabled:opacity-50
        ${isFavorite
          ? "border-red-500 text-red-400 hover:border-red-700 hover:text-red-600"
          : "border-gray-400 hover:border-red-500 hover:text-red-400"
        } ${className}`}
    >
      {loading
        ? <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        : <Heart className={`w-5 h-5 shrink-0 ${isFavorite ? "fill-red-500" : ""}`} />
      }
      {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    </button>
  );
}
