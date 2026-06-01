import ContentDetailFeaturePage from "@/features/content-detail/page";
import { getContentDetailData, getContentDetailMetadata } from "@/features/content-detail/model/getContentDetailData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	return getContentDetailMetadata(resolvedParams);
}

export default async function ContentDetailPage({
	params,
	searchParams,
}: PageProps) {
	const resolvedParams = await params;
	const resolvedSearch = await searchParams;
	const content = await getContentDetailData(resolvedParams);
	if (!content) return notFound();
	const initialSeason = resolvedSearch.season ? parseInt(resolvedSearch.season, 10) : undefined;
	return <ContentDetailFeaturePage content={content} initialSeason={initialSeason} />;
}
