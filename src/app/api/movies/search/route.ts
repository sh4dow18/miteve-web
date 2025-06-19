// Movie Search Endpoints Requirements
import { FindMoviesByTitle } from "@/lib/movies";
// Movie Search Endpoint Function
export async function GET(request: Request) {
  // Movie Search Main Constants
  const { searchParams } = new URL(request.url);
  const SEARCH = searchParams.get("search");
  const NEW_SEARCH = typeof SEARCH === "string" ? SEARCH : "";
  // Get all Movies from Search
  const RESPONSE = await FindMoviesByTitle(NEW_SEARCH);
  // Returns Movies List
  return Response.json(RESPONSE);
}