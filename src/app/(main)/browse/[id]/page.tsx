import BrowseDetailFeaturePage from "@/features/browse-detail/page";
import { getTmdbDetail } from "@/features/browse-detail/model/getTmdbMovieDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const type = resolvedSearch.type === "tv" ? "tv" : "movie";
  const content = await getTmdbDetail(resolvedParams.id, type);
  if (!content) {
    return {
      title: "Contenido no encontrado",
      description: "El contenido solicitado no fue encontrado.",
    };
  }
  return {
    title: `${content.title} - Miteve`,
    description: content.overview,
  };
}

export default async function BrowseDetailPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const type = resolvedSearch.type === "tv" ? "tv" : "movie";
  const content = await getTmdbDetail(resolvedParams.id, type);
  if (!content) return notFound();
  return <BrowseDetailFeaturePage movie={content} />;
}
