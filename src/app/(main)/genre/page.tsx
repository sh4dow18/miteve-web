import type { Metadata } from "next";
import GenresIndexPage from "@/features/genre/GenresIndexPage";

export const metadata: Metadata = {
  title: "Géneros",
  description: "Explora todo el catálogo de Miteve por género.",
};

export default function GenresRoute() {
  return <GenresIndexPage />;
}
