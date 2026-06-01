"use client";

import { ContentRow } from "@/widgets/content-row/ui/ContentRow";
import { ContentRowTV } from "@/widgets/content-row/ui/ContentRowTV";
import { HeroSection } from "@/widgets/hero-section/ui/HeroSection";
import { HeroSectionTV } from "@/widgets/hero-section/ui/HeroSectionTV";
import { useTV } from "@/shared/lib/hooks/useTV";
import type { Container, Content } from "@/entities/content/model/types";

interface MoviesPageData {
  containers: Container[];
  heroContent: Content | null;
}

export default function MoviesFeaturePage({ data }: { data: MoviesPageData }) {
  const isTV = useTV();
  const { containers, heroContent } = data;

  if (containers.length === 0) {
    return <div className="min-h-screen" />;
  }

  const Row = isTV ? ContentRowTV : ContentRow;

  return (
    <div className="min-h-screen">
      {heroContent && (
        isTV
          ? <HeroSectionTV content={heroContent} />
          : <HeroSection content={heroContent} />
      )}
      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        {containers.map((container, index) => (
          <Row
            key={container.id}
            title={container.name}
            contentsList={container.elementsList}
            rowIndex={index}
            totalRows={containers.length}
          />
        ))}
      </div>
    </div>
  );
}
