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
export async function FindEpisodeMetadataById(id: string): Promise<EpisodeMetadata> {
  return await fetch(`${API_HOST_IP}/episodes/metadata/${id}`).then((response) =>
    response.json()
  );
}

export function GetTmdbImage(url: string, size: number): string {
  return `https://image.tmdb.org/t/p/w${size}/${url}`
}