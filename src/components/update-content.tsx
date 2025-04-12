// Set this component as a client component
"use client";
// Update Content Requirements
import { UpdateMovies, UpdateSeries } from "@/lib/admin";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
// Update Content Props
interface Props {
  type: "movies" | "series";
}
// Update Content Main Function
function UpdateContent({ type }: Props) {
  // Update Content On Click Function
  const OnClick = async () => {
    if (type === "movies") {
      await UpdateMovies();
    } else {
      await UpdateSeries();
    }
    location.reload();
  };
  // Returns Update Content Component
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
