// Movies Page Requirements
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Slider, UpdateContent } from "@/components";
import {
  FindMoviesByCollection,
  FindMoviesByIds,
  FindMoviesByProp,
} from "@/lib/movies";
import { Metadata } from "next";
import Link from "next/link";
// Movies Page Metadata
export const metadata: Metadata = {
  title: "Peliculas",
  description:
    "Aquí se pueden ver todas las películas que ofrece Miteve para reproducir",
};
// Movies Page Main Function
function MoviesPage() {
  // Movies Page Sliders List Information
  const SLIDERS_LIST = [
    {
      title: "Para Disfrutar en Familia",
      contentList: [
        ...FindMoviesByProp("productionCompany", "DreamWorks Animation"),
        ...FindMoviesByIds([
          "95754",
          "1100795",
          "639720",
          "912908",
          "1022789",
          "762509",
          "939243",
          "10779",
        ]),
      ],
    },
    {
      title: "Toda la Acción",
      contentList: FindMoviesByIds([
        "136795",
        "845781",
        "533535",
        "589761",
        "493529",
        "822119",
        "447365",
        "335977",
        "539972",
        "912649",
        "22538",
        "374720",
        "616",
        "550988",
        "324786",
        "9319",
        "9798",
        "8656",
      ]),
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
      <div className="flex place-content-between gap-3 min-[500px]:items-center">
        {/* Movies Page Utilities Title */}
        <h1 className="text-4xl leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Películas
        </h1>
        {/* Movies Page Utilities CTA Container */}
        <div className="flex items-center gap-5">
          {/* Movies Page Utilities CTA Update Content Button */}
          <UpdateContent type="movies" />
          {/* Movies Page Utilities CTA Search Button */}
          <Link
            href="/search"
            className="bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          >
            <MagnifyingGlassIcon className="w-5 h-5 md:w-7 md:h-7" />
          </Link>
        </div>
      </div>
      {/* Movies Page Sliders Container */}
      <div className="flex flex-col gap-5 md:gap-7">
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
