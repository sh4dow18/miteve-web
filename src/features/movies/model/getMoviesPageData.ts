import { FindAllMovies, FindContentById } from "@/entities/content/api";
import { pickRandomContainerContent } from "@/features/movies/lib/pickRandomContainerContent";

export async function getMoviesPageData() {
  const containers = await FindAllMovies();
  const randomContent = pickRandomContainerContent(containers);
  const heroContent = randomContent
    ? await FindContentById(randomContent.id)
    : null;

  return {
    containers,
    heroContent,
  };
}
