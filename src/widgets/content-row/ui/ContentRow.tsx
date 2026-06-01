"use client";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "@/shared/ui/ContentCard";
import type { ContainerElement, Content } from "@/entities/content/model/types";
import { useContentRow } from "@/widgets/content-row/model/useContentRow";
import { useAdultProfile } from "@/shared/lib/AdultProfileContext";

interface Props {
  title: string;
  contentsList: ContainerElement[] | Content[];
  rowIndex: number;
  onRowFocus?: (rowIndex: number) => void;
  totalRows?: number;
}

export function ContentRow({
  title,
  contentsList,
  rowIndex,
  onRowFocus,
  totalRows = 1,
}: Props) {
  const adultProfile = useAdultProfile();
  const visibleList = useMemo(() => {
    if (adultProfile) return contentsList;
    return contentsList.filter((element) => {
      const age = "content" in element ? element.content.age : (element as Content).age;
      return age <= 15;
    });
  }, [contentsList, adultProfile]);

  const {
    scrollContainerRef,
    focusedIndex,
    setFocusedIndex,
    handleCardKeyDown,
    handleCardActivate,
    scroll,
  } = useContentRow({
    rowIndex,
    totalRows,
    contentLength: visibleList.length,
  });

  if (!visibleList || visibleList.length === 0) return null;

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
          {visibleList.map((element, index) => (
            <div
              key={element.id}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
            >
              <ContentCard
                content={
                  typeof element === "object" &&
                  element !== null &&
                  "content" in element
                    ? element.content
                    : element
                }
                index={index}
                rowIndex={rowIndex}
                isFocused={focusedIndex === index}
                href={`/content/${
                  (
                    typeof element === "object" &&
                    element !== null &&
                    "content" in element
                      ? element.content
                      : element
                  ).id
                }`}
                onFocus={() => {
                  setFocusedIndex(index);
                  onRowFocus?.(rowIndex);
                }}
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
