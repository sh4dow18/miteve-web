"use client";

import { useTV } from "@/shared/lib/hooks/useTV";
import { GenrePageNormal } from "@/features/genre/ui/GenrePageNormal";
import { GenrePageTV } from "@/features/genre/ui/GenrePageTV";

interface Props {
  genreId: number;
}

export default function GenrePage({ genreId }: Props) {
  const isTV = useTV();
  return isTV ? (
    <GenrePageTV genreId={genreId} />
  ) : (
    <GenrePageNormal genreId={genreId} />
  );
}
