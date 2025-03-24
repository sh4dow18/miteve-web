import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Slider, UpdateContent } from "@/components";
import { FindMoviesByIds } from "@/lib/movies";

function MoviesPage() {
  return (
    <div className="flex flex-col gap-6 px-7 py-7 lg:px-10">
      <div className="flex flex-col gap-3 min-[500px]:items-center min-[500px]:flex-row min-[500px]:gap-5 min-[500px]:place-content-between">
        <h1 className="text-[2.5rem] leading-none font-bold text-gray-300 min-[351px]:text-5xl">
          Películas
        </h1>
        <div className="flex items-center gap-5">
          <UpdateContent type="movies" />
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
            Selección de Dreamworks
          </h2>
          <Slider
            contentList={FindMoviesByIds([9502, 49444, 140300, 1011985])}
            type="movies"
          />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-gray-300">
            Toda la Acción
          </h2>
          <Slider
            contentList={FindMoviesByIds([136795, 845781, 533535])}
            type="movies"
          />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-2xl text-gray-300">
            Dramas y Misterio
          </h2>
          <Slider
            contentList={FindMoviesByIds([589761, 1100795])}
            type="movies"
          />
        </section>
      </div>
    </div>
  );
}

export default MoviesPage;
