// Insert Movie Endpoint Function
export async function POST(request: Request) {
  // Insert Movie Endpoint Main Constants
  const BODY = await request.json();
  // Send the Movie data to internal API endpoint
  const RESPONSE = await fetch("http://localhost:8080/api/movies", {
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