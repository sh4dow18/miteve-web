"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

export function GenresIndexNormal() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FindAllGenres()
      .then(setGenres)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-20 sm:px-8 md:px-12 md:pt-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/search"
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Volver a búsqueda"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">
            Explorar por
          </p>
          <h1 className="text-3xl font-bold">Géneros</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {genres.map((genre, i) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 15) * 0.035, duration: 0.25 }}
          >
            <Link
              href={`/genre/${genre.id}`}
              className={`group relative flex items-end h-24 rounded-xl bg-gradient-to-br ${colorFor(genre.id)} px-4 pb-3 overflow-hidden
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-transform duration-200 hover:scale-105`}
            >
              <Tag className="absolute top-3 right-3 w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
              <span className="text-white font-semibold text-sm leading-tight">
                {genre.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
