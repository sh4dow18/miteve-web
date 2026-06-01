import { TMDB_API_KEY } from "@/shared/config/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  const TYPE = searchParams.get("type");
  const QUERY = searchParams.get("query");

  let url: string;
  if (QUERY) {
    url = `https://api.themoviedb.org/3/search/${TYPE}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(QUERY)}&language=es-MX&page=1`;
  } else {
    url = `https://api.themoviedb.org/3/${TYPE}/${ID}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`;
  }

  const RESPONSE = await fetch(url);
  return new Response(JSON.stringify(await RESPONSE.json()), {
    headers: { "Content-Type": "application/json" },
    status: RESPONSE.status,
  });
}
