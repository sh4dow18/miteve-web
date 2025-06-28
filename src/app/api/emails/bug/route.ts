// Report Bug Endpoint Requirements
import { API_HOST_IP } from "@/lib/admin";
// Report Bug Endpoint Function
export async function POST(request: Request) {
  // Report Bug Endpoint Main Constants
  const BODY = await request.formData();
  // Send the data to internal API endpoint
  const RESPONSE = await fetch(`${API_HOST_IP}/api/emails/bug`, {
    method: "POST",
    body: BODY,
  });
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
