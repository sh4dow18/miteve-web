export type Content = {
  id: string;
  title: string;
  image: string;
  genres: Genre[];
  productionCompany: string;
  collection: string | null;
  certification: string;
  credits: string;
};
export type MinimalContent = {
  id: string;
  title: string;
  cover: string;
};
export type Genre = {
  id: number;
  name: string;
};
export type Episode = {
  episodeNumber: number;
  cover: string;
  title: string;
  description: string;
};
export type Season = {
  season_number: number;
  poster_path: string;
  name: string;
};
export type Series = {
  id: string;
  title: string;
  image: string;
  genres: Genre[];
  originCountry: string;
  certification: string;
  credits: string;
};
export type MinimalSeries = {
  id: string;
  title: string;
  cover: string;
};
export type UncompleteSeason = {
  number: number;
  from: number;
  to: number;
};
export type SeriesExtra = {
  id: string;
  trailer: string;
  seasons: number[];
  uncompleteSeasons?: UncompleteSeason[];
};
export type Actor = {
  profile_path: string;
  name: string;
  character: string;
};
export type TMBD_CONTENT = {
  id: string;
  title: string;
  year: string;
  tagline: string;
  description: string;
  rating: string;
  originCountry?: string;
  classification: string;
  cast: string;
  company?: string;
  collection?: string;
  cover: string;
  background: string;
};
export type TMDB_EPISODE = {
  episode_number: string;
  name: string;
  overview: string;
  still_path: string;
};
export type CONTAINER = {
  id: number;
  name: string;
  type: string;
};
export type MovieContainer = {
  id: number;
  name: string;
  containerElementsList: MovieContainerElement[];
}
export type SeriesContainer = {
  id: number;
  name: string;
  containerElementsList: SeriesContainerElement[];
}
export type MovieContainerElement = {
  orderNumber: number;
  movie: MinimalContent;
}
export type SeriesContainerElement = {
  orderNumber: number;
  series: MinimalContent;
}
export type MinimalContainer = {
  id: number;
  name: string;
  contentList: MinimalContent[];
}
