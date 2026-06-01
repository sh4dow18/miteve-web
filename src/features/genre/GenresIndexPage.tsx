"use client";

import { useTV } from "@/shared/lib/hooks/useTV";
import { GenresIndexNormal } from "@/features/genre/ui/GenresIndexNormal";
import { GenresIndexTV } from "@/features/genre/ui/GenresIndexTV";

export default function GenresIndexPage() {
  const isTV = useTV();
  return isTV ? <GenresIndexTV /> : <GenresIndexNormal />;
}
