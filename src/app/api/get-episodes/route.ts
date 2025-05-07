// Get Episodes Endpoint Requirements
import { TMDB_API_KEY } from "@/lib/admin";
// Get Episodes Endpoint Main Function
export async function GET(request: Request) {
  // Get Episodes Endpoint Main Constants
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  const SEASON_ID = searchParams.get("season");
  // Get all Episodes from a Specific Season from a Specific Series
  const EPISODES_LIST = await fetch(
    `https://api.themoviedb.org/3/tv/${ID}/season/${SEASON_ID}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  // Returns Episodes List
  return Response.json(EPISODES_LIST);
}
