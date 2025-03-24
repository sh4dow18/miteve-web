"use client";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

interface Props {
  id: string;
  title: string;
}

function YoutubeVideo({ id, title }: Props) {
  return (
    <div className="rounded-md overflow-hidden">
      <LiteYouTubeEmbed id={id} title={title} poster="maxresdefault" />
    </div>
  );
}

export default YoutubeVideo;
