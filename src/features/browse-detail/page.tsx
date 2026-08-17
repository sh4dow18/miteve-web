"use client";

import BrowseDetail from "@/widgets/browse-detail/ui/BrowseDetail";
import BrowseDetailTV from "@/widgets/browse-detail/ui/BrowseDetailTV";
import { useTV } from "@/shared/lib/hooks/useTV";
import type { TmdbMovieDetail } from "@/features/browse-detail/model/getTmdbMovieDetail";

interface Props {
  movie: TmdbMovieDetail;
}

export default function BrowseDetailFeaturePage({ movie }: Props) {
  const isTV = useTV();

  if (isTV) {
    return <BrowseDetailTV movie={movie} />;
  }

  return <BrowseDetail movie={movie} />;
}
