// Search Page Requirements
import { Search } from "@/components";
import { FindAllMovies } from "@/lib/movies";
import { FindAllSeries } from "@/lib/series";
import { Metadata } from "next";
// Search Page Metadata
export const metadata: Metadata = {
  title: "Buscador",
  description: "Aquí podrá buscar el contenido que desea encontrar",
};
// Search Page Main Function
function SearchPage() {
  // Search Page Main Constants
  const MOVIES_LIST = FindAllMovies();
  const SERIES_LIST = FindAllSeries();
  // Returns Search Page
  return (
    // Search Page Main Container
    <div className="flex flex-col gap-5 m-6">
      {/* Search Page Information Section */}
      <section className="flex flex-col gap-5 min-[370px]:text-center">
        {/* Search Page Page Title */}
        <h1 className="text-3xl leading-none font-bold text-gray-300 min-[466px]:text-5xl">
          Buscador
        </h1>
        {/* Search Page Title Description */}
        <p className="leading-8">
          Aquí podrá buscar el contenido que desea encontrar
        </p>
      </section>
      {/* Search Page Input Search */}
      <Search moviesList={MOVIES_LIST} seriesList={SERIES_LIST} />
    </div>
  );
}

export default SearchPage;
