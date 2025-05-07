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
  seasonsAvailableList: number[];
  displaySeason?: number;
}
// Seasons Main Function
function Seasons({ seriesId, seasonsAvailableList, displaySeason }: Props) {
  // Seasons Hooks
  const [selectedSeason, SetSelectedSeason] = useState<number>(
    displaySeason
      ? seasonsAvailableList.find(
          (season: number) => season === displaySeason
        ) || seasonsAvailableList[0]
      : seasonsAvailableList[0]
  );
  const [episodesList, SetEpisodesList] = useState<Episode[]>([]);
  // Execute this use effect when the page is loading or when the user change the selected season
  useEffect(() => {
    const GetEpisodes = async () => {
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
    GetEpisodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId, selectedSeason]);
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
          value={selectedSeason}
          className="w-full bg-gray-800 px-2 py-3 rounded-lg text-gray-300 cursor-pointer focus:outline-none min-[600px]:w-fit"
        >
          {seasonsAvailableList.map((seasonNumber, index) => (
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
