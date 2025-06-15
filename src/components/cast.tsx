// Cast Requirements
import { Actor } from "@/lib/types";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
// Cast Props
interface Props {
  type: "movies" | "series";
  credits: Actor[];
  contentId: string;
}
// Cast Main Function
function Cast({ type, credits, contentId }: Props) {
  // Returns Cast Component
  return (
    // Cast Main Section
    <section className="flex flex-col gap-5 p-5 min-[400px]:text-center">
      {/* Cast Title Container */}
      <div className="flex items-center place-content-between min-[452px]:place-content-start min-[452px]:justify-center">
        {/* Cast Title */}
        <h1 className="text-gray-300 text-3xl font-bold min-[361px]:text-4xl min-[452px]:order-2 min-[452px]:ml-5 md:text-5xl">
          Créditos
        </h1>
        {/* Back To Link */}
        <Link href={`/${type}/${contentId}`}>
          <ArrowLeftCircleIcon className="w-10 h-10 transition-all hover:fill-gray-300 hover:scale-125" />
        </Link>
      </div>
      {/* Cast Description */}
      <p className="leading-7">
        Aquí se Muestra el Cast Original de la{" "}
        {type === "movies" ? "Película" : "Serie"}
      </p>
      {/* Cast Actor Cards Container */}
      <div className="flex flex-wrap gap-7 place-content-center">
        {credits.map((actor, index) => (
          // Cast Actor Card
          <div
            key={index}
            className="flex flex-col gap-3 w-full bg-gray-900 rounded-lg shadow shadow-gray-300/40 min-[452px]:w-48"
          >
            {/* Cast Actor Card Image Container */}
            <div className="min-[452px]:w-full min-[452px]:h-52 relative overflow-hidden rounded-t-lg">
              {/* Cast Actor Image */}
              <Image
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                    : "/images/profile.jpg"
                }
                alt={`${actor.name} Profile`}
                width={150}
                height={50}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            {/* Cast Actor Information Container */}
            <div className="flex flex-col gap-1 text-center pb-3 px-3">
              {/* Cast Actor Name */}
              <span className="font-semibold text-xl min-[400px]:text-sm">{`${
                actor.name.split(" ")[0]
              } ${
                actor.name.split(" ")[1] ? actor.name.split(" ")[1] : ""
              }`}</span>
              {/* Cast Character Name */}
              <span className="italic line-clamp-1 min-[400px]:text-xs">
                {actor.character}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cast;
