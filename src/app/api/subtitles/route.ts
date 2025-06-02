// Get Subtitles Main Function
export async function GET(request: Request) {
  // Get Subtitles Main Constants
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  // Get Subtitles from API
  const SUBTITLES = await fetch(
    `http://localhost:8080/api/movies/subtitles/${ID}`
  ).then((response) => response.text());
  // Returns Subtitles
  return new Response(SUBTITLES, {
    headers: {
      "Content-Type": "text/vtt",
    },
  });
}
