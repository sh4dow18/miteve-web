// Update Movies Endpoint Requirements
import { TMDB_API_KEY } from "@/lib/admin";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
// Update Movies Endpoint Ids List
const MOVIES_IDS_LIST: string[] = [
  "589761",
  "136795",
  "845781",
  "1100795",
  "9502",
  "49444",
  "140300",
  "1011985",
  "533535",
  "95754",
  "639720",
  "493529",
  "822119",
  "447365",
  "912908",
  "335977",
  "1022789",
  "539972",
  "762509",
  "939243",
  "912649",
  "22538",
  "374720",
  "616",
  "550988",
  "64686",
  "603",
  "604",
  "605",
  "624860",
  "245891",
  "324552",
  "458156",
  "603692",
  "324786",
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
// Update Movies Endpoint Main Function
export async function PUT() {
  // Get all movie ID responses from the movie database (TMDB)
  const MOVIES_RESPONSES = await Promise.all(
    MOVIES_IDS_LIST.map((movieId) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  const MOVIES_RELEASE_DATES_LIST = await Promise.all(
    MOVIES_IDS_LIST.map((movieId) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  const MEXICO_RELEASE_DATEs_LIST = MOVIES_RELEASE_DATES_LIST.map((movie) =>
    movie.results.find(
      (movie: { iso_3166_1: string }) => movie.iso_3166_1 === "MX"
    )
  );
  // Get only the necessary information from the movies
  const FILTERED_MOVIES = MOVIES_RESPONSES.map((movie, index) => {
    const MEXICO_RELEASE_DATE = MEXICO_RELEASE_DATEs_LIST[index];
    const MEXICO_CERTIFICATION =
      MEXICO_RELEASE_DATE &&
      MEXICO_RELEASE_DATE.release_dates[0].certification !== ""
        ? MEXICO_RELEASE_DATE.release_dates[0].certification
        : "N/A";
    return {
      id: `${movie.id}`,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      genres: movie.genres,
      productionCompany: movie.production_companies[0].name,
      collection: movie.belongs_to_collection
        ? movie.belongs_to_collection.name
        : null,
      certification: COSTA_RICA_CLASIFICATIONS[MEXICO_CERTIFICATION],
    };
  });
  // Get File Path to add information
  const FILE_PATH = path.join(process.cwd(), "src/db", "movies.json");
  // Update current movie information
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(FILTERED_MOVIES, null, 2),
    "utf-8"
  );
  // Return Next Response
  return NextResponse.json({
    message: "Archivo Movies actualizado",
  });
}
