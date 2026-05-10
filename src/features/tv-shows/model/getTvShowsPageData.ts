import { FindAllTvShows, FindContentById } from "@/entities/content/api";
import { pickRandomContainerContent } from "@/features/tv-shows/lib/pickRandomContainerContent";

export async function getTvShowsPageData() {
  const containers = await FindAllTvShows();
  const randomContent = pickRandomContainerContent(containers);
  const heroContent = randomContent
    ? await FindContentById(randomContent.id)
    : null;

  return {
    containers,
    heroContent,
  };
}
