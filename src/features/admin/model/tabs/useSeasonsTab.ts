import { useMemo, useState } from "react";
import { FindSeasonsByContentId } from "@/entities/content/api";
import { MiniSeason, ShortContent } from "@/entities/content/model/types";

interface UseSeasonsTabParams {
  contents: ShortContent[];
}

export function useSeasonsTab({ contents }: UseSeasonsTabParams) {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [seasons, setSeasons] = useState<MiniSeason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const seriesContents = useMemo(
    () => contents.filter((c) => c.type === "tv-show"),
    [contents]
  );

  const selectedContent = useMemo(
    () => (selectedContentId ? contents.find((c) => c.id === selectedContentId) : null),
    [contents, selectedContentId]
  );

  const handleContentSelection = async (contentId: string) => {
    setSelectedContentId(contentId);
    setSeasons([]);
    setError(null);
    setLoading(true);

    try {
      const fetchedSeasons = await FindSeasonsByContentId(contentId);
      setSeasons(fetchedSeasons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las temporadas");
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  return {
    selectedContentId,
    seasons,
    loading,
    error,
    showAddModal,
    seriesContents,
    selectedContent,
    setSeasons,
    handleContentSelection,
    openAddModal,
    closeAddModal,
  };
}
