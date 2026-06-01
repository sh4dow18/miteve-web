"use client";

import { HOME_ROWS, HOME_ROW_INDICES, HOME_TOTAL_ROWS } from "@/features/home/config/home.constants";
import { HomeClientShell } from "@/features/home/ui/HomeClientShell";
import { HeroSection } from "@/widgets/hero-section/ui/HeroSection";
import { HeroSectionTV } from "@/widgets/hero-section/ui/HeroSectionTV";
import { ContentRow } from "@/widgets/content-row/ui/ContentRow";
import { ContentRowTV } from "@/widgets/content-row/ui/ContentRowTV";
import { useTV } from "@/shared/lib/hooks/useTV";
import type { Content } from "@/entities/content/model/types";

interface HomePageData {
  recentContents: Content[];
  comingSoonContents: Content[];
  heroContent: Content | null;
}

export default function HomeFeaturePage({ data }: { data: HomePageData }) {
  const isTV = useTV();
  const { recentContents, comingSoonContents, heroContent } = data;

  const hero = heroContent
    ? isTV
      ? <HeroSectionTV content={heroContent} />
      : <HeroSection content={heroContent} />
    : null;

  const Row = isTV ? ContentRowTV : ContentRow;

  return (
    <HomeClientShell hero={hero} isTV={isTV}>
      <Row
        title={HOME_ROWS.recent}
        contentsList={recentContents}
        rowIndex={HOME_ROW_INDICES.recent}
        totalRows={HOME_TOTAL_ROWS}
      />
      <Row
        title={HOME_ROWS.comingSoon}
        contentsList={comingSoonContents}
        rowIndex={HOME_ROW_INDICES.comingSoon}
        totalRows={HOME_TOTAL_ROWS}
      />
    </HomeClientShell>
  );
}
