// Series Page Requirements
import { Slider } from "@/components";
import { FindSeriesContainers } from "@/lib/series";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Metadata } from "next";
import Link from "next/link";
// Series Page Metadata
export const metadata: Metadata = {
  title: "Series",
  description:
    "Aquí se pueden ver todas las series que ofrece Miteve para reproducir",
};
// Series Page Main Function
async function SeriesPage() {
  // Movies Page Containers List Information
  const CONTAINERS_LIST = await FindSeriesContainers();
  // Returns Series Page
  return (
    // Series Page Main Container
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      {/* Series Page Utilities Container */}
      <div className="flex place-content-between gap-3 min-[500px]:items-center">
        {/* Series Page Utilities Title */}
        <h1 className="text-[2.5rem] leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Series
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
      {/* Series Page Sliders Container */}
      <div className="flex flex-col gap-5 md:gap-7">
        {CONTAINERS_LIST.map((container) => (
          <Slider
            key={container.id}
            title={container.name}
            contentList={container.contentList}
            type="series"
          />
        ))}
      </div>
    </div>
  );
}

export default SeriesPage;
