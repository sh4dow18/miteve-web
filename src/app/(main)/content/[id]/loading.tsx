"use client";

// Skeleton para la página de Detalle de serie/película (imagen 2)
// Refleja: hero con backdrop, metadata, géneros, botón reproducir

function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[.07] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.07) 50%,transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export default function DetailSkeletonPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* ── Full-bleed backdrop ── */}
      <div className="relative h-screen w-full overflow-hidden">

        {/* Backdrop placeholder */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg,#141418 0%,#1c1c22 40%,#111114 100%)",
            animation: "pulse-slow 3.5s ease-in-out infinite",
          }}
        />
        {/* shimmer sweep across backdrop */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 50%,transparent 100%)",
            backgroundSize: "300% 100%",
            animation: "shimmer 2.8s ease-in-out infinite",
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-[#0a0a0c]/55 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-linear-to-r from-[#0a0a0c]/80 to-transparent" />

        {/* ── Back button ── */}
        <div className="absolute left-6 top-7 sm:left-8">
          <Shimmer className="size-9 rounded-full" />
        </div>
        {/* ── Sound button ── */}
        <div className="absolute right-6 top-7 sm:right-8">
          <Shimmer className="size-9 rounded-full" />
        </div>

        {/* ── Bottom-left metadata ── */}
        <div className="absolute bottom-10 left-6 flex max-w-lg flex-col gap-3 sm:left-10 lg:left-14 lg:bottom-14">

          {/* Title */}
          <Shimmer className="h-11 w-72 rounded-xl sm:h-14 sm:w-95 lg:w-105" />

          {/* Rating row */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Shimmer key={i} className="size-5 rounded-sm" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
            <Shimmer className="h-4 w-10 rounded-md" />
            <Shimmer className="h-5 w-8 rounded-md" />
            <Shimmer className="h-4 w-10 rounded-md" />
          </div>

          {/* Description lines */}
          <div className="flex flex-col gap-2">
            <Shimmer className="h-3.5 w-full rounded-md max-w-95" />
            <Shimmer className="h-3.5 w-5/6 rounded-md max-w-80" />
            <Shimmer className="h-3.5 w-4/6 rounded-md max-w-70" />
            <Shimmer className="h-3.5 w-3/5 rounded-md max-w-60" />
          </div>

          {/* Genre tags */}
          <div className="mt-1 flex gap-2">
            <Shimmer className="h-6 w-20 rounded-lg" />
            <Shimmer className="h-6 w-16 rounded-lg" />
            <Shimmer className="h-6 w-24 rounded-lg" />
          </div>

          {/* Play button */}
          <Shimmer className="mt-2 h-12 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}