import { TMDB_API_KEY } from "@/shared/config/env";

export interface TmdbMovieDetail {
  id: number;
  title: string;
  tagline: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  trailerKey: string | null;
  videos: { key: string; site: string; type: string; name: string }[];
  type: "movie" | "tv";
}

export async function getTmdbDetail(
  id: string,
  type: "movie" | "tv" = "movie"
): Promise<TmdbMovieDetail | null> {
  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos`;

    const response = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!response.ok) return null;

    const data = await response.json();

    const trailer =
      data.videos?.results?.find(
        (v: { site: string; type: string }) =>
          v.site === "YouTube" && v.type === "Trailer"
      ) ??
      data.videos?.results?.find(
        (v: { site: string; type: string }) => v.site === "YouTube"
      );

    return {
      id: data.id,
      title: data.title || data.name || "",
      tagline: data.tagline || null,
      overview: data.overview,
      voteAverage: data.vote_average,
      releaseDate: data.release_date || data.first_air_date || "",
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      genres: data.genres || [],
      runtime: data.runtime || null,
      trailerKey: trailer?.key || null,
      videos: (data.videos?.results || []).filter(
        (v: { site: string }) => v.site === "YouTube"
      ),
      type,
    };
  } catch {
    return null;
  }
}
