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

export function TopTenCard({
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
    <div className="relative shrink-0 flex items-end" style={{ width: "clamp(14rem, 20vw, 20rem)" }}>
      {/* Big rank number */}
      <span
        aria-hidden
        className="absolute left-0 bottom-0 z-0 font-black leading-none select-none"
        style={{
          fontSize: "clamp(10rem, 18vw, 16rem)",
          WebkitTextStroke: "3px rgba(255,255,255,0.18)",
          color: "transparent",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {rank}
      </span>

      {/* Card — offset to the right so the number peeks out on the left */}
      <Link
        href={href}
        className="group/card relative block outline-none ml-[36%]"
        style={{ width: "64%", flexShrink: 0 }}
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
          className={`relative overflow-hidden rounded aspect-[2/3] bg-white/5 transition-shadow duration-200 ${
            isFocused
              ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.18)]"
              : ""
          }`}
        >
          <Image
            src={GetTmdbImage(content.cover, 342)}
            alt={content.title}
            fill
            unoptimized
            className={`object-cover transition-transform duration-300 group-hover/card:scale-105 ${
              isFocused ? "scale-105" : ""
            }`}
            draggable={false}
          />

          <div
            className={`absolute inset-0 transition-colors duration-300 group-hover/card:bg-black/40 ${
              isFocused ? "bg-black/40" : "bg-black/0"
            }`}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/card:opacity-100 ${
              isFocused ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="size-4 fill-black text-black ml-0.5" />
            </div>
          </div>
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
