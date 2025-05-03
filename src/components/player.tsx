// Set this component as a client component
"use client";
// Player Requirements
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// Player Props
interface Props {
  id: string;
  name: string;
  series?: {
    season: string;
    episode: string;
    nextEpisode: number;
  };
}
// Player Main Function
function Player({ id, name, series }: Props) {
  // Player Main Constants
  const TYPE = series === undefined ? "movies" : "series";
  const ICONS_STYLE =
    "w-12 h-12 fill-gray-300 transition-all cursor-pointer hover:scale-125 hover:fill-white";
  // Player Main Hooks
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoStates, SetVideoStates] = useState({
    paused: true,
    muted: false,
    fullscreen: false,
  });
  // Execute this use effect when the page is loading to know if can autoplay or not
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    const TryAutoplay = () => {
      const PLAY = VIDEO.play();
      if (PLAY !== undefined) {
        PLAY.then(() =>
          SetVideoStates({
            ...videoStates,
            paused: false,
          })
        ).catch(() =>
          SetVideoStates({
            ...videoStates,
            paused: true,
          })
        );
      }
    };
    VIDEO.addEventListener("canplay", TryAutoplay);
    return () => {
      VIDEO.removeEventListener("canplay", TryAutoplay);
    };
  }, []);
  // Functions that allows to play and pause the video
  const PlayAndPause = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (VIDEO.paused) {
      VIDEO.play();
      SetVideoStates({
        ...videoStates,
        paused: false,
      });
      return;
    }
    VIDEO.pause();
    SetVideoStates({
      ...videoStates,
      paused: true,
    });
  };
  // Functions that allows to mute and unmute the video
  const VolumeAndMute = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    const NEW_STATE = !VIDEO.muted;
    VIDEO.muted = NEW_STATE;
    SetVideoStates({
      ...videoStates,
      muted: NEW_STATE,
    });
  };
  // Functions that allows to set fullscreen the video and controllers
  const Fullscreen = () => {
    const CONTAINER = containerRef.current;
    if (CONTAINER === null) {
      return;
    }
    if (!document.fullscreenElement) {
      CONTAINER.requestFullscreen();
      SetVideoStates({
        ...videoStates,
        fullscreen: true,
      });
      return;
    }
    document.exitFullscreen();
    SetVideoStates({
      ...videoStates,
      fullscreen: false,
    });
  };
  // Returns Player Component
  return (
    // Player Page Main Container
    <div ref={containerRef} className="h-full w-full relative">
      {/* Content Video */}
      <video
        ref={videoRef}
        className="h-full w-full -z-10"
        src={`/videos/${TYPE}/${id}${
          TYPE === "movies"
            ? `.webm`
            : `/Temporada ${series?.season}/Episodio ${series?.episode}.webm`
        }`}
        autoPlay
        playsInline
      />
      {/* Player Controlers Container */}
      <div className="absolute bottom-0 w-full">
        {/* Player Controlers Second Container */}
        <div className="flex place-content-between items-center py-4 px-5 bg-black">
          {/* Player First Controlers Container */}
          <div className="flex gap-7">
            <PauseIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PlayAndPause}
              aria-disabled={videoStates.paused}
            />
            <PlayIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PlayAndPause}
              aria-disabled={!videoStates.paused}
            />
            <SpeakerWaveIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={VolumeAndMute}
              aria-disabled={videoStates.muted}
            />
            <SpeakerXMarkIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={VolumeAndMute}
              aria-disabled={!videoStates.muted}
            />
          </div>
          {/* Player Content Title */}
          <h1 className="text-xl text-gray-300">{name}</h1>
          {/* Player Second Controlers Container */}
          <div className="flex gap-7">
            <Link href="#">
              <BackwardIcon
                className={`${ICONS_STYLE} aria-disabled:hidden`}
                aria-disabled={true}
              />
            </Link>
            <Link
              href={`player?type=series&id=${id}&season=${
                series?.nextEpisode === 1 && series.season
                  ? Number.parseInt(series.season) + 1
                  : series?.season
              }&episode=${series?.nextEpisode}`}
            >
              <ForwardIcon
                className={`${ICONS_STYLE} aria-disabled:hidden`}
                aria-disabled={!series?.nextEpisode}
              />
            </Link>
            <ArrowsPointingOutIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={Fullscreen}
              aria-disabled={videoStates.fullscreen}
            />
            <ArrowsPointingInIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={Fullscreen}
              aria-disabled={!videoStates.fullscreen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
