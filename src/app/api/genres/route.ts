export async function GET(request: Request) {
  // Get all Episodes from a Specific Season from a Specific Series
  const GENRES = await fetch("http://localhost:8080/api/genres").then(
    (response) => response.json()
  );
  // Returns Episodes List
  return Response.json(GENRES);
}
