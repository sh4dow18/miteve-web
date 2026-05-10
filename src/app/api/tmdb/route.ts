import { TMDB_API_KEY } from "@/shared/config/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  const TYPE = searchParams.get("type");
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/${TYPE}/${ID}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  );
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
