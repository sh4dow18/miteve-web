import {
  FindComingSoonContent,
  FindContentById,
  FindRecentContent,
} from "@/entities/content/api";
import { pickRandomItem } from "@/features/home/lib/pickRandomItem";

export async function getHomePageData() {
  const recentContents = await FindRecentContent();
  const comingSoonContents = await FindComingSoonContent();

  const randomRecentContent = pickRandomItem(recentContents);
  const heroContent = randomRecentContent
    ? await FindContentById(randomRecentContent.id)
    : null;

  return {
    recentContents,
    comingSoonContents,
    heroContent,
  };
}
