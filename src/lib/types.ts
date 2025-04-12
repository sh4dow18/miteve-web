export type Content = {
  id: string;
  title: string;
  image: string;
  genres: Genre[];
  productionCompany: string;
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
};