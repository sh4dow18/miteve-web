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
        <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
          {content.title}
        </h1>

        <p className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md">
          {content.description}
        </p>

        <div className="flex items-center gap-3 mb-8">
          {/* Star Rating instead of Match */}
          <div className="flex items-center gap-2">
            <Stars rating={content.rating} />
            <span className="text-gray-400">({content.rating.toFixed(1)})</span>
          </div>

          {/* Content Rating Badge */}
          <span className="px-3 py-1 border-2 border-gray-400 text-sm font-semibold">
            +{content.age}
          </span>

          <span>{content.year}</span>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/player/${content.id}`}
            className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded text-xl font-semibold hover:bg-gray-200 transition-all hover:scale-105"
          >
            <Play className="w-8 h-8" fill="currentColor" />
            Reproducir
          </Link>

          <Link
            href={`/content/${content.id}`}
            className="flex items-center gap-3 bg-gray-500/70 text-white px-8 py-3 rounded text-xl font-semibold hover:bg-gray-500/50 transition-all hover:scale-105"
          >
            <Info className="w-8 h-8" />
            Más información
          </Link>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-32 right-12 p-3 border-2 border-gray-400 rounded-full hover:bg-gray-400/20 transition-colors"
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
