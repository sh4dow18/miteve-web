// Admin Constants
export const TMDB_API_KEY = process.env.TMDB_API_KEY;
// Update Movies Function
export async function UpdateMovies() {
  await fetch("/api/update-movies", {
    method: "PUT",
  });
}
// Update Series Function
export async function UpdateSeries() {
  await fetch("/api/update-series", {
    method: "PUT",
  });
}
