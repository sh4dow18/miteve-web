// Set this component as a client component
"use client";
// Player Requirements
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
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
    "w-5 h-5 fill-gray-300 transition-all cursor-pointer hover:scale-125 hover:fill-white min-[425px]:w-7 min-[425px]:h-7 min-[865px]:w-12 min-[865px]:h-12";
  // Player Main Hooks
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoStates, SetVideoStates] = useState({
    paused: true,
    muted: false,
    fullscreen: false,
    controlersHidden: false,
    currentTime: "00:00:00",
    progress: 0,
  });
  // Execute this use effect when the page is loading to know if can autoplay or not
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    const PLAY = VIDEO.play();
    if (PLAY === undefined) {
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Execute this use effect when the video is paused to hide or display the controllers
  useEffect(() => {
    if (videoStates.paused === false) {
      const timer = setTimeout(() => {
        SetVideoStates({
          ...videoStates,
          controlersHidden: true,
        });
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      SetVideoStates({
        ...videoStates,
        controlersHidden: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // function that allows to handle the progress bar
  const ChangeTimeInProgressBar = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const VIDEO = videoRef.current;
    if (VIDEO === null || !VIDEO.duration) {
      return;
    }
    const NEW_TIME = (parseFloat(event.target.value) / 100) * VIDEO.duration;
    VIDEO.currentTime = NEW_TIME;
    SetVideoStates({
      ...videoStates,
      currentTime: FormatTime(NEW_TIME),
    });
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
        <div className="absolute top-[45%] left-10 pr-10">
          {/* Player Content Second Information Container */}
          <div className="flex flex-col gap-3">
            {/* Player Content Name */}
            <span className="text-lg font-bold text-gray-200 min-[475px]:text-2xl min-[730px]:text-3xl min-[1000px]:text-5xl">
              {name}
            </span>
            {/* Player Content Description */}
            <p className="line-clamp-2 leading-7 text-gray-300 max-[475px]:text-xs min-[475px]:line-clamp-2 min-[730px]:text-sm min-[1000px]:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
      {/* Content Video */}
      <video
        ref={videoRef}
        className="h-full w-full -z-10 cursor-pointer object-cover"
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
            progress: videoRef.current
              ? (videoRef.current.currentTime / videoRef.current.duration) * 100
              : 0,
          });
        }}
      />
      {/* Player Controlers Container */}
      <div
        className="absolute bottom-0 w-full bg-black aria-hidden:hidden"
        aria-hidden={videoStates.controlersHidden}
      >
        {/* Player Progress Container */}
        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={videoStates.progress}
            onChange={ChangeTimeInProgressBar}
            className="w-full rounded-sm appearance-none bg-gray-400 accent-primary cursor-pointer hover:bg-gray-200"
          />
          {/* Player Time Container */}
          <div className="flex gap-1 w-20 text-xs px-3 pt-1 select-none min-[581px]:w-48 min-[1027px]:text-sm">
            <span>{videoStates.currentTime}</span>
            <span className="hidden min-[581px]:block">
              {" / "}
              {FormatTime(videoRef.current ? videoRef.current?.duration : 0)}
            </span>
          </div>
        </div>
        {/* Player Controlers Second Container */}
        <div className="flex place-content-between items-center py-4 px-5">
          {/* Player First Controlers Container */}
          <div className="flex gap-4 min-[355px]:gap-7">
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
              <ArrowUturnLeftIcon className="w-5 h-5 fill-gray-300 group-hover:fill-white min-[425px]:w-7 min-[425px]:h-7 min-[865px]:w-12 min-[865px]:h-12" />
              <span className="font-semibold max-[425px]:text-xs min-[865px]:text-xl">
                -10
              </span>
            </div>
            {/* Plus Ten Seconds Button */}
            <div
              className="group flex transition-all cursor-pointer select-none hover:scale-125 hover:text-white"
              onClick={() => AddTime(10)}
            >
              <ArrowUturnRightIcon className="w-5 h-5 fill-gray-300 group-hover:fill-white min-[425px]:w-7 min-[425px]:h-7 min-[865px]:w-12 min-[865px]:h-12" />
              <span className="font-semibold max-[425px]:text-xs min-[865px]:text-xl">
                +10
              </span>
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
          <h1 className="hidden text-gray-300 min-[615px]:block min-[865px]:text-xl">
            {name}
          </h1>
          {/* Player Second Controlers Container */}
          <div className="flex gap-4">
            {/* Back to Content Button */}
            <Link
              href={`/${TYPE}/${id}${series ? `?season=${series.season}` : ""}`}
            >
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
