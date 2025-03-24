"use client";

import { UpdateMovies, UpdateSeries } from "@/lib/admin";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

interface Props {
  type: "movies" | "series";
}

function UpdateContent({ type }: Props) {
  const OnClick = async () => {
    if (type === "movies") {
      await UpdateMovies();
    } else {
      await UpdateSeries();
    }
    location.reload();
  };
  return (
    <button
      onClick={OnClick}
      className="bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-700"
    >
      <ArrowPathIcon className="w-7 h-7" />
    </button>
  );
}

export default UpdateContent;
