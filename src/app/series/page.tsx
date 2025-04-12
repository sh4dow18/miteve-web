// Series Page Requirements
import { Slider, UpdateContent } from "@/components";
import { FindAnimes, FindSeriesByProp } from "@/lib/series";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Metadata } from "next";
// Series Page Metadata
export const metadata: Metadata = {
  title: "Series",
  description: "Aquí se pueden ver todas las series que ofrece Miteve para reproducir",
};
// Series Page Main Function
function SeriesPage() {
  // Series Page Sliders List Information
  const SLIDERS_LIST = [
    {
      title: "Series Imaginativas",
      contentList: FindAnimes(),
    },
    {
      title: "Series de Estados Unidos",
      contentList: FindSeriesByProp("originCountry", "US"),
    },
  ];
  // Returns Series Page
  return (
    // Series Page Main Container
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      {/* Series Page Utilities Container */}
      <div className="flex flex-col gap-3 min-[500px]:items-center min-[500px]:flex-row min-[500px]:gap-5 min-[500px]:place-content-between">
        {/* Series Page Utilities Title */}
        <h1 className="text-[2.5rem] leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Series
        </h1>
        {/* Series Page Utilities CTA Container */}
        <div className="flex items-center gap-5">
          {/* Series Page Utilities CTA Update Content Button */}
          <UpdateContent type="series" />
          {/* Series Page Utilities CTA Search */}
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
      {/* Series Page Sliders Container */}
      <div className="flex flex-col gap-10">
        {SLIDERS_LIST.map((slider, index) => (
          <Slider
            key={index}
            title={slider.title}
            contentList={slider.contentList}
            type="series"
          />
        ))}
      </div>
    </div>
  );
}

export default SeriesPage;
