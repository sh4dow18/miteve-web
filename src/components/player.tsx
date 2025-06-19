// Set this component as a client component
"use client";
import { SAME_NET_API_HOST_IP, EXTERNAL_API_HOST_IP } from "@/lib/admin";
// Player Requirements
import {
  ArrowLeftIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
  FilmIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/16/solid";
import { LoaderCircleIcon } from "lucide-react";
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
    nextEpisode?: {
      season: string;
      episode: string;
    };
    metadata: {
      beginSummary: number | null;
      endSummary: number | null;
      beginIntro: number | null;
      endIntro: number | null;
      beginCredits: number | null;
    };
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
  // Speed Test Function
  async function SpeedTest(): Promise<number> {
    const RESULTS_LIST: number[] = [];
    for (let i = 0; i < 2; i++) {
      const BEGIN = performance.now();
      const RESPONSE = await fetch(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pierre-Person.jpg/320px-Pierre-Person.jpg",
        { cache: "no-store" }
      );
      await RESPONSE.blob();
      const END = performance.now();
      const SECONDS = (END - BEGIN) / 1000;
      const MBPS = (0.105 / SECONDS) * 8;
      RESULTS_LIST.push(MBPS);
    }
    return Math.max(...RESULTS_LIST);
  }
  const [videoStates, SetVideoStates] = useState({
    paused: true,
    muted: false,
    fullscreen: false,
    controlersHidden: false,
    currentTime: "00:00:00",
    progress: 0,
    waiting: true,
    resolution: "HD",
    subtitlesOn: true,
  });
  const [rangeStates, SetRangeStates] = useState({
    hoverTime: 0,
    isHovering: false,
    hoverX: 0,
    buffered: 0,
  });
  const [skips, SetSkips] = useState({
    summary: false,
    intro: false,
    credits: false,
  });
  // Execute this use effect when the page is loading to know if can autoplay or not
  // Also, check if needs the HD version or low quality version
  useEffect(() => {
    const SetVideo = async () => {
      if (videoRef.current === null) {
        return;
      }
      const VIDEO = videoRef.current;
      // Spped test to know if the connection is slow
      const REAL_SPEED = await SpeedTest();
      // Check if it an Slow Internet
      const IS_CONNECTION_SLOW = REAL_SPEED < 4;
      // Set it would be use the low quality version
      const LOW_QUALITY =
        videoStates.resolution === "SD" || IS_CONNECTION_SLOW === true;
      // Set API URL
      const API = `api/${
        series === undefined ? "movies" : "series"
      }/stream/${id}${
        series !== undefined
          ? `/season/${series.season}/episode/${series.episode}`
          : ""
      }${LOW_QUALITY ? "?quality=low" : ""}`;
      // Set Resolution Video States with the New Resolution
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        resolution: LOW_QUALITY ? "SD" : "HD",
      }));
      // Set a Timeout to Check the IPs to get the content
      const CONTROLLER = new AbortController();
      const TIMEOUT = setTimeout(() => CONTROLLER.abort(), 200);
      let availableIP = EXTERNAL_API_HOST_IP;
      // Check if the main IP is available
      fetch(`${availableIP}/${API}`, {
        method: "HEAD",
        signal: CONTROLLER.signal,
      })
        .catch(() => {
          // If it is not, set the secondary IP
          availableIP = SAME_NET_API_HOST_IP;
        })
        .finally(() => {
          clearTimeout(TIMEOUT);
          VIDEO.oncanplay = null;
          VIDEO.onerror = null;
          VIDEO.src = `${availableIP}/${API}`;
          // Check if there is a summary or intro at the beginning to skip it automatically
          if (series !== undefined) {
            const { beginSummary, endSummary, beginIntro, endIntro } =
              series.metadata;
            if (beginSummary === 0 && endSummary != null) {
              VIDEO.currentTime = endSummary;
            } else if (beginIntro === 0 && endIntro != null) {
              VIDEO.currentTime = endIntro;
            } else if (
              beginSummary === 0 &&
              endSummary !== null &&
              beginIntro === endSummary + 1 &&
              endIntro != null
            ) {
              VIDEO.currentTime = endIntro;
            }
          }
          // Load Content and autoplay
          VIDEO.addEventListener(
            "canplay",
            () => {
              VIDEO.play()
                .then(() =>
                  SetVideoStates((prevVideoStates) => ({
                    ...prevVideoStates,
                    paused: false,
                    waiting: false,
                  }))
                )
                .catch(() =>
                  SetVideoStates((prevVideoStates) => ({
                    ...prevVideoStates,
                    paused: true,
                    waiting: false,
                  }))
                );
              // Add Subtitles
              const SUBTITLES = document.createElement("track");
              SUBTITLES.src = `/api/subtitles?id=${id}&type=${
                series === undefined
                  ? "movies"
                  : `series&season=${series.season}&episode=${series.episode}`
              }`;
              SUBTITLES.kind = "subtitles";
              SUBTITLES.srclang = "es";
              SUBTITLES.label = "Español";
              SUBTITLES.default = true;
              VIDEO.appendChild(SUBTITLES);
            },
            { once: true }
          );
          VIDEO.onerror = () => {
            SetVideoStates((prevVideoStates) => ({
              ...prevVideoStates,
              paused: true,
              waiting: false,
            }));
          };
          VIDEO.load();
        });
    };
    SetVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, series]);
  // Execute this use effect when the page is loading
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (series === undefined) {
      return;
    }
    // Function that allow to display and hide the skips buttons
    const ManageSkips = () => {
      const CURRENT_TIME = VIDEO.currentTime;
      const BEGIN_SUMMARY = series.metadata.beginSummary;
      const END_SUMMARY = series.metadata.endSummary;
      const BEGIN_INTRO = series.metadata.beginIntro;
      const END_INTRO = series.metadata.endIntro;
      const BEGIN_CREDITS = series.metadata.beginCredits;
      SetSkips({
        summary:
          BEGIN_SUMMARY !== null && END_SUMMARY !== null
            ? CURRENT_TIME > BEGIN_SUMMARY && CURRENT_TIME < END_SUMMARY
            : false,
        intro:
          BEGIN_INTRO !== null && END_INTRO !== null
            ? CURRENT_TIME > BEGIN_INTRO && CURRENT_TIME < END_INTRO
            : false,
        credits: BEGIN_CREDITS !== null ? CURRENT_TIME > BEGIN_CREDITS : false,
      });
    };
    VIDEO.addEventListener("timeupdate", ManageSkips);
    VIDEO.addEventListener("seeked", ManageSkips);
    return () => {
      VIDEO.removeEventListener("timeupdate", ManageSkips);
      VIDEO.removeEventListener("seeked", ManageSkips);
    };
  }, [series]);
  // Execute this use effect when the page is loading
  useEffect(() => {
    const UserPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "f":
        case "F":
          Fullscreen();
          break;
        case "m":
        case "M":
          VolumeAndMute();
          break;
        case "c":
        case "C":
          PutSubtitles();
          break;
        case "ArrowRight":
          AddTime(10);
          break;
        case "ArrowLeft":
          AddTime(-10);
          break;
        case " ":
          event.preventDefault();
          PlayAndPause();
          break;
        default:
          break;
      }
    };
    // Function that checks the changes the fullscreen mode
    const FullscreenChange = () => {
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        fullscreen: document.fullscreenElement ? true : false,
      }));
    };
    document.addEventListener("keydown", UserPress);
    document.addEventListener("fullscreenchange", FullscreenChange);
    return () => {
      document.removeEventListener("keydown", UserPress);
      document.removeEventListener("fullscreenchange", FullscreenChange);
    };
  }, []);
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
        timeout = setTimeout(() => {
          SetVideoStates((prevVideoStates) => ({
            ...prevVideoStates,
            controlersHidden: true,
          }));
        }, 5000);
      }
    };
    if (videoStates.paused === true) {
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        controlersHidden: false,
      }));
    } else {
      timeout = setTimeout(() => {
        SetVideoStates((prevVideoStates) => ({
          ...prevVideoStates,
          controlersHidden: true,
        }));
      }, 5000);
    }
    CONTAINER.addEventListener("mousemove", MouseMove);
    return () => {
      CONTAINER.removeEventListener("mousemove", MouseMove);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStates.paused === false]);
  // Execute this use effect when the page is loading to set the buffered video
  useEffect(() => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    const UpdateBuffered = () => {
      if (VIDEO.buffered.length > 0) {
        const END = VIDEO.buffered.end(VIDEO.buffered.length - 1);
        const DURATION = VIDEO.duration || 1;
        SetRangeStates({
          ...rangeStates,
          buffered: (END / DURATION) * 100,
        });
      }
    };
    VIDEO.addEventListener("progress", UpdateBuffered);
    return () => {
      VIDEO.removeEventListener("progress", UpdateBuffered);
    };
  }, [rangeStates]);
  // Functions that allows to play and pause the video
  const PlayAndPause = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (VIDEO.paused) {
      VIDEO.play();
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        paused: false,
      }));
      return;
    }
    VIDEO.pause();
    SetVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      paused: true,
      controlersHidden: false,
    }));
  };
  // Functions that allows to mute and unmute the video
  const VolumeAndMute = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    const NEW_STATE = !VIDEO.muted;
    VIDEO.muted = NEW_STATE;
    SetVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      muted: NEW_STATE,
    }));
  };
  // Functions that allows to set fullscreen the video and controllers
  const Fullscreen = () => {
    const CONTAINER = containerRef.current;
    if (CONTAINER === null) {
      return;
    }
    if (!document.fullscreenElement) {
      CONTAINER.requestFullscreen();
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        fullscreen: true,
      }));
      return;
    }
    document.exitFullscreen();
    SetVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      fullscreen: false,
    }));
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
  // Function that put subtitles in video
  const PutSubtitles = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (VIDEO.textTracks[0].mode === "showing") {
      VIDEO.textTracks[0].mode = "disabled";
      SetVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        subtitlesOn: false,
      }));
      return;
    }
    VIDEO.textTracks[0].mode = "showing";
    SetVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      subtitlesOn: true,
    }));
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
  // Function that allows to handle the progress bar
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
  // Function that allows to skip episodes summary and intros
  const Skip = () => {
    const VIDEO = videoRef.current;
    if (VIDEO === null) {
      return;
    }
    if (series === undefined) {
      return;
    }
    if (skips.summary === true && series.metadata.endSummary !== null) {
      VIDEO.currentTime = series.metadata.endSummary;
      SetSkips({
        ...skips,
        summary: false,
      });
    }
    if (skips.intro === true && series.metadata.endIntro !== null) {
      VIDEO.currentTime = series.metadata.endIntro;
      SetSkips({
        ...skips,
        intro: false,
      });
    }
  };
  // Returns Player Component
  return (
    // Player Page Main Container
    <div
      ref={containerRef}
      className={`h-full w-full relative ${
        videoStates.controlersHidden === true ? "cursor-none" : "cursor-pointer"
      }`}
    >
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
      {/* Back to Content Button */}
      <div
        className="absolute top-0 h-full w-full aria-hidden:hidden"
        aria-hidden={!videoStates.paused}
      >
        <Link
          className="absolute top-5 left-5 flex gap-1 select-none z-20 min-[865px]:left-7"
          href={`/${TYPE}/${id}${series ? `?season=${series.season}` : ""}`}
        >
          <ArrowLeftIcon className={ICONS_STYLE} />
        </Link>
      </div>
      {/* Current Resolution Display Container */}
      <div
        className="absolute top-0 h-full w-full aria-hidden:hidden"
        aria-hidden={!videoStates.paused}
      >
        <div className="absolute top-5 right-2 flex gap-1 select-none min-[425px]:right-5 min-[865px]:right-10">
          <FilmIcon className="w-5 h-5 fill-gray-300 min-[425px]:w-7 min-[425px]:h-7 min-[865px]:w-12 min-[865px]:h-12" />
          <span className="text-gray-300 font-semibold max-[425px]:text-xs min-[865px]:text-xl">
            {videoStates.resolution}
          </span>
        </div>
      </div>
      {/* Loading Container */}
      <div
        className="absolute top-0 h-full w-full aria-hidden:hidden"
        aria-hidden={!videoStates.waiting}
      >
        <LoaderCircleIcon className="h-20 w-20 text-gray-300 absolute top-[50%] left-[50%] -translate-[50%] animate-spin" />
      </div>
      {/* Skip Summary Button */}
      <button
        onClick={Skip}
        className={`absolute right-4 cursor-pointer transition-all duration-500 ease-in-out opacity-100 bg-gray-300 text-black text-sm px-4 py-2 rounded-md z-20 min-[615px]:right-10 md:text-base hover:bg-white aria-hidden:opacity-0 aria-hidden:pointer-events-none ${
          videoStates.controlersHidden
            ? "bottom-4"
            : "bottom-25 min-[615px]:bottom-28 min-[865px]:bottom-36"
        }`}
        aria-hidden={!skips.summary}
      >
        Omitir Resumen
      </button>
      {/* Skip Intro Button */}
      <button
        onClick={Skip}
        className={`absolute right-4 cursor-pointer transition-all duration-500 ease-in-out opacity-100 bg-gray-300 text-black text-sm px-4 py-2 rounded-md z-20 min-[615px]:right-10 md:text-base hover:bg-white aria-hidden:opacity-0 aria-hidden:pointer-events-none ${
          videoStates.controlersHidden
            ? "bottom-4"
            : "bottom-25 min-[615px]:bottom-28 min-[865px]:bottom-36"
        }`}
        aria-hidden={!skips.intro}
      >
        Omitir Intro
      </button>
      {/* Next Episode Button in Credits */}
      {series?.nextEpisode && (
        <a
          href={`/player?type=series&id=${id}&season=${series.nextEpisode.season}&episode=${series.nextEpisode.episode}`}
          className={`absolute right-4 cursor-pointer transition-all duration-500 ease-in-out opacity-100 bg-gray-300 text-black text-sm px-4 py-2 rounded-md z-20 min-[615px]:right-10 md:text-base hover:bg-white aria-hidden:opacity-0 aria-hidden:pointer-events-none ${
            videoStates.controlersHidden
              ? "bottom-4"
              : "bottom-25 min-[615px]:bottom-28 min-[865px]:bottom-36"
          }`}
          aria-hidden={!skips.credits}
        >
          Siguiente Episodio
        </a>
      )}
      {/* Content Video */}
      <video
        ref={videoRef}
        src={
          videoRef.current
            ? videoRef.current.src !== ""
              ? videoRef.current.src
              : undefined
            : undefined
        }
        className="h-full w-full -z-10 max-[1024px]:object-cover"
        playsInline
        onClick={PlayAndPause}
        onSeeking={() => {
          SetVideoStates({
            ...videoStates,
            waiting: true,
          });
        }}
        onPlaying={() => {
          SetVideoStates({
            ...videoStates,
            waiting: false,
          });
        }}
        onTimeUpdate={() => {
          const VIDEO = videoRef.current;
          if (VIDEO === null) {
            return;
          }
          SetVideoStates({
            ...videoStates,
            currentTime: FormatTime(VIDEO.currentTime),
            progress: (VIDEO.currentTime / VIDEO.duration) * 100,
          });
        }}
      />
      {/* Player Controlers Container */}
      <div
        className="absolute bottom-0 w-full bg-black transition-opacity duration-500 ease-in-out opacity-100 aria-hidden:opacity-0 aria-hidden:pointer-events-none"
        aria-hidden={videoStates.controlersHidden}
      >
        {/* Player Progress Container */}
        <div className="flex items-center gap-3">
          {/* Progress Bar Container */}
          <div className="relative w-full h-7 group">
            {/* Base Time Line */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-700 rounded-full transform -translate-y-1/2 z-0 group-hover:h-2.5" />
            {/* Buffered Video Time Line */}
            <div
              className="absolute top-1/2 left-0 h-1.5 bg-gray-300 rounded-full transform -translate-y-1/2 z-10 group-hover:h-2.5"
              style={{ width: `${rangeStates.buffered}%` }}
            />
            {/* Played Video Time Line */}
            <div
              className="absolute top-1/2 left-0 h-1.5 bg-primary-light rounded-full transform -translate-y-1/2 z-20 group-hover:h-2.5"
              style={{ width: `${videoStates.progress}%` }}
            />
            {/* Hover Time Video Container */}
            <div
              className="absolute inset-0 z-30 cursor-pointer"
              onMouseMove={(event) => {
                // Get the size and position of the element
                const RECTANGLE = event.currentTarget.getBoundingClientRect();
                // Calculate the horizontal position of the mouse relative to the element
                const POSITION_X = event.clientX - RECTANGLE.left;
                // Calculate the relative horizontal position as a percentage
                const PERCENT = Math.min(
                  Math.max(POSITION_X / RECTANGLE.width, 0),
                  1
                );
                SetRangeStates({
                  ...rangeStates,
                  hoverTime: (videoRef.current?.duration || 0) * PERCENT,
                  isHovering: true,
                  hoverX: POSITION_X,
                });
              }}
              onMouseLeave={() =>
                SetRangeStates({
                  ...rangeStates,
                  isHovering: false,
                })
              }
              onClick={(event) => {
                const VIDEO = videoRef.current;
                if (VIDEO === null) {
                  return;
                }
                // Get the size and position of the element
                const RECTANGLE = event.currentTarget.getBoundingClientRect();
                // Calculate the horizontal position of the mouse relative to the element
                const POSITION_X = event.clientX - RECTANGLE.left;
                // Calculate the relative horizontal position as a percentage
                const PERCENT = Math.min(
                  Math.max(POSITION_X / RECTANGLE.width, 0),
                  1
                );
                VIDEO.currentTime = PERCENT * VIDEO.duration;
              }}
            />
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={
                Number.isNaN(videoStates.progress) === false
                  ? videoStates.progress
                  : 0
              }
              onChange={ChangeTimeInProgressBar}
              className="w-full h-2 appearance-none bg-transparent cursor-pointer range-thumb relative z-20"
            />
            {rangeStates.isHovering && (
              // Show Time In Progress Bar Container
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                {/* Show Time in Progress Bar Line */}
                <div
                  className="absolute top-2 h-3 w-0.5 bg-yellow-400"
                  style={{ left: `${rangeStates.hoverX}px` }}
                />
                {/* Show Time in Progress Bar Time */}
                <div
                  className="absolute -top-6 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                  style={{ left: `${rangeStates.hoverX}px` }}
                >
                  {FormatTime(rangeStates.hoverTime)}
                </div>
              </div>
            )}
          </div>
          {/* Player Time Container */}
          <div className="flex gap-1 w-20 text-xs px-3 pt-1 select-none min-[581px]:w-48 min-[1027px]:text-sm">
            <span>{videoStates.currentTime}</span>
            <span className="hidden min-[581px]:block">
              {" / "}
              {videoRef.current &&
              Number.isNaN(videoRef.current.duration) === false
                ? FormatTime(videoRef.current.duration)
                : "--:--:--"}
            </span>
          </div>
        </div>
        {/* Player Controlers Second Container */}
        <div className="flex place-content-between items-center py-4 px-5">
          {/* Player First Controlers Container */}
          <div className="flex gap-3 min-[355px]:gap-4 min-[475px]:gap-6">
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
          <h1 className="hidden text-gray-300 min-[680px]:block min-[865px]:text-xl">
            {name}
          </h1>
          {/* Player Second Controlers Container */}
          <div className="flex gap-3 min-[355px]:gap-4 min-[475px]:gap-6">
            {series?.nextEpisode && (
              // Next Episode Button
              <a
                href={`/player?type=series&id=${id}&season=${series.nextEpisode.season}&episode=${series.nextEpisode.episode}`}
                className="aria-disabled:hidden"
                aria-disabled={!series?.nextEpisode}
              >
                <ForwardIcon className={ICONS_STYLE} />
              </a>
            )}
            {/* Subtitles Buttons */}
            <ChatBubbleBottomCenterTextIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PutSubtitles}
              aria-disabled={videoStates.subtitlesOn === false}
            />
            <ChatBubbleBottomCenterIcon
              className={`${ICONS_STYLE} aria-disabled:hidden`}
              onClick={PutSubtitles}
              aria-disabled={videoStates.subtitlesOn === true}
            />
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
