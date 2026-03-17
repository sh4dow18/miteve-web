"use client";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCard } from "./ContentCard";

interface ContentRowProps {
  title: string;
  contentsList: ContainerElement[];
  rowIndex: number;
}

export function ContentRow({ title, contentsList, rowIndex }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  useEffect(() => {
    const firstCard = scrollContainerRef.current?.querySelector(
      "[data-content-card]"
    ) as HTMLElement;

    firstCard?.focus();
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;

      const activeElement = document.activeElement;
      const isCardFocused = activeElement?.hasAttribute("data-content-card");

      if (!isCardFocused) return;

      const cardWidth = 280 + 16; // card width + gap

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (focusedIndex < contentsList.length - 1) {
          const newIndex = focusedIndex + 1;
          setFocusedIndex(newIndex);
          scrollContainerRef.current.scrollTo({
            left: newIndex * cardWidth,
            behavior: "smooth",
          });
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (focusedIndex > 0) {
          const newIndex = focusedIndex - 1;
          setFocusedIndex(newIndex);
          scrollContainerRef.current.scrollTo({
            left: newIndex * cardWidth,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, contentsList.length]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 1200;
    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (!contentsList || contentsList.length === 0) return null;

  return (
    <div className="mb-12 group/row">
      <h2 className="text-2xl font-semibold mb-4 px-12">{title}</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          tabIndex={-1}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-12 pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {contentsList.map((element, index) => (
            <ContentCard
              key={element.id}
              content={element.content}
              index={index}
              rowIndex={rowIndex}
              onFocus={() => setFocusedIndex(index)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          tabIndex={-1}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
