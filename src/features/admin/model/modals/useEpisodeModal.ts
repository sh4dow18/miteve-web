import { useState, type FormEvent } from "react";
import { FindEpisodesBySeasonId } from "@/entities/content/api";
import {
  EpisodeRequest,
  FullEpisode,
  MiniSeason,
  ShortContent,
} from "@/entities/content/model/types";
import { secondsToTime, timeToSeconds } from "@/shared/lib/utils";

interface EpisodeFormState {
  seasonId: string;
  episodeNumber: number;
  name: string;
  overview: string;
  beginIntro: string;
  endIntro: string;
  beginSummary: string;
  endSummary: string;
  beginCredits: string;
}

interface UseEpisodeModalParams {
  item: FullEpisode | null;
  onSave: (data: EpisodeRequest) => Promise<void> | void;
  reloadEpisodes: (episodesList: FullEpisode[]) => void;
}

export function useEpisodeModal({
  item,
  onSave,
  reloadEpisodes,
}: UseEpisodeModalParams) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EpisodeFormState>({
    seasonId: item?.id.split("-").slice(0, -1).join("-") || "",
    episodeNumber: item?.episodeNumber || 1,
    name: item?.title || "",
    overview: item?.description || "",
    beginIntro:
      item?.beginIntro !== null && item?.beginIntro !== undefined
        ? secondsToTime(item.beginIntro)
        : "",
    endIntro:
      item?.endIntro !== null && item?.endIntro !== undefined
        ? secondsToTime(item.endIntro)
        : "",
    beginSummary:
      item?.beginSummary !== null && item?.beginSummary !== undefined
        ? secondsToTime(item.beginSummary)
        : "",
    endSummary:
      item?.endSummary !== null && item?.endSummary !== undefined
        ? secondsToTime(item.endSummary)
        : "",
    beginCredits:
      item?.beginCredits !== null && item?.beginCredits !== undefined
        ? secondsToTime(item.beginCredits)
        : "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.seasonId) {
      setError("Debe seleccionar una temporada");
      return;
    }

    if (formData.episodeNumber < 1) {
      setError("El numero de episodio debe ser mayor a 0");
      return;
    }

    if (!formData.name.trim()) {
      setError("El titulo del episodio es requerido");
      return;
    }

    if (!formData.overview.trim()) {
      setError("La descripcion es requerida");
      return;
    }

    const timeFields = [
      { name: "beginIntro", value: formData.beginIntro },
      { name: "endIntro", value: formData.endIntro },
      { name: "beginSummary", value: formData.beginSummary },
      { name: "endSummary", value: formData.endSummary },
      { name: "beginCredits", value: formData.beginCredits },
    ];

    for (const field of timeFields) {
      if (field.value && timeToSeconds(field.value) === undefined) {
        setError(
          `Formato de tiempo invalido en ${field.name}. Use MM:SS o HH:MM:SS`
        );
        return;
      }
    }

    const data: EpisodeRequest = {
      episodeNumber: formData.episodeNumber,
      title: formData.name.trim(),
      description: formData.overview.trim(),
      beginIntro: timeToSeconds(formData.beginIntro),
      endIntro: timeToSeconds(formData.endIntro),
      beginSummary: timeToSeconds(formData.beginSummary),
      endSummary: timeToSeconds(formData.endSummary),
      beginCredits: timeToSeconds(formData.beginCredits),
    };

    await onSave(data);
    reloadEpisodes(await FindEpisodesBySeasonId(formData.seasonId));
  };

  const setField = <K extends keyof EpisodeFormState>(
    key: K,
    value: EpisodeFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getSeasonLabel = (season: MiniSeason, contents: ShortContent[]) => {
    const tvShowId = season.id.split("-").slice(0, -1).join("-");
    const content = contents.find((c) => c.id === tvShowId);
    return `${content?.title || "Serie"} - Temporada ${season.seasonNumber}`;
  };

  return {
    error,
    formData,
    handleSubmit,
    setField,
    getSeasonLabel,
  };
}
