import { ContentRow } from "@/components/ContentRow";
import { HeroSection } from "@/components/HeroSection";
import { FindComingSoonContent, FindContentById, FindRecentContent } from "@/services/api";
// Force Dynamic in Build
export const dynamic = "force-dynamic";
export default async function Movies() {
  const RECENT_CONTENTS_LIST = await FindRecentContent();
  const COMING_SOON_LIST = await FindComingSoonContent();
  const RANDOM_CONTENT =
    RECENT_CONTENTS_LIST[
      Math.floor(Math.random() * RECENT_CONTENTS_LIST.length)
    ];
  const HERO_CONTENT = await FindContentById(RANDOM_CONTENT.id);
  return (
    <div className="min-h-screen">
      <HeroSection content={HERO_CONTENT} />

      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        <ContentRow
          title="Recien Agregados"
          contentsList={RECENT_CONTENTS_LIST}
          rowIndex={0}
          totalRows={RECENT_CONTENTS_LIST.length}
        />
        <ContentRow
          title="Próximamente en Miteve"
          contentsList={COMING_SOON_LIST}
          rowIndex={1}
          totalRows={COMING_SOON_LIST.length}
        />
      </div>
    </div>
  );
}
