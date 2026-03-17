"use client";

import { useState } from "react";
import {
  Play,
  ArrowLeft,
  Volume2,
  VolumeX,
  Star,
  StarHalf,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GetTmdbImage } from "@/services/api";
import YoutubeVideo from "./YoutubeVideo";
import Stars from "./Stars";

interface Props {
  content: Content;
}

export default function Detail({ content }: Props) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-12">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
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

        <Link
          href={`/${content.type}s`}
          className="absolute top-15 left-8 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors md:top-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-15 right-8 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors md:top-8"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-16 space-y-6 max-h-[80vh] overflow-y-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold max-w-3xl mb-4 drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl"
          >
            {content.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 text-lg flex-wrap"
          >
            {/* Star Rating instead of Match */}
            <div className="flex items-center gap-2">
              <Stars rating={content.rating} />
              <span className="hidden text-gray-400 sm:block">
                ({content.rating.toFixed(1)})
              </span>
            </div>

            {/* Content Rating Badge */}
            <span className="px-3 py-1 border-2 border-gray-400 text-sm font-semibold bg-black/70">
              +{content.age}
            </span>

            <span>{content.year}</span>
          </motion.div>

          {/* Tagline */}
          {content.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base italic text-gray-300 shadow md:text-lg xl:text-xl"
            >
              "{content.tagline}"
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base max-w-2xl leading-relaxed md:text-lg xl:text-xl"
          >
            {content.description}
          </motion.p>

          {/* Genres */}
          {content.genresList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex gap-2 flex-wrap"
            >
              {content.genresList.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800/70 rounded text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Link
              href={`/player/${content.id}`}
              className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded text-xl font-semibold hover:bg-gray-200 transition-colors"
              tabIndex={0}
            >
              <Play className="w-7 h-7" fill="currentColor" />
              Reproducir
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
