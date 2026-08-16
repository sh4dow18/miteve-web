import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { FindContentById } from "@/entities/content/api";
import {
  ContentRequest,
  Genre,
  MiniContainer,
  ShortContent,
} from "@/entities/content/model/types";
import { secondsToTime, timeToSeconds, toSlug } from "@/shared/lib/utils";
import { API_HOST_IP, STREAM_HOST_IP } from "@/shared/config/env";
import {
  getAgeFromReleaseDates,
  getAgeFromContentRatings,
} from "@/shared/lib/tmdbRating";

interface UseContentModalParams {
  item: ShortContent | null;
  onSave: (data: ContentRequest) => void;
  containers: MiniContainer[];
  genres: Genre[];
}

export function useContentModal({
  item,
  onSave,
  containers,
  genres,
}: UseContentModalParams) {
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [trailerDuration, setTrailerDuration] = useState<string>("");
  const [endTimeStr, setEndTimeStr] = useState<string>("");
  const [formData, setFormData] = useState<ContentRequest>({
    tmdbId: 0,
    title: "",
    year: 0,
    tagline: null,
    description: "",
    rating: 0,
    age: 0,
    cover: "",
    background: "",
    trailer: "",
    trailerDuration: 0,
    comingSoon: false,
    note: null,
    genresList: [],
    typeId: 1,
    containerId: 0,
    containerPosition: 0,
    endTime: null,
  });
  const [loadingTMDB, setLoadingTMDB] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [previewRetries, setPreviewRetries] = useState(0);
  const [coverError, setCoverError] = useState(false);
  const [backgroundError, setBackgroundError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shakaPlayerRef = useRef<unknown>(null);

  const contentSlug = toSlug(formData.title);

  const loadShakaPlayer = useCallback(async () => {
    if (!videoRef.current || !contentSlug) return false;

    const apiPath = `${contentSlug}/manifest.mpd`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      let ip = API_HOST_IP;
      try {
        const res = await fetch(`${ip}/${apiPath}`, { method: "HEAD", signal: controller.signal });
        if (!res.ok) throw new Error();
      } catch {
        ip = API_HOST_IP;
      }
      clearTimeout(timeout);

      const shaka = await import("shaka-player/dist/shaka-player.compiled");
      shaka.default.polyfill.installAll();

      if (!shaka.default.Player.isBrowserSupported()) return false;

      const player = new shaka.default.Player();
      shakaPlayerRef.current = player;
      player.attach(videoRef.current);

      const src = `${STREAM_HOST_IP}/${apiPath}`;
      await player.load(src);
      return true;
    } catch {
      return false;
    }
  }, [contentSlug]);

  useEffect(() => {
    if (previewStatus === "success") {
      void loadShakaPlayer().then((ok) => {
        if (!ok) setPreviewStatus("failed");
      });
    }

    return () => {
      if (shakaPlayerRef.current) {
        try {
          (shakaPlayerRef.current as { destroy: () => void }).destroy();
        } catch { /* ignore */ }
        shakaPlayerRef.current = null;
      }
    };
  }, [previewStatus, loadShakaPlayer]);

  const fetchFromTMDB = async (overrideId?: number) => {
    const idToUse = overrideId ?? tmdbId;
    if (!idToUse || idToUse <= 0) {
      setError("Por favor ingresa un ID de TMDB valido");
      return;
    }

    if (overrideId) setTmdbId(overrideId);
    setLoadingTMDB(true);
    setError(null);

    try {
      const detailsRes = await fetch(
        `/api/tmdb?id=${idToUse}&type=${formData.typeId === 1 ? "movie" : "tv"}`
      );

      if (!detailsRes.ok) {
        throw new Error(`Error de TMDB: ${detailsRes.status}`);
      }

      const data = await detailsRes.json();

      if (data.success === false) {
        throw new Error(data.status_message || "Contenido no encontrado en TMDB");
      }

      const year = (data.release_date || data.first_air_date || "").split("-")[0];

      let age = -1;
      if (formData.typeId === 1 && data.release_dates?.results) {
        age = getAgeFromReleaseDates(data.release_dates.results);
      } else if (formData.typeId === 2 && data.content_ratings?.results) {
        age = getAgeFromContentRatings(data.content_ratings.results);
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || data.name || "",
        year: Number(year) || 0,
        description: data.overview || "",
        tagline: data.tagline || "",
        rating: Number(data.vote_average) || 0,
        cover: data.poster_path || "",
        background: data.backdrop_path || "",
        age: age >= 0 ? age : prev.age,
      }));
    } catch (tmdbError) {
      setError(
        tmdbError instanceof Error
          ? tmdbError.message
          : "Error al obtener datos de TMDB"
      );
    } finally {
      setLoadingTMDB(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    setFormData((prev) => ({
      ...prev,
      genresList: prev.genresList.includes(genreId)
        ? prev.genresList.filter((g: number) => g !== genreId)
        : [...prev.genresList, genreId],
    }));
  };

  useEffect(() => {
    const getData = async () => {
      if (item === null) {
        return;
      }

      try {
        const existingContent = await FindContentById(item.id);

        if (!existingContent) {
          return;
        }

        setTrailerDuration(secondsToTime(existingContent.trailerDuration || 0));
        setEndTimeStr(existingContent.endTime != null ? secondsToTime(existingContent.endTime) : "");
        setFormData({
          tmdbId: existingContent.tmdbId || 0,
          title: existingContent.title || "",
          year: existingContent.year || 0,
          tagline: existingContent.tagline ?? "",
          description: existingContent.description || "",
          rating: existingContent.rating || 0,
          age: existingContent.age || 0,
          cover: existingContent.cover || "",
          background: existingContent.background || "",
          trailer: existingContent.trailer || "",
          trailerDuration: existingContent.trailerDuration || 0,
          comingSoon: existingContent.comingSoon || false,
          note: existingContent.note ?? "",
          genresList: Array.isArray(existingContent.genresList)
            ? existingContent.genresList.map((genre) => genre.id)
            : [],
          typeId: existingContent.type === "movie" ? 1 : 2,
          containerId: existingContent.container?.id || 0,
          containerPosition: existingContent.position || 0,
          endTime: existingContent.endTime ?? null,
        });
      } catch {
        setError("Error al cargar el contenido");
      }
    };

    void getData();
  }, [item]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("El titulo es requerido");
      return;
    }

    if (!formData.description.trim()) {
      setError("La descripcion es requerida");
      return;
    }

    if (formData.year < 1800 || formData.year > 2100) {
      setError("El ano debe estar entre 1800 y 2100");
      return;
    }

    const trailerSeconds = timeToSeconds(trailerDuration);
    const endTimeSecs = endTimeStr.trim() ? timeToSeconds(endTimeStr) : null;

    setError(null);
    onSave({
      ...formData,
      tagline: formData.tagline !== "" ? formData.tagline : null,
      note: formData.note !== "" ? formData.note : null,
      trailerDuration: trailerSeconds !== null ? trailerSeconds : 0,
      tmdbId: tmdbId !== null ? tmdbId : 0,
      endTime: endTimeSecs ?? null,
    });
  };

  const handleNumberInput = (
    value: string,
    field: keyof ContentRequest,
    min?: number,
    max?: number
  ) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;

    let finalValue = num;
    if (min !== undefined && num < min) finalValue = min;
    if (max !== undefined && num > max) finalValue = max;

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const setField = <K extends keyof ContentRequest>(
    key: K,
    value: ContentRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const setCover = (value: string) => {
    setCoverError(false);
    setField("cover", value);
  };

  const setBackground = (value: string) => {
    setBackgroundError(false);
    setField("background", value);
  };

  const decrementContainerPosition = () => {
    setFormData((prev) => ({
      ...prev,
      containerPosition: Math.max(0, prev.containerPosition - 1),
    }));
  };

  const incrementContainerPosition = () => {
    setFormData((prev) => ({
      ...prev,
      containerPosition: prev.containerPosition + 1,
    }));
  };

  const toggleComingSoon = () => {
    if (previewStatus === "success") return;
    setFormData((prev) => ({ ...prev, comingSoon: !prev.comingSoon }));
  };

  const MAX_PREVIEW_RETRIES = 3;

  const handlePreview = async () => {
    if (!contentSlug || previewStatus === "loading") return;

    setPreviewStatus("loading");
    setPreviewRetries(0);

    const apiPath = `${contentSlug}/manifest.mpd`;

    for (let attempt = 1; attempt <= MAX_PREVIEW_RETRIES; attempt++) {
      setPreviewRetries(attempt);
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        let ip = API_HOST_IP;
        try {
          const res = await fetch(`${ip}/${apiPath}`, { method: "HEAD", signal: controller.signal });
          if (!res.ok) throw new Error();
        } catch {
          ip = API_HOST_IP;
        }
        clearTimeout(timeout);

        const checkRes = await fetch(`${STREAM_HOST_IP}/${apiPath}`, { method: "HEAD" });
        if (checkRes.ok) {
          setPreviewStatus("success");
          setFormData((prev) => ({ ...prev, comingSoon: false }));
          return;
        }
      } catch {
        // continue to next attempt
      }
    }

    setPreviewStatus("failed");
  };

  const resetPreview = () => {
    setPreviewStatus("idle");
    setPreviewRetries(0);
    if (shakaPlayerRef.current) {
      try {
        (shakaPlayerRef.current as { destroy: () => void }).destroy();
      } catch { /* ignore */ }
      shakaPlayerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  };

  return {
    tmdbId,
    trailerDuration,
    formData,
    loadingTMDB,
    error,
    containers,
    genres,
    contentSlug,
    previewStatus,
    previewRetries,
    coverError,
    backgroundError,
    setCoverError,
    setBackgroundError,
    videoRef,
    shakaPlayerRef,
    setTmdbId,
    setTrailerDuration,
    endTimeStr,
    setEndTimeStr,
    setField,
    setCover,
    setBackground,
    fetchFromTMDB,
    toggleGenre,
    handleSubmit,
    handleNumberInput,
    decrementContainerPosition,
    incrementContainerPosition,
    toggleComingSoon,
    handlePreview,
    resetPreview,
  };
}
