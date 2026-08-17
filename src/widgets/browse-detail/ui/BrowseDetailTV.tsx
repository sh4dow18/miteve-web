"use client";

import { ArrowLeft, CheckCircle2, Lightbulb, LogIn, X } from "lucide-react";
import Link from "next/link";
import { GetTmdbImage } from "@/shared/api/tmdb";
import Image from "next/image";
import { useBrowseDetail } from "@/widgets/browse-detail/model/useBrowseDetail";
import type { TmdbMovieDetail } from "@/features/browse-detail/model/getTmdbMovieDetail";

interface Props {
  movie: TmdbMovieDetail;
}

export default function BrowseDetailTV({ movie }: Props) {
  const {
    showModal,
    hasToken,
    textareaRef,
    message,
    setMessage,
    status,
    year,
    openModal,
    closeModal,
    handleSubmit,
  } = useBrowseDetail(movie);

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
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {movie.backdropPath ? (
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

        <div className="relative z-10 min-h-[70vh] flex items-end px-4 pt-20 pb-8 sm:p-16">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-bold max-w-3xl mb-4 drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-lg flex-wrap">
              <span className="text-yellow-400 font-semibold">
                {movie.voteAverage.toFixed(1)}/10
              </span>
              {year && <span>{year}</span>}
              {movie.runtime && (
                <span className="text-gray-400">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              )}
            </div>

            {movie.tagline && (
              <p className="text-base italic text-gray-300 shadow md:text-lg xl:text-xl">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            <p className="text-base max-w-2xl leading-relaxed line-clamp-4 sm:line-clamp-none md:text-lg xl:text-xl">
              {movie.overview}
            </p>

            {movie.genres.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800/70 rounded text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={openModal}
                className="flex w-full sm:w-auto items-center justify-center gap-3 bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded text-base sm:text-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Solicitar contenido
              </button>
            </div>
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
    </div>
  );
}
