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
  timeLabel?: string;
  progressPercent?: number;
}

export function ContentCardTV({
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
      className="relative shrink-0 cursor-pointer block
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
        className={`relative overflow-hidden rounded aspect-2/3 bg-white/5 ${
          isFocused ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black" : ""
        }`}
      >
        <Image
          src={GetTmdbImage(content.cover, 500)}
          alt={content.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 256px, 288px"
          priority={rowIndex === 0 && index === 0}
          className="object-cover"
          draggable={false}
        />

        {/* Dark overlay on TV focus */}
        <div
          className={`absolute inset-0 ${isFocused ? "bg-black/40" : "bg-black/0"}`}
        />

        {/* Play button on TV focus */}
        {isFocused && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="size-4 sm:size-5 fill-black text-black ml-0.5" />
            </div>
          </div>
        )}

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

      {/* Title */}
      <p className={`mt-2 text-sm truncate ${isFocused ? "text-white font-semibold" : "text-gray-300"}`}>
        {content.title}
      </p>
    </Link>
  );
}
