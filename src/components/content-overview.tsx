// Content Overview Requirements
import Image from "next/image";
import Stars from "./stars";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/16/solid";
import YoutubeVideo from "./youtube-video";
// Content Overview Props
interface Props {
  player: {
    id: string;
    series?: {
      season: string;
      episode: string;
    };
  };
  title: string;
  image: string;
  background: string;
  date: string;
  genres: string;
  tagline: string | null;
  overview: string;
  rating: number;
  certification: string | undefined;
  credits: {
    names: string | undefined;
    href: string;
  };
  trailer: string | undefined;
}
// Content Overview Main Container
function ContentOverview({
  player,
  title,
  image,
  background,
  date,
  genres,
  tagline,
  overview,
  rating,
  certification,
  credits,
  trailer,
}: Props) {
  // Returns Content Overview Component
  return (
    // Content Overview Container
    <div className="flex flex-col gap-5">
      {/* Content Overview Images Container */}
      <div className="min-[600px]:relative">
        {/* Content Overview Background Image */}
        <Image
          src={`https://image.tmdb.org/t/p/original/${background}`}
          alt="Fondo decorativo"
          fill
          className="hidden object-cover object-center -z-10 mask-image rounded-t-sm min-[600px]:block"
          priority
        />
        {/* Content Overview images Second Container */}
        <div className="flex flex-col gap-5 min-[600px]:flex-row min-[600px]:place-content-between min-[600px]:pt-30 min-[600px]:px-3 min-[600px]:pb-3">
          {/* Content Overview Image Cover */}
          <Image
            src={`https://image.tmdb.org/t/p/w780/${image}`}
            alt={`${title} Cover`}
            width={600}
            height={635}
            priority
            className="rounded-lg w-full min-[600px]:w-44 min-[600px]:shadow-sm shadow-gray-700"
          />
          {/* Content Overview Button Container */}
          <div className="mt-auto">
            {/* Content Overview Play Button */}
            <Link
              href={`/player?type=${
                player.series === undefined ? "movies" : "series"
              }&id=${player.id}${
                player.series !== undefined
                  ? `&season=${player.series.season}&episode=${player.series.episode}`
                  : ""
              }`}
              className="flex items-center justify-center bg-gray-300 text-xl py-2 px-5 rounded-sm text-gray-900 font-semibold hover:bg-gray-100"
            >
              <PlayIcon className="w-7 h-7 mr-1" />
              <span>Reproducir</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Content Overview Description Container */}
      <section className="flex flex-col gap-3">
        {/* Content Overview Description Main Title */}
        <h1 className="text-4xl text-center leading-14 font-bold text-gray-300 min-[351px]:text-5xl min-[600px]:text-4xl min-[600px]:text-left min-[600px]:leading-12">
          {title} ({date})
        </h1>
        {/* Content Overview Description Genres */}
        <span className="text-center min-[600px]:text-left">{genres}</span>
        {/* Content Overview Description Tagline */}
        {tagline && tagline !== "N/A" && (
          <span className="italic text-center min-[600px]:text-left">{`"${tagline}"`}</span>
        )}
        {/* Content Overview Description Second Container */}
        <section className="flex flex-col gap-1">
          {/* Content Overview Description Title */}
          <span className="font-semibold text-gray-300">Descripción</span>
          {/* Content Overview Description Paragraph */}
          <p className="leading-7 text-justify hyphens-auto">{overview}</p>
        </section>
        {/* Content Overview Extra Information Container */}
        <div className="flex flex-col gap-3 min-[477px]:flex-row min-[477px]:flex-wrap min-[477px]:items-center">
          {/* Content Overview Extra Information Rating Section */}
          <section className="flex flex-col gap-1">
            {/* Content Overview Extra Information Rating Title */}
            <span className="font-semibold text-gray-300">Valoración</span>
            {/* Content Overview Extra Information Rating Stars */}
            <div className="flex items-center">
              <Stars count={5} size={30} value={rating} />
              <span className="hidden text-lg font-semibold ml-2 mt-1 min-[352px]:block">
                ({rating})
              </span>
            </div>
          </section>
          {/* Content Overview Extra Information Clasification Section */}
          <section className="flex flex-col gap-2 min-[477px]:ml-5">
            {/* Content Overview Extra Information Clasification Title */}
            <span className="font-semibold text-gray-300">Clasificación</span>
            {/* Content Overview Extra Information Clasification */}
            <span>{certification}</span>
          </section>
          {/* Content Overview Extra Information Rating Credits Section */}
          <section className="flex flex-col gap-2 min-[870px]:ml-5">
            {/* Content Overview Extra Information Credits Title */}
            <span className="font-semibold text-gray-300">Créditos</span>
            {/* Content Overview Extra Information Credits */}
            {credits.names !== "N/A" ? (
              <Link href={credits.href} className="hover:text-gray-100">
                <span>{credits.names}</span>
              </Link>
            ) : (
              <span>{credits.names}</span>
            )}
          </section>
        </div>
      </section>
      {/* Content Overview Trailer Section */}
      {trailer && (
        <section className="flex flex-col gap-1">
          {/* Content Page Trailer Main Title */}
          <span className="font-semibold text-gray-300">Trailer</span>
          {/* Content Page Trailer */}
          <YoutubeVideo id={trailer} title={title} />
        </section>
      )}
    </div>
  );
}

export default ContentOverview;
