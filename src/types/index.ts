export interface Container {
  id: number;
  name: string;
  elementsList: ContainerElement[];
}

export interface ContainerRequest {
  name: string;
}

export interface ContainerElement {
  id: number;
  position: number;
  content: MiniContent;
}

export interface MiniContent {
  id: string;
  cover: string;
  title: string;
}

export interface Content {
  id: string;
  tmdbId: number;
  title: string;
  year: number;
  tagline: string | null;
  description: string;
  rating: number;
  age: number;
  cover: string;
  background: string;
  trailer: string;
  trailerDuration: number;
  comingSoon: boolean;
  createdDate: string;
  note: string | null;
  genresList: Genre[];
  type: string;
  seasonsList: Season[];
  container: MiniContainer;
  position: number;
}

export interface ShortContent {
  id: string;
  title: string;
  year: number;
  rating: number;
  age: number;
  comingSoon: boolean;
  createdDate: string;
  type: string;
}

export interface ContentRequest {
  tmdbId: number;
  title: string;
  year: number;
  tagline: string | null;
  description: string;
  rating: number;
  age: number;
  cover: string;
  background: string;
  trailer: string;
  trailerDuration: number;
  comingSoon: boolean;
  note: string | null;
  typeId: number;
  genresList: number[];
  containerId: number;
  containerPosition: number;
}

export interface Genre {
  id: number;
  name: string;
}
export interface GenreRequest {
  name: string;
}
export interface MiniContainer {
  id: number;
  name: string;
}

export interface MiniSeason {
  id: string;
  seasonNumber: number;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodesList: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  cover: string;
}

export interface EpisodeMetadata {
  id: string;
  title: string;
  episodeNumber: number;
  beginSummary: number | null;
  endSummary: number | null;
  beginIntro: number | null;
  endIntro: number | null;
  beginCredits: number | null;
}
export interface FullEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  cover: string;
  beginSummary: number | null;
  endSummary: number | null;
  beginIntro: number | null;
  endIntro: number | null;
  beginCredits: number | null;
}
export interface EpisodeRequest {
  episodeNumber: number;
  title: string;
  description: string;
  beginIntro: number | null;
  endIntro: number | null;
  beginSummary: number | null;
  endSummary: number | null;
  beginCredits: number | null;
}
export type TMDB_EPISODE = {
  episode_number: string;
  name: string;
  overview: string;
  still_path: string;
};
export interface NextEpisode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
}

export type TabType =
  | "content"
  | "containers"
  | "genres"
  | "seasons"
  | "episodes";
