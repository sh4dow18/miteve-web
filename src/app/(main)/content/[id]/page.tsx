import ContentDetailFeaturePage from "@/features/content-detail/page";
export { generateMetadata } from "@/features/content-detail/page";

export default function ContentDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return <ContentDetailFeaturePage params={params} />;
}
