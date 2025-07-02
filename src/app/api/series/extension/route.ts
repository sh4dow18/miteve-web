// Update Extension Series Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Update Extension Series Endpoint Main Function
export async function PUT(request: Request) {
  const BODY = await request.json();
  // Update Extension Series to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/series/extension`, {
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