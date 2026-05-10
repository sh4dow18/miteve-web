import { HOME_ROWS } from "@/features/home/config/home.constants";
import { getHomePageData } from "@/features/home/model/getHomePageData";
import { ContentRow } from "@/widgets/content-row";
import { HeroSection } from "@/widgets/hero-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { recentContents, comingSoonContents, heroContent } =
    await getHomePageData();

  return (
    <div className="min-h-screen">
      {heroContent && <HeroSection content={heroContent} />}

      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        <ContentRow
          title={HOME_ROWS.recent}
          contentsList={recentContents}
          rowIndex={0}
          totalRows={recentContents.length}
        />
        <ContentRow
          title={HOME_ROWS.comingSoon}
          contentsList={comingSoonContents}
          rowIndex={1}
          totalRows={comingSoonContents.length}
        />
      </div>
    </div>
  );
}
