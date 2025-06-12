// Series Library Requirements
import seriesList from "@/db/series.json";
import seriesExtraList from "@/db/series-extra.json";
import { TMDB_API_KEY } from "./admin";
import {
  MinimalContainer,
  Series,
  SeriesContainer,
  SeriesContainerElement,
} from "./types";
// Find all the anime series
export function FindAnimes() {
  return seriesList
    .filter((series) =>
      series.genres.some((genre) => genre.name === "Animación")
    )
    .filter((series) => series.originCountry === "JP");
}
// Find Series by Prop Value
export function FindSeriesByProp(prop: keyof Series, value: string) {
  return seriesList.filter((series) => series[prop] === value);
}
// Find Series Information from The Movie Database (TMDB)
export async function FindTMDBSeriesById(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find Series Trailer by Id
export function FindSeriesTrailerById(id: string) {
  return seriesExtraList.find((series) => series.id === id)?.trailer;
}
// Find all seasons available in project
export function FindSeasonsAvailable(id: string) {
  return seriesExtraList.find((series) => series.id === id)?.seasons;
}
// Find information about a specific season of a specific series
export async function FindTMDBSeasonById(id: string, seasonId: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${seasonId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find a season that is incomplete in the project
export function FindUncompleteSeason(id: string, seasonId: string) {
  return seriesExtraList
    .find((series) => series.id === id)
    ?.uncompleteSeasons?.find((season) => `${season.number}` === seasonId);
}
// Find Series by Id
export async function FindSeriesById(id: string) {
  return await fetch(`http://localhost:8080/api/series/${id}`).then(
    (response) => response.json()
  );
}
// Find Certification From Series
export async function FindCertificationFromSeries(id: string) {
  return seriesList.find((series) => series.id === id)?.certification;
}
// Find Cast From Series
export async function FindCastFromSeries(id: string) {
  return seriesList.find((series) => series.id === id)?.credits;
}
// Find the Recomendations From Series Function
export async function FindRecomendationsBySeries(id: string) {
  return await fetch(
    `http://localhost:8080/api/series/recommendations/${id}`
  ).then((response) => response.json());
}
// Find All Series Cast From The Movie Database (TMDB) API
export async function FindAllSeriesCastFromTMDB(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}
// Find All Series Function
export function FindAllSeries(): Series[] {
  return seriesList;
}
// Find all series containers
export async function FindSeriesContainers(): Promise<MinimalContainer[]> {
  const RESPONSE = await fetch(
    "http://localhost:8080/api/containers/series"
  ).then((response) => response.json());
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
// Find Season by Season Number and Series Id
export async function FindSeasonByNumber(id: string, seasonNumber: number) {
  return await fetch(
    `http://localhost:8080/api/series/${id}/season/${seasonNumber}`
  ).then((response) => response.json());
}
// Find Next Episode by Episode Number, Season Number and Series Id
export async function FindNextEpisodeByNumber(
  id: string,
  seasonNumber: string,
  episodeNumber: string
) {
  return await fetch(
    `http://localhost:8080/api/series/next/${id}/season/${seasonNumber}/episode/${episodeNumber}`
  ).then((response) => response.json());
}
// Find Episode Metadata by Episode Number, Season Number and Series Id
export async function FindEpisodeMetadataByNumber(
  id: string,
  seasonNumber: string,
  episodeNumber: string
) {
  return await fetch(
    `http://localhost:8080/api/series/metadata/${id}/season/${seasonNumber}/episode/${episodeNumber}`
  ).then((response) => response.json());
}
