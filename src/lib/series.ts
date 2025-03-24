import seriesList from "@/db/series.json";
import seriesExtraList from "@/db/series-extra.json";
import { TMDB_API_KEY } from "./admin";

export function FindAnimes(): Content[] {
  return seriesList
    .filter((series) =>
      series.genres.some((genre) => genre.name === "Animación")
    )
    .filter((series) =>
      series.origin_country.some((country) => country === "JP")
    );
}

export function FindSeriesByCountry(countrySent: string) {
  return seriesList.filter((series) =>
    series.origin_country.some((country) => country === countrySent)
  );
}

export async function FindTMDBSeriesById(id: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}

export function FindSeriesTrailerById(id: string) {
  return seriesExtraList.find((series) => `${series.id}` === id)?.trailer;
}

export function FindSeasonsAvailable(id: string, seasons: any[]) {
  const SEASONS_AVAILABLE = seriesExtraList.find(
    (series) => `${series.id}` === id
  )?.seasons;
  return seasons.filter((season) =>
    SEASONS_AVAILABLE?.includes(season.season_number)
  );
}

export async function FindTMDBSeasonById(id: string, seasonId: string) {
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${seasonId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
  ).then((response) => response.json());
}

export function FindUncompleteSeason(id: string, seasonId: string) {
  return seriesExtraList
    .find((series) => `${series.id}` === id)
    ?.uncompleteSeason?.find((season) => `${season.number}` === seasonId);
}
