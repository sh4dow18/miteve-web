"use client";

import { CheckCircle2, Lightbulb, Loader2, Send, XCircle } from "lucide-react";
import { useSuggestContent } from "@/features/suggest-content/model/useSuggestContent";

export default function SuggestContentPage() {
  const { message, setMessage, status, submit, reset } = useSuggestContent();

  return (
    <section className="min-h-screen bg-black px-4 pb-16 pt-20 text-white sm:px-8 md:px-14 md:pt-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-semibold tracking-tight">Sugerir Contenido</h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg">
            ¿Hay una película o serie que te gustaría ver en Miteve? Cuéntanos y lo evaluaremos.
          </p>
        </header>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">¡Sugerencia enviada!</h2>
              <p className="text-slate-400">Gracias por tu sugerencia. La revisaremos y te informaremos sobre su estado.</p>
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
              <label htmlFor="suggest-message" className="block text-sm font-medium text-slate-300">
                ¿Qué contenido deseas? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="suggest-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ejemplo: Me gustaría ver la película 'Dune Parte 2' o la serie 'Severance'..."
                rows={8}
                maxLength={2000}
                disabled={status === "sending"}
                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition disabled:opacity-50"
              />
              <div className="text-xs text-slate-500">
                {message.trim().length === 0 ? "Mínimo 10 caracteres" : `${message.length} / 2000`}
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400">
                <XCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">No se pudo enviar la sugerencia. Verifica tu sesión e intenta de nuevo.</p>
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
    </section>
  );
}
