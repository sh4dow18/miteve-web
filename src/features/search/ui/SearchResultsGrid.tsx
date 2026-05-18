"use client";

import { useCallback, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import type { Content } from "@/entities/content/model/types";

interface Props {
  results: Content[];
  onMoveUpFromFirstRow?: () => void;
}

function getColumnsCount() {
  if (typeof window === "undefined") {
    return 2;
  }

  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 3;
  return 2;
}

export function SearchResultsGrid({ results, onMoveUpFromFirstRow }: Props) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const cardTransitionDelay = (index: number) => Math.min(index, 7) * 0.025;

  const focusCard = useCallback((index: number) => {
    const card = document.querySelector(
      `[data-search-card="${index}"]`
    ) as HTMLElement | null;

    if (!card) {
      return;
    }

    card.focus({ preventScroll: false });
    card.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  const handleCardKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) => {
      const columns = getColumnsCount();
      const lastIndex = results.length - 1;

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          const nextIndex = Math.min(index + 1, lastIndex);
          focusCard(nextIndex);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const prevIndex = Math.max(index - 1, 0);
          focusCard(prevIndex);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const downIndex = Math.min(index + columns, lastIndex);
          focusCard(downIndex);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const upIndex = index - columns;
          if (upIndex >= 0) {
            focusCard(upIndex);
            return;
          }
          onMoveUpFromFirstRow?.();
          break;
        }
      }
    },
    [focusCard, onMoveUpFromFirstRow, results.length]
  );

  if (results.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {results.map((content, index) => (
        <Link
          key={content.id}
          href={`/content/${content.id}`}
          data-search-card={index}
          onKeyDown={(event) => handleCardKeyDown(event, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          className="group/card outline-none"
        >
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
              delay: cardTransitionDelay(index),
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <div
              className={`relative overflow-hidden rounded-xl bg-gray-900/60 aspect-2/3 transition-shadow duration-200 ${
                focusedIndex === index ? "ring-2 ring-white/90 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.18)]" : ""
              }`}
            >
              <Image
                src={GetTmdbImage(content.cover, 500)}
                alt={content.title}
                fill
                loading={index < 5 ? "eager" : "lazy"}
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                className={`object-cover transition-transform duration-300 group-hover/card:scale-105 ${
                  focusedIndex === index ? "scale-105" : ""
                }`}
                draggable={false}
              />

              {/* Dark overlay on hover / TV focus */}
              <div
                className={`absolute inset-0 transition-colors duration-300 group-hover/card:bg-black/40 ${
                  focusedIndex === index ? "bg-black/40" : "bg-black/0"
                }`}
              />

              {/* Play button on hover / TV focus */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/card:opacity-100 ${
                  focusedIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="size-4 sm:size-5 fill-black text-black ml-0.5" />
                </div>
              </div>
            </div>

            <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-gray-300 group-hover/card:text-white transition-colors duration-200">
              {content.title}
            </h3>

            <p className="mt-0.5 text-xs text-gray-400">{content.year}</p>
          </motion.article>
        </Link>
      ))}
    </motion.div>
  );
}
