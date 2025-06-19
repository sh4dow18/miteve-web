// Middleware Requirements
import { API_HOST_IP } from "@/lib/admin";
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
    try {
      console.log(`${API_HOST_IP}/api/utils/health`);
      const RESPONSE = await fetch(`${API_HOST_IP}/api/utils/health`, {
        method: "HEAD",
      });
      console.log(RESPONSE)
      apiOk = RESPONSE.ok;
    } catch (e) {
      console.log(e);
      apiOk = false;
    }
    // If api is up and the current page is "Error", redirect to movies page
    if (apiOk === true && PAGE_NAME === "/error") {
      return NextResponse.redirect(new URL("/movies", request.url));
    }
    // If api is down and the current page is not "Error", redirect to error page
    if (apiOk === false && PAGE_NAME !== "/error") {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }
}
