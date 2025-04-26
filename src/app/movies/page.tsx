// Movies Page Requirements
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Slider, UpdateContent } from "@/components";
import { FindMoviesByCollection, FindMoviesByIds, FindMoviesByProp } from "@/lib/movies";
import { Metadata } from "next";
// Movies Page Metadata
export const metadata: Metadata = {
  title: "Peliculas",
  description: "Aquí se pueden ver todas las películas que ofrece Miteve para reproducir",
};
// Movies Page Main Function
function MoviesPage() {
  // Movies Page Sliders List Information
  const SLIDERS_LIST = [
    {
      title: "Para Disfrutar en Familia",
      contentList: [
        ...FindMoviesByProp(
          "productionCompany",
          "DreamWorks Animation"
        ),
        ...FindMoviesByIds(["95754", "1100795", "639720", "912908", "1022789", "762509", "939243"])
      ],
    },
    {
      title: "Toda la Acción",
      contentList: FindMoviesByIds(["136795", "845781", "533535", "589761", "493529", "822119", "447365", "335977", "539972", "912649", "22538", "374720", "616", "550988", "324786"]),
    },
    {
      title: "Lo Mejor de Keanu Reaves",
      contentList: [
        ...FindMoviesByIds(["64686"]),
        ...FindMoviesByCollection("Matrix - Colección"),
        ...FindMoviesByCollection("John Wick - Colección"),
      ],
    },
  ];
  // Returns Movies Page
  return (
    // Movies Page Main Container
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      {/* Movies Page Utilities Container */}
      <div className="flex flex-col gap-3 min-[500px]:items-center min-[500px]:flex-row min-[500px]:gap-5 min-[500px]:place-content-between">
        {/* Movies Page Utilities Title */}
        <h1 className="text-[2.5rem] leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Películas
        </h1>
        {/* Movies Page Utilities CTA Container */}
        <div className="flex items-center gap-5">
          {/* Movies Page Utilities CTA Update Content Button */}
          <UpdateContent type="movies" />
          {/* Movies Page Utilities CTA Search */}
          <div className="flex place-content-between gap-2 rounded-md outline-2 py-2 px-1 bg-gray-800 outline-gray-800 focus-within:outline-mateoryPurple min-[576px]:my-3">
            <MagnifyingGlassIcon className="w-7 h-7" />
            <input
              type="search"
              name="search"
              disabled
              className="w-full bg-transparent outline-hidden text-white"
            />
          </div>
        </div>
      </div>
      {/* Movies Page Sliders Container */}
      <div className="flex flex-col gap-10">
        {SLIDERS_LIST.map((slider, index) => (
          <Slider
            key={index}
            title={slider.title}
            contentList={slider.contentList}
            type="movies"
          />
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;
