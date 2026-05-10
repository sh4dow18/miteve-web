// Proxy Requirements
import { NextResponse, NextRequest } from "next/server";
import { API_HOST_IP, SECURITY_PASSWORD } from "@/shared/config/env";
// Proxy Main Function
export async function proxy(request: NextRequest) {
  // Proxy Main Constants
  const PAGE_NAME = request.nextUrl.pathname;
  // If it is the admin page, check if the secret password was sent, if not, redirect to 404
  if (
    PAGE_NAME === "/admin" &&
    request.nextUrl.searchParams.get("secret") !== SECURITY_PASSWORD
  ) {
    return NextResponse.redirect(new URL("/404", request.url));
  }
  // Check if the page is a async page that needs the internal API
  if (
    PAGE_NAME.includes("/home") ||
    PAGE_NAME.includes("/movies") ||
    PAGE_NAME.includes("/tv-shows") ||
    PAGE_NAME.includes("/content") ||
    PAGE_NAME.includes("/player") ||
    PAGE_NAME.includes("/search") ||
    PAGE_NAME === "/admin" ||
    PAGE_NAME === "/maintenance"
  ) {
    // Set an API Ok Variable
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
    // If API is up and the current page is "Maintenance", redirect to movies page
    if (apiOk === true && PAGE_NAME === "/maintenance") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    // If API is down and the current page is not "Maintenance", redirect to Maintenance page
    if (apiOk === false && PAGE_NAME !== "/maintenance") {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }
}
// Proxy Config
export const config = {
  matcher: [
    "/home/:path*",
    "/movies/:path*",
    "/tv-shows/:path*",
    "/content/:path*",
    "/search/:path*",
    "/player/:path*",
    "/admin",
    "/maintenance",
  ],
};