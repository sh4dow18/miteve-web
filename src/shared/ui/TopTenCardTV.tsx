"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import type { MiniContent } from "@/entities/content/model/types";

interface Props {
  content: MiniContent;
  rank: number;
  index: number;
  rowIndex: number;
  isFocused: boolean;
  href: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function TopTenCardTV({
  content,
  rank,
  index,
  rowIndex,
  isFocused,
  href,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  return (
    <div className="relative shrink-0 flex items-end" style={{ width: "clamp(16rem, 22vw, 22rem)" }}>
      {/* Big rank number */}
      <span
        aria-hidden
        className="absolute left-0 bottom-0 z-0 font-black leading-none select-none"
        style={{
          fontSize: "clamp(12rem, 20vw, 18rem)",
          WebkitTextStroke: "3px rgba(255,255,255,0.18)",
          color: "transparent",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {rank}
      </span>

      {/* Card */}
      <Link
        href={href}
        className="relative block outline-none ml-[38%]"
        style={{ width: "62%", flexShrink: 0 }}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={`${rank}. ${content.title}`}
        data-content-card
        data-row={rowIndex}
        data-col={index}
      >
        <div
          className={`relative overflow-hidden rounded aspect-[2/3] bg-white/5 transition-all duration-150 ${
            isFocused
              ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.18)]"
              : ""
          }`}
        >
          <Image
            src={GetTmdbImage(content.cover, 342)}
            alt={content.title}
            fill
            unoptimized
            className="object-cover"
            draggable={false}
          />

          <div
            className={`absolute inset-0 ${isFocused ? "bg-black/40" : "bg-black/0"}`}
          />

          {isFocused && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="size-4 fill-black text-black ml-0.5" />
              </div>
            </div>
          )}
        </div>

        <p
          className={`mt-2 text-xs truncate ${
            isFocused ? "text-white font-semibold" : "text-gray-300"
          }`}
        >
          {content.title}
        </p>
      </Link>
    </div>
  );
}
