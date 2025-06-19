// Get Subtitles Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Get Subtitles Main Function
export async function GET(request: Request) {
  // Get Subtitles Main Constants
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  const TYPE = searchParams.get("type");
  const SEASON = searchParams.get("season");
  const EPISODE = searchParams.get("episode");
  // Get Subtitles from API
  const SUBTITLES = await fetch(
    `${API_HOST_IP}/api/${TYPE}/subtitles/${ID}${
      TYPE === "series" ? `/season/${SEASON}/episode/${EPISODE}` : ""
    }`
  ).then((response) => response.text());
  // Returns Subtitles
  return new Response(SUBTITLES, {
    headers: {
      "Content-Type": "text/vtt",
    },
  });
}
