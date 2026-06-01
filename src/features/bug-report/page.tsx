"use client";

import { Bug, CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { useBugReport } from "@/features/bug-report/model/useBugReport";

export default function BugReportPage() {
  const { message, setMessage, status, submit, reset } = useBugReport();

  return (
    <section className="min-h-screen bg-black px-4 pb-16 pt-20 text-white sm:px-8 md:px-14 md:pt-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Bug className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-semibold tracking-tight">Reportar un Bug</h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg">
            Encontraste algo que no funciona bien? Cuéntanos qué pasó y lo revisaremos lo antes posible.
          </p>
        </header>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Reporte enviado</h2>
              <p className="text-slate-400">Gracias por ayudarnos a mejorar Miteve. Revisaremos tu reporte pronto.</p>
            </div>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded transition-colors font-medium"
            >
              Enviar otro reporte
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
              <label htmlFor="bug-message" className="block text-sm font-medium text-slate-300">
                Descripción del problema <span className="text-red-500">*</span>
              </label>
              <textarea
                id="bug-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe el bug con el mayor detalle posible: ¿qué estabas haciendo?, ¿qué esperabas que pasara?, ¿qué pasó en cambio?"
                rows={8}
                maxLength={2000}
                disabled={status === "sending"}
                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition disabled:opacity-50"
              />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{message.trim().length === 0 ? "Mínimo 10 caracteres" : `${message.length} / 2000`}</span>
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400">
                <XCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">No se pudo enviar el reporte. Verifica tu sesión e intenta de nuevo.</p>
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
                  Enviar reporte
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
