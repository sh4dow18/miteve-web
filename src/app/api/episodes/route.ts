// Update Episode Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
import { TimeToSeconds } from "@/lib/utils";
// Update Episode Endpoint Main Function
export async function PUT(request: Request) {
  // Update Episode Endpoint Constants
  const BODY = await request.json();
  const {
    id,
    seasonNumber,
    episodeNumber,
    beginSummary,
    endSummary,
    beginIntro,
    endIntro,
    beginCredits,
  } = BODY;
  const NEW_BODY = {
    beginSummary: beginSummary !== null ? TimeToSeconds(beginSummary) : null,
    endSummary: endSummary !== null ? TimeToSeconds(endSummary) : null,
    beginIntro: beginIntro !== null ? TimeToSeconds(beginIntro) : null,
    endIntro: endIntro !== null ? TimeToSeconds(endIntro) : null,
    beginCredits: TimeToSeconds(beginCredits),
  };
  // Update Episode Metadata to internal API endpoint
  const EPISODE_METADATA = await fetch(
    `${API_HOST_IP}/api/series/metadata/${id}/season/${seasonNumber}/episode/${episodeNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NEW_BODY),
    }
  );
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await EPISODE_METADATA.json()), {
    headers: { "Content-Type": "application/json" },
    status: EPISODE_METADATA.status,
  });
}
