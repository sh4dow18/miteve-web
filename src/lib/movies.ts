// Movies Library Requirements
import { API_HOST_IP, TMDB_API_KEY } from "./admin";
import {
  MinimalContainer,
  MovieContainer,
  MovieContainerElement,
} from "./types";
// Find all movies containers
export async function FindMoviesContainers(): Promise<MinimalContainer[]> {
  const RESPONSE = await fetch(`${API_HOST_IP}/api/containers/movies`).then(
    (response) => response.json()
  );
  return RESPONSE.filter(
    (container: { containerElementsList: { id: number }[] }) =>
      container.containerElementsList.length > 0
  ).map((container: MovieContainer) => ({
    id: container.id,
    name: container.name,
    contentList: container.containerElementsList.map(
      (element: MovieContainerElement) => element.movie
    ),
  }));
}
// Find all movies that are coming soon
export async function FindMoviesSoon() {
  return await fetch(`${API_HOST_IP}/api/movies/soon`).then((response) =>
    response.json()
  );
}
// Find the 10 First Recomendations From Movie Function
export async function FindRecomendationsByMovie(id: string) {
  return await fetch(`${API_HOST_IP}/api/movies/recommendations/${id}`).then(
    (response) => response.json()
  );
}
// Find Movie by Id Function
export async function FindMovieById(id: string) {
  return await fetch(`${API_HOST_IP}/api/movies/${id}`).then((response) =>
    response.json()
  );
}
// Find All Movie Cast From The Movie Database (TMDB) API
export async function FindAllMovieCastFromTMDB(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find Movies by Title Function
export async function FindMoviesByTitle(title: string) {
  return await fetch(`${API_HOST_IP}/api/movies/title/${title}`).then(
    (response) => response.json()
  );
}
