import ContentDetailFeaturePage from "@/features/content-detail/page";
export { generateMetadata } from "@/features/content-detail/page";

export default function ContentDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ season?: string }>;
}) {
	return <ContentDetailFeaturePage params={params} searchParams={searchParams} />;
}
