import { useEffect, useState } from "react";
import { FindSimilarContent } from "@/entities/content/api";
import type { MiniContent } from "@/entities/content/model/types";

export function useRecommendations(contentId: string) {
  const [items, setItems] = useState<MiniContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FindSimilarContent(contentId, 15)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [contentId]);

  return { items, loading };
}
