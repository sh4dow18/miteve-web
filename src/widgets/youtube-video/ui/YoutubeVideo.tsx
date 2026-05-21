"use client";

import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import Image from "next/image";
import { useYoutubeVideo } from "@/widgets/youtube-video/model/useYoutubeVideo";

interface Props {
  id: string;
  title: string;
  thumbnail: string;
  mute: boolean;
  duration: number;
}

export function YoutubeVideo({ id, title, thumbnail, mute, duration }: Props) {
  const { containerRef, ended } = useYoutubeVideo({ mute, duration });

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-700 ${
          ended ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="absolute inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full
                  [@media(max-width:1110px)]:overflow-hidden"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full
                    w-[177.78vh] min-w-full"
          >
            <LiteYouTubeEmbed
              id={id}
              title={title}
              thumbnail={thumbnail}
              params="autoplay=1&mute=1&controls=0&enablejsapi=1&rel=0"
            />
          </div>
        </div>
      </div>

      <Image
        src={thumbnail}
        alt={title}
        fill
        unoptimized
        priority
        sizes="100vw"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          ended ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
