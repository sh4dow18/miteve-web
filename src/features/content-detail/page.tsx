import {
  getContentDetailData,
  getContentDetailMetadata,
} from "@/features/content-detail/model/getContentDetailData";
import { Detail } from "@/widgets/content-detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ season?: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return getContentDetailMetadata(resolvedParams);
}

export default async function ContentDetailPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const content = await getContentDetailData(resolvedParams);
  if (!content) return notFound();
  const initialSeason = resolvedSearch.season ? parseInt(resolvedSearch.season, 10) : undefined;
  return <Detail content={content} initialSeason={initialSeason} />;
}
