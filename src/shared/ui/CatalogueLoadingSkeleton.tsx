function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/6 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
      }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Shimmer className="aspect-2/3 w-full rounded-xl" />
      <Shimmer className="h-3 w-3/4 rounded-md" />
      <Shimmer className="h-2.5 w-1/2 rounded-md" />
    </div>
  );
}

function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="px-4 sm:px-8 lg:px-12">
      <Shimmer className="mb-4 h-5 w-40 rounded-lg" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function CatalogueLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* Hero banner skeleton */}
      <div className="relative h-[72vh] min-h-130 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg,#111115 0%,#1a1a1f 50%,#0f0f12 100%)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%)",
            backgroundSize: "300% 100%",
            animation: "shimmer 2.5s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#0a0a0c] to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-[#0a0a0c]/60 to-transparent" />

        {/* Hero content */}
        <div className="absolute bottom-14 left-4 flex flex-col gap-3 sm:left-8 lg:left-12 lg:bottom-16">
          <Shimmer className="h-5 w-28 rounded-full" />
          <Shimmer className="h-10 w-72 rounded-xl sm:h-12 sm:w-96 lg:h-14 lg:w-120" />
          <Shimmer className="h-10 w-52 rounded-xl sm:h-12 sm:w-72 lg:h-14 lg:w-80" />
          <div className="mt-1 flex flex-col gap-2">
            <Shimmer className="h-3.5 w-80 rounded-md lg:w-110" />
            <Shimmer className="h-3.5 w-64 rounded-md lg:w-96" />
            <Shimmer className="h-3.5 w-48 rounded-md lg:w-72" />
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Shimmer key={i} className="size-4 rounded-sm" />
              ))}
            </div>
            <Shimmer className="h-3.5 w-10 rounded-md" />
            <Shimmer className="h-5 w-8 rounded-md" />
            <Shimmer className="h-3.5 w-12 rounded-md" />
          </div>
          <div className="mt-2 flex gap-3">
            <Shimmer className="h-11 w-36 rounded-xl" />
            <Shimmer className="h-11 w-36 rounded-xl" />
          </div>
        </div>

        <Shimmer className="absolute bottom-14 right-6 size-10 rounded-full" />
      </div>

      {/* Content rows */}
      <div className="mt-2 space-y-10 pb-16">
        <RowSkeleton count={7} />
        <RowSkeleton count={7} />
        <RowSkeleton count={7} />
      </div>
    </div>
  );
}
