import { useMemo, useState } from "react";
import {
  FindEpisodesBySeasonId,
  FindSeasonsByContentId,
} from "@/entities/content/api";
import {
  EpisodeRequest,
  FullEpisode,
  MiniSeason,
  ShortContent,
} from "@/entities/content/model/types";

interface UseEpisodesTabParams {
  contents: ShortContent[];
  onEdit: (id: string, data: EpisodeRequest) => Promise<void>;
}

export function useEpisodesTab({ contents, onEdit }: UseEpisodesTabParams) {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<MiniSeason[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisode[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FullEpisode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const seriesContents = useMemo(
    () => contents.filter((c) => c.type === "tv-show"),
    [contents]
  );

  const selectedContent = useMemo(
    () => (selectedContentId ? contents.find((c) => c.id === selectedContentId) : null),
    [contents, selectedContentId]
  );

  const selectedSeason = useMemo(
    () => (selectedSeasonId ? seasons.find((s) => s.id === selectedSeasonId) : null),
    [selectedSeasonId, seasons]
  );

  const handleContentSelection = async (contentId: string) => {
    setSelectedContentId(contentId);
    setSelectedSeasonId(null);
    setSeasons([]);
    setEpisodes([]);
    setError(null);
    setLoadingSeasons(true);

    try {
      const fetchedSeasons = await FindSeasonsByContentId(contentId);
      setSeasons(fetchedSeasons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las temporadas");
      setSeasons([]);
    } finally {
      setLoadingSeasons(false);
    }
  };

  const handleSeasonSelection = async (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setEpisodes([]);
    setError(null);
    setLoadingEpisodes(true);

    try {
      const fetchedEpisodes = await FindEpisodesBySeasonId(seasonId);
      setEpisodes(fetchedEpisodes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los episodios");
      setEpisodes([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (episode: FullEpisode) => {
    setEditingItem(episode);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = async (data: EpisodeRequest) => {
    if (editingItem) {
      await onEdit(editingItem.id, data);
    }
    handleClose();
  };

  return {
    selectedContentId,
    selectedSeasonId,
    seasons,
    episodes,
    loadingSeasons,
    loadingEpisodes,
    error,
    editingItem,
    showModal,
    seriesContents,
    selectedContent,
    selectedSeason,
    setEpisodes,
    handleContentSelection,
    handleSeasonSelection,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
  };
}
