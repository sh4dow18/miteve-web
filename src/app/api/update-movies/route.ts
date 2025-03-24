import { TMDB_API_KEY } from "@/lib/admin";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

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

export async function PUT() {
  const MOVIES_RESPONSES = await Promise.all(
    MOVIES_IDS_LIST.map((movieId) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      ).then((response) => response.json())
    )
  );
  const FILTERED_MOVIES = MOVIES_RESPONSES.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    genres: movie.genres,
  }));
  const FILE_PATH = path.join(process.cwd(), "src/db", "movies.json");
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(FILTERED_MOVIES, null, 2),
    "utf-8"
  );
  return NextResponse.json({
    message: "Archivo JSON actualizado",
    filePath: "/src/db/movies.json",
  });
}
