import { useState, type FormEvent } from "react";
import { FindContentById, FindSeasonsByContentId } from "@/entities/content/api";
import { MiniSeason, ShortContent } from "@/entities/content/model/types";

interface UseSeasonsModalParams {
  content: ShortContent;
  onSave?: () => void;
  onClose: () => void;
  reloadSeasons: (seasons: MiniSeason[]) => void;
}

export function useSeasonsModal({
  content,
  onSave,
  onClose,
  reloadSeasons,
}: UseSeasonsModalParams) {
  const [formData, setFormData] = useState({
    seasonStart: 1,
    episodeStart: 1,
    seasonEnd: 1,
    episodeEnd: 1,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const fullContent = await FindContentById(content.id);

      const body = {
        id: content.id,
        tmdbId: fullContent.tmdbId,
        firstSeason: formData.seasonStart,
        firstEpisode: formData.episodeStart,
        lastSeason: formData.seasonEnd,
        lastEpisode: formData.episodeEnd,
      };

      const response = await fetch("/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error al guardar las temporadas");
      }

      reloadSeasons((await FindSeasonsByContentId(content.id)) || []);
      onSave?.();
      onClose();
    } catch {
      alert("Hubo un error al guardar las temporadas");
    }
  };

  const setSeasonStart = (value: number) =>
    setFormData((prev) => ({ ...prev, seasonStart: value }));
  const setEpisodeStart = (value: number) =>
    setFormData((prev) => ({ ...prev, episodeStart: value }));
  const setSeasonEnd = (value: number) =>
    setFormData((prev) => ({ ...prev, seasonEnd: value }));
  const setEpisodeEnd = (value: number) =>
    setFormData((prev) => ({ ...prev, episodeEnd: value }));

  return {
    formData,
    handleSubmit,
    setSeasonStart,
    setEpisodeStart,
    setSeasonEnd,
    setEpisodeEnd,
  };
}
