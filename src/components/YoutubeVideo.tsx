"use client";

import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  title: string;
  thumbnail: string;
  mute: boolean;
  duration: number;
}

function YoutubeVideo({ id, title, thumbnail, mute, duration }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);

  // crear iframe automáticamente
  useEffect(() => {
    const btn = containerRef.current?.querySelector("button");
    btn?.click();
  }, []);

  const sendCommand = (func: string) => {
    const iframe =
      containerRef.current?.querySelector("iframe") as HTMLIFrameElement;

    iframe?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: []
      }),
      "*"
    );
  };

  useEffect(() => {
    if (mute) sendCommand("mute");
    else sendCommand("unMute");
  }, [mute]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnded(true);
      sendCommand("mute")
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* VIDEO */}
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-700 ${
          ended ? "opacity-0" : "opacity-100"
        }`}
      >
        <LiteYouTubeEmbed
          id={id}
          title={title}
          thumbnail={thumbnail}
          params="autoplay=1&mute=1&controls=0&enablejsapi=1&rel=0"
        />
      </div>

      {/* THUMBNAIL */}
      <img
        src={thumbnail}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          ended ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default YoutubeVideo;