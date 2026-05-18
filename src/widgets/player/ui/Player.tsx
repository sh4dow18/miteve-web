"use client";

import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Clapperboard,
  FastForward,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Content, EpisodeMetadata, NextEpisode } from "@/entities/content/model/types";
import { type UsePlayerReturn } from "@/features/player/model/usePlayer";

interface Props {
  content: Content;
  player: UsePlayerReturn;
  tvShow?: {
    season: number;
    episode: EpisodeMetadata;
    nextEpisode: NextEpisode | null;
  };
}

function Player({ content, player, tvShow }: Props) {
  const {
    videoRef,
    containerRef,
    controlsRef,
    videoStates,
    rangeStates,
    seekPreviewPercent,
    volumeFeedback,
    qualityMenuRef,
    qualityButtonRef,
    qualityFocusedIndex,
    qualityMenuOpen,
    isAutoQuality,
    qualityOptions,
    isPip,
    hasSubtitles,
    skips,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seek,
    toggleSubtitles,
    togglePiP,
    onVolumeBarChange,
    onSeekBar,
    onSeekBarMouseMove,
    onSeekBarMouseLeave,
    onSeekBarTrackClick,
    handleTVNav,
    onToggleQualityMenu,
    selectAutoQuality,
    selectQuality,
    navigateToNextEpisode,
    skip,
    fmt,
  } = player;

  const iconBtn =
    "cursor-pointer p-2 rounded-full transition-all duration-150 text-white/70 hover:text-white hover:bg-white/10 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  const resolutionColor: Record<string, string> = {
    FHD: "text-blue-400 border-blue-400/40",
    SD: "text-orange-400 border-orange-400/40",
  };
  const qualityLabelColor: Record<string, string> = {
    FHD: "text-blue-400",
    SD: "text-orange-400",
  };
  const resColor =
    resolutionColor[videoStates.resolution] ?? "text-white/60 border-white/15";
  const qualityColorClass =
    qualityLabelColor[videoStates.resolution] ?? "text-white/70";
  const isSeekPreviewActive = seekPreviewPercent !== null;
  const isMousePreviewActive =
    !isSeekPreviewActive && rangeStates.isHovering;
  const isAnyPreviewActive = isSeekPreviewActive || isMousePreviewActive;
  const displayedProgress =
    seekPreviewPercent !== null
      ? seekPreviewPercent
      : isMousePreviewActive
      ? rangeStates.hoverPercent
      : videoStates.progress;

  return (
    <div
      ref={containerRef}
      id="video-container"
      className={`relative min-h-screen w-full bg-black overflow-hidden select-none ${
        videoStates.controlsHidden ? "cursor-none" : "cursor-default"
      }`}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain z-0 max-[1024px]:object-cover"
        playsInline
        data-focusable
        onClick={togglePlay}
      />

      {/* LOADING */}
      <div
        aria-hidden={!videoStates.waiting}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none aria-hidden:hidden"
      >
        <Loader2
          className="h-12 w-12 text-white/50 animate-spin"
          strokeWidth={1.5}
        />
      </div>

      <AnimatePresence>
        {volumeFeedback.visible && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <div className="w-52 rounded-xl border border-white/15 bg-black/80 backdrop-blur-sm px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-white/70">Volumen</span>
                <span className="text-white font-semibold">{volumeFeedback.value}%</span>
              </div>
              <div className="relative h-2">
                <div className="absolute top-1/2 inset-x-0 h-1 -translate-y-1/2 rounded-full bg-white/20" />
                <div
                  className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-[#e50914]"
                  style={{ width: `${volumeFeedback.value}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP GRADIENT + HEADER */}
      <div
        aria-hidden={videoStates.controlsHidden}
        className="absolute top-0 inset-x-0 z-20
                   bg-linear-to-b from-black/80 via-black/20 to-transparent
                   px-6 pt-6 pb-20
                   transition-opacity duration-500
                   aria-hidden:opacity-0 aria-hidden:pointer-events-none"
      >
        <div className="flex items-start justify-between">
          <Link
            href={`/content/${content.id}`}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft
              className="w-6 h-6 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </Link>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5
                bg-black/40 backdrop-blur-sm border
                text-xs font-bold tracking-widest uppercase
                px-2.5 py-1 rounded-full transition-colors duration-300
                ${resColor}`}
            >
              <Clapperboard className="w-3 h-3" strokeWidth={2} />
              {videoStates.resolution}
            </div>

            <div className="text-right">
              <h1 className="text-white font-semibold text-lg leading-tight min-[865px]:text-2xl">
                {content.title}
              </h1>
              {tvShow && (
                <span className="italic text-gray-300">{`T${tvShow.season}E${tvShow.episode.episodeNumber} «${tvShow.episode.title}»`}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skip Buttons */}
      <AnimatePresence>
        {skips.intro && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={skip}
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-semibold transition-colors z-40"
          >
            Omitir Intro
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {skips.summary && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={skip}
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-semibold transition-colors z-40"
          >
            Omitir Resumen
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {skips.credits && tvShow && tvShow.nextEpisode !== null && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={navigateToNextEpisode}
            className="absolute right-12 bottom-32 bg-white/90 hover:bg-white text-black px-8 py-4 rounded font-semibold transition-colors z-40"
          >
            Siguiente Episodio
          </motion.button>
        )}
      </AnimatePresence>

      {/* BOTTOM CONTROLS */}
      <div
        ref={controlsRef}
        aria-hidden={videoStates.controlsHidden}
        className="absolute bottom-0 inset-x-0 z-20
                   bg-linear-to-t from-black/95 via-black/50 to-transparent
                   px-5 pb-5 pt-20
                   transition-opacity duration-500
                   aria-hidden:opacity-0 aria-hidden:pointer-events-none"
      >
        {/* SEEKBAR */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full h-8 group/bar">
            <div
              className="absolute top-1/2 inset-x-0 h-0.75 -translate-y-1/2 rounded-full bg-white/15
                            group-hover/bar:h-1.25 transition-all duration-150"
            />
            <div
              className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-white/25
                         group-hover/bar:h-1.25 transition-all duration-150"
              style={{ width: `${rangeStates.buffered}%` }}
            />
            <div
              className={`absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full group-hover/bar:h-1.25 transition-all duration-150 ${
                isSeekPreviewActive ? "bg-white" : "bg-[#e50914]"
              }`}
              style={{ width: `${displayedProgress}%` }}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg pointer-events-none transition-opacity duration-150 ${
                isSeekPreviewActive
                  ? "opacity-100"
                  : "opacity-0 group-hover/bar:opacity-100"
              }`}
              style={{ left: `${displayedProgress}%` }}
            />
            {isAnyPreviewActive && (
              <div
                className="absolute top-1/2 -translate-x-1/2 w-px h-4 bg-white pointer-events-none"
                style={{ left: `${displayedProgress}%`, marginTop: "6px" }}
              />
            )}
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onMouseMove={onSeekBarMouseMove}
              onMouseLeave={onSeekBarMouseLeave}
              onClick={onSeekBarTrackClick}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={!Number.isNaN(displayedProgress) ? displayedProgress : 0}
              onChange={onSeekBar}
              onClick={onSeekBarTrackClick}
              onMouseMove={onSeekBarMouseMove}
              onMouseLeave={onSeekBarMouseLeave}
              onKeyDown={handleTVNav}
              data-focusable
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />
            {isAnyPreviewActive && rangeStates.isHovering && (
              <div className="pointer-events-none absolute inset-0 z-30">
                <div
                  className="absolute top-0 bottom-0 w-px bg-white/50"
                  style={{ left: rangeStates.hoverX }}
                />
                <div
                  className="absolute -top-10 -translate-x-1/2 flex items-center gap-1.5
                             bg-black/90 border border-white/15 text-white text-xs
                             px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg"
                  style={{ left: rangeStates.hoverX }}
                >
                  <Play className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                  {fmt(rangeStates.hoverTime)}
                </div>
              </div>
            )}
          </div>

          <div className="hidden min-[581px]:flex items-center gap-1 shrink-0 tabular-nums text-xs select-none">
            <span className="text-white/80">{videoStates.currentTime}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">{videoStates.duration}</span>
          </div>
        </div>

        {/* BUTTON ROW */}
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="relative flex items-center gap-0.5 min-[425px]:gap-1">
            <button
              className={iconBtn}
              onClick={togglePlay}
              data-focusable
              tabIndex={0}
              aria-label={videoStates.paused ? "Play" : "Pause"}
            >
              {videoStates.paused ? (
                <Play
                  className="w-7 h-7 min-[865px]:w-9 min-[865px]:h-9"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ) : (
                <Pause
                  className="w-7 h-7 min-[865px]:w-9 min-[865px]:h-9"
                  fill="currentColor"
                  strokeWidth={0}
                />
              )}
            </button>

            <button
              className={`hidden sm:flex gap-1 items-center ${iconBtn}`}
              onClick={() => seek(-10)}
              tabIndex={0}
              aria-label="Retroceder 10s"
            >
              <RotateCcw
                className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                strokeWidth={2}
              />
              <span className="text-sm">-10s</span>
            </button>

            <button
              className={`hidden sm:flex gap-1 items-center ${iconBtn}`}
              onClick={() => seek(10)}
              tabIndex={0}
              aria-label="Adelantar 10s"
            >
              <RotateCw
                className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                strokeWidth={2}
              />
              <span className="text-sm">+10s</span>
            </button>

            <div className="group/volume hidden sm:flex relative items-center">
              <button
                className={iconBtn}
                onClick={toggleMute}
                tabIndex={0}
                aria-label={videoStates.muted ? "Activar sonido" : "Silenciar"}
              >
                {videoStates.muted || videoStates.volume === 0 ? (
                  <VolumeX
                    className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                    strokeWidth={2}
                  />
                ) : (
                  <Volume2
                    className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                    strokeWidth={2}
                  />
                )}
              </button>

              <div className="w-0 opacity-0 overflow-hidden pointer-events-none transition-all duration-200 group-hover/volume:w-28 group-hover/volume:opacity-100 group-hover/volume:pointer-events-auto">
                <div className="pl-2 pr-1">
                  <div className="relative h-8 flex items-center">
                    <div className="absolute top-1/2 inset-x-0 h-0.75 -translate-y-1/2 rounded-full bg-white/15" />
                    <div
                      className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-[#e50914]"
                      style={{ width: `${videoStates.volume}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg pointer-events-none"
                      style={{ left: `${videoStates.volume}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={videoStates.volume}
                      onChange={onVolumeBarChange}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      aria-label="Volumen"
                    />
                  </div>
                </div>
              </div>
            </div>

            <span className="hidden">
              {videoStates.currentTime}
            </span>
          </div>

          {/* Center title */}
          <span className="hidden min-[940px]:block text-white/40 text-sm tracking-wide truncate max-w-xs px-4">
            {content.title}
          </span>

          {/* Right */}
          <div className="relative flex items-center gap-0.5 min-[425px]:gap-1">
            {tvShow && tvShow.nextEpisode !== null && (
              <button
                className={`hidden sm:inline-flex ${iconBtn}`}
                onClick={navigateToNextEpisode}
                tabIndex={0}
                aria-label="Siguiente Episodio"
              >
                <FastForward
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              </button>
            )}

            <button
              onClick={togglePiP}
              className={`hidden sm:inline-flex ${iconBtn}`}
              tabIndex={0}
              aria-label={isPip ? "Salir de Picture-in-Picture" : "Picture-in-Picture"}
            >
              {isPip ? (
                <PictureInPicture
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <PictureInPicture2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              )}
            </button>

            {hasSubtitles && (
              <button
                className={`hidden sm:inline-flex ${iconBtn} ${
                  videoStates.subtitlesOn ? "text-white" : "text-white/40"
                }`}
                onClick={toggleSubtitles}
                tabIndex={0}
                aria-label={
                  videoStates.subtitlesOn
                    ? "Ocultar subtítulos"
                    : "Mostrar subtítulos"
                }
              >
                {videoStates.subtitlesOn ? (
                  <Captions
                    className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                    strokeWidth={2}
                  />
                ) : (
                  <CaptionsOff
                    className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                    strokeWidth={2}
                  />
                )}
              </button>
            )}

            {qualityOptions.length > 0 && (
              <div className="hidden sm:block relative">
                <button
                  ref={qualityButtonRef}
                  className={`${iconBtn} ${
                    qualityMenuOpen ? "text-white bg-white/10" : ""
                  }`}
                  onClick={onToggleQualityMenu}
                  tabIndex={0}
                  aria-label="Calidad de video"
                  aria-expanded={qualityMenuOpen}
                >
                  <Settings
                    className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                    strokeWidth={2}
                  />
                </button>

                <AnimatePresence>
                  {qualityMenuOpen && (
                    <motion.div
                      ref={qualityMenuRef}
                      className="absolute right-0 bottom-full mb-3 w-60 bg-black/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-30"
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      style={{ transformOrigin: "bottom right" }}
                    >
                      <div className="px-4 pt-4 pb-3 border-b border-white/10">
                        <p className="text-[11px] tracking-[0.16em] font-semibold text-white/40 uppercase">
                          Calidad de video
                        </p>
                      </div>

                      <button
                        className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                          qualityFocusedIndex === 0
                            ? "bg-white/14 text-white"
                            : isAutoQuality
                            ? "bg-white/12 text-white"
                            : "text-white/90 hover:bg-white/8"
                        }`}
                        onClick={selectAutoQuality}
                        role="menuitem"
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              isAutoQuality ? "bg-[#e50914]" : "bg-transparent"
                            }`}
                          />
                          <span
                            className={`text-sm leading-none ${
                              isAutoQuality ? "font-bold" : "font-semibold"
                            }`}
                          >
                            Automático
                          </span>
                        </span>
                        <span
                          className={`text-base font-semibold leading-none ${qualityColorClass}`}
                        >
                          {videoStates.resolution}
                        </span>
                      </button>

                      <div className="max-h-56 overflow-y-auto bg-black/90">
                        {qualityOptions.map((quality) => {
                          const isSelected = !isAutoQuality && quality.isActive;
                          const optionIndex = qualityOptions.findIndex(
                            (option) => option.id === quality.id
                          );
                          const isFocusedOption =
                            qualityFocusedIndex === optionIndex + 1;

                          return (
                            <button
                              key={quality.id}
                              className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                                isFocusedOption
                                  ? "bg-white/14 text-white"
                                  : isSelected
                                  ? "bg-white/10 text-white"
                                  : "text-white/80 hover:bg-white/8"
                              }`}
                              onClick={() => selectQuality(quality.id)}
                              role="menuitem"
                            >
                              <span
                                className={`text-sm leading-none ${
                                  isSelected ? "font-bold" : "font-medium"
                                }`}
                              >
                                {quality.label}
                              </span>
                              <span className="text-xs text-white/35">
                                {quality.bitrateText}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              className={iconBtn}
              onClick={toggleFullscreen}
              tabIndex={0}
              aria-label={
                videoStates.fullscreen
                  ? "Salir pantalla completa"
                  : "Pantalla completa"
              }
            >
              {videoStates.fullscreen ? (
                <Minimize2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              ) : (
                <Maximize2
                  className="w-5 h-5 min-[865px]:w-6 min-[865px]:h-6"
                  strokeWidth={2}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;