"use client";

import { CatalogueLoadingSkeleton } from "@/shared/ui/CatalogueLoadingSkeleton";
import { useHomeShell } from "@/features/home/model/useHomeShell";
import { ContinueWatchingRow } from "./ContinueWatchingRow";

interface Props {
  hero?: React.ReactNode;
  children: React.ReactNode;
}

export function HomeClientShell({ hero, children }: Props) {
  const { ready, onLoaded } = useHomeShell();

  return (
    <>
      {!ready && (
        <div aria-hidden="true">
          <CatalogueLoadingSkeleton />
        </div>
      )}

      <div className={ready ? undefined : "invisible absolute"} aria-busy={!ready}>
        <div className="min-h-screen">
          {hero}
          <div className="-mt-16 relative z-10 space-y-8 pb-12">
            <ContinueWatchingRow onLoaded={onLoaded} />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
