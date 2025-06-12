// Function that transforms String Time in Seconds as Number
function TimeToSeconds(hourString: string) {
  const hourParts = hourString.split(":").map(Number);
  const [hour, minutes, seconds] = hourParts;
  return hour * 3600 + minutes * 60 + seconds;
}
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
    beginIntro: TimeToSeconds(beginIntro),
    endIntro: TimeToSeconds(endIntro),
    beginCredits: TimeToSeconds(beginCredits),
  };
  // Update Episode Metadata to internal API endpoint
  const EPISODE_METADATA = await fetch(
    `http://localhost:8080/api/series/metadata/${id}/season/${seasonNumber}/episode/${episodeNumber}`,
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
