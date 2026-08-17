import { TMDB_API_KEY } from "@/shared/config/env";
import { API_HOST_IP } from "@/shared/config/env";

export interface TmdbMovieItem {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
}

export interface GenreMovies {
  genreId: number;
  genreName: string;
  movies: TmdbMovieItem[];
}

const TMDB_GENRES: { id: number; name: string; keyword?: number }[] = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familiar" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia Ficción" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" },
  { id: 99, name: "Documental" },
  { id: 9648, name: "Misterio" },
  { id: 10402, name: "Musical" },
  { id: 16, name: "Anime", keyword: 210024 },
];

type RawTMDBItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
};

function mapItem(m: RawTMDBItem): TmdbMovieItem {
  return {
    id: m.id,
    title: m.title || m.name || "",
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    overview: m.overview,
    voteAverage: m.vote_average,
    releaseDate: m.release_date || m.first_air_date || "",
    genreIds: m.genre_ids,
  };
}

async function fetchPage(
  type: "movie" | "tv",
  genreId: number,
  page: number,
  keywordId?: number
): Promise<TmdbMovieItem[]> {
  try {
    let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=200&language=es-MX&page=${page}`;
    if (keywordId) {
      url += `&with_keywords=${keywordId}`;
    }
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(mapItem);
  } catch {
    return [];
  }
}

async function fetchGenreContentUntil15(
  type: "movie" | "tv",
  genreId: number,
  genreName: string,
  usedIds: Set<number>,
  existing: { tmdbIds: Set<number>; titles: Set<string> },
  keywordId?: number
): Promise<GenreMovies> {
  const unique: TmdbMovieItem[] = [];

  for (let page = 1; page <= 30; page++) {
    const items = await fetchPage(type, genreId, page, keywordId);
    if (items.length === 0) break;

    for (const item of items) {
      if (usedIds.has(item.id)) continue;
      if (existing.tmdbIds.has(item.id)) continue;

      const titleNorm = item.title.trim().toLowerCase();
      if (existing.titles.has(titleNorm)) continue;

      usedIds.add(item.id);
      unique.push(item);
      if (unique.length === 30) break;
    }

    if (unique.length === 30) break;
  }

  return { genreId, genreName, movies: unique };
}

async function fetchExistingContent(): Promise<{ tmdbIds: Set<number>; titles: Set<string> }> {
  try {
    const data = await fetch(`${API_HOST_IP}/contents?page=0&size=9999`).then(
      (response) => response.json()
    );
    const items: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.content ?? []);

    const tmdbIds = new Set<number>();
    const titles = new Set<string>();

    for (const item of items) {
      const tmdbId = item.tmdbId;
      if (typeof tmdbId === "number" && tmdbId > 0) {
        tmdbIds.add(tmdbId);
      }
      const title = item.title;
      const year = item.year;
      if (typeof title === "string" && typeof year === "number") {
        titles.add(title.trim().toLowerCase());
        titles.add(`${title.trim().toLowerCase()}_${year}`);
      }
    }

    return { tmdbIds, titles };
  } catch {
    return { tmdbIds: new Set(), titles: new Set() };
  }
}

async function fetchByType(type: "movie" | "tv"): Promise<GenreMovies[]> {
  const existing = await fetchExistingContent();
  const usedIds = new Set<number>();
  const results: GenreMovies[] = [];

  for (const genre of TMDB_GENRES) {
    const genreItems = await fetchGenreContentUntil15(
      type,
      genre.id,
      genre.name,
      usedIds,
      existing,
      genre.keyword
    );
    if (genreItems.movies.length > 0) {
      results.push(genreItems);
    }
  }

  return results.sort((a, b) => a.genreName.localeCompare(b.genreName, "es"));
}

export async function getSuggestContentPageData(): Promise<GenreMovies[]> {
  return fetchByType("movie");
}

export async function getSuggestContentPageDataTV(): Promise<GenreMovies[]> {
  return fetchByType("tv");
}
