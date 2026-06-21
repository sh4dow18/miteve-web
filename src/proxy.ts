// Proxy Requirements
import { NextResponse, NextRequest } from "next/server";
import { API_HOST_IP } from "@/shared/config/env";
// Decode JWT payload and extract authorities (Edge Runtime compatible — uses atob, not Buffer)
function getJWTAuthorities(token: string): string[] {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json) as Record<string, unknown>;
    const raw = data.authorities ?? data.roles ?? [];
    if (Array.isArray(raw)) {
      return raw.map((a: unknown) =>
        typeof a === "string"
          ? a
          : ((a as { authority?: string }).authority ?? "")
      );
    }
    if (typeof raw === "string") return raw.split(" ");
    return [];
  } catch {
    return [];
  }
}
// Proxy Main Function
export async function proxy(request: NextRequest) {
  // Proxy Main Constants
  const PAGE_NAME = request.nextUrl.pathname;
  // Skip internal Next.js and API routes
  if (PAGE_NAME.startsWith("/api/")) {
    return NextResponse.next();
  }
  // Admin page: verify JWT cookie has the read-admin-page authority
  if (PAGE_NAME === "/admin") {
    const token = request.cookies.get("miteve_token")?.value;
    if (!token || !getJWTAuthorities(token).includes("read-admin-page")) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }
  // Downloads page: always accessible offline (PWA) — skip API check
  if (PAGE_NAME === "/downloads") {
    return NextResponse.next();
  }
  // Player page in offline mode: skip API check only when offline param is present
  if (
    PAGE_NAME.startsWith("/player/") &&
    request.nextUrl.searchParams.get("offline") === "true"
  ) {
    return NextResponse.next();
  }
  // Check backend connection for all pages
  let apiOk = true;
  let apiReachable = false;
  // Set Controller to allow to check fast the API Health
  const CONTROLLER = new AbortController();
  const TIMEOUT = setTimeout(() => CONTROLLER.abort(), 5000);
  // Try to fetch API
  try {
    const RESPONSE = await fetch(`${API_HOST_IP}/utils/health`, {
      method: "HEAD",
      signal: CONTROLLER.signal,
    });
    apiOk = RESPONSE.ok;
    apiReachable = true;
  } catch {
    apiOk = false;
    apiReachable = false;
  } finally {
    clearTimeout(TIMEOUT);
  }
  // If API is up and the current page is "Maintenance", redirect to home page
  if (apiOk === true && PAGE_NAME === "/maintenance") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  // If API responds with an error, the backend is in maintenance/unhealthy.
  if (apiOk === false && apiReachable === true && PAGE_NAME !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
  // If API is unreachable, distinguish between "no internet" and "API server down"
  // by probing a reliable external host. No internet -> downloads; API down -> maintenance.
  if (apiOk === false && apiReachable === false) {
    let hasInternet = false;
    const NET_CONTROLLER = new AbortController();
    const NET_TIMEOUT = setTimeout(() => NET_CONTROLLER.abort(), 3000);
    try {
      const NET_RESPONSE = await fetch("https://www.google.com/generate_204", {
        method: "HEAD",
        signal: NET_CONTROLLER.signal,
      });
      hasInternet = NET_RESPONSE.status === 204 || NET_RESPONSE.ok;
    } catch {
      hasInternet = false;
    } finally {
      clearTimeout(NET_TIMEOUT);
    }

    if (hasInternet && PAGE_NAME !== "/maintenance") {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
    if (!hasInternet && PAGE_NAME !== "/downloads" && PAGE_NAME !== "/maintenance") {
      return NextResponse.redirect(new URL("/downloads", request.url));
    }
  }
}
// Proxy Config — matches all page routes, excludes Next.js internals and static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};