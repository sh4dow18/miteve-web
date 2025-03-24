import moviesList from "@/db/movies.json";
import moviesExtraList from "@/db/movies-extra.json";
import { TMDB_API_KEY } from "./admin";

export function FindMoviesByIds(moviesIdsList: number[]): Content[] {
  return moviesList.filter((movie) => moviesIdsList.includes(movie.id));
}
export async function FindTMDBMovieById(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
export function FindMoviesTrailerById(id: string) {
  return moviesExtraList.find((movie) => `${movie.id}` === id)?.trailer;
}
