// Series Library Requirements
import { API_HOST_IP, TMDB_API_KEY } from "./admin";
import {
  MinimalContainer,
  SeriesContainer,
  SeriesContainerElement,
} from "./types";
// Find Series by Id
export async function FindSeriesById(id: string) {
  return await fetch(`${API_HOST_IP}/api/series/${id}`).then((response) =>
    response.json()
  );
}
// Find the Recomendations From Series Function
export async function FindRecomendationsBySeries(id: string) {
  return await fetch(`${API_HOST_IP}/api/series/recommendations/${id}`).then(
    (response) => response.json()
  );
}
// Find All Series Cast From The Movie Database (TMDB) API
export async function FindAllSeriesCastFromTMDB(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find all series containers
export async function FindSeriesContainers(): Promise<MinimalContainer[]> {
  const RESPONSE = await fetch(`${API_HOST_IP}/api/containers/series`).then(
    (response) => response.json()
  );
  return RESPONSE.filter(
    (container: { containerElementsList: { id: number }[] }) =>
      container.containerElementsList.length > 0
  ).map((container: SeriesContainer) => ({
    id: container.id,
    name: container.name,
    contentList: container.containerElementsList.map(
      (element: SeriesContainerElement) => element.series
    ),
  }));
}
// Find all SERIES that are coming soon
export async function FindSeriesSoon() {
  return await fetch(`${API_HOST_IP}/api/series/soon`).then(
    (response) => response.json()
  );
}
// Find all new series
export async function FindSeriesNew() {
  return await fetch(`${API_HOST_IP}/api/series/new`).then((response) =>
    response.json()
  );
}
// Find Season by Season Number and Series Id
export async function FindSeasonByNumber(id: string, seasonNumber: number) {
  return await fetch(
    `${API_HOST_IP}/api/series/${id}/season/${seasonNumber}`
  ).then((response) => response.json());
}
// Find Next Episode by Episode Number, Season Number and Series Id
export async function FindNextEpisodeByNumber(
  id: string,
  seasonNumber: string,
  episodeNumber: string
) {
  return await fetch(
    `${API_HOST_IP}/api/series/next/${id}/season/${seasonNumber}/episode/${episodeNumber}`
  ).then((response) => response.json());
}
// Find Episode Metadata by Episode Number, Season Number and Series Id
export async function FindEpisodeMetadataByNumber(
  id: string,
  seasonNumber: string,
  episodeNumber: string
) {
  return await fetch(
    `${API_HOST_IP}/api/series/metadata/${id}/season/${seasonNumber}/episode/${episodeNumber}`
  ).then((response) => response.json());
}
// Find Series by Title Function
export async function FindSeriesByTitle(title: string) {
  return await fetch(`${API_HOST_IP}/api/series/title/${title}`).then(
    (response) => response.json()
  );
}
