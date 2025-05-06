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
// Find Certification From Movie
export async function FindCertificationFromMovie(id: string) {
  return moviesList.find((movie) => movie.id === id)?.certification;
}
// Find Cast From Movie
export async function FindCastFromMovie(id: string) {
  return moviesList.find((movie) => movie.id === id)?.credits;
}
// Find the 10 First Recomendations From Movie Function
export function FindRecomendationsByMovie(id: string) {
  const MOVIE = moviesList.find((movie) => movie.id === id);
  const COLLECTION = MOVIE?.collection;
  const GENRE = MOVIE?.genres[0].name;
  const MOVIES_BY_SAME_COLLECTION_LIST = moviesList
    .filter((movie) => movie.collection === COLLECTION)
    .filter((movie) => movie.id !== id);
  const MOVIES_BY_GENRE_LIST = moviesList
    .filter((movie) => movie.genres.some((genre) => genre.name === GENRE))
    .filter((movie) => !MOVIES_BY_SAME_COLLECTION_LIST.includes(movie))
    .filter((movie) => movie.id !== id);
  return [...MOVIES_BY_SAME_COLLECTION_LIST, ...MOVIES_BY_GENRE_LIST].slice(
    0,
    10
  );
}
// Find Movie by Id Function
export function FindMovieById(id: string) {
  return moviesList.find((movie) => movie.id === id);
}
// Find All Movie Cast From The Movie Database (TMDB) API
export async function FindAllMovieCastFromTMDB(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}