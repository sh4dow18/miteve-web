// Set this component as a client component
"use client";
// Player Requirements
import {
  ArrowsPointingOutIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/16/solid";
import { useRef, useState } from "react";
// Player Props
interface Props {
  content: string;
}
// Player Main Function
function Player({ content }: Props) {
  // Player Main Constants
  const ICONS_STYLE =
    "w-12 h-12 fill-gray-300 transition-all cursor-pointer hover:scale-125 hover:fill-white";
  // Player Main Hooks
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoPaused, SetVideoPaused] = useState(true);
  // Functions that allows to play and pause the video
  const PlayAndPause = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (VIDEO.paused) {
      VIDEO.play();
      SetVideoPaused(false);
      return;
    }
    VIDEO.pause();
    SetVideoPaused(true);
  };
  // Returns Player Component
  return (
    // Player Page Main Container
    <div className="h-full w-full relative">
      {/* Content Video */}
      <video
        ref={videoRef}
        className="h-full w-full -z-10"
        src={content}
        autoPlay
        playsInline
      />
      {/* Player Controlers Container */}
      <div className="absolute bottom-0 w-full">
        {/* Player Controlers Second Container */}
        <div className="flex place-content-between py-4 px-5 bg-black">
          {/* Player First Controlers Container */}
          <div className="flex gap-7">
            <PauseIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PlayAndPause}
              aria-disabled={videoPaused}
            />
            <PlayIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PlayAndPause}
              aria-disabled={!videoPaused}
            />
            <SpeakerWaveIcon className={ICONS_STYLE} />
          </div>
          {/* Player Second Controlers Container */}
          <div className="flex gap-7">
            <BackwardIcon className={ICONS_STYLE} />
            <ForwardIcon className={ICONS_STYLE} />
            <ArrowsPointingOutIcon className={ICONS_STYLE} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
