// Set this component as a client component
"use client";
// Player Requirements
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
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
  description: string;
  series?: {
    season: string;
    episode: string;
    nextEpisode: number;
  };
}
// Player Main Function
function Player({ id, name, description, series }: Props) {
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
    controlersHidden: false,
    currentTime: "00:00:00",
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
  // Execute this use effect when the video is paused to hide or display the controllers
  useEffect(() => {
    if (videoStates.paused === false) {
      const timer = setTimeout(() => {
        SetVideoStates({
          ...videoStates,
          controlersHidden: true,
        });
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    } else {
      SetVideoStates({
        ...videoStates,
        controlersHidden: false,
      });
    }
  }, [videoStates.paused === false]);
  // Execute this use effect to hide or display the controllers
  useEffect(() => {
    const CONTAINER = containerRef.current;
    if (CONTAINER === null) {
      return;
    }
    let timeout: NodeJS.Timeout;
    const MouseMove = () => {
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        controlersHidden: false,
      }));
      clearTimeout(timeout);
      if (videoStates.paused === false) {
        timeout = setTimeout(
          () =>
            SetVideoStates((prevVideoStates) => ({
              ...prevVideoStates,
              controlersHidden: true,
            })),
          5000
        );
      }
    };
    CONTAINER.addEventListener("mousemove", MouseMove);
    return () => {
      CONTAINER.removeEventListener("mousemove", MouseMove);
      clearTimeout(timeout);
    };
  }, [videoStates.paused === false]);
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
      controlersHidden: false,
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
  // Function that allows to Add Time to the Video
  const AddTime = (seconds: number) => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    VIDEO.currentTime = Math.min(
      Math.max(0, VIDEO.currentTime + seconds),
      VIDEO.duration
    );
  };
  // Function that allows to Format Current and Duration Times from Video
  const FormatTime = (time: number): string => {
    const HOURS = Math.floor(time / 3600);
    const MINUTES = Math.floor((time % 3600) / 60);
    const SECONDS = Math.floor(time % 60);
    return `${String(HOURS).padStart(2, "0")}:${String(MINUTES).padStart(
      2,
      "0"
    )}:${String(SECONDS).padStart(2, "0")}`;
  };
  // Returns Player Component
  return (
    // Player Page Main Container
    <div ref={containerRef} className="h-full w-full relative">
      {/* Player Content Information Background Container */}
      <div
        className="absolute top-0 h-full w-full bg-black/60 aria-hidden:hidden"
        aria-hidden={!videoStates.paused}
      >
        {/* Player Content Information Container */}
        <div className="absolute top-[45%] left-14">
          {/* Player Content Second Information Container */}
          <div className="flex flex-col gap-3">
            {/* Player Content Name */}
            <span className="text-5xl font-bold text-gray-200">{name}</span>
            {/* Player Content Description */}
            <p className="leading-7 text-gray-300 text-lg">{description}</p>
          </div>
        </div>
      </div>
      {/* Content Video */}
      <video
        ref={videoRef}
        className="h-full w-full -z-10 cursor-pointer"
        src={`/videos/${TYPE}/${id}${
          TYPE === "movies"
            ? `.webm`
            : `/Temporada ${series?.season}/Episodio ${series?.episode}.webm`
        }`}
        autoPlay
        playsInline
        onClick={PlayAndPause}
        onTimeUpdate={() => {
          SetVideoStates({
            ...videoStates,
            currentTime: FormatTime(
              videoRef.current ? videoRef.current?.currentTime : 0
            ),
          });
        }}
      />
      {/* Player Controlers Container */}
      <div
        className="absolute bottom-0 w-full bg-black aria-hidden:hidden"
        aria-hidden={videoStates.controlersHidden}
      >
        {/* Player Time Container */}
        <div className="text-sm pt-3 px-3">
          {videoStates.currentTime} /{" "}
          {FormatTime(videoRef.current ? videoRef.current?.duration : 0)}
        </div>
        {/* Player Controlers Second Container */}
        <div className="flex place-content-between items-center py-4 px-5">
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
            {/* Less Ten Seconds Button */}
            <div
              className="group flex transition-all cursor-pointer select-none hover:scale-125 hover:text-white"
              onClick={() => AddTime(-10)}
            >
              <ArrowUturnLeftIcon className="w-12 h-12 fill-gray-300 group-hover:fill-white" />
              <span className="text-xl font-semibold">-10</span>
            </div>
            {/* Plus Ten Seconds Button */}
            <div
              className="group flex transition-all cursor-pointer select-none hover:scale-125 hover:text-white"
              onClick={() => AddTime(10)}
            >
              <ArrowUturnRightIcon className="w-12 h-12 fill-gray-300 group-hover:fill-white" />
              <span className="text-xl font-semibold">+10</span>
            </div>
            {/* Volume Buttons */}
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
          <div className="flex gap-4">
            {/* Back to Content Button */}
            <Link href={`/${TYPE}/${id}`}>
              <ArrowLeftStartOnRectangleIcon className={ICONS_STYLE} />
            </Link>
            {/* Next Episode Button */}
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
            {/* Fullscreen Buttons */}
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
