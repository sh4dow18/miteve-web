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
  const [focusedIndex, setFocusedIndex] = useState(0);

  const focusCard = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const card = container.querySelector(
        `[data-row="${rowIndex}"][data-col="${index}"]`
      ) as HTMLElement;

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
    [rowIndex]
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
          } else {
            const heroBtn = document.querySelector("[data-hero-btn]") as HTMLElement;
            heroBtn?.focus({ preventScroll: false });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          e.stopPropagation();
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
