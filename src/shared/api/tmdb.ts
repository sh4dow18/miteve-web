export function GetTmdbImage(url: string, size?: number): string {
  return `https://image.tmdb.org/t/p/${size ? `w${size}` : "original"}/${url}`;
}
