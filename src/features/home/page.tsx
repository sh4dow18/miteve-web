import { HOME_ROWS } from "@/features/home/config/home.constants";
import { getHomePageData } from "@/features/home/model/getHomePageData";
import { HomeClientShell } from "@/features/home/ui/HomeClientShell";
import { ContentRow } from "@/widgets/content-row";
import { HeroSection } from "@/widgets/hero-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { recentContents, comingSoonContents, heroContent } =
    await getHomePageData();

  return (
    <HomeClientShell hero={heroContent ? <HeroSection content={heroContent} /> : null}>
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
    </HomeClientShell>
  );
}
