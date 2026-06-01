"use client";

import Detail from "@/widgets/content-detail/ui/Detail";
import DetailTV from "@/widgets/content-detail/ui/DetailTV";
import { useTV } from "@/shared/lib/hooks/useTV";
import type { Content } from "@/entities/content/model/types";

interface Props {
  content: Content;
  initialSeason?: number;
}

export default function ContentDetailFeaturePage({ content, initialSeason }: Props) {
  const isTV = useTV();

  if (isTV) {
    return <DetailTV content={content} initialSeason={initialSeason} />;
  }

  return <Detail content={content} initialSeason={initialSeason} />;
}
