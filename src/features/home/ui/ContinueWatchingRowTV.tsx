"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getToken, getMainProfile } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";
import { ContentCardTV } from "@/shared/ui/ContentCardTV";
import type { MiniContent } from "@/entities/content/model/types";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";

/** Row index reserved for Continue Watching – used by useContentRow ArrowUp */
const CW_ROW_INDEX = -1;

type CWContent = {
  id: string;
  title: string;
  cover: string;
  age: number;
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

export function ContinueWatchingRowTV({ onLoaded }: { onLoaded?: () => void }) {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const {
    scrollContainerRef,
    focusedIndex,
    setFocusedIndex,
    handleCardKeyDown,
    scroll,
  } = useContentRow({
    rowIndex: CW_ROW_INDEX,
    totalRows: 1,
    contentLength: items.length,
  });

  useEffect(() => {
    const token = getToken();
    const profile = getMainProfile();
    if (!token || !profile) {
      setLoaded(true);
      onLoaded?.();
      return;
    }
    fetch(`${API_HOST_IP}/profiles/${profile.id}/continue-watching`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ContinueWatchingItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => { setLoaded(true); onLoaded?.(); });
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
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
                     bg-black/50 flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4
                     sm:gap-4 sm:px-8 md:px-12
                     scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => {
            const content: MiniContent = {
              id: item.content?.id ?? "",
              cover: item.content?.cover ?? "",
              title: getTitle(item),
              trailer: "",
              age: item.content?.age ?? 0,
            };
            return (
              <div
                key={item.id}
                onKeyDown={(e) => handleCardKeyDown(e, index)}
              >
                <ContentCardTV
                  content={content}
                  index={index}
                  rowIndex={CW_ROW_INDEX}
                  isFocused={focusedIndex === index}
                  href={buildPlayerHref(item)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                  timeLabel={fmtTime(item.time)}
                  progressPercent={Math.min((item.time / (item.time + 60)) * 100, 95)}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          tabIndex={-1}
          aria-hidden
          className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12
                     bg-black/50 flex items-center justify-center
                     hover:bg-black/70 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}
