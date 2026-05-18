import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/entities/content/model/types";

interface UseHeroSectionParams {
  content: Content;
}

export function useHeroSection({ content }: UseHeroSectionParams) {
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();

  const toggleMuted = () => setIsMuted((prev) => !prev);

  const focusFirstCard = () => {
    const cwCard = document.querySelector("[data-row='-1'][data-col='0']") as HTMLElement;
    if (cwCard) {
      cwCard.focus({ preventScroll: false });
      cwCard.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const firstCard = document.querySelector(
      "[data-row='0'][data-col='0']"
    ) as HTMLElement;
    firstCard?.focus({ preventScroll: false });
    firstCard?.scrollIntoView({ behavior: "smooth", block: "center" });
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
