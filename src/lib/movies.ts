// Movies Library Requirements
import moviesList from "@/db/movies.json";
import moviesExtraList from "@/db/movies-extra.json";
import { TMDB_API_KEY } from "./admin";
import { Content } from "./types";
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
export function FindMoviesByProp(prop: keyof Content, value: string): Content[] {
  return moviesList.filter((movie: Content) => movie[prop] === value);
}
// Find Movies by Collection
export function FindMoviesByCollection(collection: string) {
  return moviesList.filter((movie: Content) => movie.collection === collection)
}
