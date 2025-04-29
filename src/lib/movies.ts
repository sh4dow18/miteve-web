// Movies Library Requirements
import moviesList from "@/db/movies.json";
import moviesExtraList from "@/db/movies-extra.json";
import { TMDB_API_KEY } from "./admin";
import { Content } from "./types";
const COSTA_RICA_CLASIFICATIONS: Record<string, string> = {
  AA: "Todo Público",
  A: "Todo Público",
  B: "+12",
  B15: "+15",
  C: "+18",
  D: "+18",
};
// Find multiple movies by movie ID list
export function FindMoviesByIds(moviesIdsList: string[]): Content[] {
  return moviesList.filter((movie) => moviesIdsList.includes(movie.id));
}
// Find Movie Information from The Movie Database (TMDB)
export async function FindTMDBMovieById(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find Movie Trailer by Id
export function FindMoviesTrailerById(id: string) {
  return moviesExtraList.find((movie) => `${movie.id}` === id)?.trailer;
}
// Find Movie by Prop Value
export function FindMoviesByProp(
  prop: keyof Content,
  value: string
): Content[] {
  return moviesList.filter((movie: Content) => movie[prop] === value);
}
// Find Movies by Collection
export function FindMoviesByCollection(collection: string) {
  return moviesList.filter((movie: Content) => movie.collection === collection);
}
// Find Certification From Movie of the Movie Database (TMDB)
export async function FindCertificationFromMovie(id: string) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  const MEXICO_CLASIFICATION =
    RESPONSE.results.find(
      (movie: { iso_3166_1: string }) => movie.iso_3166_1 === "MX"
    ).release_dates[0]?.certification || "N/A";
  return COSTA_RICA_CLASIFICATIONS[MEXICO_CLASIFICATION];
}
// Find Cast From Movie of the Movie Database (TMDB)
export async function FindCastFromMovie(id: string) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
  const TOP_2 = RESPONSE.cast
    .slice(0, 2)
    .map((actor: { name: string }) => actor.name);
  return RESPONSE.cast.length > 2
    ? `${TOP_2.join(", ")}, más`
    : TOP_2.join(", ");
}
