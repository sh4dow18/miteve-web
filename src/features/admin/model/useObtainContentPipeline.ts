"use client";

import { useCallback, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";

export type PipelineStepId = "download" | "decompress" | "register" | "transform" | "upload" | "update";
export type StepStatus = "idle" | "running" | "success" | "error";
export interface PipelineStep {
  id: PipelineStepId;
  label: string;
  description: string;
  status: StepStatus;
  message?: string;
  progress?: number;
  details?: string;
}
export interface DownloadResult {
  success: boolean;
  message: string;
  filename?: string;
  filePath?: string;
  fileSize?: number;
}
export interface DownloadItem {
  season: number;
  episode: number;
  status: "pending" | "running" | "success" | "error";
  message?: string;
  result?: DownloadResult;
}
export interface DecompressItem {
  filename: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
}
export interface TransformSubStep {
  id: "1080p" | "360p" | "dash";
  status: "pending" | "running" | "success" | "error";
  message?: string;
  outputFiles?: string[];
  commandOutputs?: string[];
}
export interface TransformItem {
  base: string;
  status: "pending" | "running" | "success" | "error";
  audioTrack: number;
  subtitleTrack: number;
  subSteps: TransformSubStep[];
}
export interface UploadSubStep {
  id: string;
  filename: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
  remotePath?: string;
}
export interface UploadItem {
  base: string;
  status: "pending" | "running" | "success" | "error";
  subSteps: UploadSubStep[];
}

const STEP_ENDPOINTS: Record<string, string> = {};
function initialSteps(): PipelineStep[] {
  return [
    { id: "download", label: "Descargar Contenido", description: "Descarga el contenido original desde la fuente externa.", status: "idle" },
    { id: "decompress", label: "Descomprimir Archivos", description: "Extrae archivos .rar en la carpeta de descarga (unrar x -pcc -o+).", status: "idle" },
    { id: "register", label: "Registrar Contenido", description: "Registra el contenido en BD como Próximamente (comingSoon=true), solo contenido.", status: "idle" },
    { id: "transform", label: "Transformar Contenido", description: "Transcodifica y optimiza el contenido para streaming.", status: "idle" },
    { id: "upload", label: "Subir Contenido", description: "Sube el contenido procesado al almacenamiento.", status: "idle" },
    { id: "update", label: "Actualizar Contenido", description: "Quita Próximamente y registra/actualiza capítulos (serie) o solo actualiza película.", status: "idle" },
  ];
}

function buildEpisodeList(
  startSeason: number,
  startEpisode: number,
  endSeason: number,
  endEpisode: number,
  seasonEpisodeCounts?: Map<number, number>
): { season: number; episode: number }[] {
  const list: { season: number; episode: number }[] = [];
  if (startSeason > endSeason || (startSeason === endSeason && startEpisode > endEpisode)) return list;
  for (let s = startSeason; s <= endSeason; s++) {
    const isFirst = s === startSeason;
    const isLast = s === endSeason;
    const epStart = isFirst ? startEpisode : 1;
    let epEnd: number;
    if (isLast) epEnd = endEpisode;
    else if (seasonEpisodeCounts?.has(s)) epEnd = seasonEpisodeCounts.get(s)!;
    else epEnd = 30;
    for (let e = epStart; e <= epEnd; e++) list.push({ season: s, episode: e });
    if (list.length > 500) break;
  }
  return list;
}

export function useObtainContentPipeline(
  reportId: number,
  opts?: { tmdbId: number | null; contentTypeName: string | null; tmdbTitle?: string | null; customTitle?: string | null; year?: number | null }
) {
  const [steps, setSteps] = useState<PipelineStep[]>(() => initialSteps());
  const [runningAll, setRunningAll] = useState(false);
  const [activeStep, setActiveStep] = useState<PipelineStepId | null>(null);

  const [startSeason, setStartSeason] = useState(1);
  const [startEpisode, setStartEpisode] = useState(1);
  const [endSeason, setEndSeason] = useState(1);
  const [endEpisode, setEndEpisode] = useState(1);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
  const [downloadCurrent, setDownloadCurrent] = useState<number>(-1);

  const [decompressFilename, setDecompressFilename] = useState("");
  const [decompressItems, setDecompressItems] = useState<DecompressItem[]>([]);
  const [decompressCurrent, setDecompressCurrent] = useState<number>(-1);

  const [transformItems, setTransformItems] = useState<TransformItem[]>([]);
  const [transformCurrent, setTransformCurrent] = useState<number>(-1);
  const [transformSubStep, setTransformSubStep] = useState<"1080p" | "360p" | "dash" | null>(null);

  const setTransformAudioTrack = useCallback((base: string, value: number) => {
    setTransformItems((prev) => prev.map((it) => (it.base === base ? { ...it, audioTrack: Math.max(0, value) } : it)));
  }, []);
  const setTransformSubtitleTrack = useCallback((base: string, value: number) => {
    setTransformItems((prev) => prev.map((it) => (it.base === base ? { ...it, subtitleTrack: Math.max(0, value) } : it)));
  }, []);

  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [uploadCurrent, setUploadCurrent] = useState<number>(-1);
  const [uploadSubStep, setUploadSubStep] = useState<string | null>(null);
  const [uploadMkdirItems, setUploadMkdirItems] = useState<{ path: string; status: "pending" | "running" | "success" | "error"; message?: string }[]>([]);

  const [registerItems, setRegisterItems] = useState<{ season: number; episode: number; status: "pending" | "running" | "success" | "error"; message?: string }[]>([]);
  const [registerCurrent, setRegisterCurrent] = useState<number>(-1);
  const [registeredContentId, setRegisteredContentId] = useState<string | null>(null);
  const [updateItems, setUpdateItems] = useState<{ season: number; episode: number; status: "pending" | "running" | "success" | "error"; message?: string }[]>([]);
  const [updateCurrent, setUpdateCurrent] = useState<number>(-1);

  const [checkingExists, setCheckingExists] = useState(false);
  const [rarExistsResults, setRarExistsResults] = useState<{ filename: string; exists: boolean; path?: string; size?: number }[]>([]);
  const [checkingMp4Exists, setCheckingMp4Exists] = useState(false);
  const [mp4ExistsResults, setMp4ExistsResults] = useState<{ filename: string; exists: boolean; path?: string; size?: number }[]>([]);
  const [checkingTransformExists, setCheckingTransformExists] = useState(false);
  const [transformExistsResults, setTransformExistsResults] = useState<{ base: string; mp4Exists: boolean; av1Exists: boolean; lowExists: boolean; dashExists: boolean }[]>([]);
  const [checkingUploadExists, setCheckingUploadExists] = useState(false);
  const [uploadVerifyResult, setUploadVerifyResult] = useState<{ verified: boolean; allExist?: boolean; totalEpisodes?: number; missingCount?: number; manifestPath?: string; episodes?: { season: number; episode: number; path: string; exists: boolean }[] } | null>(null);

  const updateStep = useCallback((id: PipelineStepId, patch: Partial<PipelineStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const slugify = useCallback((title: string) => {
    return title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
  }, []);

  const buildExpectedRarFilenames = useCallback(
    (tmdbTitle: string): string[] => {
      if (!tmdbTitle) return [];
      const type = opts?.contentTypeName === "tv-show" ? "tv" : "movie";
      if (type === "movie") return [`${slugify(tmdbTitle)}.rar`];
      const cleanTitle = tmdbTitle.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim();
      const sSeason = Math.max(1, startSeason || 1);
      const sEpisode = Math.max(1, startEpisode || 1);
      const eSeason = Math.max(sSeason, endSeason || sSeason);
      const eEpisode = Math.max(1, endEpisode || 1);
      const slug = slugify(cleanTitle);
      const list: string[] = [];
      for (let s = sSeason; s <= eSeason; s++) {
        const epStart = s === sSeason ? sEpisode : 1;
        const epEnd = s === eSeason ? eEpisode : 30;
        for (let e = epStart; e <= Math.min(epEnd, 100); e++) list.push(`${slug}/season-${s}/episode-${e}.rar`);
        if (list.length > 500) break;
      }
      return list;
    },
    [opts?.contentTypeName, opts?.customTitle, opts?.year, startSeason, startEpisode, endSeason, endEpisode, slugify]
  );

  const buildExpectedMp4Filenames = useCallback(
    (tmdbTitle: string): string[] => {
      if (!tmdbTitle) return [];
      const type = opts?.contentTypeName === "tv-show" ? "tv" : "movie";
      if (type === "movie") return [`${slugify(tmdbTitle)}.mp4`];
      const cleanTitle = tmdbTitle.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim();
      const sSeason = Math.max(1, startSeason || 1);
      const sEpisode = Math.max(1, startEpisode || 1);
      const eSeason = Math.max(sSeason, endSeason || sSeason);
      const eEpisode = Math.max(1, endEpisode || 1);
      const slug = slugify(cleanTitle);
      const list: string[] = [];
      for (let s = sSeason; s <= eSeason; s++) {
        const epStart = s === sSeason ? sEpisode : 1;
        const epEnd = s === eSeason ? eEpisode : 30;
        for (let e = epStart; e <= Math.min(epEnd, 100); e++) list.push(`${slug}/season-${s}/episode-${e}.mp4`);
        if (list.length > 500) break;
      }
      return list;
    },
    [opts?.contentTypeName, opts?.customTitle, opts?.year, startSeason, startEpisode, endSeason, endEpisode, slugify]
  );

  const fetchSeasonCounts = useCallback(async (tmdbId: number): Promise<Map<number, number> | undefined> => {
    try {
      const res = await fetch(`/api/tmdb?id=${tmdbId}&type=tv`);
      if (!res.ok) return undefined;
      const data = await res.json();
      if (data.success === false || !Array.isArray(data.seasons)) return undefined;
      const map = new Map<number, number>();
      for (const s of data.seasons as { season_number: number; episode_count: number }[]) {
        if (typeof s.season_number === "number" && typeof s.episode_count === "number" && s.season_number > 0) {
          map.set(s.season_number, s.episode_count);
        }
      }
      return map.size ? map : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const getArchiveExistsCandidates = useCallback(
    (filename: string) => {
      const enc = encodeURIComponent(filename);
      return [`/api/archive/exists?filename=${enc}`];
    },
    []
  );

  const getArchiveMp4ExistsCandidates = useCallback(
    (filename: string) => {
      const enc = encodeURIComponent(filename);
      return [`/api/archive/mp4/exists?filename=${enc}`];
    },
    []
  );

  const checkSingleExists = useCallback(
    async (filename: string): Promise<{ exists: boolean; filename: string; path?: string; size?: number }> => {
      const url = getArchiveExistsCandidates(filename)[0];
      try {
        const token = getToken();
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const data = (await res.json()) as { exists: boolean; filename: string; path?: string; size?: number; detail?: string };
        if (res.ok && typeof data.exists === "boolean") return { exists: data.exists, filename: data.filename ?? filename, path: data.path, size: data.size };
        return { exists: false, filename };
      } catch {
        return { exists: false, filename };
      }
    },
    [getArchiveExistsCandidates]
  );

  const checkSingleMp4Exists = useCallback(
    async (filename: string): Promise<{ exists: boolean; filename: string; path?: string; size?: number }> => {
      const url = getArchiveMp4ExistsCandidates(filename)[0];
      try {
        const token = getToken();
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const data = (await res.json()) as { exists: boolean; filename: string; path?: string; size?: number; detail?: string };
        if (res.ok && typeof data.exists === "boolean") return { exists: data.exists, filename: data.filename ?? filename, path: data.path, size: data.size };
        return { exists: false, filename };
      } catch {
        return { exists: false, filename };
      }
    },
    [getArchiveMp4ExistsCandidates]
  );

  const verifyExistingRars = useCallback(
    async (tmdbTitle: string): Promise<boolean> => {
      if (!tmdbTitle) return false;
      const expected = buildExpectedRarFilenames(tmdbTitle);
      if (expected.length === 0) return false;
      setCheckingExists(true);
      try {
        const results: { filename: string; exists: boolean; path?: string; size?: number }[] = [];
        for (const f of expected) {
          const r = await checkSingleExists(f);
          results.push(r);
        }
        setRarExistsResults(results);
        const allExist = results.every((r) => r.exists);
        const someExist = results.some((r) => r.exists);
        if (allExist) {
          if (opts?.contentTypeName === "tv-show") {
            const seasonCounts = await fetchSeasonCounts(opts.tmdbId ?? 0).catch(() => undefined);
            const episodes = buildEpisodeList(
              Math.max(1, startSeason || 1),
              Math.max(1, startEpisode || 1),
              Math.max(startSeason || 1, endSeason || 1),
              Math.max(1, endEpisode || 1),
              seasonCounts
            );
            setDownloadItems(
              episodes.map((ep) => {
                const cleanTitle = tmdbTitle.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim();
                const slug = slugify(cleanTitle);
                const fname = `${slug}/season-${ep.season}/episode-${ep.episode}.rar`;
                const found = results.find((r) => r.filename === fname);
                return {
                  season: ep.season,
                  episode: ep.episode,
                  status: found?.exists ? "success" : "pending",
                  message: found?.exists ? `Ya existe (${found.size ? (found.size / 1024 / 1024).toFixed(1) + " MB" : "verificado"})` : undefined,
                  result: found?.exists ? { success: true, message: "Ya existe", filename: fname, filePath: found.path, fileSize: found.size } : undefined,
                } as DownloadItem;
              })
            );
            if (results[results.length - 1]?.filename) setDownloadResult({ success: true, message: "Rars ya existentes", filename: results[results.length - 1].filename, filePath: results[results.length - 1].path, fileSize: results[results.length - 1].size });
          } else {
            const found = results[0];
            setDownloadResult({ success: true, message: "Rar ya existe", filename: found.filename, filePath: found.path, fileSize: found.size });
          }
          updateStep("download", {
            status: "success",
            message: `Archivos ya existentes verificados: ${results.length} archivo(s) en servidor`,
            progress: 100,
            details: results.map((r) => `${r.filename} (${r.exists ? "existe" : "falta"})`).join(" · "),
          });
          const type = opts?.contentTypeName === "tv-show" ? "tv" : "movie";
          if (type === "movie" && results[0]?.filename) setDecompressFilename(results[0].filename);
        } else if (someExist) {
          updateStep("download", {
            status: "idle",
            message: `Algunos rars ya existen (${results.filter((r) => r.exists).length}/${results.length}). Puedes descargar los faltantes o continuar si ya están en carpeta destino.`,
            progress: 0,
          });
        }
        return allExist;
      } finally {
        setCheckingExists(false);
      }
    },
    [buildExpectedRarFilenames, checkSingleExists, fetchSeasonCounts, startSeason, startEpisode, endSeason, endEpisode, opts?.contentTypeName, opts?.tmdbId, slugify, updateStep]
  );

  const verifyExistingMp4s = useCallback(
    async (tmdbTitle: string): Promise<boolean> => {
      if (!tmdbTitle) return false;
      const expected = buildExpectedMp4Filenames(tmdbTitle);
      if (expected.length === 0) return false;
      setCheckingMp4Exists(true);
      try {
        const results: { filename: string; exists: boolean; path?: string; size?: number }[] = [];
        for (const f of expected) {
          const r = await checkSingleMp4Exists(f);
          results.push(r);
        }
        setMp4ExistsResults(results);
        const allExist = results.every((r) => r.exists);
        const someExist = results.some((r) => r.exists);
        if (allExist) {
          setDecompressItems(results.map((r) => ({ filename: r.filename, status: "success", message: r.size ? `${(r.size / 1024 / 1024).toFixed(1)} MB` : "Ya existe" })));
          updateStep("decompress", {
            status: "success",
            message: `MP4 ya existentes verificados: ${results.length} archivo(s)`,
            progress: 100,
            details: results.map((r) => r.filename).join(" · "),
          });
        } else if (someExist) {
          setMp4ExistsResults(results);
          updateStep("decompress", {
            status: "idle",
            message: `Algunos MP4 ya existen (${results.filter((r) => r.exists).length}/${results.length}). Descomprime para generar los faltantes.`,
            progress: 0,
          });
        } else {
          setMp4ExistsResults(results);
        }
        return allExist;
      } finally {
        setCheckingMp4Exists(false);
      }
    },
    [buildExpectedMp4Filenames, checkSingleMp4Exists, updateStep]
  );

  const checkTransformFileExists = useCallback(async (filename: string, kind: "mkv" | "dash"): Promise<boolean> => {
    const enc = encodeURIComponent(filename);
    const url = kind === "mkv" ? `/api/archive/mkv/exists?filename=${enc}` : `/api/archive/dash/exists?filename=${enc}`;
    try {
      const token = getToken();
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = (await res.json()) as { exists: boolean };
      return res.ok && data.exists === true;
    } catch {
      return false;
    }
  }, []);

  const verifyExistingTransforms = useCallback(
    async (tmdbTitle: string): Promise<boolean> => {
      if (!tmdbTitle) return false;
      const bases = (() => {
        const arr: string[] = [];
        const add = (f: string) => {
          const b = f.replace(/\.rar$/i, "").replace(/\.mkv$/i, "").replace(/\.mp4$/i, "");
          if (b && !arr.includes(b)) arr.push(b);
        };
        const rarFiles = buildExpectedRarFilenames(tmdbTitle);
        for (const r of rarFiles) add(r);
        if (arr.length === 0) {
          const mp4 = buildExpectedMp4Filenames(tmdbTitle);
          for (const m of mp4) add(m);
        }
        return arr;
      })();
      if (bases.length === 0) return false;
      setCheckingTransformExists(true);
      try {
        const results: { base: string; mp4Exists: boolean; av1Exists: boolean; lowExists: boolean; dashExists: boolean }[] = [];
        for (const base of bases) {
          const mp4 = await checkSingleMp4Exists(`${base}.mp4`);
          const av1 = await checkTransformFileExists(`${base}-av1.mkv`, "mkv");
          const low = await checkTransformFileExists(`${base}-low.mkv`, "mkv");
          const dash = await checkTransformFileExists(`${base}/manifest.mpd`, "dash");
          results.push({ base, mp4Exists: mp4.exists, av1Exists: av1, lowExists: low, dashExists: dash });
        }
        setTransformExistsResults(results);
        const totalSubs = results.length * 3;
        const doneSubs = results.reduce((acc, r) => acc + (r.av1Exists ? 1 : 0) + (r.lowExists ? 1 : 0) + (r.dashExists ? 1 : 0), 0);
        const allDone = results.every((r) => r.av1Exists && r.lowExists && r.dashExists);
        const mp4Missing = results.some((r) => !r.mp4Exists);
        const baseItems: TransformItem[] = results.map((r) => ({
          base: r.base,
          status: r.av1Exists && r.lowExists && r.dashExists ? "success" : "pending",
          audioTrack: 0,
          subtitleTrack: 0,
          subSteps: [
            { id: "1080p", status: r.av1Exists ? "success" : "pending", message: r.av1Exists ? "Ya existe -av1.mkv" : undefined },
            { id: "360p", status: r.lowExists ? "success" : "pending", message: r.lowExists ? "Ya existe -low.mkv" : undefined },
            { id: "dash", status: r.dashExists ? "success" : "pending", message: r.dashExists ? "Ya existe manifest.mpd" : undefined },
          ],
        }));
        setTransformItems(baseItems);
        if (mp4Missing) {
          updateStep("transform", { status: "idle", message: `Falta MP4 fuente para transformar (${results.filter((r) => !r.mp4Exists).length}/${results.length} sin MP4). Completa descompresión.`, progress: 0 });
          return false;
        }
        if (allDone) {
          updateStep("transform", { status: "success", message: `Transformados ya existentes: ${doneSubs}/${totalSubs} sub-pasos (${results.length} archivos)`, progress: 100, details: bases.join(", ") });
        } else if (doneSubs > 0) {
          updateStep("transform", { status: "idle", message: `${doneSubs}/${totalSubs} sub-pasos ya existen (${results.filter((r) => r.av1Exists && r.lowExists && r.dashExists).length}/${results.length} archivos completos) — al iniciar se omitirán`, progress: 0 });
        }
        return allDone;
      } finally {
        setCheckingTransformExists(false);
      }
    },
    [buildExpectedRarFilenames, buildExpectedMp4Filenames, checkTransformFileExists, checkSingleMp4Exists, updateStep]
  );

  const verifyExistingUploads = useCallback(
    async (tmdbTitle: string): Promise<boolean> => {
      if (!tmdbTitle) return false;
      const type = opts?.contentTypeName === "tv-show" ? "tv" : "movie";
      const cleanTitle = type === "tv" ? tmdbTitle.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim() : tmdbTitle;
      const slug = slugify(cleanTitle);
      const tmdbId = opts?.tmdbId;
      const qs = tmdbId ? `?slug=${encodeURIComponent(slug)}&type=${type}&tmdbId=${tmdbId}` : `?slug=${encodeURIComponent(slug)}&type=${type}`;
      const candidates = (() => {
        const base = API_HOST_IP ?? "";
        const list: string[] = [];
        list.push(`${base}/upload/verify-dash${qs}`);
        if (base.includes(":8084")) list.push(base.replace(":8084", ":8080") + `/upload/verify-dash${qs}`);
        if (base.endsWith("/new-api")) list.push(base.replace("/new-api", "") + `/upload/verify-dash${qs}`);
        const altOrigin = base ? base.split("/new-api")[0] : "";
        if (altOrigin && !list.includes(`${altOrigin}/new-api/upload/verify-dash${qs}`)) list.push(`${altOrigin}/new-api/upload/verify-dash${qs}`);
        if (altOrigin && !list.includes(`${altOrigin}/upload/verify-dash${qs}`)) list.push(`${altOrigin}/upload/verify-dash${qs}`);
        list.push(`/api/upload/verify-dash${qs}`);
        return [...new Set(list)];
      })();
      setCheckingUploadExists(true);
      try {
        let data: Record<string, unknown> | null = null;
        let lastResOk = false;
        for (const url of candidates) {
          try {
            const token = getToken();
            const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const text = await res.text();
            let parsed: Record<string, unknown>;
            try {
              parsed = JSON.parse(text) as Record<string, unknown>;
            } catch {
              if (text.includes("No static resource")) continue;
              continue;
            }
            if (typeof (parsed as { detail?: string }).detail === "string" && (parsed as { detail?: string }).detail!.includes("No static resource")) continue;
            if (!res.ok) {
              if (res.status === 404) continue;
              data = parsed;
              lastResOk = false;
              break;
            }
            data = parsed;
            lastResOk = true;
            break;
          } catch {
            continue;
          }
        }
        if (!data || !lastResOk) return false;
        const verified = (data.verified as boolean | undefined) ?? (data.allExist as boolean | undefined) ?? (data.manifestExists as boolean | undefined) ?? false;
        setUploadVerifyResult({
          verified: !!verified,
          allExist: data.allExist as boolean | undefined,
          totalEpisodes: data.totalEpisodes as number | undefined,
          missingCount: data.missingCount as number | undefined,
          manifestPath: data.manifestPath as string | undefined,
          episodes: data.episodes as { season: number; episode: number; path: string; exists: boolean }[] | undefined,
        });
        if (verified) {
          const bases = (() => {
            const arr: string[] = [];
            const add = (f: string) => {
              const b = f.replace(/\.rar$/i, "").replace(/\.mkv$/i, "").replace(/\.mp4$/i, "");
              if (b && !arr.includes(b)) arr.push(b);
            };
            const rarFiles = buildExpectedRarFilenames(tmdbTitle);
            for (const r of rarFiles) add(r);
            if (arr.length === 0) {
              const mp4 = buildExpectedMp4Filenames(tmdbTitle);
              for (const m of mp4) add(m);
            }
            return arr;
          })();
          setUploadItems(
            bases.map((b) => ({
              base: b,
              status: "success",
              subSteps: [{ id: b, filename: b, status: "success", message: "Ya subido (verificado)" }],
            }))
          );
          updateStep("upload", { status: "success", message: `Subida ya verificada en servidor remoto`, progress: 100, details: (data.manifestPath as string | undefined) ? `manifest: ${data.manifestPath}` : bases.join(", ") });
          return true;
        }
        if ((data.missingCount as number | undefined) != null && (data.missingCount as number) > 0) {
          updateStep("upload", { status: "idle", message: `Faltan ${data.missingCount as number}/${(data.totalEpisodes as number | undefined) ?? "?"} manifests en remoto`, progress: 0 });
        }
        return !!verified;
      } finally {
        setCheckingUploadExists(false);
      }
    },
    [opts?.contentTypeName, opts?.tmdbId, slugify, buildExpectedRarFilenames, buildExpectedMp4Filenames, updateStep]
  );

  const pollScrapeJob = useCallback(
    async (jobId: string, onPoll?: (status: string, attempt: number) => void): Promise<DownloadResult> => {
      const token = getToken();
      const candidates = (() => {
        const base = API_HOST_IP ?? "";
        const list: string[] = [];
        list.push(`${base}/scrape/job/${jobId}`);
        if (base.includes(":8084")) list.push(base.replace(":8084", ":8080") + `/scrape/job/${jobId}`);
        list.push(`/api/scrape/job/${jobId}`);
        return [...new Set(list)];
      })();
      let lastData: DownloadResult & { status?: string; error?: string } = { success: false, message: "Polling torrent..." };
      let attempts = 0;
      while (attempts < 180) {
        onPoll?.(lastData.status ?? "RUNNING", attempts + 1);
        await new Promise((r) => setTimeout(r, 60000));
        attempts++;
        for (const url of candidates) {
          try {
            const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const text = await res.text();
            let data: DownloadResult & { status?: string; jobId?: string; error?: string };
            try {
              data = JSON.parse(text) as typeof data;
            } catch {
              data = { success: false, message: text } as typeof data;
            }
            const status = (data.status as string) ?? (res.ok ? "COMPLETED" : "FAILED");
            if (status === "COMPLETED" || (res.ok && (data.success === true || data.filename))) {
              return {
                success: true,
                message: (data.message as string) || "Descarga completada (torrent)",
                filename: (data.filename as string) ?? (data as { filename?: string }).filename,
                filePath: (data.filePath as string) ?? (data as { filePath?: string }).filePath,
                fileSize: (data.fileSize as number) ?? (data as { fileSize?: number }).fileSize,
              };
            }
            if (status === "FAILED" || status === "ERROR") {
              return { success: false, message: (data.error as string) || (data.message as string) || "Fallo torrent", filename: data.filename, filePath: data.filePath, fileSize: data.fileSize };
            }
            lastData = data as typeof lastData;
            break;
          } catch {
            continue;
          }
        }
        if (lastData.status === "FAILED") break;
      }
      return { success: false, message: lastData.message || "Timeout torrent", filename: lastData.filename, filePath: lastData.filePath, fileSize: lastData.fileSize };
    },
    []
  );

  const runSingleDownload = useCallback(
    async (tmdbId: number, qs: string, onPoll?: (status: string, attempt: number) => void): Promise<DownloadResult> => {
      const token = getToken();
      const asyncQs = qs.includes("?") ? qs.replace("?", "?async=true&") : `?async=true${qs}`;
      const useSlug = !!(opts?.customTitle && opts.customTitle.trim().length > 0);
      let url: string;
      if (useSlug) {
        const slug = slugify(opts?.customTitle?.trim() ?? "");
        url = `${API_HOST_IP}/scrape/slug/${encodeURIComponent(slug)}/download${asyncQs}`;
      } else {
        url = `${API_HOST_IP}/scrape/${tmdbId}/download${asyncQs}`;
      }
      const res = await fetch(url, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const text = await res.text();
      let data: DownloadResult & { jobId?: string; status?: string; type?: string };
      try {
        data = text ? (JSON.parse(text) as typeof data) : ({ success: false, message: text } as typeof data);
      } catch {
        data = { success: false, message: text } as typeof data;
      }
      if (res.status === 202 && data.jobId) {
        const status = data.status ?? "RUNNING";
        if (status === "RUNNING" || status === "PENDING" || status === "QUEUED") {
          return await pollScrapeJob(data.jobId, onPoll);
        }
      }
      if (data.jobId && (data.status === "RUNNING" || data.status === "PENDING" || data.status === "QUEUED")) {
        return await pollScrapeJob(data.jobId, onPoll);
      }
      if (!res.ok) return { success: false, message: data.message || `Error ${res.status}`, filename: data.filename, filePath: data.filePath, fileSize: data.fileSize };
      if (data.success === false) return { success: false, message: data.message || "Error", filename: data.filename, filePath: data.filePath, fileSize: data.fileSize };
      return data;
    },
    [pollScrapeJob, opts?.customTitle, opts?.contentTypeName, opts?.year, slugify]
  );

  const runDecompress = useCallback(async (): Promise<boolean> => {
    setActiveStep("decompress");
    updateStep("decompress", { status: "running", message: "Descomprimiendo archivos...", progress: 15 });

    const isSeriesDecompress = opts?.contentTypeName === "tv-show";
    let filenames: string[] = [];

    if (isSeriesDecompress) {
      for (const it of downloadItems) if (it.result?.filename) {
        if (!filenames.includes(it.result.filename)) filenames.push(it.result.filename);
      }
      if (filenames.length === 0) {
        for (const r of rarExistsResults) if (r.exists) filenames.push(r.filename);
      }
      if (filenames.length === 0 && downloadResult?.filename) filenames.push(downloadResult.filename);
    } else {
      if (downloadResult?.filename) filenames.push(downloadResult.filename);
      for (const it of downloadItems) {
        if (it.result?.filename && !filenames.includes(it.result.filename)) filenames.push(it.result.filename);
      }
    }

    if (filenames.length === 0) {
      updateStep("decompress", { status: "error", message: "No hay archivos descargados para descomprimir. Completa primero la descarga.", progress: 100 });
      setActiveStep(null);
      return false;
    }

    setDecompressItems(filenames.map((f) => ({ filename: f, status: "pending" })));
    setDecompressCurrent(-1);

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];
      setDecompressCurrent(i);
      setDecompressItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "running" } : it)));
      updateStep("decompress", { status: "running", message: `Descomprimiendo ${filename} (${i + 1}/${filenames.length})...`, progress: Math.round((i / filenames.length) * 90) + 5 });

      const proxyUrl = "/api/archive/unrar";
      try {
        const token = getToken();
        const res = await fetch(proxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ filename }),
        });
        const text = await res.text();
        let data: { success?: boolean; message?: string; detail?: string } & Record<string, unknown>;
        try {
          data = text ? (JSON.parse(text) as typeof data) : { success: res.ok, message: text };
        } catch {
          data = { success: res.ok, message: text };
        }
        const ok = res.ok && data.success !== false;
        if (!ok) {
          const msg = (data.message as string) || (data.detail as string) || `Error ${res.status}`;
          setDecompressItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "error", message: msg } : it)));
          updateStep("decompress", { status: "error", message: `Error en ${filename}: ${msg}`, progress: 100 });
          setActiveStep(null);
          return false;
        }
        setDecompressItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "success", message: (data.message as string) || "Extraído" } : it)));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de red";
        setDecompressItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "error", message: msg } : it)));
        updateStep("decompress", { status: "error", message: `Error en ${filename}: ${msg}`, progress: 100 });
        setActiveStep(null);
        return false;
      }
    }

    setDecompressCurrent(-1);
    updateStep("decompress", { status: "success", message: `Descompresión completada: ${filenames.length} archivo(s)`, progress: 100, details: filenames.join(", ") });
    setActiveStep(null);
    return true;
  }, [downloadResult?.filename, downloadItems, rarExistsResults, opts?.contentTypeName, updateStep]);

  const getTransformBases = useCallback((): string[] => {
    const bases: string[] = [];
    const add = (filename: string) => {
      const base = filename.replace(/\.rar$/i, "").replace(/\.mkv$/i, "").replace(/\.mp4$/i, "");
      if (base && !bases.includes(base)) bases.push(base);
    };
    if (downloadResult?.filename) add(downloadResult.filename);
    for (const it of downloadItems) if (it.result?.filename) add(it.result.filename);
    for (const r of rarExistsResults) if (r.exists) add(r.filename);
    for (const r of mp4ExistsResults) if (r.exists) add(r.filename);
    return bases;
  }, [downloadResult?.filename, downloadItems, rarExistsResults, mp4ExistsResults]);

  const callFfmpegAsync = useCallback(async (endpoint: "1080p" | "360p" | "dash", base: string, audioTrack?: number, subtitleTrack?: number, onPoll?: (status: string) => void) => {
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    const body: Record<string, unknown> = { filename: base };
    if (endpoint === "1080p") {
      body.audioTrack = audioTrack ?? 0;
      body.subtitleTrack = subtitleTrack ?? 0;
    }
    const res = await fetch(`/api/ffmpeg/${endpoint}?async=true`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let init: { jobId?: string; status?: string; message?: string; detail?: string } & Record<string, unknown>;
    try {
      init = JSON.parse(text) as typeof init;
    } catch {
      return { ok: false, data: { message: text, detail: text } as never, status: res.status };
    }
    if (!res.ok || !init.jobId) {
      const ok = res.ok && (init as { success?: boolean }).success !== false;
      return { ok, data: init as never, status: res.status };
    }
    const jobId = init.jobId;
    let pollStatus = init.status ?? "RUNNING";
    let lastData: typeof init & { outputFiles?: string[]; commandOutputs?: string[]; error?: string } = init;
    while (pollStatus === "RUNNING" || pollStatus === "PENDING" || pollStatus === "QUEUED") {
      onPoll?.(pollStatus);
      await new Promise((r) => setTimeout(r, 60000));
      try {
        const pollRes = await fetch(`/api/ffmpeg/job/${jobId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const pollText = await pollRes.text();
        let pollData: typeof lastData;
        try {
          pollData = JSON.parse(pollText) as typeof lastData;
        } catch {
          pollData = { status: pollRes.ok ? "RUNNING" : "FAILED", message: pollText } as typeof lastData;
        }
        lastData = pollData;
        pollStatus = (pollData.status as string) ?? "RUNNING";
        if (pollStatus === "COMPLETED" || pollStatus === "SUCCESS") {
          return { ok: true, data: { success: true, message: (pollData as { message?: string }).message ?? "Completado", outputFiles: (pollData as { outputFiles?: string[] }).outputFiles, commandOutputs: (pollData as { commandOutputs?: string[] }).commandOutputs, ...pollData } as never, status: 200 };
        }
        if (pollStatus === "FAILED" || pollStatus === "ERROR") {
          return { ok: false, data: { success: false, message: (pollData as { error?: string; message?: string }).error ?? (pollData as { message?: string }).message ?? "Fallo", ...pollData } as never, status: pollRes.status };
        }
      } catch {
        continue;
      }
    }
    return { ok: false, data: lastData as never, status: 500 };
  }, []);

  const runTransform = useCallback(async (): Promise<boolean> => {
    const bases = getTransformBases();
    if (bases.length === 0) {
      updateStep("transform", { status: "error", message: "No hay archivos descomprimidos para transformar. Completa descarga y descompresión.", progress: 100 });
      return false;
    }
    for (const base of bases) {
      const mp4Check = await checkSingleMp4Exists(`${base}.mp4`);
      if (!mp4Check.exists) {
        updateStep("transform", { status: "error", message: `Falta MP4 fuente ${base}.mp4 — verifica descompresión (se buscó MP4, no RAR)`, progress: 100 });
        return false;
      }
    }
    setActiveStep("transform");
    const prevMap = new Map(transformItems.map((it) => [it.base, it]));
    const initialItems: TransformItem[] = bases.map((b) => {
      const existing = prevMap.get(b);
      return {
        base: b,
        status: "pending" as const,
        audioTrack: existing?.audioTrack ?? 0,
        subtitleTrack: existing?.subtitleTrack ?? 0,
        subSteps: [
          { id: "1080p" as const, status: "pending" as const },
          { id: "360p" as const, status: "pending" as const },
          { id: "dash" as const, status: "pending" as const },
        ],
      };
    });
    setTransformItems(initialItems);
    setTransformCurrent(-1);
    setTransformSubStep(null);
    updateStep("transform", { status: "running", message: `Transformando ${bases.length} archivo(s) (1080p → 360p → DASH)...`, progress: 5 });

    for (let i = 0; i < bases.length; i++) {
      const base = bases[i];
      setTransformCurrent(i);
      setTransformItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "running" } : it)));
      const subOrder: ("1080p" | "360p" | "dash")[] = ["1080p", "360p", "dash"];
      for (const sub of subOrder) {
        const existsMap = new Map(transformExistsResults.map((r) => [r.base, r]));
        const existing = existsMap.get(base);
        const alreadyExists = existing ? (sub === "1080p" ? existing.av1Exists : sub === "360p" ? existing.lowExists : existing.dashExists) : false;
        if (alreadyExists) {
          setTransformItems((prev) =>
            prev.map((it, idx) =>
              idx === i
                ? { ...it, subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, status: "success" as const, message: "Ya existe — se omite" } : s)) }
                : it
            )
          );
          continue;
        }
        const liveCheck = sub === "1080p" ? await checkTransformFileExists(`${base}-av1.mkv`, "mkv") : sub === "360p" ? await checkTransformFileExists(`${base}-low.mkv`, "mkv") : await checkTransformFileExists(`${base}/manifest.mpd`, "dash");
        if (liveCheck) {
          setTransformItems((prev) =>
            prev.map((it, idx) =>
              idx === i ? { ...it, subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, status: "success" as const, message: "Ya existe — se omite" } : s)) } : it
            )
          );
          continue;
        }
        setTransformSubStep(sub);
        setTransformItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? { ...it, subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, status: "running" } : s)) }
              : it
          )
        );
        updateStep("transform", {
          status: "running",
          message: `Transformando ${base} — ${sub} (${i + 1}/${bases.length})`,
          progress: Math.round(((i * 3 + subOrder.indexOf(sub)) / (bases.length * 3)) * 90) + 5,
        });
        const itemAudio = initialItems[i]?.audioTrack ?? 0;
        const itemSubs = initialItems[i]?.subtitleTrack ?? 0;
        const { ok, data } = await callFfmpegAsync(sub, base, itemAudio, itemSubs, (pollStatus) => {
          setTransformItems((prev) =>
            prev.map((it, idx) =>
              idx === i
                ? {
                    ...it,
                    subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, message: `Estado: ${pollStatus} — consultando cada 60s` } : s)),
                  }
                : it
            )
          );
        });
        if (!ok) {
          const msg = ((data as Record<string, unknown>).message as string) || ((data as Record<string, unknown>).detail as string) || `Error ${sub}`;
          const outFiles = (data as Record<string, unknown>).outputFiles as string[] | undefined;
          const cmdOut = (data as Record<string, unknown>).commandOutputs as string[] | undefined;
          setTransformItems((prev) =>
            prev.map((it, idx) =>
              idx === i
                ? {
                    ...it,
                    status: "error",
                    subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, status: "error", message: msg, outputFiles: outFiles, commandOutputs: cmdOut } : s)),
                  }
                : it
            )
          );
          updateStep("transform", { status: "error", message: `Error en ${base} [${sub}]: ${msg}`, progress: 100 });
          setActiveStep(null);
          setTransformSubStep(null);
          return false;
        }
        {
          const outFiles = (data as Record<string, unknown>).outputFiles as string[] | undefined;
          const cmdOut = (data as Record<string, unknown>).commandOutputs as string[] | undefined;
          const msgOk = ((data as Record<string, unknown>).message as string) || "Completado";
          setTransformItems((prev) =>
            prev.map((it, idx) =>
              idx === i
                ? {
                    ...it,
                    subSteps: it.subSteps.map((s) => (s.id === sub ? { ...s, status: "success", message: msgOk, outputFiles: outFiles, commandOutputs: cmdOut } : s)),
                  }
                : it
            )
          );
        }
      }
      setTransformItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "success" } : it)));
    }

    setTransformCurrent(-1);
    setTransformSubStep(null);
    updateStep("transform", { status: "success", message: `Transformación completada: ${bases.length} archivo(s)`, progress: 100, details: bases.join(", ") });
    setActiveStep(null);
    return true;
  }, [getTransformBases, callFfmpegAsync, checkSingleMp4Exists, transformItems, updateStep]);

  const getUploadBases = useCallback((): string[] => getTransformBases(), [getTransformBases]);

  const callUpload = useCallback(async (filename: string) => {
    const token = getToken();
    const res = await fetch("/api/upload/to-server", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ filename }),
    });
    const text = await res.text();
    let data: { success?: boolean; message?: string; filename?: string; remotePath?: string; commandOutput?: string; detail?: string } & Record<string, unknown>;
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      data = { success: res.ok, message: text } as typeof data;
    }
    const ok = res.ok && data.success !== false;
    return { ok, data, status: res.status };
  }, []);

  const callMkdir = useCallback(async (filename: string) => {
    const token = getToken();
    const res = await fetch("/api/upload/mkdir", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ filename }),
    });
    const text = await res.text();
    let data: { success?: boolean; message?: string; path?: string; detail?: string } & Record<string, unknown>;
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      data = { success: res.ok, message: text } as typeof data;
    }
    const ok = res.ok && data.success !== false;
    return { ok, data, status: res.status };
  }, []);

  const runUpload = useCallback(async (): Promise<boolean> => {
    const bases = getUploadBases();
    if (bases.length === 0) {
      updateStep("upload", { status: "error", message: "No hay carpetas DASH para subir. Completa transformación.", progress: 100 });
      return false;
    }
    setActiveStep("upload");
    setUploadMkdirItems([]);
    const items: UploadItem[] = bases.map((b) => ({
      base: b,
      status: "pending",
      subSteps: [{ id: b, filename: b, status: "pending" }],
    }));
    setUploadItems(items);
    setUploadCurrent(-1);
    setUploadSubStep(null);
    updateStep("upload", { status: "running", message: `Subiendo ${bases.length} carpeta(s) DASH una por una...`, progress: 5 });

    for (let i = 0; i < items.length; i++) {
      const base = bases[i];
      setUploadCurrent(i);
      setUploadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "running" } : it)));
      setUploadSubStep(base);
      setUploadItems((prev) =>
        prev.map((it, idx) =>
          idx === i ? { ...it, subSteps: it.subSteps.map((s) => ({ ...s, status: "running" })) } : it
        )
      );
      updateStep("upload", { status: "running", message: `Subiendo carpeta DASH ${base} (${i + 1}/${bases.length})...`, progress: Math.round((i / bases.length) * 90) + 5 });
      const { ok, data } = await callUpload(base);
      if (!ok) {
        const msg = (data.message as string) || (data.detail as string) || `Error ${base}`;
        setUploadItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: "error", subSteps: it.subSteps.map((s) => ({ ...s, status: "error", message: msg })) } : it
          )
        );
        updateStep("upload", { status: "error", message: `Error subiendo ${base}: ${msg}`, progress: 100 });
        setActiveStep(null);
        setUploadSubStep(null);
        return false;
      }
      setUploadItems((prev) =>
        prev.map((it, idx) =>
          idx === i
            ? { ...it, status: "success", subSteps: it.subSteps.map((s) => ({ ...s, status: "success", message: (data.message as string) || "Subido", remotePath: data.remotePath as string | undefined })) }
            : it
        )
      );
    }
    setUploadCurrent(-1);
    setUploadSubStep(null);
    updateStep("upload", { status: "success", message: `Subida completada: ${bases.length} carpeta(s) DASH`, progress: 100, details: bases.join(", ") });
    setActiveStep(null);
    return true;
  }, [getUploadBases, callUpload, updateStep]);

  const runRegister = useCallback(async (): Promise<boolean> => {
    const tmdbId = opts?.tmdbId;
    const typeRaw = opts?.contentTypeName;
    if (!tmdbId) {
      updateStep("register", { status: "error", message: "No hay TMDB ID para registrar." });
      return false;
    }
    const isSeries = typeRaw === "tv-show";
    const type = isSeries ? "tv" : "movie";
    setActiveStep("register");
    updateStep("register", { status: "running", message: isSeries ? "Registrando serie y episodios..." : "Registrando película...", progress: 10 });

    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

      const tryPipeline = async (): Promise<boolean | null> => {
        try {
          const body: Record<string, unknown> = {
            tmdbId,
            contentTypeName: typeRaw,
            type,
            startSeason,
            startEpisode,
            endSeason,
            endEpisode,
          };
          const res = await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/pipeline/register`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          });
          const text = await res.text();
          let data: { success?: boolean; message?: string; detail?: string };
          try {
            data = JSON.parse(text) as typeof data;
          } catch {
            data = { message: text } as typeof data;
          }
          if (res.ok && data.success !== false) return true;
          if (typeof data.detail === "string" && data.detail.includes("No static resource")) return null;
          if (res.status === 404) return null;
          updateStep("register", { status: "error", message: data.message || data.detail || `Error ${res.status}`, progress: 100 });
          return false;
        } catch {
          return null;
        }
      };

      const pipelineResult = await tryPipeline();
      if (pipelineResult === true) {
        updateStep("register", { status: "success", message: "Contenido registrado vía pipeline", progress: 100 });
        setActiveStep(null);
        return true;
      }
      if (pipelineResult === false) {
        setActiveStep(null);
        return false;
      }

      const tmdbRes = await fetch(`/api/tmdb?id=${tmdbId}&type=${type}`);
      if (!tmdbRes.ok) {
        updateStep("register", { status: "error", message: `No se pudo obtener TMDB ${tmdbId}`, progress: 100 });
        setActiveStep(null);
        return false;
      }
      const tmdb = await tmdbRes.json();
      if (tmdb.success === false) {
        updateStep("register", { status: "error", message: tmdb.status_message || "TMDB no encontrado", progress: 100 });
        setActiveStep(null);
        return false;
      }

      const year = Number((tmdb.release_date || tmdb.first_air_date || "").slice(0, 4)) || new Date().getFullYear();
      const [containersRes, genresRes] = await Promise.all([
        fetch(`${API_HOST_IP}/containers`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
        fetch(`${API_HOST_IP}/genres`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
      ]);
      const containers = containersRes.ok ? ((await containersRes.json()) as { id: number }[]) : [];
      const genres = genresRes.ok ? ((await genresRes.json()) as { id: number; name: string }[]) : [];
      const containerId = containers[0]?.id ?? 1;
      const tmdbGenres: { id: number; name: string }[] = tmdb.genres ?? [];
      const genreIds = tmdbGenres
        .map((g) => genres.find((eg) => eg.name.toLowerCase() === g.name.toLowerCase())?.id)
        .filter((id): id is number => typeof id === "number");
      const finalGenres = genreIds.length ? genreIds : genres.slice(0, 1).map((g) => g.id);

      const contentBody = {
        tmdbId,
        title: tmdb.title || tmdb.name || "",
        year,
        tagline: tmdb.tagline || null,
        description: tmdb.overview || "",
        rating: tmdb.vote_average || 0,
        age: 0,
        cover: tmdb.poster_path || "",
        background: tmdb.backdrop_path || "",
        trailer: "",
        trailerDuration: 0,
        comingSoon: true,
        note: null,
        typeId: isSeries ? 2 : 1,
        genresList: finalGenres,
        containerId,
        containerPosition: 0,
        endTime: null,
      };

      let existingId: string | null = null;
      try {
        const searchUrls = [
          `${API_HOST_IP}/contents/search?title=${encodeURIComponent(contentBody.title)}&page=0&size=5`,
          `${API_HOST_IP}/contents/like/${encodeURIComponent(contentBody.title)}`,
        ];
        for (const url of searchUrls) {
          try {
            const r = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            if (!r.ok) continue;
            const d = await r.json();
            const list: { id: string; tmdbId?: number; title: string }[] = Array.isArray(d) ? d : (d.content ?? []);
            const found = list.find((c) => (c.tmdbId && c.tmdbId === tmdbId) || c.title.toLowerCase() === contentBody.title.toLowerCase());
            if (found) {
              existingId = found.id;
              break;
            }
          } catch {
            continue;
          }
        }
      } catch {}

      let finalContentId = existingId ?? "";
      let skipCreate = false;
      if (existingId) {
        if (!isSeries) {
          updateStep("register", { status: "success", message: `Contenido ya existe (ID ${existingId}) — no se registra de nuevo`, progress: 100, details: `TMDB ${tmdbId}` });
          try {
            await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/status`, {
              method: "PATCH",
              headers,
              body: JSON.stringify({ statusId: 2, rejectionReason: null }),
            });
          } catch {}
          setActiveStep(null);
          return true;
        } else {
          finalContentId = existingId;
          skipCreate = true;
          updateStep("register", { status: "running", message: `Contenido ya existe (ID ${existingId}), registrando episodios nuevos...`, progress: 30 });
        }
      } else {
        skipCreate = false;
        finalContentId = "";
      }

      if (!skipCreate) {
        updateStep("register", { status: "running", message: `Creando contenido "${contentBody.title}"...`, progress: 30 });
        const createRes = await fetch(`${API_HOST_IP}/contents`, { method: "POST", headers, body: JSON.stringify(contentBody) });
        const createText = await createRes.text();
        let created: { id?: string; contentId?: string } & Record<string, unknown>;
        try {
          created = JSON.parse(createText) as typeof created;
        } catch {
          created = {} as typeof created;
        }
        if (!createRes.ok) {
          const msg = (created as { message?: string }).message || createText || `Error ${createRes.status}`;
          if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("existe") || createRes.status === 409) {
            updateStep("register", { status: "running", message: "Contenido ya existe, continuando con episodios...", progress: 60 });
            finalContentId = String(tmdbId);
            try {
              const searchRes = await fetch(`${API_HOST_IP}/contents/search?title=${encodeURIComponent(contentBody.title)}&page=0&size=5`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
              if (searchRes.ok) {
                const page = await searchRes.json();
                const found = (page.content ?? page)?.find?.((c: { title: string; id: string }) => c.title === contentBody.title);
                if (found?.id) finalContentId = found.id;
              }
            } catch {}
          } else {
            updateStep("register", { status: "error", message: `Error creando contenido: ${msg}`, progress: 100 });
            setActiveStep(null);
            return false;
          }
        } else {
          const contentId = (created.id as string) || (created.contentId as string) || String(tmdbId);
          finalContentId = contentId;
          if (!created.id) {
            try {
              const searchRes = await fetch(`${API_HOST_IP}/contents/search?title=${encodeURIComponent(contentBody.title)}&page=0&size=5`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
              if (searchRes.ok) {
                const page = await searchRes.json();
                const found = (page.content ?? page)?.find?.((c: { title: string; id: string }) => c.title === contentBody.title);
                if (found?.id) finalContentId = found.id;
              }
            } catch {}
          }
        }
      }

      setRegisteredContentId(finalContentId);
      if (!isSeries) {
        try {
          await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/status`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ statusId: 2, rejectionReason: null }),
          });
        } catch {}
        updateStep("register", { status: "success", message: `Película "${contentBody.title}" registrada como Próximamente (ID ${finalContentId})`, progress: 100, details: `TMDB ${tmdbId} · comingSoon=true` });
        setActiveStep(null);
        return true;
      }

      updateStep("register", { status: "success", message: `Serie "${contentBody.title}" registrada como Próximamente (ID ${finalContentId})`, progress: 100, details: `TMDB ${tmdbId} · comingSoon=true · sin episodios aún` });
      setActiveStep(null);
      return true;
    } catch (err) {
      updateStep("register", { status: "error", message: err instanceof Error ? err.message : "Error desconocido", progress: 100 });
      setActiveStep(null);
      return false;
    }
  }, [opts?.tmdbId, opts?.contentTypeName, reportId, startSeason, startEpisode, endSeason, endEpisode, fetchSeasonCounts, updateStep]);

  const runUpdate = useCallback(async (): Promise<boolean> => {
    const isSeries = opts?.contentTypeName === "tv-show";
    const tmdbId = opts?.tmdbId;
    let contentId = registeredContentId;
    if (!contentId && tmdbId) {
      try {
        const token = getToken();
        const headers: Record<string, string> = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        const r = await fetch(`${API_HOST_IP}/contents/tmdb/${tmdbId}`, { headers });
        if (r.ok) {
          const d = await r.json();
          const found = Array.isArray(d) ? d[0] : d;
          if (found?.id) {
            contentId = found.id;
            setRegisteredContentId(contentId);
          }
        }
      } catch {}
    }
    if (!contentId) {
      try {
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        const searchUrls = [
          `${API_HOST_IP}/contents/search?title=${encodeURIComponent(opts?.tmdbTitle ?? "")}&page=0&size=5`,
          `${API_HOST_IP}/contents/like/${encodeURIComponent(opts?.tmdbTitle ?? "")}`,
        ];
        for (const url of searchUrls) {
          try {
            const r = await fetch(url, { headers });
            if (!r.ok) continue;
            const d = await r.json();
            const list: { id: string; title: string }[] = Array.isArray(d) ? d : (d.content ?? []);
            const found = list.find((c) => c.title.toLowerCase() === (opts?.tmdbTitle ?? "").toLowerCase());
            if (found) {
              contentId = found.id;
              setRegisteredContentId(contentId);
              break;
            }
          } catch {
            continue;
          }
        }
      } catch {}
      if (!contentId) {
        updateStep("update", { status: "error", message: "No hay contenido registrado para actualizar. Completa Registrar primero.", progress: 100 });
        return false;
      }
    }
    setActiveStep("update");
    updateStep("update", { status: "running", message: isSeries ? "Actualizando serie y registrando episodios..." : "Actualizando película (quitando Próximamente)...", progress: 10 });
    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const contentRes = await fetch(`${API_HOST_IP}/contents/${contentId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!contentRes.ok) {
        updateStep("update", { status: "error", message: `No se pudo obtener contenido ${contentId}`, progress: 100 });
        setActiveStep(null);
        return false;
      }
      const content = await contentRes.json();
      const updateBody = {
        tmdbId: content.tmdbId ?? opts?.tmdbId,
        title: content.title,
        year: content.year,
        tagline: content.tagline,
        description: content.description,
        rating: content.rating,
        age: content.age,
        cover: content.cover,
        background: content.background,
        trailer: content.trailer,
        trailerDuration: content.trailerDuration,
        comingSoon: false,
        note: content.note,
        typeId: content.type === "tv-show" || content.type === "tv" ? 2 : isSeries ? 2 : 1,
        genresList: Array.isArray(content.genresList) ? content.genresList.map((g: { id: number }) => g.id) : [],
        containerId: content.container?.id ?? content.containerId ?? 1,
        containerPosition: content.position ?? content.containerPosition ?? 0,
        endTime: content.endTime ?? null,
      };
      const updateRes = await fetch(`${API_HOST_IP}/contents/${contentId}`, { method: "PUT", headers, body: JSON.stringify(updateBody) });
      if (!updateRes.ok) {
        const t = await updateRes.text();
        let d: { message?: string; detail?: string };
        try {
          d = JSON.parse(t) as typeof d;
        } catch {
          d = { message: t };
        }
        updateStep("update", { status: "error", message: d.message || d.detail || `Error ${updateRes.status}`, progress: 100 });
        setActiveStep(null);
        return false;
      }
      if (!isSeries) {
        updateStep("update", { status: "success", message: `Película actualizada (ID ${contentId}) — ya no es Próximamente`, progress: 100 });
        try {
          await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/status`, { method: "PATCH", headers, body: JSON.stringify({ statusId: 2, rejectionReason: null }) });
        } catch {}
        setActiveStep(null);
        return true;
      }

      const sSeason = Math.max(1, startSeason || 1);
      const sEpisode = Math.max(1, startEpisode || 1);
      const eSeason = Math.max(sSeason, endSeason || sSeason);
      const eEpisode = Math.max(1, endEpisode || 1);
      let seasonCounts: Map<number, number> | undefined;
      try {
        seasonCounts = await fetchSeasonCounts(opts?.tmdbId ?? 0);
      } catch {
        seasonCounts = undefined;
      }
      const episodes = buildEpisodeList(sSeason, sEpisode, eSeason, eEpisode, seasonCounts);
      if (episodes.length === 0) {
        updateStep("update", { status: "error", message: "Rango de episodios vacío", progress: 100 });
        setActiveStep(null);
        return false;
      }
      setUpdateItems(episodes.map((ep) => ({ season: ep.season, episode: ep.episode, status: "pending" })));
      setUpdateCurrent(-1);
      updateStep("update", { status: "running", message: `Registrando ${episodes.length} episodios S${sSeason}E${sEpisode}→S${eSeason}E${eEpisode}...`, progress: 60 });
      try {
        const seasonsBody = {
          id: contentId,
          tmdbId: opts?.tmdbId,
          firstSeason: sSeason,
          firstEpisode: sEpisode,
          lastSeason: eSeason,
          lastEpisode: eEpisode,
        };
        setUpdateItems((prev) => prev.map((it) => ({ ...it, status: "running" })));
        const seasonsRes = await fetch("/api/seasons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(seasonsBody),
        });
        const seasonsText = await seasonsRes.text();
        let seasonsData: { message?: string; detail?: string } & Record<string, unknown>;
        try {
          seasonsData = JSON.parse(seasonsText) as typeof seasonsData;
        } catch {
          seasonsData = { message: seasonsText } as typeof seasonsData;
        }
        if (!seasonsRes.ok) {
          const msg = (seasonsData.message as string) || (seasonsData.detail as string) || `Error ${seasonsRes.status}`;
          const isAlreadyExists = msg.toLowerCase().includes("already") || msg.toLowerCase().includes("existe") || msg.toLowerCase().includes("duplicate");
          if (isAlreadyExists) {
            setRegisterItems((prev) => prev.map((it) => ({ ...it, status: "success", message: "Ya existía — se ignora" })));
          } else {
            updateStep("register", { status: "error", message: `Error registrando temporadas: ${msg}`, progress: 100 });
            setRegisterItems((prev) => prev.map((it) => ({ ...it, status: "error", message: msg })));
            setActiveStep(null);
            return false;
          }
        } else {
          setRegisterItems((prev) => prev.map((it) => ({ ...it, status: "success", message: "Registrado (TMDB)" })));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de red";
        updateStep("register", { status: "error", message: `Error registrando temporadas: ${msg}`, progress: 100 });
        setActiveStep(null);
        return false;
      }

      try {
        await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ statusId: 2, rejectionReason: null }),
        });
      } catch {
        // ignore
      }
      setRegisterCurrent(-1);
      updateStep("update", { status: "success", message: `Serie "${opts?.tmdbTitle ?? ""}" actualizada con ${episodes.length} episodios`, progress: 100, details: `ID ${contentId} · S${sSeason}E${sEpisode}→S${eSeason}E${eEpisode}` });
      setActiveStep(null);
      return true;
    } catch (err) {
      updateStep("register", { status: "error", message: err instanceof Error ? err.message : "Error desconocido", progress: 100 });
      setActiveStep(null);
      return false;
    }
  }, [opts?.tmdbId, opts?.contentTypeName, reportId, startSeason, startEpisode, endSeason, endEpisode, fetchSeasonCounts, updateStep]);

  const runDownload = useCallback(async (): Promise<boolean> => {
    const tmdbId = opts?.tmdbId;
    const typeRaw = opts?.contentTypeName;
    if (!tmdbId) {
      updateStep("download", { status: "error", message: "No hay TMDB ID asociado a esta sugerencia." });
      return false;
    }
    const type = typeRaw === "tv-show" ? "tv" : "movie";
    if (type === "movie") {
      setActiveStep("download");
      updateStep("download", { status: "running", message: "Descargando película...", progress: 15 });
      setDownloadResult(null);
      setDownloadItems([]);
      try {
        const data = await runSingleDownload(tmdbId, "?type=movie", (status, attempt) => {
          updateStep("download", { status: "running", message: `Torrent ${status} — consultando cada 60s (intento ${attempt})...`, progress: 15 });
        });
        if (!data.success) {
          updateStep("download", { status: "error", message: data.message || "Error en descarga", progress: 100 });
          if (data.filename || data.filePath) setDownloadResult(data);
          return false;
        }
        const detail = [data.filename && `Archivo: ${data.filename}`, data.fileSize ? `Tamaño: ${(data.fileSize / 1024 / 1024).toFixed(2)} MB` : null, data.filePath && `Ruta: ${data.filePath}`].filter(Boolean).join(" · ");
        setDownloadResult(data);
        if (data.filename) setDecompressFilename(data.filename);
        updateStep("download", { status: "success", message: data.message || "Descarga completada", progress: 100, details: detail || undefined });
        return true;
      } catch (err) {
        updateStep("download", { status: "error", message: err instanceof Error ? err.message : "Error de red", progress: 100 });
        return false;
      } finally {
        setActiveStep(null);
      }
    }

    const sSeason = Math.max(1, startSeason || 1);
    const sEpisode = Math.max(1, startEpisode || 1);
    const eSeason = Math.max(sSeason, endSeason || sSeason);
    const eEpisode = Math.max(1, endEpisode || 1);
    if (sSeason === eSeason && sEpisode > eEpisode) {
      updateStep("download", { status: "error", message: "Rango inválido: episodio inicial mayor que final." });
      return false;
    }

    let seasonCounts: Map<number, number> | undefined;
    try {
      seasonCounts = await fetchSeasonCounts(tmdbId);
    } catch {
      seasonCounts = undefined;
    }
    const episodes = buildEpisodeList(sSeason, sEpisode, eSeason, eEpisode, seasonCounts);
    if (episodes.length === 0) {
      updateStep("download", { status: "error", message: "Rango vacío o inválido." });
      return false;
    }

    setActiveStep("download");
    setDownloadResult(null);
    setDownloadItems(episodes.map((ep) => ({ season: ep.season, episode: ep.episode, status: "pending" })));
    setDownloadCurrent(-1);
    updateStep("download", { status: "running", message: `Descargando ${episodes.length} episodio(s) S${sSeason}E${sEpisode} → S${eSeason}E${eEpisode}...`, progress: 5 });

    let successCount = 0;
    let lastSuccess: DownloadResult | null = null;
    const failedEpisodes: { season: number; episode: number; message: string }[] = [];

    for (let i = 0; i < episodes.length; i++) {
      const ep = episodes[i];
      setDownloadCurrent(i);
      setDownloadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "running" } : it)));
      updateStep("download", { status: "running", message: `Descargando S${ep.season}E${ep.episode} (${i + 1}/${episodes.length})...`, progress: Math.round(((i) / episodes.length) * 90) + 5 });

      try {
        const data = await runSingleDownload(
          tmdbId,
          `?type=tv&season=${ep.season}&episode=${ep.episode}`,
          (status, attempt) => {
            setDownloadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "running", message: `Torrent ${status} — consultando cada 60s (intento ${attempt})` } : it)));
            updateStep("download", { status: "running", message: `Descargando S${ep.season}E${ep.episode} via torrent — ${status} (intento ${attempt})...`, progress: Math.round((i / episodes.length) * 90) + 5 });
          }
        );
        if (!data.success) {
          const msg = data.message || "Error desconocido";
          failedEpisodes.push({ season: ep.season, episode: ep.episode, message: msg });
          setDownloadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "error", message: msg, result: data } : it)));
          // No abort: continúa con el siguiente capítulo (requisito: descargar todos los que se pueda)
          updateStep("download", {
            status: "running",
            message: `Error en S${ep.season}E${ep.episode}: ${msg} — ${successCount}/${episodes.length} ok, continúan ${episodes.length - i - 1} restantes...`,
            progress: Math.round(((i + 1) / episodes.length) * 90) + 5,
          });
          continue;
        }
        successCount++;
        lastSuccess = data;
        setDownloadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "success", message: data.message, result: data } : it)));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de red";
        failedEpisodes.push({ season: ep.season, episode: ep.episode, message: msg });
        setDownloadItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, status: "error", message: msg } : it)));
        updateStep("download", {
          status: "running",
          message: `Error en S${ep.season}E${ep.episode}: ${msg} — ${successCount}/${episodes.length} ok, continúan ${episodes.length - i - 1} restantes...`,
          progress: Math.round(((i + 1) / episodes.length) * 90) + 5,
        });
        continue;
      }
    }

    setDownloadCurrent(-1);
    setDownloadResult(lastSuccess);
    if (downloadItems.length === 0 && lastSuccess?.filename) setDecompressFilename(lastSuccess.filename);

    if (successCount === 0) {
      const failedList = failedEpisodes.map((f) => `S${f.season}E${f.episode}`).join(", ");
      const firstMsg = failedEpisodes[0]?.message ?? "Error desconocido";
      const detail = `0/${episodes.length} descargados — fallaron: ${failedList}`;
      updateStep("download", { status: "error", message: `No se pudo descargar ningún capítulo. Fallaron: ${failedList} — Ej. S${failedEpisodes[0]?.season}E${failedEpisodes[0]?.episode}: ${firstMsg}`, progress: 100, details: detail });
      setActiveStep(null);
      return false;
    }

    if (failedEpisodes.length > 0) {
      const failedList = failedEpisodes.map((f) => `S${f.season}E${f.episode}`).join(", ");
      const detail = `${successCount}/${episodes.length} episodios descargados — fallaron: ${failedList}` + (lastSuccess?.filename ? ` — Último: ${lastSuccess.filename}` : "");
      // Partial success: se avisa pero se permite continuar con los descargados (no bloquea pipeline)
      updateStep("download", {
        status: "success",
        message: `Descarga parcial: ${successCount}/${episodes.length} ok — No se pudieron descargar: ${failedList}. Los ${successCount} descargados continuarán a descompresión/transformación.`,
        progress: 100,
        details: detail,
      });
      setActiveStep(null);
      return true;
    }

    const detail = `${successCount}/${episodes.length} episodios descargados` + (lastSuccess?.filename ? ` - Ultimo: ${lastSuccess.filename}` : "");
    updateStep("download", { status: "success", message: `Descarga completada: ${detail}`, progress: 100, details: detail });
    setActiveStep(null);
    return true;
  }, [opts?.tmdbId, opts?.contentTypeName, startSeason, startEpisode, endSeason, endEpisode, fetchSeasonCounts, runSingleDownload, updateStep, downloadItems.length]);

  const runGenericStep = useCallback(
    async (stepId: PipelineStepId): Promise<boolean> => {
      setActiveStep(stepId);
      updateStep(stepId, { status: "running", message: "Procesando...", progress: 15 });
      try {
        const token = getToken();
        const res = await fetch(`${API_HOST_IP}/suggested-content-reports/${reportId}/pipeline/${stepId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ step: stepId }),
        });
        const text = await res.text();
        let data: unknown = text;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = text;
        }
        if (!res.ok) {
          const msg = typeof data === "object" && data !== null && "message" in data ? String((data as { message: string }).message) : typeof data === "string" && data.length > 0 ? data : `Error ${res.status}`;
          updateStep(stepId, { status: "error", message: msg, progress: 100 });
          return false;
        }
        const successMsg = typeof data === "object" && data !== null && "message" in data ? String((data as { message: string }).message) : "Completado correctamente";
        updateStep(stepId, { status: "success", message: successMsg, progress: 100 });
        return true;
      } catch (err) {
        updateStep(stepId, { status: "error", message: err instanceof Error ? err.message : "Error de red", progress: 100 });
        return false;
      } finally {
        setActiveStep(null);
      }
    },
    [reportId, updateStep]
  );

  const runStep = useCallback(
    async (stepId: PipelineStepId): Promise<boolean> => {
      if (stepId === "download") return runDownload();
      if (stepId === "decompress") return runDecompress();
      if (stepId === "register") return runRegister();
      if (stepId === "transform") return runTransform();
      if (stepId === "upload") return runUpload();
      if (stepId === "update") return runUpdate();
      return runGenericStep(stepId);
    },
    [runDownload, runDecompress, runRegister, runTransform, runUpload, runUpdate, runGenericStep]
  );

  const runAll = useCallback(async () => {
    if (runningAll) return;
    setRunningAll(true);
    const order: PipelineStepId[] = ["download", "decompress", "register", "transform", "upload", "update"];
    for (const id of order) {
      const ok = await runStep(id);
      if (!ok) break;
    }
    setRunningAll(false);
  }, [runStep, runningAll]);

  const confirmManualDownload = useCallback(() => {
    setDownloadResult({ success: true, message: "Descarga manual confirmada" });
    setDownloadItems((prev) => prev.map((it) => ({ ...it, status: "success" as const })));
    updateStep("download", { status: "success", message: "Descarga manual confirmada — contenido listo en carpeta destino", progress: 100, details: "Continuando con Descomprimir → Transformar → Subir → Registrar" });
  }, [updateStep]);

  const reset = useCallback(() => {
    setSteps(initialSteps());
    setActiveStep(null);
    setRunningAll(false);
    setDownloadResult(null);
    setDownloadItems([]);
    setDownloadCurrent(-1);
    setDecompressItems([]);
    setDecompressCurrent(-1);
    setTransformItems([]);
    setTransformCurrent(-1);
    setTransformSubStep(null);
    setUploadMkdirItems([]);
    setRegisterItems([]);
    setRegisterCurrent(-1);
    setUpdateItems([]);
    setUpdateCurrent(-1);
    setRegisteredContentId(null);
    setRarExistsResults([]);
    setMp4ExistsResults([]);
    setTransformExistsResults([]);
    setUploadVerifyResult(null);
  }, []);

  const completedCount = steps.filter((s) => s.status === "success").length;
  const overallProgress = Math.round((completedCount / steps.length) * 100);
  const hasError = steps.some((s) => s.status === "error");
  const isRunning = runningAll || activeStep !== null;

  return {
    steps,
    activeStep,
    runningAll,
    isRunning,
    hasError,
    overallProgress,
    completedCount,
    runStep,
    runAll,
    reset,
    confirmManualDownload,
    season,
    episode,
    setSeason,
    setEpisode,
    startSeason,
    setStartSeason,
    startEpisode,
    setStartEpisode,
    endSeason,
    setEndSeason,
    endEpisode,
    setEndEpisode,
    downloadResult,
    downloadItems,
    downloadCurrent,
    decompressFilename,
    setDecompressFilename,
    decompressItems,
    decompressCurrent,
    transformItems,
    transformCurrent,
    transformSubStep,
    setTransformAudioTrack,
    setTransformSubtitleTrack,
    uploadItems,
    uploadCurrent,
    uploadSubStep,
    uploadMkdirItems,
    registerItems,
    registerCurrent,
    updateItems,
    updateCurrent,
    registeredContentId,
    checkingExists,
    rarExistsResults,
    verifyExistingRars,
    buildExpectedRarFilenames,
    slugify,
    checkingMp4Exists,
    mp4ExistsResults,
    verifyExistingMp4s,
    buildExpectedMp4Filenames,
    checkingTransformExists,
    transformExistsResults,
    verifyExistingTransforms,
    checkingUploadExists,
    uploadVerifyResult,
    verifyExistingUploads,
  };
}
