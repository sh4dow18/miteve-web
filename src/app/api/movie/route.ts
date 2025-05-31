// Get Episodes Endpoint Requirements
import { TMDB_API_KEY } from "@/lib/admin";
const COSTA_RICA_CLASIFICATIONS: Record<string, string> = {
  AA: "Todo Público",
  A: "Todo Público",
  B: "+12",
  B15: "+15",
  "B-15": "+15",
  C: "+18",
  D: "+18",
};
// Get Episodes Endpoint Main Function
export async function GET(request: Request) {
  // Get Episodes Endpoint Main Constants
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  // Get all Episodes from a Specific Season from a Specific Series
  const MOVIE = await fetch(
    `https://api.themoviedb.org/3/movie/${ID}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  const MOVIES_RELEASE_DATES = await fetch(
    `https://api.themoviedb.org/3/movie/${ID}/release_dates?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  const CREDITS = await fetch(
    `https://api.themoviedb.org/3/movie/${ID}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  const MEXICO_RELEASE_DATE = MOVIES_RELEASE_DATES.results.find(
    (movie: { iso_3166_1: string }) => movie.iso_3166_1 === "MX"
  );
  const CERTIFICATION =
    MEXICO_RELEASE_DATE &&
    MEXICO_RELEASE_DATE.release_dates[0].certification !== ""
      ? COSTA_RICA_CLASIFICATIONS[
          MEXICO_RELEASE_DATE.release_dates[0].certification
        ]
      : "N/A";
  // Returns Episodes List
  return Response.json({
    ...MOVIE,
    classification: CERTIFICATION,
    cast: `${CREDITS.cast
      .slice(0, 2)
      .map((actor: { name: string }) => actor.name)
      .join(", ")}, más`,
  });
}
