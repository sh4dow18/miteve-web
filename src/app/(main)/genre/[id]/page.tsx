import type { Metadata } from "next";
import { use } from "react";
import GenrePage from "@/features/genre/page";

export const metadata: Metadata = {
  title: "Género",
  description: "Explora el contenido disponible por género en Miteve.",
};

export default function GenreRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const genreId = Number(id);
  return <GenrePage genreId={genreId} />;
}
