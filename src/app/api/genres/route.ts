export async function GET() {
  // Get all Episodes from a Specific Season from a Specific Series
  const GENRES = await fetch("http://localhost:8080/api/genres").then(
    (response) => response.json()
  );
  // Returns Episodes List
  return Response.json(GENRES);
}
// Insert Genre Endpoint Function
export async function POST(request: Request) {
  // Insert Genre Endpoint Main Constants
  const BODY = await request.json();
  // Send the genre data to internal API endpoint
  const RESPONSE = await fetch("http://localhost:8080/api/genres", {
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
