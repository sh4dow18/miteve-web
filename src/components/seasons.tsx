// Set this component as a client component
"use client";
// Seasons Requirements
import { FindUncompleteSeason } from "@/lib/series";
import { Episode } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
// Seasons Props
interface Props {
  seriesId: string;
}
// Seasons Main Function
function Seasons({ seriesId }: Props) {
  // Seasons Hooks
  const [selectedSeason, SetSelectedSeason] = useState<number>(1);
  const [episodesList, SetEpisodesList] = useState<Episode[]>([]);
  const [seasonsAvailable, SetSeasonsAvailable] = useState<number[]>([1]);
  // Execute this use effect when the page is loading
  useEffect(() => {
    // Get all Seasons Available in Miteve Project
    const GetSeasonsAvailable = async () => {
      // Get All Seasons Available
      const SEASONS_LIST = await fetch(
        `/api/get-seasons-available?id=${seriesId}&season=${selectedSeason}`
      ).then((response) => response.json());
      // Set Seasons Available to Hook
      SetSeasonsAvailable(SEASONS_LIST);
      const FIRST_SEASON = SEASONS_LIST[0];
      // Set First Season Availabnle to Selected Season Hook
      SetSelectedSeason(FIRST_SEASON);
      // Get All Season Information
      const SEASON = await fetch(
        `/api/get-episodes?id=${seriesId}&season=${FIRST_SEASON}`
      ).then((response) => response.json());
      // Check that the season is not complete
      const UNCOMPLETE_SEASON = FindUncompleteSeason(
        seriesId,
        `${FIRST_SEASON}`
      );
      // Get the Episodes Information that are available
      const EPISODES_LIST =
        UNCOMPLETE_SEASON === undefined
          ? SEASON.episodes
          : SEASON.episodes.slice(UNCOMPLETE_SEASON.from, UNCOMPLETE_SEASON.to);
      // Set Episodes List to Hook
      SetEpisodesList(EPISODES_LIST);
    };
    GetSeasonsAvailable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId]);
  // Execute this use effect when the user change the selected season
  useEffect(() => {
    const GetEpisodesFromSeason = async () => {
      // Get All Episodes from the Selected Season
      // Get All Season Information
      const SEASON = await fetch(
        `/api/get-episodes?id=${seriesId}&season=${selectedSeason}`
      ).then((response) => response.json());
      // Check that the season is not complete
      const UNCOMPLETE_SEASON = FindUncompleteSeason(
        seriesId,
        `${selectedSeason}`
      );
      // Get the Episodes Information that are available
      const EPISODES_LIST =
        UNCOMPLETE_SEASON === undefined
          ? SEASON.episodes
          : SEASON.episodes.slice(UNCOMPLETE_SEASON.from, UNCOMPLETE_SEASON.to);
      // Set Episodes List to Hook
      SetEpisodesList(EPISODES_LIST);
    };
    GetEpisodesFromSeason();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason]);
  // Change Season Function to Select "onChange"
  const ChangeSeason = (event: ChangeEvent<HTMLSelectElement>) => {
    SetSelectedSeason(Number.parseInt(event.target.value));
  };
  // Returns Seasons Component
  return (
    // Seasons Main Section Container
    <section className="flex flex-col gap-3">
      {/* Seasons Title Container */}
      <div className="flex flex-col gap-3 min-[600px]:flex-row min-[600px]:items-center min-[600px]:place-content-between">
        {/* Seasons Title */}
        <h2 className="font-semibold text-gray-300 min-[600px]:text-xl">
          Episodios
        </h2>
        {/* Seasons Select that Changes Episodes to the Selected Season */}
        <select
          name="seasons"
          onChange={ChangeSeason}
          className="w-full bg-gray-800 px-2 py-3 rounded-lg text-gray-300 cursor-pointer focus:outline-none min-[600px]:w-fit"
        >
          {seasonsAvailable.map((seasonNumber, index) => (
            <option key={index} className="text-gray-300" value={seasonNumber}>
              Temporada {seasonNumber}
            </option>
          ))}
        </select>
      </div>
      {/* Seasons Episodes Cards Container */}
      <div className="flex flex-col gap-7">
        {episodesList.map((episode: Episode, index: number) => (
          // Season Episode Card Link Container
          <Link
            key={index}
            className="flex flex-col gap-2 w-full bg-gray-900 transition hover:scale-105 min-[600px]:flex-row"
            href={`/player?type=series&id=${seriesId}&season=${selectedSeason}&episode=${episode.episode_number}`}
          >
            {/* Season Episode Image */}
            <Image
              src={
                episode.still_path
                  ? `https://image.tmdb.org/t/p/w500/${episode.still_path}`
                  : "/images/404.png"
              }
              alt={`Episodio ${episode.episode_number} Cover`}
              width={520}
              height={300}
              className="w-full rounded-sm min-[600px]:w-48"
            />
            {/* Season Episode Overview */}
            <section className="flex flex-col gap-1 p-3 min-[600px]:w-3/4">
              {/* Season Episode Title */}
              <span className="font-semibold text-gray-300 hyphens-auto">
                Episodio {episode.episode_number}: {episode.name}
              </span>
              {/* Season Episode Description */}
              <p className="line-clamp-4">
                {episode.overview
                  ? episode.overview
                  : "No hay Información Disponible sobre este capítulo actualmente, favor volver a consultar en otro momento"}
              </p>
            </section>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Seasons;
