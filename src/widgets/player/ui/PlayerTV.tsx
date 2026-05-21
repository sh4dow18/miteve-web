"use client";

import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Clapperboard,
  FastForward,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
} from "lucide-react";
import Link from "next/link";
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

// ─── TV PLAYER ────────────────────────────────────────────────────────────────
// Stripped-down, large-target UI optimised for Android TV remote navigation.
// • No volume controls (TV handles audio natively)
// • No PiP / fullscreen toggle (TV is always fullscreen)
// • Minimal animations to reduce GPU load on low-end TVs
// • Large hit-targets and high-contrast focus rings
// ──────────────────────────────────────────────────────────────────────────────

function PlayerTV({ content, player, tvShow }: Props) {
  const {
    videoRef,
    containerRef,
    controlsRef,
    videoStates,
    rangeStates,
    seekPreviewPercent,
    qualityMenuRef,
    qualityButtonRef,
    playButtonRef,
    seekbarRef,
    backButtonRef,
    qualityFocusedIndex,
    qualityMenuOpen,
    isAutoQuality,
    qualityOptions,
    hasSubtitles,
    skips,
    togglePlay,
    toggleSubtitles,
    seek,
    onSeekBar,
    onSeekBarTrackClick,
    handleTVNav,
    handleDpadNav,
    onToggleQualityMenu,
    selectAutoQuality,
    selectQuality,
    navigateToNextEpisode,
    skip,
    fmt,
  } = player;

  // ── Derived values ──────────────────────────────────────────────────────────
  const isSeekPreview = seekPreviewPercent !== null;
  const displayedProgress = isSeekPreview
    ? seekPreviewPercent!
    : videoStates.progress;

  const resolutionColor: Record<string, string> = {
    FHD: "text-blue-400 border-blue-400/40",
    SD: "text-amber-400 border-amber-400/40",
  };
  const resColor = resolutionColor[videoStates.resolution] ?? "text-white/60 border-white/15";

  // ── Shared class for TV icon buttons (large, focus-visible ring) ────────────
  const tvBtn =
    "cursor-pointer p-3 rounded-xl transition-colors duration-100 text-white/70 " +
    "hover:text-white hover:bg-white/10 active:scale-95 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

  return (
    <div
      ref={containerRef}
      id="video-container"
      onKeyDown={handleDpadNav}
      className={`relative min-h-screen w-full bg-black overflow-hidden select-none ${
        videoStates.controlsHidden ? "cursor-none" : "cursor-default"
      }`}
    >
      {/* ── VIDEO ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain z-0"
        playsInline
        data-focusable
        onClick={togglePlay}
      />

      {/* ── LOADING SPINNER ── */}
      {videoStates.waiting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-14 w-14 text-white/60 animate-spin" strokeWidth={1.5} />
        </div>
      )}

      {/* ── SKIP BUTTONS — inside tab flow, positioned above controls ── */}
      {/* Rendered inside the controls visibility zone so they show/hide with controls */}

      {/* ══════════════════════════════════════════════════════════════════════
          TOP HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden={videoStates.controlsHidden}
        className={`absolute top-0 inset-x-0 z-20
          bg-linear-to-b from-black/85 via-black/30 to-transparent
          px-10 pt-8 pb-24
          transition-opacity duration-300
          ${videoStates.controlsHidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex items-start justify-between">
          {/* Back arrow */}
          <Link
            ref={backButtonRef}
            href={`/content/${content.id}${tvShow ? `?season=${tvShow.season}` : ""}`}
            data-focusable
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg p-1"
          >
            <ArrowLeft className="w-8 h-8 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
          </Link>

          {/* Title + resolution badge */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 bg-black/50 border text-sm font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${resColor}`}>
              <Clapperboard className="w-4 h-4" strokeWidth={2} />
              {videoStates.resolution}
            </div>
            <div className="text-right">
              <h1 className="text-white font-semibold text-2xl leading-tight">
                {content.title}
              </h1>
              {tvShow && (
                <span className="italic text-gray-300 text-base">
                  {`T${tvShow.season}E${tvShow.episode.episodeNumber} «${tvShow.episode.title}»`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SKIP BUTTONS — always visible regardless of controls state ── */}
      <div className="absolute right-10 bottom-44 z-30 flex justify-end">
        {skips.intro && (
          <button
            onClick={skip}
            tabIndex={0}
            data-focusable
            autoFocus
            className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg text-base font-bold tracking-wide transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Omitir Intro
          </button>
        )}
        {skips.summary && (
          <button
            onClick={skip}
            tabIndex={0}
            data-focusable
            autoFocus
            className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg text-base font-bold tracking-wide transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Omitir Resumen
          </button>
        )}
        {skips.credits && tvShow?.nextEpisode && (
          <button
            onClick={navigateToNextEpisode}
            tabIndex={0}
            data-focusable
            autoFocus
            className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg text-base font-bold tracking-wide transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Siguiente Episodio
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CONTROLS
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={controlsRef}
        aria-hidden={videoStates.controlsHidden}
        className={`absolute bottom-0 inset-x-0 z-20
          bg-linear-to-t from-black/95 via-black/60 to-transparent
          px-10 pb-8 pt-24
          transition-opacity duration-300
          ${videoStates.controlsHidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >

        {/* ── SEEKBAR — fixed-height wrapper so preview bubble never shifts layout ── */}
        <div
          className="relative w-full mb-6 rounded-lg focus-within:ring-2 focus-within:ring-white/80 focus-within:ring-offset-2 focus-within:ring-offset-black transition-shadow duration-150"
          style={{ height: "40px" }}
        >
          {/* Time preview bubble — absolutely positioned above thumb, never shifts layout */}
          {isSeekPreview && (
            <div
              className="absolute bottom-full mb-3 -translate-x-1/2 flex items-center gap-2
                bg-black/85 border border-white/20 px-3 py-1.5 rounded-xl
                text-white text-base font-semibold tabular-nums whitespace-nowrap pointer-events-none"
              style={{ left: `${displayedProgress}%` }}
            >
              <Play className="w-3.5 h-3.5 shrink-0" fill="currentColor" strokeWidth={0} />
              {fmt(rangeStates.hoverTime)}
            </div>
          )}

          {/* Track background */}
          <div className="absolute top-1/2 inset-x-0 h-1.5 -translate-y-1/2 rounded-full bg-white/15" />
          {/* Buffered */}
          <div
            className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-white/25 transition-[width] duration-300"
            style={{ width: `${rangeStates.buffered}%` }}
          />
          {/* Played */}
          <div
            className={`absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full transition-[width] duration-100 ${
              isSeekPreview ? "bg-white" : "bg-[#e50914]"
            }`}
            style={{ width: `${displayedProgress}%` }}
          />
          {/* Thumb — always visible on TV */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white shadow-xl border-2 border-white/80 transition-[left] duration-100"
            style={{ left: `${displayedProgress}%` }}
          />
          {/* Hidden range input for remote control */}
          <input
            ref={seekbarRef}
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={!Number.isNaN(displayedProgress) ? displayedProgress : 0}
            onChange={onSeekBar}
            onClick={onSeekBarTrackClick}
            onKeyDown={handleTVNav}
            data-focusable
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Progreso de reproducción"
          />
        </div>

        {/* ── BUTTON ROW ── */}
        <div className="flex items-center justify-between">

          {/* Left — Play / Seek */}
          <div className="flex items-center gap-2">
            <button
              ref={playButtonRef}
              className={tvBtn}
              onClick={togglePlay}
              data-focusable
              tabIndex={0}
              aria-label={videoStates.paused ? "Play" : "Pause"}
            >
              {videoStates.paused ? (
                <Play className="w-10 h-10" fill="currentColor" strokeWidth={0} />
              ) : (
                <Pause className="w-10 h-10" fill="currentColor" strokeWidth={0} />
              )}
            </button>

            <button
              className={`${tvBtn} flex items-center gap-2`}
              onClick={() => seek(-10)}
              tabIndex={0}
              aria-label="Retroceder 10 segundos"
            >
              <RotateCcw className="w-7 h-7" strokeWidth={2} />
              <span className="text-base font-medium">-10s</span>
            </button>

            <button
              className={`${tvBtn} flex items-center gap-2`}
              onClick={() => seek(10)}
              tabIndex={0}
              aria-label="Adelantar 10 segundos"
            >
              <RotateCw className="w-7 h-7" strokeWidth={2} />
              <span className="text-base font-medium">+10s</span>
            </button>
          </div>

          {/* Center — timestamps */}
          <div className="flex items-center gap-2 tabular-nums text-base select-none">
            <span className="text-white font-semibold text-xl">{videoStates.currentTime}</span>
            <span className="text-white/30 text-lg">/</span>
            <span className="text-white/50">{videoStates.duration}</span>
          </div>

          {/* Right — Next Episode / Subtitles / Quality */}
          <div className="flex items-center gap-2">
            {tvShow?.nextEpisode && (
              <button
                className={tvBtn}
                onClick={navigateToNextEpisode}
                tabIndex={0}
                aria-label="Siguiente Episodio"
              >
                <FastForward className="w-7 h-7" strokeWidth={2} />
              </button>
            )}

            {hasSubtitles && (
              <button
                className={`${tvBtn} ${videoStates.subtitlesOn ? "text-white" : "text-white/40"}`}
                onClick={toggleSubtitles}
                tabIndex={0}
                aria-label={videoStates.subtitlesOn ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              >
                {videoStates.subtitlesOn ? (
                  <Captions className="w-7 h-7" strokeWidth={2} />
                ) : (
                  <CaptionsOff className="w-7 h-7" strokeWidth={2} />
                )}
              </button>
            )}

            {/* ── Quality menu ── */}
            {qualityOptions.length > 0 && (
              <div className="relative">
                <button
                  ref={qualityButtonRef}
                  className={`${tvBtn} ${qualityMenuOpen ? "text-white bg-white/10" : ""}`}
                  onClick={onToggleQualityMenu}
                  tabIndex={0}
                  aria-label="Calidad de video"
                  aria-expanded={qualityMenuOpen}
                >
                  <Settings className="w-7 h-7" strokeWidth={2} />
                </button>

                {qualityMenuOpen && (
                  <div
                    ref={qualityMenuRef}
                    role="menu"
                    className="absolute right-0 bottom-full mb-4 w-72 bg-black/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-30"
                  >
                    {/* Header */}
                    <div className="px-5 pt-5 pb-4 border-b border-white/10">
                      <p className="text-xs tracking-widest font-semibold text-white/40 uppercase">
                        Calidad de video
                      </p>
                    </div>

                    {/* Auto */}
                    <button
                      className={`w-full px-5 py-4 text-left flex items-center justify-between transition-colors ${
                        qualityFocusedIndex === 0
                          ? "bg-white/14 text-white"
                          : isAutoQuality
                          ? "bg-white/10 text-white"
                          : "text-white/90 hover:bg-white/8"
                      }`}
                      onClick={selectAutoQuality}
                      role="menuitem"
                    >
                      <span className="flex items-center gap-3">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${isAutoQuality ? "bg-[#e50914]" : "bg-transparent border border-white/30"}`} />
                        <span className={`text-base ${isAutoQuality ? "font-bold" : "font-semibold"}`}>Automático</span>
                      </span>
                      <span className="text-sm text-white/50">{videoStates.resolution}</span>
                    </button>

                    {/* Options */}
                    <div className="max-h-56 overflow-y-auto">
                      {qualityOptions.map((quality, optionIndex) => {
                        const isSelected = !isAutoQuality && quality.isActive;
                        const isFocused = qualityFocusedIndex === optionIndex + 1;
                        return (
                          <button
                            key={quality.id}
                            className={`w-full px-5 py-4 text-left flex items-center justify-between transition-colors ${
                              isFocused
                                ? "bg-white/14 text-white"
                                : isSelected
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/8"
                            }`}
                            onClick={() => selectQuality(quality.id)}
                            role="menuitem"
                          >
                            <span className="flex items-center gap-3">
                              <span className={`inline-block h-2.5 w-2.5 rounded-full ${isSelected ? "bg-[#e50914]" : "bg-transparent border border-white/30"}`} />
                              <span className={`text-base ${isSelected ? "font-bold" : "font-medium"}`}>{quality.label}</span>
                            </span>
                            <span className="text-sm text-white/35">{quality.bitrateText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerTV;