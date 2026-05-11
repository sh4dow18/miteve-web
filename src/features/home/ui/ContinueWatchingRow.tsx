"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";
import { getToken, getMainProfile } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";
import { GetTmdbImage } from "@/shared/api/tmdb";

type CWContent = {
  id: string;
  title: string;
  cover: string;
};

type CWEpisode = {
  id: string;
  title: string;
  episodeNumber: number;
  beginSummary: number | null;
  endSummary: number | null;
  beginIntro: number | null;
  endIntro: number | null;
  beginCredits: number | null;
};

function getSeasonFromEpisodeId(episodeId: string): number {
  const parts = episodeId.split("-");
  return Number(parts[parts.length - 2]) || 1;
}

type ContinueWatchingItem = {
  id: string;
  time: number;
  content?: CWContent;
  episode?: CWEpisode;
};

// For TV shows, the backend also returns `content` alongside `episode`
function buildPlayerHref(item: ContinueWatchingItem): string {
  const t = Math.floor(item.time);
  if (item.episode && item.content) {
    const season = getSeasonFromEpisodeId(item.episode.id);
    return `/player/${item.content.id}?season=${season}&episode=${item.episode.episodeNumber}&time=${t}`;
  }
  if (item.content) {
    return `/player/${item.content.id}?time=${t}`;
  }
  return "/home";
}

function getCover(item: ContinueWatchingItem): string {
  const raw = item.content?.cover ?? "";
  return raw ? GetTmdbImage(raw, 342) : "";
}

function getTitle(item: ContinueWatchingItem): string {
  if (item.episode && item.content) {
    const season = getSeasonFromEpisodeId(item.episode.id);
    return `${item.content.title} — T${season}:E${item.episode.episodeNumber}`;
  }
  return item.content?.title ?? "";
}

function fmtTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function ContinueWatchingRow() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = getToken();
    const profile = getMainProfile();
    if (!token || !profile) {
      setLoaded(true);
      return;
    }

    fetch(`${API_HOST_IP}/profiles/${profile.id}/continue-watching`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ContinueWatchingItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (!loaded || items.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row">
      <h2
        className="text-lg font-semibold mb-3 px-4
                   sm:text-xl sm:px-8
                   md:text-2xl md:mb-4 md:px-12"
      >
        Continúa viendo
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          tabIndex={-1}
          aria-hidden
          className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12
                     bg-black/50 opacity-0 group-hover/row:opacity-100
                     transition-opacity flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4
                     sm:gap-4 sm:px-8 md:px-12
                     scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const href = buildPlayerHref(item);
            const cover = getCover(item);
            const title = getTitle(item);
            const timeLabel = fmtTime(item.time);

            return (
              <Link
                key={item.id}
                href={href}
                className="group/card relative shrink-0 cursor-pointer outline-none
                           w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72"
              >
                {/* Cover */}
                <div className="relative overflow-hidden rounded aspect-2/3 bg-white/5">
                  {cover && (
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 176px,(max-width: 768px) 208px,288px"
                      className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    />
                  )}

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/40 transition-colors duration-300" />

                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <Play className="size-5 fill-black text-black ml-0.5" />
                    </div>
                  </div>

                  {/* Progress bar overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-[#e50914]"
                      style={{ width: `${Math.min((item.time / (item.time + 60)) * 100, 95)}%` }}
                    />
                  </div>

                  {/* Time badge */}
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {timeLabel}
                  </div>
                </div>

                {/* Title */}
                <p className="mt-2 text-xs font-medium text-gray-300 line-clamp-2 group-hover/card:text-white transition-colors duration-200">
                  {title}
                </p>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          tabIndex={-1}
          aria-hidden
          className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12
                     bg-black/50 opacity-0 group-hover/row:opacity-100
                     transition-opacity flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}
