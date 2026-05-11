const TOKEN_KEY = "miteve_token";
const PROFILE_KEY = "miteve_main_profile";

export type MainProfile = {
  id: string;
  name: string;
  avatar?: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getMainProfile(): MainProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MainProfile;
  } catch {
    return null;
  }
}

export function setMainProfile(profile: MainProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearMainProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

function decodePayload(token: string): Record<string, unknown> {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function getUserId(token: string): string | null {
  const payload = decodePayload(token);
  const id = payload.id ?? payload.sub;
  return id != null ? String(id) : null;
}

export function getAuthorities(token: string): string[] {
  const payload = decodePayload(token);
  const raw = payload.authorities ?? payload.roles ?? [];
  if (Array.isArray(raw)) {
    return raw.map((a) =>
      typeof a === "string" ? a : ((a as { authority?: string }).authority ?? "")
    );
  }
  if (typeof raw === "string") return raw.split(" ");
  return [];
}

export function hasAuthority(token: string, authority: string): boolean {
  return getAuthorities(token).includes(authority);
}
