import { ContentRow } from "@/components/ContentRow";
import { HeroSection } from "@/components/HeroSection";
import { FindAllMovies, FindContentById } from "@/services/api";
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
  const CONTAINERS_LIST = await FindAllMovies();
  const RANDOM_CONTAINER =
    CONTAINERS_LIST[Math.floor(Math.random() * CONTAINERS_LIST.length)];
  const RANDOM_ELEMENT =
    RANDOM_CONTAINER.elementsList[
      Math.floor(Math.random() * RANDOM_CONTAINER.elementsList.length)
    ];
  const HERO_CONTENT = await FindContentById(RANDOM_ELEMENT.content.id);
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
            totalRows={CONTAINERS_LIST.length} // ← agregar esto
          />
        ))}
      </div>
    </div>
  );
}
