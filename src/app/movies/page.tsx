// Movies Page Requirements
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Slider } from "@/components";
import {
  FindMoviesContainers,
  FindMoviesNew,
  FindMoviesSoon,
} from "@/lib/movies";
import { Metadata } from "next";
import Link from "next/link";
// Movies Page Metadata
export const metadata: Metadata = {
  title: "Peliculas",
  description:
    "Aquí se pueden ver todas las películas que ofrece Miteve para reproducir",
};
// Force Dynamic in Build
export const dynamic = "force-dynamic";
// Movies Page Main Function
async function MoviesPage() {
  // Movies Page Containers List Information
  const NEW_MOVIES_LIST = await FindMoviesNew();
  const COMING_SOON_LIST = await FindMoviesSoon();
  const CONTAINERS_LIST = await FindMoviesContainers();
  // Returns Movies Page
  return (
    // Movies Page Main Container
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      {/* Movies Page Utilities Container */}
      <div className="flex place-content-between gap-3 min-[500px]:items-center">
        {/* Movies Page Utilities Title */}
        <h1 className="text-4xl leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Películas
        </h1>
        {/* Movies Page Utilities CTA Container */}
        <div className="flex items-center gap-5">
          {/* Movies Page Utilities CTA Search Button */}
          <Link
            href="/search"
            className="flex items-center gap-1 bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          >
            <MagnifyingGlassIcon className="w-5 h-5 md:w-7 md:h-7" />
            <span className="text-gray-300 md:text-lg">Buscar</span>
          </Link>
        </div>
      </div>
      {/* Movies Page Sliders Container */}
      <div className="flex flex-col gap-5 md:gap-7">
        {NEW_MOVIES_LIST.length > 0 && (
          <Slider
            title="Nuevo Disponible"
            contentList={NEW_MOVIES_LIST}
            type="movies"
          />
        )}
        {COMING_SOON_LIST.length > 0 && (
          <Slider
            title="Próximamente en Miteve"
            contentList={COMING_SOON_LIST}
            type="movies"
          />
        )}
        {CONTAINERS_LIST.map((container) => (
          <Slider
            key={container.id}
            title={container.name}
            contentList={container.contentList}
            type="movies"
          />
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;
