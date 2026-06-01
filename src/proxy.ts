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
  // Player page in offline mode via PWA: skip API check
  if (
    PAGE_NAME.startsWith("/player/") &&
    request.nextUrl.searchParams.get("offline") === "true" &&
    request.cookies.get("miteve_pwa")?.value === "1"
  ) {
    return NextResponse.next();
  }
  // Check backend connection for all pages
  let apiOk = true;
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
  } catch {
    apiOk = false;
  } finally {
    clearTimeout(TIMEOUT);
  }
  // If API is up and the current page is "Maintenance", redirect to home page
  if (apiOk === true && PAGE_NAME === "/maintenance") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  // If API is down and the current page is not "Maintenance", redirect to Maintenance page
  if (apiOk === false && PAGE_NAME !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
}
// Proxy Config — matches all page routes, excludes Next.js internals and static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};