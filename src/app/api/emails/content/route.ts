// Content App Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Content App Endpoint Function
export async function POST(request: Request) {
  // Content App Endpoint Main Constants
  const BODY = await request.json();
  // Send the data to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/emails/content`, {
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
