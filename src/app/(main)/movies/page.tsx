import { ContentRow } from "@/components/ContentRow";
import { HeroSection } from "@/components/HeroSection";
import { FindAllContainers, FindContentById } from "@/services/api";
import { Metadata } from "next";

// Movies Page Metadata
export const metadata: Metadata = {
  title: "Peliculas",
  description:
    "Aquí se pueden ver todas las películas que ofrece Miteve para reproducir",
};
// Force Dynamic in Build
export const dynamic = "force-dynamic";
export default async function Movies() {
  const CONTAINERS_LIST = await FindAllContainers();
  const HERO_CONTENT = await FindContentById(CONTAINERS_LIST[0].elementsList[0].content.id);
  return (
    <div className="min-h-screen">
      <HeroSection content={HERO_CONTENT} />

      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        {CONTAINERS_LIST.map((container, index) => (
          <ContentRow
            key={container.id}
            title={container.name}
            contentsList={container.elementsList}
            rowIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
