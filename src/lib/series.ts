// Series Library Requirements
import seriesList from "@/db/series.json";
import seriesExtraList from "@/db/series-extra.json";
import { TMDB_API_KEY } from "./admin";
import { Season, Series, SeriesExtra } from "./types";
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
export function FindSeasonsAvailable(id: string, seasons: Season[]) {
  const SEASONS_AVAILABLE = seriesExtraList.find(
    (series) => series.id === id
  )?.seasons;
  return seasons.filter((season) =>
    SEASONS_AVAILABLE?.includes(season.season_number)
  );
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
export function FindSeriesById(id: string): SeriesExtra | undefined {
  return seriesExtraList.find((series) => series.id === id);
}
// Find Certification From Series
export async function FindCertificationFromSeries(id: string) {
  return seriesList.find((series) => series.id === id)?.certification;
}
// Find Cast From Series
export async function FindCastFromSeries(id: string) {
  return seriesList.find((series) => series.id === id)?.credits;
}
// Find the 10 First Recomendations From Series Function
export function FindRecomendationsBySeries(id: string) {
  const SERIES = seriesList.find((movie) => movie.id === id);
  const GENRE = SERIES?.genres[0].name;
  const MOVIES_BY_GENRE_LIST = seriesList
    .filter((series) => series.genres.some((genre) => genre.name === GENRE))
    .filter((series) => series.id !== id);
  return MOVIES_BY_GENRE_LIST.slice(0, 10);
}
