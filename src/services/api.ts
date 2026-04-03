import { Container, Content, Episode, EpisodeMetadata, FullEpisode, Genre, MiniContainer, MiniSeason, NextEpisode, ShortContent } from "@/types";
import { API_HOST_IP } from "./admin";

export async function FindAllMovies(): Promise<Container[]> {
  return await fetch(`${API_HOST_IP}/containers/type/1`).then((response) =>
    response.json()
  );
}
export async function FindAllTvShows(): Promise<Container[]> {
  return await fetch(`${API_HOST_IP}/containers/type/2`).then((response) =>
    response.json()
  );
}
export async function FindContentById(id: string): Promise<Content> {
  return await fetch(`${API_HOST_IP}/contents/${id}`).then((response) =>
    response.json()
  );
}
export async function FindRecentContent(): Promise<Content[]> {
  return await fetch(`${API_HOST_IP}/contents/recent`).then((response) =>
    response.json()
  );
}
export async function FindComingSoonContent(): Promise<Content[]> {
  return await fetch(`${API_HOST_IP}/contents/soon`).then((response) =>
    response.json()
  );
}
export async function FindEpisodeMetadataById(
  id: string
): Promise<EpisodeMetadata> {
  return await fetch(`${API_HOST_IP}/episodes/metadata/${id}`).then(
    (response) => response.json()
  );
}
export async function FindNextEpisodeById(
  id: string
): Promise<NextEpisode | null> {
  const response = await fetch(`${API_HOST_IP}/episodes/next/${id}`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}
export async function FindAllContents(): Promise<ShortContent[]> {
  return await fetch(`${API_HOST_IP}/contents`).then(
    (response) => response.json()
  );
}
export async function FindAllContainers(): Promise<MiniContainer[]> {
  return await fetch(`${API_HOST_IP}/containers`).then(
    (response) => response.json()
  );
}
export async function FindAllGenres(): Promise<Genre[]> {
  return await fetch(`${API_HOST_IP}/genres`).then(
    (response) => response.json()
  );
}
export async function FindSeasonsByContentId(id: string): Promise<MiniSeason[]> {
  return await fetch(`${API_HOST_IP}/contents/${id}/seasons`).then(
    (response) => response.json()
  );
}
export async function FindEpisodesBySeasonId(id: string): Promise<FullEpisode[]> {
  return await fetch(`${API_HOST_IP}/seasons/${id}/episodes`).then(
    (response) => response.json()
  );
}

export function GetTmdbImage(url: string, size?: number): string {
  return `https://image.tmdb.org/t/p/${size ? `w${size}` : "original"}/${url}`;
}
