// Set this component as a client component
"use client";
// Seasons Requirements
import { Episode } from "@/lib/types";
import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react";
// Seasons Props
interface Props {
  seriesId: string;
  seasonsList: number[];
  displaySeason?: number;
}
// Seasons Main Function
function Seasons({ seriesId, seasonsList, displaySeason }: Props) {
  // Seasons Hooks
  const [selectedSeason, SetSelectedSeason] = useState<number>(
    displaySeason
      ? seasonsList.find((season: number) => season === displaySeason) ||
          seasonsList[0]
      : seasonsList[0]
  );
  const [episodesList, SetEpisodesList] = useState<Episode[]>([]);
  // Execute this use effect when the page is loading or when the user change the selected season
  useEffect(() => {
    const GetEpisodes = async () => {
      // Get All Season Information
      const SEASON = await fetch(
        `/api/seasons?id=${seriesId}&season=${selectedSeason}`
      ).then((response) => response.json());
      // Set Episodes List to Hook
      SetEpisodesList(SEASON.episodesList);
    };
    GetEpisodes();
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
          className="w-full bg-gray-800 px-2 py-3 rounded-lg text-gray-300 cursor-pointer min-[600px]:w-fit"
        >
          {seasonsList.map((seasonNumber, index) => (
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
          <a
            key={index}
            className="flex flex-col gap-2 w-full bg-gray-900 transition hover:scale-105 min-[600px]:flex-row"
            href={`/player?type=series&id=${seriesId}&season=${selectedSeason}&episode=${episode.episodeNumber}`}
          >
            {/* Season Episode Image */}
            <Image
              src={
                episode.cover
                  ? `https://image.tmdb.org/t/p/w500/${episode.cover}`
                  : "/images/404.png"
              }
              alt={`Episodio ${episode.episodeNumber} Cover`}
              width={520}
              height={300}
              className="w-full rounded-sm min-[600px]:w-48"
            />
            {/* Season Episode Overview */}
            <section className="flex flex-col gap-1 p-3 min-[600px]:w-3/4">
              {/* Season Episode Title */}
              <span className="font-semibold text-gray-300 hyphens-auto">
                Episodio {episode.episodeNumber}: {episode.title}
              </span>
              {/* Season Episode Description */}
              <p className="line-clamp-4">
                {episode.description
                  ? episode.description
                  : "No hay Información Disponible sobre este capítulo actualmente, favor volver a consultar en otro momento"}
              </p>
            </section>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Seasons;
