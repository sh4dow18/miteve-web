// Update All Episodes Metadata From Season Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
import { TimeToSeconds } from "@/lib/utils";
// Update All Episodes Metadata From Season Endpoint Main Function
export async function PUT(request: Request) {
  // Update All Episodes Metadata From Season Endpoint Constants
  const BODY = await request.json();
  const {
    id,
    seasonNumber,
    beginSummary,
    endSummary,
    beginIntro,
    endIntro,
    credits,
  } = BODY;
  const NEW_BODY = {
    beginSummary: beginSummary !== null ? TimeToSeconds(beginSummary) : null,
    endSummary: endSummary !== null ? TimeToSeconds(endSummary) : null,
    beginIntro: beginIntro !== null ? TimeToSeconds(beginIntro) : null,
    endIntro: endIntro !== null ? TimeToSeconds(endIntro) : null,
    credits: TimeToSeconds(credits),
  };
  console.log(NEW_BODY)
  // Update All Episodes Metadata From Season to internal API endpoint
  const EPISODES_METADATA_LIST = await fetch(
    `${API_HOST_IP}/api/series/metadata/all/${id}/season/${seasonNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NEW_BODY),
    }
  );
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await EPISODES_METADATA_LIST.json()), {
    headers: { "Content-Type": "application/json" },
    status: EPISODES_METADATA_LIST.status,
  });
}
