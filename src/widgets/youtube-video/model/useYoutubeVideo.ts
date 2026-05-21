import { useEffect, useRef, useState } from "react";

interface UseYoutubeVideoParams {
  mute: boolean;
  duration: number;
}

export function useYoutubeVideo({ mute, duration }: UseYoutubeVideoParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    // Mark the thumbnail img as eager so it is detected as LCP-ready
    const img = containerRef.current?.querySelector("img");
    if (img) (img as HTMLImageElement).loading = "eager";
    const btn = containerRef.current?.querySelector("button");
    btn?.click();
  }, []);

  const sendCommand = (func: string) => {
    const iframe = containerRef.current?.querySelector(
      "iframe"
    ) as HTMLIFrameElement;

    iframe?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
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
      sendCommand("mute");
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration]);

  return {
    containerRef,
    ended,
  };
}
