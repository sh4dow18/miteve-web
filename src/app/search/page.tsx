// Search Page Requirements
import { Search } from "@/components";
import { Metadata } from "next";
// Search Page Metadata
export const metadata: Metadata = {
  title: "Buscador",
  description: "Aquí podrá buscar el contenido que desea encontrar",
};
// Search Page Main Function
function SearchPage() {
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
      <Search />
    </div>
  );
}

export default SearchPage;
