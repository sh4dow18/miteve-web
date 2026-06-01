"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Film, Tv } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { CatalogueLoadingSkeleton } from "@/shared/ui/CatalogueLoadingSkeleton";
import { useGenrePage } from "@/features/genre/model/useGenrePage";

interface Props {
  genreId: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i, 12) * 0.04, duration: 0.28, ease: "easeOut" as const },
  }),
};

export function GenrePageNormal({ genreId }: Props) {
  const { genre, items, page, totalPages, loading, loadPage } =
    useGenrePage(genreId);

  function goToPage(p: number) {
    loadPage(p).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-20 sm:px-8 md:px-12 md:pt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/genre"
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
            Género
          </p>
          <h1 className="text-3xl font-bold">
            {genre?.name ?? "Cargando..."}
          </h1>
        </div>
      </div>

      {/* Content grid */}
      {loading ? (
        <CatalogueLoadingSkeleton />
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-center py-24 text-lg">
          No hay contenido disponible para este género.
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={`/content/${item.id}`}
                  className="group block rounded-lg overflow-hidden bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {/* Poster */}
                  <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
                    {item.cover ? (
                      <Image
                        src={GetTmdbImage(item.cover, 342)}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-900/50 to-purple-900/50">
                        {item.type === "Serie" ? (
                          <Tv className="w-10 h-10 text-white/30" />
                        ) : (
                          <Film className="w-10 h-10 text-white/30" />
                        )}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Info */}
                  <div className="px-2.5 py-2">
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-1">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{item.year}</span>
                    </div>
                    <span
                      className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                        item.type === "Serie"
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i)
            .filter((i) => Math.abs(i - page) <= 2)
            .map((i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                  i === page
                    ? "bg-red-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
