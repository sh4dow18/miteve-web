// Get Content from The Movie Database Endpoint Requirements
import { TMDB_API_KEY } from "@/lib/admin";
const COSTA_RICA_CLASIFICATIONS: Record<string, string> = {
  AA: "Todo Público",
  A: "Todo Público",
  B: "+12",
  B15: "+15",
  "B-15": "+15",
  C: "+18",
  D: "+18",
  "N/A": "N/A",
};
// Get Content from The Movie Database Endpoint Main Function
export async function GET(request: Request) {
  // Get Content from The Movie Database Endpoint Main Constants
  const { searchParams } = new URL(request.url);
  const ID = searchParams.get("id");
  const SERIES = searchParams.get("series");
  // Get all Content Information
  const CONTENT = await fetch(
    `https://api.themoviedb.org/3/${
      SERIES === null ? "movie" : "tv"
    }/${ID}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  // Get all Certifications from the Content
  const CERTIFICATIONS = await fetch(
    `https://api.themoviedb.org/3/${SERIES === null ? "movie" : "tv"}/${ID}/${
      SERIES === null ? "release_dates" : "content_ratings"
    }?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  // Get all Credits from Content
  const CREDITS = await fetch(
    `https://api.themoviedb.org/3/${
      SERIES === null ? "movie" : "tv"
    }/${ID}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  // Get all Mexico Certifications
  const MEXICO_CERTIFICATIONS = CERTIFICATIONS.results
    ? CERTIFICATIONS.results.find(
        (movie: { iso_3166_1: string }) => movie.iso_3166_1 === "MX"
      )
    : null;
  // Get First Mexico Certification
  const CERTIFICATION =
    SERIES === null
      ? MEXICO_CERTIFICATIONS &&
        MEXICO_CERTIFICATIONS.release_dates[0].certification !== ""
        ? MEXICO_CERTIFICATIONS.release_dates[0].certification
        : "N/A"
      : MEXICO_CERTIFICATIONS && MEXICO_CERTIFICATIONS.rating !== ""
      ? MEXICO_CERTIFICATIONS.rating
      : "N/A";
  // Get First 2 Cast Actors
  const CAST = CREDITS.cast
    ? `${CREDITS.cast
        .slice(0, 2)
        .map((actor: { name: string }) => actor.name)
        .join(", ")}, más`
    : null;
  // Returns Content Information
  return Response.json({
    ...CONTENT,
    classification: COSTA_RICA_CLASIFICATIONS[CERTIFICATION],
    cast: CAST !== ", más" && CAST !== null ? CAST : "N/A",
  });
}
