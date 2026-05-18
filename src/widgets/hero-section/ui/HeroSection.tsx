"use client";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { Stars } from "@/shared/ui/Stars";
import { YoutubeVideo } from "@/widgets/youtube-video";
import type { Content } from "@/entities/content/model/types";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useHeroSection } from "@/widgets/hero-section/model/useHeroSection";

interface Props {
  content: Content;
}

export function HeroSection({ content }: Props) {
  const { isMuted, toggleMuted, handleHeroBtnKeyDown, playContent } =
    useHeroSection({ content });

  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <YoutubeVideo
          id={content.trailer}
          title={content.title}
          thumbnail={GetTmdbImage(content.background)}
          mute={isMuted}
          duration={content.trailerDuration}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent sm:via-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/50 to-transparent sm:via-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-24 px-4 max-w-3xl
                      sm:justify-center sm:pb-0 sm:px-8
                      md:px-12">
        <h1 className="text-2xl font-bold mb-2 drop-shadow-lg
                       sm:text-3xl sm:mb-4
                       md:text-4xl lg:text-5xl xl:text-6xl">
          {content.title}
        </h1>

        {/* Descripción */}
        <p className="text-sm text-gray-200 mb-3 line-clamp-2 drop-shadow-md
                      sm:text-lg sm:mb-6 sm:line-clamp-3">
          {content.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-4 flex-wrap
                        sm:gap-3 sm:mb-8">
          <div className="flex items-center gap-1.5">
            <Stars rating={content.rating} />
            <span className="hidden text-gray-400 sm:block">
              ({content.rating.toFixed(1)})
            </span>
          </div>

          <span className="px-2 py-0.5 border border-gray-400 text-xs font-semibold
                           sm:px-3 sm:py-1 sm:border-2 sm:text-sm">
            +{content.age}
          </span>

          <span className="text-sm sm:text-base">{content.year}</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={playContent}
            data-hero-btn
            onKeyDown={handleHeroBtnKeyDown}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-base font-semibold hover:bg-gray-200 transition-all hover:scale-105
                       sm:gap-3 sm:px-8 sm:py-3 sm:text-xl"
          >
            <Play className="w-5 h-5 sm:w-8 sm:h-8" fill="currentColor" />
            <span>{content.comingSoon ? "Próximamente" : "Reproducir"}</span>
          </button>

          <Link
            href={`/content/${content.id}`}
            data-hero-btn
            onKeyDown={handleHeroBtnKeyDown}
            className="flex items-center gap-2 bg-gray-500/70 text-white px-4 py-2 rounded text-base font-semibold hover:bg-gray-500/50 transition-all hover:scale-105
                       sm:gap-3 sm:px-8 sm:py-3 sm:text-xl"
          >
            <Info className="w-5 h-5 sm:w-8 sm:h-8" />
            <span className="hidden sm:block">Más información</span>
          </Link>
          <button onClick={toggleMuted} className="sm:hidden p-2">
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={toggleMuted}
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
