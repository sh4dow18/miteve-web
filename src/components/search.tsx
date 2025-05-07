// Set this component as a client component
"use client";
// Search Requirements
import { Content, Series } from "@/lib/types";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
// Search Props
interface Props {
  moviesList: Content[];
  seriesList: Series[];
}
// Search Main Function
function Search({ moviesList, seriesList }: Props) {
  // Search Main Constants
  const ORIGINAL_LIST = [
    ...moviesList.map((movie) => ({
      title: movie.title,
      image: movie.image,
      href: `/movies/${movie.id}`,
    })),
    ...seriesList.map((series) => ({
      title: series.title,
      image: series.image,
      href: `/series/${series.id}`,
    })),
  ];
  // Search Hooks
  const [searchList, SetSearchList] = useState(ORIGINAL_LIST);
  // Function that allows the list to change while the user is typing
  const OnChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const SEARCH = event.target.value.toLowerCase();
    if (SEARCH === "") {
      SetSearchList(ORIGINAL_LIST);
      return;
    }
    const NEW_LIST = ORIGINAL_LIST.filter((content) =>
      content.title.toLowerCase().includes(SEARCH)
    );
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
          <Link key={index} href={content.href} className="rounded-md w-[30%] min-[552px]:w-40">
            <Image
              src={content.image}
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
