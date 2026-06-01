import { useEffect, useState, type FormEvent } from "react";
import { FindContentById } from "@/entities/content/api";
import {
  ContentRequest,
  Genre,
  MiniContainer,
  ShortContent,
} from "@/entities/content/model/types";
import { secondsToTime, timeToSeconds } from "@/shared/lib/utils";

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

      setFormData((prev) => ({
        ...prev,
        title: data.title || data.name || "",
        year: Number(year) || 0,
        description: data.overview || "",
        tagline: data.tagline || "",
        rating: Number(data.vote_average) || 0,
        cover: data.poster_path || "",
        background: data.backdrop_path || "",
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
    setFormData((prev) => ({ ...prev, comingSoon: !prev.comingSoon }));
  };

  return {
    tmdbId,
    trailerDuration,
    formData,
    loadingTMDB,
    error,
    containers,
    genres,
    setTmdbId,
    setTrailerDuration,
    endTimeStr,
    setEndTimeStr,
    setField,
    fetchFromTMDB,
    toggleGenre,
    handleSubmit,
    handleNumberInput,
    decrementContainerPosition,
    incrementContainerPosition,
    toggleComingSoon,
  };
}
