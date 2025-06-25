// Insert Movie Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Insert Movie Endpoint Function
export async function POST(request: Request) {
  // Insert Movie Endpoint Main Constants
  const BODY = await request.json();
  // Send the Movie data to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(BODY),
  });
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
// Update Movie Endpoint Main Function
export async function PUT(request: Request) {
  const BODY = await request.json();
  // Update Movie to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/movies`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(BODY),
  });
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
