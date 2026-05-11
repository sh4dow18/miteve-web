"use client";

// Skeleton para el Reproductor de video (imagen 3)
// Refleja: video a pantalla completa + controles en barra inferior + info en esquina superior derecha

function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white/8 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 50%,transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export default function PlayerSkeleton() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#050505]">
      <style>{`
        @keyframes shimmer {
          0%   { background-position:200% 0 }
          100% { background-position:-200% 0 }
        }
        @keyframes pulse-bg {
          0%,100% { opacity:.3 }
          50%      { opacity:.55 }
        }
        @keyframes spin-slow {
          from { transform:rotate(0deg) }
          to   { transform:rotate(360deg) }
        }
      `}</style>

      {/* ── Video area ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Simulated blurry video frame */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,#1a2a1a 0%,#182020 30%,#151a25 60%,#201510 100%)",
            animation: "pulse-bg 4s ease-in-out infinite",
          }}
        />

        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.10) 50%,transparent 100%)",
            backgroundSize: "300% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Center spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-14">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-white/10"
            />
            {/* Spinning arc */}
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/50"
              style={{ animation: "spin-slow .9s linear infinite" }}
            />
            {/* Inner dot */}
            <div className="absolute inset-[38%] rounded-full bg-white/30" />
          </div>
        </div>

        {/* ── Top bar: back + title block ── */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-6 sm:px-8">
          {/* Back button */}
          <Shimmer className="size-9 rounded-full" />

          {/* Top-right: title + episode info + badge (mirrors image 3) */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Shimmer className="h-5 w-12 rounded-md" />
              {/* FHD badge */}
              <Shimmer className="h-5 w-10 rounded-md" />
            </div>
            <Shimmer className="h-5 w-36 rounded-md" />
            <Shimmer className="h-3.5 w-48 rounded-md" />
          </div>

          {/* pip / screen button */}
          <div className="absolute left-1/2 top-6 -translate-x-1/2">
            <Shimmer className="size-8 rounded-lg" />
          </div>
        </div>

        {/* Gradient fade to bottom for controls */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/80 to-transparent" />
      </div>

      {/* ── Controls bar ── */}
      <div className="relative z-10 bg-black/70 px-6 pb-6 pt-3 backdrop-blur-md sm:px-8">

        {/* Progress bar */}
        <div className="relative mb-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <Shimmer className="absolute inset-y-0 left-0 w-0 rounded-full" />
          {/* Thumb dot */}
          <div className="absolute left-0 top-1/2 size-3 -translate-y-1/2 rounded-full bg-white/25" />
        </div>

        {/* Time stamps */}
        <div className="mb-4 flex justify-end">
          <Shimmer className="h-3 w-28 rounded-md" />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">

          {/* Left: play + skip + volume */}
          <div className="flex items-center gap-4">
            <Shimmer className="size-8 rounded-full" />
            <Shimmer className="h-4 w-14 rounded-md" />
            <Shimmer className="h-4 w-14 rounded-md" />
            <Shimmer className="size-7 rounded-full" />
          </div>

          {/* Center: episode title */}
          <Shimmer className="hidden h-4 w-40 rounded-md sm:block" />

          {/* Right: speed + subtitles + settings + fullscreen */}
          <div className="flex items-center gap-3">
            <Shimmer className="size-7 rounded-full" />
            <Shimmer className="size-7 rounded-full" />
            <Shimmer className="size-7 rounded-full" />
            <Shimmer className="size-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}