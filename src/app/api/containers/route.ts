// Containers Endpoints Requirements
import { API_HOST_IP } from "@/lib/admin";
// Get Containers Endpoint Main Function
export async function GET() {
  // Find All Containers from internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/containers`);
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
// Insert Container Endpoint Main Function
export async function POST(request: Request) {
  const BODY = await request.json();
  // Insert Container to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/containers`, {
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
