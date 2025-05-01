// Get Seasons Available Endpoint Requirements
import { FindSeasonsAvailable } from "@/lib/series";
// Get Seasons Available Endpoint Main Function
export async function GET(req: Request) {
  // Get Seasons Available Endpoint Main Constants
  const { searchParams } = new URL(req.url);
  const ID = searchParams.get("id") || "1";
  // Returns the Seasons Available in Miteve
  return Response.json(FindSeasonsAvailable(ID));
}
