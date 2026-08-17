import { TMDB_API_KEY } from "@/shared/config/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get("genreId");
  const type = searchParams.get("type") || "movie";

  if (!genreId) {
    return new Response(
      JSON.stringify({ error: "genreId is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=vote_count.desc&language=es-MX&page=1`;

  const response = await fetch(url);
  return new Response(JSON.stringify(await response.json()), {
    headers: { "Content-Type": "application/json" },
    status: response.status,
  });
}
