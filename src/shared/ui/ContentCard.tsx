"use client";

import { motion } from "framer-motion";
import { GetTmdbImage } from "@/shared/api/tmdb";
import Image from "next/image";
import type { MiniContent } from "@/entities/content/model/types";

interface Props {
  content: MiniContent;
  index: number;
  rowIndex: number;
  isFocused: boolean;
  onActivate: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ContentCard({
  content,
  index,
  rowIndex,
  isFocused,
  onActivate,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer
                 w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72
                 outline-none"
      onClick={onActivate}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={content.title}
      data-content-card
      data-row={rowIndex}
      data-col={index}
    >
      <motion.div
        className={`relative rounded overflow-hidden transition-shadow duration-300 ${
          isFocused ? "ring-4 ring-white shadow-2xl" : "ring-0"
        }`}
        animate={{ scale: isFocused ? 1.08 : 1, zIndex: isFocused ? 10 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full aspect-2/3">
          <Image
            src={GetTmdbImage(content.cover, 500)}
            alt={content.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 240px, (max-width: 1280px) 256px, 288px"
            className="object-cover"
            draggable={false}
          />
        </div>

        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent
                     flex flex-col justify-end p-3"
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-sm font-semibold line-clamp-2 md:text-base md:mb-1">
            {content.title}
          </h3>
        </motion.div>
      </motion.div>
    </div>
  );
}
