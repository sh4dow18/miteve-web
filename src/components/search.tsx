// Set this component as a client component
"use client";
import { FindMoviesByTitle } from "@/lib/movies";
import { FindSeriesByTitle } from "@/lib/series"
// Search Requirements
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
// Search Main Function
function Search() {
  // Search Hooks
  const [searchList, SetSearchList] = useState<
    { image: string; title: string; href: string }[]
  >([]);
  // Function that allows the list to change while the user is typing
  const OnChangeSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const VALUE = event.target.value.toLowerCase();
    if (VALUE === "") {
      SetSearchList([]);
      return;
    }
    const MOVIES = await FindMoviesByTitle(VALUE);
    const SERIES = await FindSeriesByTitle(VALUE);
    const NEW_LIST = [
      ...MOVIES.map((movie: { id: number; title: string; cover: string }) => ({
        image: movie.cover,
        title: movie.title,
        href: `/movies/${movie.id}`,
      })),
      ...SERIES.map((series: { id: number; title: string; cover: string }) => ({
        image: series.cover,
        title: series.title,
        href: `/series/${series.id}`,
      })),
    ];
    SetSearchList(NEW_LIST);
  };
  // Returns Search Component
  return (
    // Search Main Container
    <div className="flex flex-col gap-5">
      {/* Search Input Container */}
      <div className="group flex gap-2 bg-gray-800 p-3 rounded-md mx-auto focus:outline focus:outline-primary">
        <MagnifyingGlassIcon className="w-7" />
        <input
          type="text"
          name="search"
          className="w-full py-1 px-2 focus:outline-none"
          onChange={OnChangeSearch}
        />
      </div>
      {/* Search Display List Container */}
      <div className="flex flex-wrap gap-3 place-content-center">
        {searchList.map((content, index) => (
          <Link
            key={index}
            href={content.href}
            className="rounded-md w-[30%] min-[552px]:w-40"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500/${content.image}`}
              alt={`${content.title} Cover`}
              width={300}
              height={450}
              className="rounded-md transition-all ease-in-out hover:scale-110"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Search;
