import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const SERIES_IDS_LIST: string[] = [
  "128839",
  "65930",
  "31356",
  "58841",
  "83095",
  "94954",
  "95479",
  "37585",
  "67230",
  "206586",
];

export async function PUT() {
  const SERIES_RESPONSES = await Promise.all(
    SERIES_IDS_LIST.map((seriesId) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  const FILTERED_SERIES = SERIES_RESPONSES.map((series) => ({
    id: series.id,
    title: series.name,
    image: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
    genres: series.genres,
    origin_country: series.origin_country,
  }));
  const FILE_PATH = path.join(process.cwd(), "src/db", "series.json");
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(FILTERED_SERIES, null, 2),
    "utf-8"
  );
  return NextResponse.json({
    message: "Archivo JSON actualizado",
    filePath: "/src/db/series.json",
  });
}
