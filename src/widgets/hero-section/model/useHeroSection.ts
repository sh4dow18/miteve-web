import { useEffect, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { HOME_TOTAL_ROWS } from "@/features/home/config/home.constants";
import type { Content } from "@/entities/content/model/types";

interface UseHeroSectionParams {
  content: Content;
}

export function useHeroSection({ content }: UseHeroSectionParams) {
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const playBtn = document.querySelector(
        "[data-hero-btn]"
      ) as HTMLElement;
      playBtn?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMuted = () => setIsMuted((prev) => !prev);

  const focusFirstCard = () => {
    const cwCard = document.querySelector("[data-row='-1'][data-col='0']") as HTMLElement;
    if (cwCard) {
      cwCard.focus({ preventScroll: false });
      cwCard.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    for (let r = 0; r < HOME_TOTAL_ROWS; r++) {
      const card = document.querySelector(
        `[data-row="${r}"][data-col="0"]`
      ) as HTMLElement | null;
      if (card) {
        card.focus({ preventScroll: false });
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  };

  const handleHeroBtnKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstCard();
    }
  };

  const playContent = () => {
    if (content.comingSoon) return;

    if (content.type !== "movie" && content.seasonsList.length > 0) {
      router.push(
        `/player/${content.id}?season=${content.seasonsList[0].seasonNumber}&episode=${content.seasonsList[0].episodesList[0].episodeNumber}`
      );
      return;
    }

    router.push(`/player/${content.id}`);
  };

  return {
    isMuted,
    toggleMuted,
    handleHeroBtnKeyDown,
    playContent,
  };
}
