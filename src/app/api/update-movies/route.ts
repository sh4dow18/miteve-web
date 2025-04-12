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
];
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
  // Get only the necessary information from the movies
  const FILTERED_MOVIES = MOVIES_RESPONSES.map((movie) => ({
    id: `${movie.id}`,
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    genres: movie.genres,
    productionCompany: movie.production_companies[0].name
  }));
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
