// Insert Series Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Insert Series Endpoint Function
export async function POST(request: Request) {
  // Insert Series Endpoint Main Constants
  const BODY = await request.json();
  // Send the Series data to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/series`, {
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
// Update Series Endpoint Main Function
export async function PUT(request: Request) {
  const BODY = await request.json();
  // Update Series to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/series`, {
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
