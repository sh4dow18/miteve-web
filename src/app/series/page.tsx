import { Slider, UpdateContent } from "@/components";
import { FindAnimes, FindSeriesByCountry } from "@/lib/series";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";

function SeriesPage() {
  return (
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      <div className="flex flex-col gap-3 min-[500px]:items-center min-[500px]:flex-row min-[500px]:gap-5 min-[500px]:place-content-between">
        <h1 className="text-[2.5rem] leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Series
        </h1>
        <div className="flex items-center gap-5">
          <UpdateContent type="series" />
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
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-gray-300">
            Series Imaginativas
          </h2>
          <Slider contentList={FindAnimes()} type="series" />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-gray-300">
            Series de Estados Unidos
          </h2>
          <Slider contentList={FindSeriesByCountry("US")} type="series" />
        </section>
      </div>
    </div>
  );
}

export default SeriesPage;
