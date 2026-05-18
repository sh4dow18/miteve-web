"use client";

import { Play, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { YoutubeVideo } from "@/widgets/youtube-video";
import { Stars } from "@/shared/ui/Stars";
import Image from "next/image";
import { Content } from "@/entities/content/model/types";
import { useDetail } from "@/widgets/content-detail/model/useDetail";

interface Props {
  content: Content;
}

export default function Detail({ content }: Props) {
  const {
    seasonsList,
    isMuted,
    toggleMuted,
    selectedSeason,
    selectSeason,
    currentSeasonData,
    playContent,
  } = useDetail({ content });
  return (
    <div className="min-h-screen bg-[#141414] text-white pb-12">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <YoutubeVideo
            id={content.trailer}
            title={content.title}
            thumbnail={GetTmdbImage(content.background)}
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
          onClick={toggleMuted}
          className="absolute top-15 right-8 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors md:top-8"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>

        <div className="relative z-10 min-h-screen flex items-end px-4 pt-20 pb-8 sm:p-16">
          <div className="space-y-6 max-w-3xl">
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
                &quot;{content.tagline}&quot;
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base max-w-2xl leading-relaxed line-clamp-4 sm:line-clamp-none md:text-lg xl:text-xl"
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
              <button
                onClick={playContent}
                className="flex w-full sm:w-auto items-center justify-center gap-3 bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded text-base sm:text-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-7 h-7" fill="currentColor" />
                {content.comingSoon ? "Próximamente" : "Reproducir"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      {content.note !== null && !content.comingSoon && (
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border-white/10 border mx-4 sm:mx-10">
          <div className="flex items-start gap-4">
            <Image
              src="/logo.png"
              alt="Miteve Note"
              className="size-12 rounded-full shrink-0"
              width={48}
              height={48}
            />
            <div className="flex-1">
              <p className="font-semibold mb-2">Nota de Miteve</p>
              <p className="text-gray-300 mb-3">{content.note}</p>
            </div>
          </div>
        </div>
      )}
      {currentSeasonData &&
        currentSeasonData.episodesList.length > 0 &&
        !content.comingSoon && (
          <div className="bg-[#0a0a0a] px-4 sm:px-8 lg:px-16 py-10">
            {/* Título */}
            <h2
              className="text-white mb-6 tracking-widest uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              }}
            >
              Episodios
            </h2>

            {/* Selector de temporadas */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {seasonsList.map((season) => (
                <button
                  key={season.id}
                  onClick={() => selectSeason(season.seasonNumber)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium tracking-wide border transition-all duration-200 ${
                    season.seasonNumber === selectedSeason
                      ? "bg-primary border-primary text-white"
                      : "bg-gray-900 border-white/30 text-primary hover:text-white hover:border-white/30"
                  }`}
                >
                  Temporada {season.seasonNumber}
                </button>
              ))}
            </div>

            {/* Lista de episodios */}
            <div className="flex flex-col gap-0">
              {currentSeasonData.episodesList.map((episode, index) => (
                <div key={episode.id}>
                  <Link
                    href={`/player/${content.id}?season=${currentSeasonData.seasonNumber}&episode=${episode.episodeNumber}`}
                    className={`
                    group cursor-pointer text-decoration-none
                    sm:grid sm:grid-cols-[3rem_180px_1fr_auto] sm:items-center
                    sm:gap-4 sm:px-4 sm:py-3 sm:rounded-sm sm:hover:bg-white/5
                    flex flex-col gap-2 px-1 py-3
                    sm:flex-none
                    transition-colors duration-200
                  `}
                    style={{
                      gridTemplateColumns: "2.5rem 180px 1fr auto",
                    }}
                  >
                    {/* Número */}
                    <span className="hidden sm:block text-gray-500 text-2xl font-light text-center">
                      {episode.episodeNumber}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[#1e1e1e] rounded-sm overflow-hidden w-full sm:w-auto sm:shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${episode.cover}`}
                        alt={episode.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 180px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 px-1 sm:px-0">
                      <h3 className="text-white font-medium mb-1">
                        {episode.episodeNumber}. {episode.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 sm:line-clamp-2">
                        {episode.description && episode.description !== ""
                          ? episode.description
                          : "No ha Información disponible de este capítulo"}
                      </p>
                    </div>
                  </Link>

                  {/* Divisor */}
                  {index < currentSeasonData.episodesList.length - 1 && (
                    <div className="mx-3 h-px bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
