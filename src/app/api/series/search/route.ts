// Movie Search Endpoints Requirements
import { FindSeriesByTitle } from "@/lib/series";
// Movie Search Endpoint Function
export async function GET(request: Request) {
  // Movie Search Main Constants
  const { searchParams } = new URL(request.url);
  const SEARCH = searchParams.get("search");
  const NEW_SEARCH = typeof SEARCH === "string" ? SEARCH : "";
  // Get all Movies from Search
  const RESPONSE = await FindSeriesByTitle(NEW_SEARCH);
  // Returns Movies List
  return Response.json(RESPONSE);
}