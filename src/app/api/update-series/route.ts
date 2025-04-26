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
  "1399"
];
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
  // Get only the necessary information from the Series
  const FILTERED_SERIES = SERIES_RESPONSES.map((series) => ({
    id: `${series.id}`,
    title: series.name,
    image: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
    genres: series.genres,
    originCountry: series.origin_country[0],
  }));
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
