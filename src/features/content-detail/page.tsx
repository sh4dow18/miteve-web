import {
  getContentDetailData,
  getContentDetailMetadata,
} from "@/features/content-detail/model/getContentDetailData";
import { Detail } from "@/widgets/content-detail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return getContentDetailMetadata(resolvedParams);
}

export default async function ContentDetailPage({
  params,
}: Props) {
  const resolvedParams = await params;
  const content = await getContentDetailData(resolvedParams);

  return <Detail content={content} />;
}
