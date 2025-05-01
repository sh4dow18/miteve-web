// Update Series Endpoint Requirements
import { TMDB_API_KEY } from "@/lib/admin";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
// Update Series Endpoint Ids List
const SERIES_IDS_LIST: string[] = [
  "128839",
  "65930",
  "31356",
  "83095",
  "94954",
  "95479",
  "37585",
  "67230",
  "206586",
  "44006",
  "210879",
  "1399",
];
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
// Update Series Endpoint Main Function
export async function PUT() {
  // Get all Series ID responses from the movie database (TMDB)
  const SERIES_RESPONSES = await Promise.all(
    SERIES_IDS_LIST.map((seriesId) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  // Get all Series ID Ratings from the movie database (TMDB)
  const SERIES_RATINGS_LIST = await Promise.all(
    SERIES_IDS_LIST.map((seriesId) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/content_ratings?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  // Get all Series ID Cast from the movie database (TMDB)
  const SERIES_CAST_LIST = await Promise.all(
    SERIES_IDS_LIST.map((seriesId) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  // Get all Mexico Ratings List
  const MEXICO_RATINGS_LIST = SERIES_RATINGS_LIST.map((series) =>
    series.results.find(
      (movie: { iso_3166_1: string }) => movie.iso_3166_1 === "MX"
    )
  );
  // Get only the necessary information from the Series
  const FILTERED_SERIES = SERIES_RESPONSES.map((series, index) => {
    const MEXICO_RELEASE_DATE = MEXICO_RATINGS_LIST[index];
    const CREDITS = SERIES_CAST_LIST[index];
    const MEXICO_CERTIFICATION =
      MEXICO_RELEASE_DATE && MEXICO_RELEASE_DATE.rating !== ""
        ? MEXICO_RELEASE_DATE.rating
        : "N/A";
    const TOP_2 = `${CREDITS.cast
      .slice(0, 2)
      .map((actor: { name: string }) => actor.name)
      .join(", ")}, más`;
    return {
      id: `${series.id}`,
      title: series.name,
      image: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
      genres: series.genres,
      originCountry: series.origin_country[0],
      certification: COSTA_RICA_CLASIFICATIONS[MEXICO_CERTIFICATION],
      credits: TOP_2 === ", más" ? "N/A" : TOP_2,
    };
  });
  // Get File Path to add information
  const FILE_PATH = path.join(process.cwd(), "src/db", "series.json");
  // Update current Series information
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(FILTERED_SERIES, null, 2),
    "utf-8"
  );
  // Return Next Response
  return NextResponse.json({
    message: "Archivo Series actualizado",
  });
}
