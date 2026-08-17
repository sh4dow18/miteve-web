"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Film,
  Lightbulb,
  Loader2,
  LogIn,
  Send,
  Tv,
  XCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSuggestContent } from "@/features/suggest-content/model/useSuggestContent";
import { ContentRowTMDB } from "@/widgets/content-row/ui/ContentRowTMDB";
import { ContentRowTMDBTV } from "@/widgets/content-row/ui/ContentRowTMDBTV";
import { useTV } from "@/shared/lib/hooks/useTV";
import { useSuggestContentPage } from "@/features/suggest-content/model/useSuggestContentPage";
import { TmdbSuggestSearch } from "@/features/suggest-content/ui/TmdbSuggestSearch";
import type { GenreMovies } from "@/features/suggest-content/model/getSuggestContentPageData";

interface Props {
  moviesData: GenreMovies[];
  tvData: GenreMovies[];
}

export default function SuggestContentPage({ moviesData, tvData }: Props) {
  const isTV = useTV();
  const { activeTab, setActiveTab, hasToken } = useSuggestContentPage();
  const [showForm, setShowForm] = useState(false);
  const { message, setMessage, status, submit, reset } = useSuggestContent();

  const Row = isTV ? ContentRowTMDBTV : ContentRowTMDB;
  const activeData = activeTab === "movies" ? moviesData : tvData;

  if (hasToken === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasToken) {
    return (
      <section className="min-h-screen bg-black px-4 flex items-center justify-center">
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
    <section className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 pt-20 pb-6 sm:px-8 md:px-14 md:pt-12">
        <div className="flex items-center gap-3 mb-3">
          <Lightbulb className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-semibold tracking-tight">
            Solicitar Contenido
          </h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
          Explora las películas y series más populares por género. Si encuentras
          algo que te gustaría ver en Miteve, haz clic en él para ver los
          detalles y solicítalo.
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="px-4 sm:px-8 md:px-14 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-1 bg-gray-900 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("movies")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "movies"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="w-4 h-4" />
              Películas
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "tv"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tv className="w-4 h-4" />
              Series
            </button>
          </div>
          <TmdbSuggestSearch activeTab={activeTab} />
        </div>
      </div>

      {/* Genre Sliders */}
      <div className="space-y-8 pb-12">
        {activeData.map((genre, index) => (
          <Row
            key={genre.genreName}
            title={genre.genreName}
            movies={genre.movies}
            rowIndex={index}
            totalRows={activeData.length}
            type={activeTab === "movies" ? "movie" : "tv"}
          />
        ))}
      </div>

      {/* Suggest Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-semibold">Sugerir Contenido</h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-6 py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    ¡Sugerencia enviada!
                  </h3>
                  <p className="text-slate-400">
                    Gracias por tu sugerencia. La revisaremos y te informaremos
                    sobre su estado.
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors font-medium"
                >
                  Enviar otra sugerencia
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="suggest-message"
                    className="block text-sm font-medium text-slate-300"
                  >
                    ¿Qué contenido deseas?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="suggest-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ejemplo: Me gustaría ver la película 'Dune Parte 2' o la serie 'Severance'..."
                    rows={8}
                    maxLength={2000}
                    disabled={status === "sending"}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition disabled:opacity-50"
                  />
                  <div className="text-xs text-slate-500">
                    {message.trim().length === 0
                      ? "Mínimo 10 caracteres"
                      : `${message.length} / 2000`}
                  </div>
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">
                      No se pudo enviar la sugerencia. Verifica tu sesión e
                      intenta de nuevo.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={message.trim().length < 10 || status === "sending"}
                  className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors font-semibold text-lg"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar sugerencia
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
