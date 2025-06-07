// Get Season Endpoint Requirements
import { FindSeasonByNumber } from "@/lib/series";
// Get Season Endpoint Main Function
export async function GET(request: Request) {
  // Get Season Endpoint Main Constants
  const { searchParams } = new URL(request.url);
  const GET_ID = searchParams.get("id");
  const GET_SEASON_ID = searchParams.get("season");
  const ID = typeof GET_ID === "string" ? GET_ID : "1";
  const SEASON_ID = typeof GET_SEASON_ID === "string" ? GET_SEASON_ID : "1";
  // Get Season from a Specific Series
  const SEASON = await FindSeasonByNumber(ID, Number.parseInt(SEASON_ID));
  // Returns Season
  return Response.json(SEASON);
}
