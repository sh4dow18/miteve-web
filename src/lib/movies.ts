// Movies Library Requirements
import moviesList from "@/db/movies.json";
import moviesExtraList from "@/db/movies-extra.json";
import { TMDB_API_KEY } from "./admin";
import { Content, MinimalContent } from "./types";
// Find multiple movies by movie ID list
export async function FindMoviesByIds(
  moviesIdsList: string[]
): Promise<MinimalContent[]> {
  // return moviesList.filter((movie) => moviesIdsList.includes(movie.id));
  const RESPONSE = await Promise.all(
    moviesIdsList.map((movieId) =>
      fetch(`http://localhost:8080/api/movies/minimal/${movieId}`).then(
        (response) => response.json()
      )
    )
  );
  return RESPONSE;
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
export async function FindRecomendationsByMovie(id: string) {
  return await fetch(
    `http://localhost:8080/api/movies/recommendations/${id}`
  ).then((response) => response.json());
}
// Find Movie by Id Function
export async function FindMovieById(id: string) {
  return await fetch(
    `http://localhost:8080/api/movies/${id}`
  ).then((response) => response.json());
}
// Find All Movie Cast From The Movie Database (TMDB) API
export async function FindAllMovieCastFromTMDB(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find All Movies Function
export function FindAllMovies(): Content[] {
  return moviesList;
}
