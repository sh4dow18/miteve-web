"use client";

import { useEffect, useState } from "react";
import { CatalogueLoadingSkeleton } from "@/shared/ui/CatalogueLoadingSkeleton";
import { useHomeShell } from "@/features/home/model/useHomeShell";
import { ContinueWatchingRow } from "./ContinueWatchingRow";
import { ContinueWatchingRowTV } from "./ContinueWatchingRowTV";
import { ProfileContentRow } from "./ProfileContentRow";
import { ProfileContentRowTV } from "./ProfileContentRowTV";
import { TopTenRow } from "./TopTenRow";
import { TopTenRowTV } from "./TopTenRowTV";
import { HOME_ROWS, HOME_ROW_INDICES, HOME_TOTAL_ROWS } from "@/features/home/config/home.constants";
import { getMainProfile, getToken } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

interface Props {
  hero?: React.ReactNode;
  children: React.ReactNode;
  isTV?: boolean;
}

const RECOMMENDATIONS_ENDPOINT = {
  type: "profile" as const,
  path: (id: string) => `/contents/recommendations/${id}`,
};
const TRENDING_ENDPOINT = { type: "public" as const, path: "/contents/top-watched" };
const FAVORITES_ENDPOINT = {
  type: "profile" as const,
  path: (id: string) => `/profiles/${id}/favorites`,
};
const WATCH_AGAIN_ENDPOINT = {
  type: "profile" as const,
  path: (id: string) => `/contents/watch-again/${id}`,
};

export function HomeClientShell({ hero, children, isTV = false }: Props) {
  const { ready, onLoaded } = useHomeShell();
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    const mainProfile = getMainProfile();
    if (!mainProfile) return;
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_HOST_IP}/profiles/${mainProfile.id}`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data: { allowPersonalizedRecommendations?: boolean } | null) => {
        if (data !== null) {
          setShowRecommendations(data.allowPersonalizedRecommendations ?? true);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Row = isTV ? ProfileContentRowTV : ProfileContentRow;
  const TrendingRow = isTV ? TopTenRowTV : TopTenRow;

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
          <div className="sm:-mt-16 relative z-10 space-y-8 pb-12">
            {isTV
              ? <ContinueWatchingRowTV onLoaded={onLoaded} />
              : <ContinueWatchingRow onLoaded={onLoaded} />
            }
            {showRecommendations && (
              <Row
                title={HOME_ROWS.recommendations}
                endpoint={RECOMMENDATIONS_ENDPOINT}
                rowIndex={HOME_ROW_INDICES.recommendations}
                totalRows={HOME_TOTAL_ROWS}
                requiresProfile
              />
            )}
            {children}
            <TrendingRow
              title={HOME_ROWS.trending}
              endpoint={TRENDING_ENDPOINT}
              rowIndex={HOME_ROW_INDICES.trending}
              totalRows={HOME_TOTAL_ROWS}
            />
            <Row
              title={HOME_ROWS.favorites}
              endpoint={FAVORITES_ENDPOINT}
              rowIndex={HOME_ROW_INDICES.favorites}
              totalRows={HOME_TOTAL_ROWS}
              requiresProfile
            />
            <Row
              title={HOME_ROWS.watchAgain}
              endpoint={WATCH_AGAIN_ENDPOINT}
              rowIndex={HOME_ROW_INDICES.watchAgain}
              totalRows={HOME_TOTAL_ROWS}
              requiresProfile
            />
          </div>
        </div>
      </div>
    </>
  );
}
