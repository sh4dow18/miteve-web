export const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function UpdateMovies() {
  await fetch("/api/update-movies", {
    method: "PUT",
  });
}
export async function UpdateSeries() {
  await fetch("/api/update-series", {
    method: "PUT",
  });
}
