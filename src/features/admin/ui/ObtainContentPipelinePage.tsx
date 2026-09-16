"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileArchive,
  FolderDown,
  Loader2,
  Play,
  RefreshCw,
  Shield,
  Sparkles,
  UploadCloud,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import { useObtainContentPipeline, type PipelineStepId } from "@/features/admin/model/useObtainContentPipeline";
import type { SuggestedContentReportResponse } from "@/entities/content/model/types";

const STEP_ICONS: Record<PipelineStepId, React.ReactNode> = {
  download: <Download className="w-5 h-5" />,
  decompress: <FileArchive className="w-5 h-5" />,
  register: <Database className="w-5 h-5" />,
  transform: <Cpu className="w-5 h-5" />,
  upload: <UploadCloud className="w-5 h-5" />,
  update: <CheckCircle2 className="w-5 h-5" />,
};

const STEP_ACCENT: Record<PipelineStepId, string> = {
  download: "from-sky-500 to-blue-600",
  decompress: "from-amber-500 to-orange-600",
  register: "from-emerald-500 to-teal-600",
  transform: "from-violet-500 to-purple-600",
  upload: "from-teal-500 to-cyan-600",
  update: "from-green-500 to-emerald-600",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "running") return <Loader2 className="w-4 h-4 animate-spin text-sky-400" />;
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "error") return <XCircle className="w-4 h-4 text-red-400" />;
  return <CircleDashed className="w-4 h-4 text-white/30" />;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    idle: "bg-white/[0.06] text-zinc-400 border-white/10",
    running: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    error: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  const label: Record<string, string> = { idle: "Pendiente", running: "En curso", success: "Completado", error: "Error" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${map[status]}`}>
      <StatusIcon status={status} />
      {label[status]}
    </span>
  );
}

export function ObtainContentPipelinePage({ reportId }: { reportId: number }) {
  const [report, setReport] = useState<SuggestedContentReportResponse | null>(null);
  const [tmdb, setTmdb] = useState<{ title: string; poster: string | null; type: string; year: number | null } | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const effectiveTitle = customTitle.trim() || tmdb?.title || "";
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const pipeline = useObtainContentPipeline(reportId, {
    tmdbId: report?.tmdbId ?? null,
    contentTypeName: report?.contentTypeName ?? null,
    tmdbTitle: effectiveTitle || null,
    customTitle: customTitle.trim() || null,
    year: tmdb?.year ?? null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        let data: SuggestedContentReportResponse | null = null;
        const single = await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}`, { headers });
        if (single.ok) {
          data = (await single.json()) as SuggestedContentReportResponse;
        } else {
          const tryFindInPage = async (url: string) => {
            try {
              const r = await fetch(url, { headers });
              if (!r.ok) return null;
              const j = await r.json();
              if (Array.isArray(j)) return (j as SuggestedContentReportResponse[]).find((x) => x.id === reportId) ?? null;
              if (j.content && Array.isArray(j.content)) return (j.content as SuggestedContentReportResponse[]).find((x) => x.id === reportId) ?? null;
              return null;
            } catch {
              return null;
            }
          };
          data =
            (await tryFindInPage(`${API_HOST_IP}/suggested-content-reports?page=0&size=100`)) ??
            (await tryFindInPage(`${API_HOST_IP}/suggested-content-reports/rejected?page=0&size=100`));
        }
        if (!data) {
          setNotFound(true);
          return;
        }
        setReport(data);

        if (data.tmdbId) {
          const type = data.contentTypeName === "tv-show" ? "tv" : "movie";
          const tmdbRes = await fetch(`/api/tmdb?id=${data.tmdbId}&type=${type}`);
          if (tmdbRes.ok) {
            const j = await tmdbRes.json();
            if (j.success !== false) {
              const trans = j.translations?.translations ?? [];
              const esMx = trans.find((t: { iso_639_1: string; data: { title?: string; name?: string } }) => t.iso_639_1 === "es-MX")?.data;
              const titleEs = esMx?.title || esMx?.name || j.title || j.name || `TMDB #${data.tmdbId}`;
              const year = Number((j.release_date || j.first_air_date || "").slice(0, 4)) || null;
              setTmdb({
                title: titleEs,
                poster: j.poster_path || null,
                type,
                year,
              });
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [reportId]);

  void 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-semibold">Sugerencia no encontrada</h2>
        <p className="text-sm text-zinc-400">No se pudo encontrar la sugerencia #{reportId}.</p>
        <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Volver al admin
        </Link>
      </div>
    );
  }

  const canRunStep = (id: PipelineStepId) => {
    if (pipeline.isRunning) return false;
    const order: PipelineStepId[] = ["download", "decompress", "register", "transform", "upload", "update"];
    const idx = order.indexOf(id);
    if (idx === 0) return true;
    const prev = pipeline.steps.find((s) => s.id === order[idx - 1]);
    return prev?.status === "success";
  };

  const allDone = pipeline.completedCount === 6;

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute top-0 inset-x-0 h-[420px] bg-gradient-to-b from-red-950/30 via-violet-950/10 to-transparent" />
        <div className="absolute top-20 right-[10%] w-[480px] h-[480px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 left-[5%] w-[360px] h-[360px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Volver a Administración
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/30 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row gap-6">
            <div className="flex gap-5 flex-1 min-w-0">
              <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                {tmdb?.poster ? (
                  <Image src={GetTmdbImage(tmdb.poster, 342)} alt={tmdb.title} fill unoptimized sizes="96px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Database className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium">
                    <Shield className="w-3 h-3 text-red-400" /> Sugerencia #{report.id}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">TMDB #{report.tmdbId ?? "—"} · {report.contentTypeName ?? "—"}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{effectiveTitle || "Contenido sugerido"}</h1>
                {customTitle.trim() && tmdb?.title && customTitle.trim() !== tmdb.title && <p className="text-xs text-zinc-500">TMDB original: {tmdb.title}</p>}
                <p className="text-sm text-zinc-400 line-clamp-2">{report.message || "Sin mensaje del usuario."}</p>
                <div className="pt-3 space-y-2">
                  <label className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Título personalizado (opcional) — reemplaza al de TMDB para slug y todos los procesos</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder={tmdb?.title ? `Ej: ${tmdb.title}` : "Ej: Kick-Ass: un superhéroe sin superpoderes"}
                      className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    />
                    {customTitle && (
                      <button onClick={() => setCustomTitle("")} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium">
                        Restablecer
                      </button>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Se usará para generar <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">slug</code> en descarga/descompresión/transformación/subida/registro. Ej: “Kick-Ass: Listo para machacar” → <code className="font-mono">kick-ass-listo-para-machacar</code> vs custom “Kick-Ass: un superhéroe sin superpoderes” →{" "}
                    <code className="font-mono">kick-ass-un-superheroe-sin-superpoderes</code>.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
                  <span>{report.userEmail}</span>
                  <span>·</span>
                  <span>{new Date(report.reportedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${report.statusName === "Aprobado" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" : report.statusName === "Rechazado" ? "bg-red-500/15 text-red-300 border-red-500/20" : report.statusName === "Subido" ? "bg-sky-500/15 text-sky-300 border-sky-500/20" : "bg-amber-500/15 text-amber-300 border-amber-500/20"}`}>
                    {report.statusName}
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:w-[300px] shrink-0 space-y-3 self-center w-full">
              <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Progreso global</span>
                  <span className="text-xs font-mono text-white">{pipeline.overallProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pipeline.overallProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{pipeline.completedCount} / 5 pasos completados</span>
                  {allDone && <span className="text-emerald-400 flex items-center gap-1 font-medium"><Sparkles className="w-3 h-3" /> Listo</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => void pipeline.runAll()}
            disabled={pipeline.isRunning || allDone}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-red-900/20 transition-all text-sm"
          >
            {pipeline.runningAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {pipeline.runningAll ? "Ejecutando pipeline..." : allDone ? "Pipeline completado" : "Ejecutar pipeline completo"}
          </button>
          <button
            onClick={pipeline.reset}
            disabled={pipeline.isRunning}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors disabled:opacity-40"
          >
            <RefreshCw className="w-4 h-4" /> Reiniciar
          </button>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> API: {API_HOST_IP ?? "—"}
          </div>
        </div>

        <div className="grid gap-4">
          {pipeline.steps.map((step, idx) => {
            const isLast = idx === pipeline.steps.length - 1;
            const Icon = STEP_ICONS[step.id];
            return (
              <div key={step.id} className="relative">
                {!isLast && (
                  <div
                    className={`hidden sm:block absolute left-[26px] top-[64px] bottom-[-16px] w-px transition-colors duration-500 ${step.status === "success" ? "bg-emerald-500/40" : "bg-white/10"}`}
                  />
                )}

                <div
                  className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${step.status === "running" ? "bg-sky-950/20 border-sky-500/30 shadow-lg shadow-sky-900/10" : step.status === "success" ? "bg-emerald-950/10 border-emerald-500/20" : step.status === "error" ? "bg-red-950/20 border-red-500/30" : "bg-zinc-900/50 border-white/[0.06] hover:border-white/10"}`}
                >
                  {step.status === "running" && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent animate-pulse" />
                  )}

                  <div className="p-5 sm:p-6 flex gap-4 sm:gap-5">
                    <div
                      className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border shadow-inner transition-all ${step.status === "success" ? "bg-emerald-500 text-white border-emerald-400/30" : step.status === "running" ? "bg-sky-500 text-white border-sky-400/30 animate-pulse" : step.status === "error" ? "bg-red-500 text-white border-red-400/30" : `bg-gradient-to-br ${STEP_ACCENT[step.id]} text-white border-white/10`}`}
                    >
                      {step.status === "running" ? <Loader2 className="w-6 h-6 animate-spin" /> : step.status === "success" ? <CheckCircle2 className="w-6 h-6" /> : step.status === "error" ? <XCircle className="w-6 h-6" /> : Icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Paso {idx + 1} · {step.id}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold leading-tight">{step.label}</h3>
                          <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                        </div>
                        <StatusBadge status={step.status} />
                      </div>

                      {step.id === "download" && (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            {pipeline.checkingExists ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                <span className="text-amber-200">Verificando rars existentes...</span>
                              </>
                            ) : pipeline.rarExistsResults.length > 0 ? (
                              <>
                                <CheckCircle2 className={`w-4 h-4 ${pipeline.rarExistsResults.every((r) => r.exists) ? "text-emerald-400" : "text-amber-400"}`} />
                                <span className="text-zinc-300">
                                  {pipeline.rarExistsResults.every((r) => r.exists)
                                    ? `Rars ya existentes: ${pipeline.rarExistsResults.length} archivo(s) — puedes continuar`
                                    : `${pipeline.rarExistsResults.filter((r) => r.exists).length}/${pipeline.rarExistsResults.length} rars existentes`}
                                </span>
                              </>
                            ) : (
                              <>
                                <FileArchive className="w-4 h-4 text-white/40" />
                                <span className="text-zinc-500">
                                  {report.contentTypeName === "tv-show"
                                    ? `Esperado: ${pipeline.buildExpectedRarFilenames(effectiveTitle).length} rars (${pipeline.slugify(effectiveTitle)}/season-X/episode-Y.rar)`
                                    : `Esperado: ${pipeline.slugify(effectiveTitle)}.rar`}
                                </span>
                              </>
                            )}
                          </div>
                            <button
                              onClick={() => effectiveTitle && void pipeline.verifyExistingRars(effectiveTitle)}
                              disabled={pipeline.checkingExists || pipeline.isRunning || !effectiveTitle}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium disabled:opacity-40"
                            >
                              <RefreshCw className={`w-3 h-3 ${pipeline.checkingExists ? "animate-spin" : ""}`} /> Verificar rars
                            </button>
                        </div>
                      )}

                      {step.id === "download" && pipeline.rarExistsResults.length > 0 && pipeline.rarExistsResults.every((r) => r.exists) && step.status === "success" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const next = pipeline.steps.find((s) => s.id === "decompress");
                              if (next?.status === "idle") void pipeline.runStep("decompress");
                            }}
                            disabled={pipeline.isRunning}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow disabled:opacity-40"
                          >
                            <ArrowRight className="w-4 h-4" /> Continuar a Descomprimir
                          </button>
                        </div>
                      )}

                      {step.id === "download" && report.contentTypeName === "tv-show" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-black/30 border border-white/10 p-4">
                            <label className="space-y-1">
                              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">Temp. inicial</span>
                              <input
                                type="number"
                                min={1}
                                value={pipeline.startSeason}
                                onChange={(e) => {
                                  const v = Math.max(1, Number(e.target.value) || 1);
                                  pipeline.setStartSeason(v);
                                  if (v > pipeline.endSeason) pipeline.setEndSeason(v);
                                }}
                                disabled={pipeline.isRunning}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">Cap. inicial</span>
                              <input
                                type="number"
                                min={1}
                                value={pipeline.startEpisode}
                                onChange={(e) => pipeline.setStartEpisode(Math.max(1, Number(e.target.value) || 1))}
                                disabled={pipeline.isRunning}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">Temp. final</span>
                              <input
                                type="number"
                                min={pipeline.startSeason}
                                value={pipeline.endSeason}
                                onChange={(e) => pipeline.setEndSeason(Math.max(pipeline.startSeason, Number(e.target.value) || pipeline.startSeason))}
                                disabled={pipeline.isRunning}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">Cap. final</span>
                              <input
                                type="number"
                                min={1}
                                value={pipeline.endEpisode}
                                onChange={(e) => pipeline.setEndEpisode(Math.max(1, Number(e.target.value) || 1))}
                                disabled={pipeline.isRunning}
                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50"
                              />
                            </label>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                              S{pipeline.startSeason}E{pipeline.startEpisode} → S{pipeline.endSeason}E{pipeline.endEpisode}
                            </span>
                            <span className="hidden sm:inline">→ /scrape/{report.tmdbId}/download?type=tv&season=X&episode=Y (secuencial)</span>
                          </div>
                          {pipeline.downloadItems.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                                  Progreso episodios · {pipeline.downloadItems.filter((i) => i.status === "success").length}/{pipeline.downloadItems.length}
                                </span>
                                {step.status === "running" && (
                                  <span className="text-xs text-sky-300 flex items-center gap-1.5">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Descargando...
                                  </span>
                                )}
                              </div>
                              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                                {pipeline.downloadItems.map((it, idx) => (
                                  <div key={`${it.season}-${it.episode}`} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${idx === pipeline.downloadCurrent ? "bg-sky-500/10" : ""}`}>
                                    <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0">
                                      S{it.season}E{it.episode}
                                    </span>
                                    <span className="flex-1 min-w-0 truncate text-zinc-400 text-xs">
                                      {it.status === "pending" && "Pendiente"}
                                      {it.status === "running" && "Descargando..."}
                                      {it.status === "success" && (it.result?.filename || "Completado")}
                                      {it.status === "error" && (it.message || "Error")}
                                    </span>
                                    {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20 shrink-0" />}
                                    {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />}
                                    {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    {it.status === "error" && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                  </div>
                                ))}
                              </div>
                              <div className="h-1.5 bg-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300"
                                  style={{ width: `${pipeline.downloadItems.length ? (pipeline.downloadItems.filter((i) => i.status === "success").length / pipeline.downloadItems.length) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step.id === "download" && report.contentTypeName !== "tv-show" && (
                        <div className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-xs font-mono text-zinc-400">
                          POST {API_HOST_IP}/scrape/{report.tmdbId}/download?type=movie
                        </div>
                      )}

                      {step.id === "download" && step.details && step.status === "success" && (
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-mono text-emerald-200 break-all">
                          {step.details}
                        </div>
                      )}

                      {step.id === "download" && pipeline.downloadResult && step.status === "success" && pipeline.downloadResult.fileSize != null && report.contentTypeName !== "tv-show" && (
                        <div className="flex gap-2 text-xs text-zinc-500">
                          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{pipeline.downloadResult.filename}</span>
                          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{(pipeline.downloadResult.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      )}

                      {step.id === "decompress" && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                            <div className="flex items-center gap-2 text-xs">
                              {pipeline.checkingMp4Exists ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                  <span className="text-amber-200">Verificando MP4 existentes...</span>
                                </>
                              ) : pipeline.mp4ExistsResults.length > 0 ? (
                                <>
                                  <CheckCircle2 className={`w-4 h-4 ${pipeline.mp4ExistsResults.every((r) => r.exists) ? "text-emerald-400" : "text-amber-400"}`} />
                                  <span className="text-zinc-300">
                                    {pipeline.mp4ExistsResults.every((r) => r.exists)
                                      ? `MP4 ya existentes: ${pipeline.mp4ExistsResults.length} archivo(s) — puedes continuar`
                                      : `${pipeline.mp4ExistsResults.filter((r) => r.exists).length}/${pipeline.mp4ExistsResults.length} MP4 existentes`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FileArchive className="w-4 h-4 text-white/40" />
                                  <span className="text-zinc-500">
                                    {report.contentTypeName === "tv-show"
                                      ? `Esperado MP4: ${pipeline.buildExpectedMp4Filenames(effectiveTitle).length} archivos (${pipeline.slugify(effectiveTitle.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim())}/season-X/episode-Y.mp4)`
                                      : `Esperado MP4: ${pipeline.slugify(effectiveTitle)}.mp4`}
                                  </span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => effectiveTitle && void pipeline.verifyExistingMp4s(effectiveTitle)}
                              disabled={pipeline.checkingMp4Exists || pipeline.isRunning || !effectiveTitle}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium disabled:opacity-40"
                            >
                              <RefreshCw className={`w-3 h-3 ${pipeline.checkingMp4Exists ? "animate-spin" : ""}`} /> Verificar MP4
                            </button>
                          </div>
                          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <FileArchive className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Origen automático desde descarga</span>
                              <span className="hidden sm:inline text-xs text-zinc-500">→ POST {API_HOST_IP}/archive/unrar {"{filename}"} · unrar x -pcc -o+ en lamovie.download-dir</span>
                            </div>
                            {(() => {
                              const autoFiles: string[] = [];
                              if (pipeline.downloadResult?.filename) autoFiles.push(pipeline.downloadResult.filename);
                              for (const it of pipeline.downloadItems) if (it.result?.filename && !autoFiles.includes(it.result.filename)) autoFiles.push(it.result.filename);
                              if (autoFiles.length === 0) {
                                return <p className="text-xs text-amber-200/70">Aún no hay archivos descargados. Completa el paso 1 para habilitar la descompresión.</p>;
                              }
                              return (
                                <div className="flex flex-wrap gap-2">
                                  {autoFiles.map((f) => (
                                    <span key={f} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 truncate max-w-[220px]">
                                      {f}
                                    </span>
                                  ))}
                                  <span className="text-xs text-zinc-500 self-center">· {autoFiles.length} archivo(s) se descomprimirán automáticamente</span>
                                </div>
                              );
                            })()}
                          </div>

                          {pipeline.decompressItems.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                                  Progreso descompresión · {pipeline.decompressItems.filter((i) => i.status === "success").length}/{pipeline.decompressItems.length}
                                </span>
                                {step.status === "running" && <span className="text-xs text-amber-300 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Extrayendo...</span>}
                              </div>
                              <div className="max-h-48 overflow-y-auto divide-y divide-white/5">
                                {pipeline.decompressItems.map((it, idx) => (
                                  <div key={`${it.filename}-${idx}`} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${idx === pipeline.decompressCurrent ? "bg-amber-500/10" : ""}`}>
                                    <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0 truncate max-w-[180px]">{it.filename}</span>
                                    <span className="flex-1 min-w-0 truncate text-zinc-400 text-xs">{it.status === "pending" ? "Pendiente" : it.status === "running" ? "Descomprimiendo..." : it.status === "success" ? it.message || "Extraído" : it.message || "Error"}</span>
                                    {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20 shrink-0" />}
                                    {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />}
                                    {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    {it.status === "error" && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                  </div>
                                ))}
                              </div>
                              <div className="h-1.5 bg-white/5">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" style={{ width: `${pipeline.decompressItems.length ? (pipeline.decompressItems.filter((i) => i.status === "success").length / pipeline.decompressItems.length) * 100 : 0}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step.id === "transform" && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                            <div className="flex items-center gap-2 text-xs">
                              {pipeline.checkingTransformExists ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                                  <span className="text-violet-200">Verificando transformados...</span>
                                </>
                              ) : pipeline.transformExistsResults.length > 0 ? (
                                <>
                                  <CheckCircle2 className={`w-4 h-4 ${pipeline.transformExistsResults.every((r) => r.av1Exists && r.lowExists && r.dashExists) ? "text-emerald-400" : "text-amber-400"}`} />
                                  <span className="text-zinc-300">
                                    {pipeline.transformExistsResults.every((r) => r.av1Exists && r.lowExists && r.dashExists)
                                      ? `Transformados existentes: ${pipeline.transformExistsResults.length} archivo(s) — puedes continuar`
                                      : `${pipeline.transformExistsResults.filter((r) => r.av1Exists && r.lowExists && r.dashExists).length}/${pipeline.transformExistsResults.length} completos (av1/low/manifest)`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Cpu className="w-4 h-4 text-white/40" />
                                  <span className="text-zinc-500">Verifica si -av1.mkv, -low.mkv y manifest.mpd ya existen</span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => effectiveTitle && void pipeline.verifyExistingTransforms(effectiveTitle)}
                              disabled={pipeline.checkingTransformExists || pipeline.isRunning || !effectiveTitle}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium disabled:opacity-40"
                            >
                              <RefreshCw className={`w-3 h-3 ${pipeline.checkingTransformExists ? "animate-spin" : ""}`} /> Verificar transformados
                            </button>
                          </div>
                          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-violet-400" />
                              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">3 transformaciones por archivo</span>
                              <span className="hidden sm:inline text-xs text-zinc-500">1080p (AV1) → 360p (low) → DASH/HLS (requiere ambas)</span>
                            </div>
                            <p className="text-[11px] text-zinc-500">Solo <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">1080p</code> usa <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">audioTrack/subtitleTrack</code> (ej. <code className="font-mono">{"{filename:\"rick-y-morty/season-9/episode-10\", audioTrack:1, subtitleTrack:2}"}</code> → <code className="font-mono">-map 0:a:1 -map 0:s:2</code>); 360p/dash usan default 0.</p>
                            {(() => {
                              const bases: string[] = [];
                              const add = (f: string) => {
                                const b = f.replace(/\.rar$/i, "").replace(/\.mkv$/i, "");
                                if (b && !bases.includes(b)) bases.push(b);
                              };
                              if (pipeline.downloadResult?.filename) add(pipeline.downloadResult.filename);
                              for (const it of pipeline.downloadItems) if (it.result?.filename) add(it.result.filename);
                              if (bases.length === 0) return <p className="text-xs text-violet-200/60">Esperando archivos descomprimidos para transformar.</p>;
                              return (
                                <div className="flex flex-wrap gap-2">
                                  {bases.map((b) => (
                                    <span key={b} className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-200 truncate max-w-[220px]">
                                      {b}
                                    </span>
                                  ))}
                                  <span className="text-xs text-zinc-500 self-center">· {bases.length} archivo(s) · endpoints: /ffmpeg/1080p, /360p, /dash</span>
                                </div>
                              );
                            })()}
                          </div>

                          {pipeline.transformItems.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                                  Progreso transformación · {pipeline.transformItems.filter((i) => i.status === "success").length}/{pipeline.transformItems.length} archivos
                                </span>
                                {step.status === "running" && pipeline.transformSubStep && (
                                  <span className="text-xs text-violet-300 flex items-center gap-1.5">
                                    <Loader2 className="w-3 h-3 animate-spin" /> {pipeline.transformSubStep}...
                                  </span>
                                )}
                              </div>
                              <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
                                {pipeline.transformItems.map((it, idx) => (
                                  <div key={it.base} className={`p-4 space-y-2 ${idx === pipeline.transformCurrent ? "bg-violet-500/5" : ""}`}>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 truncate max-w-[200px]">{it.base}</span>
                                      {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20" />}
                                      {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-violet-400" />}
                                      {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                      {it.status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                                      <span className="text-xs text-zinc-500">{it.status === "success" ? "Completado" : it.status === "running" ? "Transformando..." : it.status}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <label className="space-y-1">
                                        <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">Audio Track (solo 1080p)</span>
                                        <input
                                          type="number"
                                          min={0}
                                          value={it.audioTrack}
                                          onChange={(e) => pipeline.setTransformAudioTrack(it.base, Math.max(0, Number(e.target.value) || 0))}
                                          disabled={pipeline.isRunning || it.status !== "pending"}
                                          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50"
                                        />
                                      </label>
                                      <label className="space-y-1">
                                        <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">Subtitle Track (solo 1080p)</span>
                                        <input
                                          type="number"
                                          min={0}
                                          value={it.subtitleTrack}
                                          onChange={(e) => pipeline.setTransformSubtitleTrack(it.base, Math.max(0, Number(e.target.value) || 0))}
                                          disabled={pipeline.isRunning || it.status !== "pending"}
                                          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50"
                                        />
                                      </label>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      {it.subSteps.map((sub) => (
                                        <div
                                          key={sub.id}
                                          className={`rounded-lg border p-2.5 space-y-1 ${sub.status === "success" ? "bg-emerald-500/10 border-emerald-500/20" : sub.status === "running" ? "bg-violet-500/10 border-violet-500/30" : sub.status === "error" ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"}`}
                                        >
                                          <div className="flex items-center gap-1.5">
                                            {sub.status === "pending" && <CircleDashed className="w-3.5 h-3.5 text-white/20" />}
                                            {sub.status === "running" && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />}
                                            {sub.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                            {sub.status === "error" && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                            <span className="text-xs font-semibold tracking-wide uppercase">{sub.id}</span>
                                          </div>
                                          {sub.status !== "pending" && sub.message && <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-2">{sub.message}</p>}
                                          {sub.outputFiles && sub.outputFiles.length > 0 && <p className="text-[11px] font-mono text-zinc-500 truncate">{sub.outputFiles.join(", ")}</p>}
                                        </div>
                                      ))}
                                    </div>
                                    {it.subSteps.some((s) => s.commandOutputs && s.commandOutputs.length > 0) && (
                                      <details className="rounded-lg bg-black/40 border border-white/10 px-3 py-2">
                                        <summary className="text-xs font-mono text-zinc-400 cursor-pointer">Ver logs ffmpeg</summary>
                                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                          {it.subSteps.flatMap((s) => s.commandOutputs ?? []).map((log, li) => (
                                            <pre key={li} className="text-[10px] leading-relaxed text-zinc-500 whitespace-pre-wrap break-all font-mono bg-white/5 p-2 rounded">
                                              {log.slice(0, 800)}
                                              {log.length > 800 ? "…" : ""}
                                            </pre>
                                          ))}
                                        </div>
                                      </details>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="h-1.5 bg-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                                  style={{ width: `${pipeline.transformItems.length ? (pipeline.transformItems.filter((i) => i.status === "success").length / pipeline.transformItems.length) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step.id === "upload" && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                            <div className="flex items-center gap-2 text-xs">
                              {pipeline.checkingUploadExists ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                                  <span className="text-teal-200">Verificando subida remota...</span>
                                </>
                              ) : pipeline.uploadVerifyResult?.verified ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span className="text-zinc-300">
                                    Subida verificada en remoto
                                    {pipeline.uploadVerifyResult.totalEpisodes ? ` — ${pipeline.uploadVerifyResult.totalEpisodes - (pipeline.uploadVerifyResult.missingCount ?? 0)}/${pipeline.uploadVerifyResult.totalEpisodes} manifests` : ""}
                                    {pipeline.uploadVerifyResult.manifestPath ? ` · ${pipeline.uploadVerifyResult.manifestPath}` : ""}
                                  </span>
                                </>
                              ) : pipeline.uploadVerifyResult ? (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                                  <span className="text-zinc-300">
                                    {pipeline.uploadVerifyResult.missingCount != null
                                      ? `Faltan ${pipeline.uploadVerifyResult.missingCount} manifests en remoto`
                                      : "No verificado en remoto"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-4 h-4 text-white/40" />
                                  <span className="text-zinc-500">Verifica si manifest.mpd ya está en sh4dow-server</span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => effectiveTitle && void pipeline.verifyExistingUploads(effectiveTitle)}
                              disabled={pipeline.checkingUploadExists || pipeline.isRunning || !effectiveTitle}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium disabled:opacity-40"
                            >
                              <RefreshCw className={`w-3 h-3 ${pipeline.checkingUploadExists ? "animate-spin" : ""}`} /> Verificar subida
                            </button>
                          </div>
                          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <UploadCloud className="w-4 h-4 text-teal-400" />
                              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Solo carpetas DASH</span>
                              <span className="hidden sm:inline text-xs text-zinc-500">POST /upload/to-server {"{filename}"} → scp -r carpeta DASH (no archivos sueltos)</span>
                            </div>
                            {(() => {
                              const bases: string[] = [];
                              const add = (f: string) => {
                                const b = f.replace(/\.rar$/i, "").replace(/\.mkv$/i, "").replace(/\.mp4$/i, "");
                                if (b && !bases.includes(b)) bases.push(b);
                              };
                              if (pipeline.downloadResult?.filename) add(pipeline.downloadResult.filename);
                              for (const it of pipeline.downloadItems) if (it.result?.filename) add(it.result.filename);
                              if (bases.length === 0) return <p className="text-xs text-teal-200/60">Esperando carpetas DASH (transformación).</p>;
                              return (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {bases.map((b) => (
                                      <span key={b} className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-mono text-teal-200 truncate max-w-[220px]">
                                        {b}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-zinc-500">
                                    Película: <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">iron-man-3</code> · Serie:{" "}
                                    <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">rick-y-morty/season-9/episode-10</code> — se ignora <code className="font-mono">episode-10.mp4</code> suelto en season-9, solo sube la carpeta DASH.
                                  </p>
                                </div>
                              );
                            })()}
                          </div>

                          {pipeline.uploadMkdirItems.length > 0 && (
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-amber-500/10 bg-amber-500/10">
                                <span className="text-xs font-semibold tracking-widest uppercase text-amber-200">Creando rutas remotas (mkdir)</span>
                                <span className="text-xs font-mono text-amber-300">
                                  {pipeline.uploadMkdirItems.filter((i) => i.status === "success").length}/{pipeline.uploadMkdirItems.length}
                                </span>
                              </div>
                              <div className="divide-y divide-white/5">
                                {pipeline.uploadMkdirItems.map((it) => (
                                  <div key={it.path} className="flex items-center gap-3 px-4 py-2.5">
                                    <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 truncate max-w-[220px]">{it.path}</span>
                                    <span className="flex-1 text-xs text-zinc-400 truncate">{it.message || (it.status === "success" ? "Creada" : it.status === "running" ? "Creando..." : "Pendiente")}</span>
                                    {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20" />}
                                    {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
                                    {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    {it.status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {pipeline.uploadItems.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                                  Progreso subida · {pipeline.uploadItems.filter((i) => i.status === "success").length}/{pipeline.uploadItems.length} carpetas
                                </span>
                                {step.status === "running" && pipeline.uploadSubStep && (
                                  <span className="text-xs text-teal-300 flex items-center gap-1.5">
                                    <Loader2 className="w-3 h-3 animate-spin" /> {pipeline.uploadSubStep}...
                                  </span>
                                )}
                              </div>
                              <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto">
                                {pipeline.uploadItems.map((it, idx) => (
                                  <div key={it.base} className={`flex items-center gap-3 px-4 py-3 ${idx === pipeline.uploadCurrent ? "bg-teal-500/5" : ""}`}>
                                    <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 truncate max-w-[240px]">{it.base}</span>
                                    <span className="flex-1 min-w-0 truncate text-xs text-zinc-400">
                                      {it.status === "pending" ? "Pendiente" : it.status === "running" ? "Subiendo carpeta DASH..." : it.subSteps[0]?.message || (it.status === "success" ? "Subida" : "")}
                                    </span>
                                    {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20 shrink-0" />}
                                    {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" />}
                                    {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    {it.status === "error" && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                  </div>
                                ))}
                              </div>
                              <div className="h-1.5 bg-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                                  style={{ width: `${pipeline.uploadItems.length ? (pipeline.uploadItems.filter((i) => i.status === "success").length / pipeline.uploadItems.length) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step.id === "register" && (
                        <div className="space-y-3">
                          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Registro en BD como Próximamente</span>
                              <span className="hidden sm:inline text-xs text-zinc-500">comingSoon=true · solo contenido</span>
                            </div>
                            <p className="text-xs text-zinc-500">
                              {report.contentTypeName === "tv-show"
                                ? `Serie "${effectiveTitle}" se crea como Próximamente; los episodios se añadirán en el último paso Actualizar.`
                                : `Película "${effectiveTitle}" se crea como Próximamente.`}
                            </p>
                          </div>
                        </div>
                      )}

                      {step.id === "update" && (
                        <div className="space-y-3">
                          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Actualizar Contenido</span>
                              <span className="hidden sm:inline text-xs text-zinc-500">
                                {report.contentTypeName === "tv-show" ? `Quita Próximamente y registra ${pipeline.updateItems.length || "N"} episodios` : "Quita Próximamente"}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500">
                              {report.contentTypeName === "tv-show"
                                ? `Actualiza serie a comingSoon=false y registra episodios S${pipeline.startSeason}E${pipeline.startEpisode}→S${pipeline.endSeason}E${pipeline.endEpisode} vía POST /api/seasons (mismo que admin).`
                                : "Actualiza película a comingSoon=false."}
                            </p>
                          </div>

                          {pipeline.updateItems.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                                  Progreso actualización episodios · {pipeline.updateItems.filter((i) => i.status === "success").length}/{pipeline.updateItems.length}
                                </span>
                                {step.status === "running" && <span className="text-xs text-green-300 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Actualizando...</span>}
                              </div>
                              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                                {pipeline.updateItems.map((it, idx) => (
                                  <div key={`${it.season}-${it.episode}`} className={`flex items-center gap-3 px-4 py-2.5 ${idx === pipeline.updateCurrent ? "bg-green-500/10" : ""}`}>
                                    <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0">S{it.season}E{it.episode}</span>
                                    <span className="flex-1 min-w-0 truncate text-xs text-zinc-400">{it.status === "pending" ? "Pendiente" : it.status === "running" ? "Actualizando..." : it.status === "success" ? it.message || "Actualizado" : it.message || "Error"}</span>
                                    {it.status === "pending" && <CircleDashed className="w-4 h-4 text-white/20" />}
                                    {it.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-green-400" />}
                                    {it.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    {it.status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                                  </div>
                                ))}
                              </div>
                              <div className="h-1.5 bg-white/5">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${pipeline.updateItems.length ? (pipeline.updateItems.filter((i) => i.status === "success").length / pipeline.updateItems.length) * 100 : 0}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {(step.status === "running" || step.status === "success" || step.status === "error") && step.message && (
                        <div
                          className={`rounded-xl px-4 py-3 text-sm border flex items-start gap-2.5 ${step.status === "error" ? "bg-red-500/10 border-red-500/20 text-red-200" : step.status === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" : "bg-sky-500/10 border-sky-500/20 text-sky-200"}`}
                        >
                          {step.status === "error" ? <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> : step.status === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />}
                          <span className="leading-relaxed break-words">{step.message}</span>
                        </div>
                      )}

                      {step.id === "download" && step.status === "error" && (
                        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 sm:p-5 space-y-4">
                          <div className="flex gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                              <FolderDown className="w-5 h-5 text-amber-300" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold text-amber-100">No se pudo obtener el contenido automáticamente</h4>
                              <p className="text-sm leading-relaxed text-amber-200/80">
                                El scraper no encontró el archivo. Puedes buscarlo manualmente en estas páginas y colocarlo en la carpeta destino del servidor.
                              </p>
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <a
                              href="https://zona-leros.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white text-black hover:bg-zinc-100 transition-colors text-sm font-medium"
                            >
                              <span className="truncate">zona-leros.com</span>
                              <ExternalLink className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a
                              href="https://www.gatonplayseries.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 transition-colors text-sm font-medium"
                            >
                              <span className="truncate">gatonplayseries.com</span>
                              <ExternalLink className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </div>
                          <p className="text-xs leading-relaxed text-amber-200/60">
                            Tip: descarga el archivo con el nombre correcto y colócalo en la carpeta destino configurada en el backend (ej. <code className="px-1 py-0.5 rounded bg-black/30 border border-white/10 font-mono">/data/incoming</code>). Luego pulsa Continuar.
                          </p>
                          <button
                            onClick={() => pipeline.confirmManualDownload()}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Ya está en la carpeta destino — Continuar <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {step.status === "running" && (
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full animate-pulse" style={{ width: "70%" }} />
                        </div>
                      )}

                      <div className="flex gap-2 pt-1 flex-wrap">
                        {step.status === "idle" && (
                          <>
                            <button
                              onClick={() => void pipeline.runStep(step.id)}
                              disabled={!canRunStep(step.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                              title={!canRunStep(step.id) ? "Completa el paso anterior primero" : undefined}
                            >
                              <Play className="w-3.5 h-3.5" /> Iniciar
                            </button>
                            {step.id === "download" && (
                              <button
                                onClick={() => pipeline.confirmManualDownload()}
                                disabled={pipeline.isRunning}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-40"
                                title="Si ya tienes los .rar en el servidor, omite la verificación y continúa a Descomprimir"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Ya tengo los archivos — Continuar
                              </button>
                            )}
                          </>
                        )}
                        {step.status === "error" && step.id !== "download" && (
                          <button
                            onClick={() => void pipeline.runStep(step.id)}
                            disabled={pipeline.isRunning}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-40"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Reintentar
                          </button>
                        )}
                        {step.status === "error" && step.id === "download" && (
                          <button
                            onClick={() => void pipeline.runStep(step.id)}
                            disabled={pipeline.isRunning}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors disabled:opacity-40"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Reintentar descarga
                          </button>
                        )}
                        {step.status === "success" && (
                          <button
                            onClick={() => void pipeline.runStep(step.id)}
                            disabled={pipeline.isRunning}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors disabled:opacity-40"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Volver a ejecutar
                          </button>
                        )}
                        {step.status === "running" && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-sky-300">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando en el servidor...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 flex gap-3 text-sm text-sky-200/90">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
          <p className="leading-relaxed">
            <strong>Descarga</strong> usa <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-xs">POST {API_HOST_IP}/scrape/{report.tmdbId}/download?type=movie</code> o{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-xs">?type=tv&season=&episode=</code> · <strong>Descomprimir</strong>{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-xs">POST {API_HOST_IP}/archive/unrar {"{filename}"}</code> (unrar x -pcc -o+ en lamovie.download-dir) — <strong>Transformar / Subir / Registrar</strong>{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-xs">POST {API_HOST_IP}/suggested-content-reports/{reportId}/pipeline/{"{transform|upload|register}"}</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
