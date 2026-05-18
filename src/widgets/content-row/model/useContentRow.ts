import { useRef, useCallback, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface UseContentRowParams {
  rowIndex: number;
  totalRows: number;
  contentLength: number;
}

export function useContentRow({
  rowIndex,
  totalRows,
  contentLength,
}: UseContentRowParams) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const focusCard = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Use data-content-card (present on every ContentCard Link) scoped to
      // this container instead of data-row/data-col to avoid issues with
      // negative attribute values in CSS selectors (e.g. rowIndex = -1).
      const cards = container.querySelectorAll(
        "[data-content-card]"
      ) as NodeListOf<HTMLElement>;
      const card = cards[index];

      if (!card) return;

      card.focus({ preventScroll: true });

      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset =
        cardRect.left -
        containerRect.left -
        containerRect.width / 2 +
        cardRect.width / 2;

      container.scrollBy({ left: offset, behavior: "smooth" });
    },
    [] // scrollContainerRef is a stable ref object
  );

  const handleCardKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          if (index < contentLength - 1) {
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
          } else {
            // First card → focus the sidebar nav button
            const navBtn = document.querySelector("[data-nav-btn]") as HTMLElement;
            navBtn?.focus({ preventScroll: false });
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          if (rowIndex < totalRows - 1) {
            const nextRowCard = document.querySelector(
              `[data-row="${rowIndex + 1}"][data-col="${focusedIndex}"]`
            ) as HTMLElement;
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
          } else if (rowIndex === 0) {
            const cwCard = document.querySelector("[data-row='-1'][data-col='0']") as HTMLElement;
            if (cwCard) {
              cwCard.focus({ preventScroll: false });
              cwCard.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              const heroBtn = document.querySelector("[data-hero-btn]") as HTMLElement;
              heroBtn?.focus({ preventScroll: false });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          } else {
            // rowIndex < 0 (ContinueWatching) → go directly to hero
            const heroBtn = document.querySelector("[data-hero-btn]") as HTMLElement;
            heroBtn?.focus({ preventScroll: false });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          break;
      }
    },
    [contentLength, focusCard, focusedIndex, rowIndex, totalRows]
  );

  const handleCardActivate = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -900 : 900,
      behavior: "smooth",
    });
  };

  return {
    scrollContainerRef,
    focusedIndex,
    setFocusedIndex,
    handleCardKeyDown,
    handleCardActivate,
    scroll,
  };
}
