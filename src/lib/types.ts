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
  episode_number: number;
  still_path: string;
  name: string;
  overview: string;
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
}