import { getMoviesPageData } from "@/features/movies/model/getMoviesPageData";
import { ContentRow } from "@/widgets/content-row";
import { HeroSection } from "@/widgets/hero-section";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const { containers, heroContent } = await getMoviesPageData();

  if (containers.length === 0) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      {heroContent && <HeroSection content={heroContent} />}
      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        {containers.map((container, index) => (
          <ContentRow
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
