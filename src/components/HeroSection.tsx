"use client";
import { GetTmdbImage } from "@/services/api";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Stars from "./Stars";
import YoutubeVideo from "./YoutubeVideo";

interface Props {
  content: Content;
}

export function HeroSection({ content }: Props) {
  const [isMuted, setIsMuted] = useState(true);
  // Función helper para ir al primer card
  const focusFirstCard = () => {
    const firstCard = document.querySelector(
      "[data-row='0'][data-col='0']"
    ) as HTMLElement;
    firstCard?.focus({ preventScroll: false });
    firstCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleHeroBtnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstCard();
    }
  };
  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <YoutubeVideo
          id={content.trailer}
          title={content.title}
          thumbnail={GetTmdbImage(content.background, 780)}
          mute={isMuted}
          duration={content.trailerDuration}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
          {content.title}
        </h1>

        {/* Descripción */}
        <p className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md">
          {content.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <Stars rating={content.rating} />
            <span className="hidden text-gray-400 sm:block">
              ({content.rating.toFixed(1)})
            </span>
          </div>

          <span className="px-3 py-1 border-2 border-gray-400 text-sm font-semibold">
            +{content.age}
          </span>

          <span>{content.year}</span>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Link
            href={`/player/${content.id}`}
            data-hero-btn
            onKeyDown={handleHeroBtnKeyDown}
            className="flex items-center gap-3 bg-white text-black px-3 py-3 rounded text-xl font-semibold hover:bg-gray-200 transition-all hover:scale-105 min-[350px]:px-8"
          >
            <Play className="w-8 h-8" fill="currentColor" />
            <span className="hidden sm:block">Reproducir</span>
          </Link>

          <Link
            href={`/content/${content.id}`}
            data-hero-btn
            onKeyDown={handleHeroBtnKeyDown}
            className="flex items-center gap-3 bg-gray-500/70 text-white px-3 py-3 rounded text-xl font-semibold hover:bg-gray-500/50 transition-all hover:scale-105 min-[350px]:px-8"
          >
            <Info className="w-8 h-8" />
            <span className="hidden sm:block">Más información</span>
          </Link>
          <button onClick={() => setIsMuted(!isMuted)} className="sm:hidden">
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        data-hero-btn
        onKeyDown={handleHeroBtnKeyDown}
        className="hidden absolute bottom-32 right-12 p-3 border-2 border-gray-400 rounded-full hover:bg-gray-400/20 transition-colors sm:block"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
