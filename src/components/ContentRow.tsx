"use client";
import { useRef, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "./ContentCard";

interface ContentRowProps {
  title: string;
  contentsList: ContainerElement[];
  rowIndex: number;
  // Permite al padre saber qué row tiene foco para manejar ArrowUp/Down
  onRowFocus?: (rowIndex: number) => void;
  totalRows?: number;
}

export function ContentRow({
  title,
  contentsList,
  rowIndex,
  onRowFocus,
  totalRows = 1,
}: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Enfoca la card en el índice dado y hace scroll para que sea visible
  const focusCard = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const card = container.querySelector(
        `[data-row="${rowIndex}"][data-col="${index}"]`
      ) as HTMLElement;

      if (!card) return;

      card.focus({ preventScroll: true });

      // Scroll para centrar la card enfocada
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset =
        cardRect.left -
        containerRect.left -
        containerRect.width / 2 +
        cardRect.width / 2;

      container.scrollBy({ left: offset, behavior: "smooth" });
    },
    [rowIndex]
  );

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          if (index < contentsList.length - 1) {
            setFocusedIndex(index + 1);
            focusCard(index + 1);
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          e.stopPropagation();
          if (index > 0) {
            setFocusedIndex(index - 1);
            focusCard(index - 1);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          // Delega la navegación vertical al padre / navegación nativa
          // Busca el mismo índice (o el más cercano) en el siguiente row
          if (rowIndex < totalRows - 1) {
            const nextRowCard = document.querySelector(
              `[data-row="${rowIndex + 1}"][data-col="${focusedIndex}"]`
            ) as HTMLElement;
            // Si no existe esa columna, coge la última del siguiente row
            const fallback = document.querySelector(
              `[data-row="${rowIndex + 1}"]`
            ) as HTMLElement;
            (nextRowCard || fallback)?.focus({ preventScroll: false });
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          if (rowIndex > 0) {
            const prevRowCard = document.querySelector(
              `[data-row="${rowIndex - 1}"][data-col="${focusedIndex}"]`
            ) as HTMLElement;
            const fallback = document.querySelector(
              `[data-row="${rowIndex - 1}"]`
            ) as HTMLElement;
            (prevRowCard || fallback)?.focus({ preventScroll: false });
          }
          break;
      }
    },
    [contentsList.length, focusCard, focusedIndex, rowIndex, totalRows]
  );

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -900 : 900,
      behavior: "smooth",
    });
  };

  if (!contentsList || contentsList.length === 0) return null;

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
        {/* Left arrow — oculto en TV (navegan con D-pad) */}
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

        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4
                     sm:gap-4 sm:px-8
                     md:px-12
                     scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {contentsList.map((element, index) => (
            // Wrapper que captura las teclas antes de que lleguen al window
            <div
              key={element.id}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
            >
              <ContentCard
                content={element.content}
                index={index}
                rowIndex={rowIndex}
                onFocus={() => {
                  setFocusedIndex(index);
                  onRowFocus?.(rowIndex);
                }}
              />
            </div>
          ))}
        </div>

        {/* Right arrow */}
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
