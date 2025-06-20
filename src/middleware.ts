// Middleware Requirements
import { API_HOST_IP, SECURITY_PASSWORD } from "@/lib/admin";
import { NextResponse, NextRequest } from "next/server";
// Middleware Main Function
export async function middleware(request: NextRequest) {
  // Middleware Main Constants
  const PAGE_NAME = request.nextUrl.pathname;
  // Check if the page is a async page that needs the internal API
  if (
    PAGE_NAME.includes("/movies") ||
    PAGE_NAME.includes("/series") ||
    PAGE_NAME.includes("/player") ||
    PAGE_NAME === "/admin" ||
    PAGE_NAME === "/error"
  ) {
    let apiOk = true;
    const CONTROLLER = new AbortController();
    const TIMEOUT = setTimeout(() => CONTROLLER.abort(), 1000);
    try {
      const RESPONSE = await fetch(`${API_HOST_IP}/api/utils/health`, {
        method: "HEAD",
        signal: CONTROLLER.signal,
      });
      apiOk = RESPONSE.ok;
    } catch {
      apiOk = false;
    } finally {
      clearTimeout(TIMEOUT);
    }
    // If api is up and the current page is "Error", redirect to movies page
    if (apiOk === true && PAGE_NAME === "/error") {
      return NextResponse.redirect(new URL("/movies", request.url));
    }
    // If api is down and the current page is not "Error", redirect to error page
    if (apiOk === false && PAGE_NAME !== "/error") {
      return NextResponse.redirect(new URL("/error", request.url));
    }
    // If it is the admin page, check if the secret password was sent, if not, redirect to 404
    if (
      PAGE_NAME === "/admin" &&
      request.nextUrl.searchParams.get("secret") !== SECURITY_PASSWORD
    ) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }
}
