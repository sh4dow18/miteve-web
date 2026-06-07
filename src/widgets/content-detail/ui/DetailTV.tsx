"use client";

import { Play, ArrowLeft, Volume2, VolumeX, Trash2, Film } from "lucide-react";
import Link from "next/link";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { Stars } from "@/shared/ui/Stars";
import Image from "next/image";
import { YoutubeVideo } from "@/widgets/youtube-video";
import { Content } from "@/entities/content/model/types";
import { useDetail } from "@/widgets/content-detail/model/useDetail";
import { useContinueWatchingEntry } from "@/widgets/content-detail/model/useContinueWatchingEntry";
import { useRecommendations } from "@/widgets/content-detail/model/useRecommendations";
import { FavoriteButton } from "@/shared/ui/FavoriteButton";
import { ContentCardTV } from "@/shared/ui/ContentCardTV";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CommentsSection } from "@/widgets/content-detail/ui/CommentsSection";

interface Props {
  content: Content;
  initialSeason?: number;
}

export default function DetailTV({ content, initialSeason }: Props) {
  const {
    seasonsList,
    isMuted,
    toggleMuted,
    selectedSeason,
    selectSeason,
    currentSeasonData,
    playContent,
  } = useDetail({ content, initialSeason });
  const { cwId, removing, remove } = useContinueWatchingEntry(content.id);
  const { items: recommendations } = useRecommendations(content.id);
  const {
    scrollContainerRef: recoScrollRef,
    focusedIndex: recoFocused,
    setFocusedIndex: setRecoFocused,
    handleCardKeyDown: recoKeyDown,
    scroll: recoScroll,
  } = useContentRow({ rowIndex: -1, totalRows: 1, contentLength: recommendations.length });

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
          className="absolute top-15 left-8 z-20 p-3 bg-black/50 rounded-full md:top-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <button
          onClick={toggleMuted}
          className="absolute top-15 right-8 z-20 p-3 bg-black/50 rounded-full md:top-8"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>

        <div className="relative z-10 min-h-screen flex items-end px-4 pt-20 pb-8 sm:p-16">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-bold max-w-3xl mb-4 drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-lg flex-wrap">
              <div className="flex items-center gap-2">
                <Stars rating={content.rating} />
                <span className="hidden text-gray-400 sm:block">
                  ({content.rating.toFixed(1)})
                </span>
              </div>

              <span className="px-3 py-1 border-2 border-gray-400 text-sm font-semibold bg-black/70">
                +{content.age}
              </span>

              <span>{content.year}</span>
            </div>

            {content.tagline && (
              <p className="text-base italic text-gray-300 shadow md:text-lg xl:text-xl">
                &quot;{content.tagline}&quot;
              </p>
            )}

            <p className="text-base max-w-2xl leading-relaxed line-clamp-4 sm:line-clamp-none md:text-lg xl:text-xl">
              {content.description}
            </p>

            {content.genresList.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {content.genresList.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800/70 rounded text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={playContent}
                className="flex w-full sm:w-auto items-center justify-center gap-3 bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded text-base sm:text-xl font-semibold"
              >
                <Play className="w-7 h-7" fill="currentColor" />
                {content.comingSoon ? "Próximamente" : "Reproducir"}
              </button>
              {cwId && (
                <button
                  onClick={remove}
                  disabled={removing}
                  className="flex w-full sm:w-auto items-center justify-center gap-3 bg-transparent border-2 border-gray-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded text-base sm:text-xl font-semibold focus:border-red-500 focus:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  {removing ? "Quitando…" : "Quitar de Continuar viendo"}
                </button>
              )}
              <FavoriteButton
                contentId={content.id}
                tv
                className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-xl"
              />
            </div>
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
            <h2
              className="text-white mb-6 tracking-widest uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              }}
            >
              Episodios
            </h2>

            <div className="flex gap-2 mb-8 flex-wrap">
              {seasonsList.map((season) => (
                <button
                  key={season.id}
                  onClick={() => selectSeason(season.seasonNumber)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium tracking-wide border ${
                    season.seasonNumber === selectedSeason
                      ? "bg-primary border-primary text-white"
                      : "bg-gray-900 border-white/30 text-primary"
                  }`}
                >
                  Temporada {season.seasonNumber}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-0">
              {currentSeasonData.episodesList.map((episode, index) => (
                <div key={episode.id}>
                  <Link
                    href={`/player/${content.id}?season=${currentSeasonData.seasonNumber}&episode=${episode.episodeNumber}`}
                    className="group cursor-pointer text-decoration-none
                      sm:grid sm:grid-cols-[3rem_180px_1fr_auto] sm:items-center
                      sm:gap-4 sm:px-4 sm:py-3 sm:rounded-sm
                      flex flex-col gap-2 px-1 py-3 sm:flex-none"
                    style={{ gridTemplateColumns: "2.5rem 180px 1fr auto" }}
                  >
                    <span className="hidden sm:block text-gray-500 text-2xl font-light text-center">
                      {episode.episodeNumber}
                    </span>

                    <div className="relative aspect-video bg-[#1e1e1e] rounded-sm overflow-hidden w-full sm:w-auto sm:shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${episode.cover}`}
                        alt={episode.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 180px"
                        className="object-cover"
                      />
                    </div>

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

                  {index < currentSeasonData.episodesList.length - 1 && (
                    <div className="mx-3 h-px bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8 md:mb-12">
          <h2
            className="text-lg font-semibold mb-3 px-4
                       sm:text-xl sm:px-8
                       md:text-2xl md:mb-4 md:px-12"
          >
            También te podría gustar
          </h2>
          <div className="relative">
            <button
              onClick={() => recoScroll("left")}
              tabIndex={-1}
              aria-hidden
              className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12
                         bg-black/50 flex items-center justify-center
                         hover:bg-black/70 focus:outline-none"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div
              ref={recoScrollRef}
              className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4
                         sm:gap-4 sm:px-8
                         md:px-12
                         scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {recommendations.map((item, index) => (
                <div
                  key={item.id}
                  onKeyDown={(e) => recoKeyDown(e, index)}
                >
                  <ContentCardTV
                    content={item}
                    index={index}
                    rowIndex={-1}
                    isFocused={recoFocused === index}
                    href={`/content/${item.id}`}
                    onFocus={() => setRecoFocused(index)}
                    onBlur={() => setRecoFocused(-1)}
                    onMouseEnter={() => setRecoFocused(index)}
                    onMouseLeave={() => setRecoFocused(-1)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => recoScroll("right")}
              tabIndex={-1}
              aria-hidden
              className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12
                         bg-black/50 flex items-center justify-center
                         hover:bg-black/70 focus:outline-none"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Comments (read-only on TV) */}
      <CommentsSection contentId={content.id} readOnly />
    </div>
  );
}
