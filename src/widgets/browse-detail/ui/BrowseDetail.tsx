"use client";

import { ArrowLeft, Volume2, VolumeX, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, LogIn, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { YoutubeVideo } from "@/widgets/youtube-video";
import { Stars } from "@/shared/ui/Stars";
import Image from "next/image";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import { useBrowseDetail } from "@/widgets/browse-detail/model/useBrowseDetail";
import type { TmdbMovieDetail } from "@/features/browse-detail/model/getTmdbMovieDetail";

interface Props {
  movie: TmdbMovieDetail;
}

export default function BrowseDetail({ movie }: Props) {
  const {
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
  } = useBrowseDetail(movie);

  const {
    scrollContainerRef: recoScrollRef,
    focusedIndex: recoFocused,
    setFocusedIndex: setRecoFocused,
    handleCardKeyDown: recoKeyDown,
    scroll: recoScroll,
  } = useContentRow({
    rowIndex: -1,
    totalRows: 1,
    contentLength: recommendations.length,
  });

  if (hasToken === null) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasToken) {
    return (
      <section className="min-h-screen bg-[#141414] px-4 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto" />
          <h1 className="text-3xl font-semibold">Inicia sesión para continuar</h1>
          <p className="text-slate-400 text-lg">
            Debes tener una cuenta para poder solicitar contenido en Miteve.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-12">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {movie.trailerKey ? (
            <YoutubeVideo
              id={movie.trailerKey}
              title={movie.title}
              thumbnail={GetTmdbImage(movie.backdropPath || movie.posterPath || "")}
              mute={isMuted}
              duration={0}
            />
          ) : movie.backdropPath ? (
            <Image
              src={GetTmdbImage(movie.backdropPath)}
              alt={movie.title}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        <Link
          href="/suggest-content"
          className="absolute top-15 left-8 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors md:top-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {movie.trailerKey && (
          <button
            onClick={toggleMuted}
            className="absolute top-15 right-8 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors md:top-8"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        )}

        <div className="relative z-10 min-h-screen flex items-end px-4 pt-20 pb-8 sm:p-16">
          <div className="space-y-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold max-w-3xl mb-4 drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl"
            >
              {movie.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 text-lg flex-wrap"
            >
              <div className="flex items-center gap-2">
                <Stars rating={movie.voteAverage} />
                <span className="hidden text-gray-400 sm:block">
                  ({movie.voteAverage.toFixed(1)})
                </span>
              </div>

              {year && <span>{year}</span>}

              {movie.runtime && (
                <span className="text-gray-400">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              )}
            </motion.div>

            {movie.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base italic text-gray-300 shadow md:text-lg xl:text-xl"
              >
                &quot;{movie.tagline}&quot;
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base max-w-2xl leading-relaxed line-clamp-4 sm:line-clamp-none md:text-lg xl:text-xl"
            >
              {movie.overview}
            </motion.p>

            {movie.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex gap-2 flex-wrap"
              >
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800/70 rounded text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={openModal}
                className="flex w-full sm:w-auto items-center justify-center gap-3 bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded text-base sm:text-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Solicitar contenido
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-lg p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-semibold">
                  ¡Solicitud enviada!
                </h3>
                <p className="text-slate-400">
                  Tu solicitud de <span className="text-white font-medium">{movie.title}</span> ha sido enviada correctamente.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Solicitar <span className="text-white">{movie.title}</span>
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Agrega un mensaje opcional con tu solicitud.
                </p>

                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ejemplo: Me encantaría que agreguen esta serie, la recomiendan mucho..."
                  rows={4}
                  maxLength={2000}
                  disabled={status === "sending"}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 transition disabled:opacity-50"
                />

                {status === "error" && (
                  <p className="text-sm text-red-400 mt-2">
                    No se pudo enviar la solicitud. Verifica tu sesión e intenta de nuevo.
                  </p>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={closeModal}
                    disabled={status === "sending"}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Solicitar"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8 md:mb-12 group/row">
          <h2
            className="text-lg font-semibold mb-3 px-4
                       sm:text-xl sm:px-8
                       md:text-2xl md:mb-4 md:px-12"
          >
            También te podría gustar
          </h2>
          <div className="relative">
            <button
              onClick={() => recoScroll("left")}
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
              ref={recoScrollRef}
              className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4
                         sm:gap-4 sm:px-8
                         md:px-12
                         scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {recommendations.map((item, index) => (
                <div
                  key={item.id}
                  onKeyDown={(e) => recoKeyDown(e, index)}
                >
                  <Link
                    href={`/browse/${item.id}?type=${movie.type}`}
                    className="group/card relative shrink-0 cursor-pointer block
                               w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72
                               outline-none"
                    onFocus={() => setRecoFocused(index)}
                    onBlur={() => setRecoFocused(-1)}
                    onMouseEnter={() => setRecoFocused(index)}
                    onMouseLeave={() => setRecoFocused(-1)}
                    aria-label={item.title}
                    data-content-card
                    data-row={-1}
                    data-col={index}
                  >
                    <div
                      className={`relative overflow-hidden rounded aspect-2/3 bg-white/5 transition-shadow duration-200 ${
                        recoFocused === index
                          ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.18)]"
                          : ""
                      }`}
                    >
                      {item.posterPath ? (
                        <Image
                          src={GetTmdbImage(item.posterPath, 500)}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 256px, 288px"
                          className={`object-cover transition-transform duration-300 group-hover/card:scale-105 ${
                            recoFocused === index ? "scale-105" : ""
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
                          recoFocused === index
                            ? "bg-black/40"
                            : "bg-black/0"
                        }`}
                      />
                    </div>

                    <p className="mt-2 text-xs font-medium text-gray-300 line-clamp-2 group-hover/card:text-white transition-colors duration-200">
                      {item.title}
                    </p>
                  </Link>
                </div>
              ))}
            </div>

            <button
              onClick={() => recoScroll("right")}
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
      )}
    </div>
  );
}
