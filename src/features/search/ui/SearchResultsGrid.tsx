"use client";

import { useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
          className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
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
            <div className="overflow-hidden rounded-xl bg-gray-900/60">
              <div className="relative aspect-2/3 w-full">
                <Image
                  src={GetTmdbImage(content.cover, 500)}
                  alt={content.title}
                  fill
                  loading={index < 5 ? "eager" : "lazy"}
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  draggable={false}
                />
              </div>
            </div>

            <h3 className="mt-2 line-clamp-1 text-base font-semibold text-white">
              {content.title}
            </h3>

            <p className="mt-1 text-sm text-gray-300">{content.year}</p>
          </motion.article>
        </Link>
      ))}
    </motion.div>
  );
}
