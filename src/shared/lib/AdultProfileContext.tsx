"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMainProfile, getToken } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";

const AdultProfileContext = createContext<boolean>(true);

export function AdultProfileProvider({ children }: { children: ReactNode }) {
  const [adultProfile, setAdultProfile] = useState(true);

  useEffect(() => {
    const mainProfile = getMainProfile();
    if (!mainProfile) return;
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_HOST_IP}/profiles/${mainProfile.id}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { adultProfile?: boolean } | null) => {
        if (data !== null) {
          setAdultProfile(data.adultProfile ?? true);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdultProfileContext.Provider value={adultProfile}>
      {children}
    </AdultProfileContext.Provider>
  );
}

export function useAdultProfile(): boolean {
  return useContext(AdultProfileContext);
}
