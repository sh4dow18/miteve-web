import { useState, type FormEvent } from "react";
import {
  BatchUpdateEpisodes,
} from "@/entities/content/api";
import {
  BatchUpdateEpisodesRequest,
  FullEpisode,
  MiniSeason,
} from "@/entities/content/model/types";
import { timeToSeconds } from "@/shared/lib/utils";

interface BatchUpdateFormState {
  startSeason: number;
  startEpisode: number;
  endSeason: number;
  endEpisode: number;
  beginSummary: string;
  endSummary: string;
  beginIntro: string;
  endIntro: string;
  endingDuration: string;
}

interface UseBatchUpdateModalParams {
  seriesId: string;
  seasons: MiniSeason[];
  onClose: () => void;
  reloadEpisodes: (episodes: FullEpisode[]) => void;
}

export function useBatchUpdateModal({
  seriesId,
  seasons,
  onClose,
}: UseBatchUpdateModalParams) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BatchUpdateFormState>({
    startSeason: 1,
    startEpisode: 1,
    endSeason: seasons.length || 1,
    endEpisode: 1,
    beginSummary: "",
    endSummary: "",
    beginIntro: "",
    endIntro: "",
    endingDuration: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.startSeason < 1 || formData.endSeason < 1) {
        setError("Los numeros de temporada deben ser mayores a 0");
        return;
      }

      if (formData.startEpisode < 1 || formData.endEpisode < 1) {
        setError("Los numeros de episodio deben ser mayores a 0");
        return;
      }

      if (formData.startSeason > formData.endSeason) {
        setError("La temporada de inicio no puede ser mayor a la de fin");
        return;
      }

      const timeFields = [
        { name: "beginSummary", value: formData.beginSummary },
        { name: "endSummary", value: formData.endSummary },
        { name: "beginIntro", value: formData.beginIntro },
        { name: "endIntro", value: formData.endIntro },
        { name: "endingDuration", value: formData.endingDuration },
      ];

      for (const field of timeFields) {
        if (field.value && timeToSeconds(field.value) === undefined) {
          setError(
            `Formato de tiempo invalido en ${field.name}. Use MM:SS o HH:MM:SS`
          );
          return;
        }
      }

      const payload: BatchUpdateEpisodesRequest = {
        seriesId,
        startSeason: formData.startSeason,
        startEpisode: formData.startEpisode,
        endSeason: formData.endSeason,
        endEpisode: formData.endEpisode,
        beginSummary: timeToSeconds(formData.beginSummary),
        endSummary: timeToSeconds(formData.endSummary),
        beginIntro: timeToSeconds(formData.beginIntro),
        endIntro: timeToSeconds(formData.endIntro),
        endingDuration: timeToSeconds(formData.endingDuration),
      };

      await BatchUpdateEpisodes(payload);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar episodios"
      );
    } finally {
      setLoading(false);
    }
  };

  const setField = <K extends keyof BatchUpdateFormState>(
    key: K,
    value: BatchUpdateFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return {
    error,
    loading,
    formData,
    handleSubmit,
    setField,
  };
}
