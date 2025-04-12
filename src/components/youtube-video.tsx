// Set this component as a client component
"use client";
// Youtube Video Stylesheets
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
// Youtube Video Requirements
import LiteYouTubeEmbed from "react-lite-youtube-embed";
// Youtube Video Props
interface Props {
  id: string;
  title: string;
}
// Youtube Video Main Function
function YoutubeVideo({ id, title }: Props) {
  // Returns Youtube Video Component
  return (
    // Youtube Video Main Function
    <div className="rounded-md overflow-hidden">
      <LiteYouTubeEmbed id={id} title={title} poster="maxresdefault" />
    </div>
  );
}

export default YoutubeVideo;
