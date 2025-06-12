// Seasons Endpoints Requirements
import { TMDB_API_KEY, API_HOST_IP } from "@/lib/admin";
import { TMDB_EPISODE } from "@/lib/types";
import { FindSeasonByNumber } from "@/lib/series";
// Get Season Endpoint Main Function
export async function GET(request: Request) {
  // Get Season Endpoint Main Constants
  const { searchParams } = new URL(request.url);
  const GET_ID = searchParams.get("id");
  const GET_SEASON_ID = searchParams.get("season");
  const ID = typeof GET_ID === "string" ? GET_ID : "1";
  const SEASON_ID = typeof GET_SEASON_ID === "string" ? GET_SEASON_ID : "1";
  // Get Season from a Specific Series
  const SEASON = await FindSeasonByNumber(ID, Number.parseInt(SEASON_ID));
  // Returns Season
  return Response.json(SEASON);
}
// Insert Seasons from Series Endpoint Main Function
export async function POST(request: Request) {
  // Insert Seasons from Series Endpoint Main Constants
  const BODY = await request.json();
  const { id, firstSeason, lastSeason, firstEpisode, lastEpisode } = BODY;
  // Create an array with all season numbers to fetch
  const SEASONS_TO_FETCH_LIST = [];
  for (let season = firstSeason; season <= lastSeason; season++) {
    SEASONS_TO_FETCH_LIST.push(season);
  }
  // Fetch data for each season from TMDB API
  const SEASON_RESPONSES = await Promise.all(
    SEASONS_TO_FETCH_LIST.map((seasonNumber) =>
      fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=videos,images`
      )
        .then(async (response) => {
          // If the request fails, return null
          if (response.ok === false) {
            return null;
          }
          // If not, parse the JSON and return season number and episodes
          const DATA = await response.json();
          return { seasonNumber, episodes: DATA.episodes };
        })
        // Catch errors and return null
        .catch(() => null)
    )
  );
  // Filter out null responses and type-guard the remaining items
  const FILTERES_SEASON_DATA_LIST = SEASON_RESPONSES.filter(
    (season): season is { seasonNumber: number; episodes: TMDB_EPISODE[] } =>
      season !== null
  )
    // Map each valid season response to the desired structure
    .map(({ seasonNumber, episodes }) => {
      // Filter episodes based on season and episode numbers
      const FILTERED_EPISODES_LIST = episodes.filter(
        (episode: TMDB_EPISODE) => {
          const EPISODE_NUMBER = episode.episode_number;
          // If all episodes are from the same season
          if (firstSeason === lastSeason) {
            return (
              EPISODE_NUMBER >= firstEpisode && EPISODE_NUMBER <= lastEpisode
            );
          }
          // If it's the first season, filter episodes starting from first episode
          if (seasonNumber === firstSeason) {
            return EPISODE_NUMBER >= firstEpisode;
          }
          // If it's the last season, filter episodes up to last episode
          if (seasonNumber === lastSeason) {
            return EPISODE_NUMBER <= lastEpisode;
          }
          // Else, include all episodes
          return true;
        }
      );
      // If no episodes matched, return null
      if (FILTERED_EPISODES_LIST.length === 0) {
        return null;
      }
      // Return the season object with filtered episodes in the desired format
      return {
        seasonNumber,
        episodesList: FILTERED_EPISODES_LIST.map((episode: TMDB_EPISODE) => ({
          episodeNumber: episode.episode_number,
          title: episode.name,
          description: episode.overview,
          cover: episode.still_path,
        })),
      };
    })
    // Filter out any null season results
    .filter(Boolean);
  // Send the filtered seasons data to internal API endpoint
  const SEASONS = await fetch(`${API_HOST_IP}/api/series/${id}/episodes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FILTERES_SEASON_DATA_LIST),
  });
  // Return the response from the internal API as the final result
  return new Response(JSON.stringify(await SEASONS.json()), {
    headers: { "Content-Type": "application/json" },
    status: SEASONS.status,
  });
}
