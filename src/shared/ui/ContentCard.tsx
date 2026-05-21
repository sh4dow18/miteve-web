"use client";

import { GetTmdbImage } from "@/shared/api/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { MiniContent } from "@/entities/content/model/types";

interface Props {
  content: MiniContent;
  index: number;
  rowIndex: number;
  isFocused: boolean;
  href: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Optional time badge shown at the bottom-right of the image (e.g. Continue Watching) */
  timeLabel?: string;
  /** Optional red progress bar shown at the very bottom of the image (0-100) */
  progressPercent?: number;
}

export function ContentCard({
  content,
  index,
  rowIndex,
  isFocused,
  href,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  timeLabel,
  progressPercent,
}: Props) {
  return (
    <Link
      href={href}
      className="group/card relative shrink-0 cursor-pointer block
                 w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72
                 outline-none"
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={content.title}
      data-content-card
      data-row={rowIndex}
      data-col={index}
    >
      {/* Image container */}
      <div
        className={`relative overflow-hidden rounded aspect-2/3 bg-white/5 transition-shadow duration-200 ${
          isFocused ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.18)]" : ""
        }`}
      >
        <Image
          src={GetTmdbImage(content.cover, 500)}
          alt={content.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 256px, 288px"
          priority={rowIndex === 0 && index === 0}
          className={`object-cover transition-transform duration-300 group-hover/card:scale-105 ${
            isFocused ? "scale-105" : ""
          }`}
          draggable={false}
        />

        {/* Dark overlay on hover / TV focus */}
        <div
          className={`absolute inset-0 transition-colors duration-300 group-hover/card:bg-black/40 ${
            isFocused ? "bg-black/40" : "bg-black/0"
          }`}
        />

        {/* Play button on hover / TV focus */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/card:opacity-100 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="size-4 sm:size-5 fill-black text-black ml-0.5" />
          </div>
        </div>

        {/* Progress bar – shown only for Continue Watching */}
        {progressPercent !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-[#e50914]" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        {/* Time badge – shown only for Continue Watching */}
        {timeLabel && (
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {timeLabel}
          </div>
        )}
      </div>

      {/* Title always visible below the card */}
      <p className="mt-2 text-xs font-medium text-gray-300 line-clamp-2 group-hover/card:text-white transition-colors duration-200">
        {content.title}
      </p>
    </Link>
  );
}
