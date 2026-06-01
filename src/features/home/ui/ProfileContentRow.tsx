"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "@/shared/ui/ContentCard";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import { useProfileRow } from "@/features/home/model/useProfileRow";

type EndpointBuilder =
  | { type: "profile"; path: (profileId: string) => string }
  | { type: "public"; path: string };

interface Props {
  title: string;
  endpoint: EndpointBuilder;
  rowIndex: number;
  totalRows?: number;
  /** If true, the row is hidden when no profile is active in localStorage */
  requiresProfile?: boolean;
  onRowFocus?: (rowIndex: number) => void;
}

export function ProfileContentRow({
  title,
  endpoint,
  rowIndex,
  totalRows = 1,
  requiresProfile = false,
  onRowFocus,
}: Props) {
  const { items, ready } = useProfileRow(endpoint, requiresProfile);
  const {
    scrollContainerRef,
    focusedIndex,
    setFocusedIndex,
    handleCardKeyDown,
    scroll,
  } = useContentRow({ rowIndex, totalRows, contentLength: items.length });

  if (!ready || items.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row">
      <h2
        className="text-lg font-semibold mb-3 px-4
                   sm:text-xl sm:px-8
                   md:text-2xl md:mb-4 md:px-12"
      >
        {title}
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
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4
                     sm:gap-4 sm:px-8
                     md:px-12
                     scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <div key={item.id} onKeyDown={(e) => handleCardKeyDown(e, index)}>
              <ContentCard
                content={item}
                index={index}
                rowIndex={rowIndex}
                isFocused={focusedIndex === index}
                href={`/content/${item.id}`}
                onFocus={() => { setFocusedIndex(index); onRowFocus?.(rowIndex); }}
                onBlur={() => setFocusedIndex(-1)}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(-1)}
              />
            </div>
          ))}
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
