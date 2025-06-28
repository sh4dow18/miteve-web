// Player Page Requirements
import { Metadata } from "next";
import { NotFound, Player } from "@/components";
import {
  FindEpisodeMetadataByNumber,
  FindNextEpisodeByNumber,
  FindSeasonByNumber,
} from "@/lib/series";
import { API_HOST_IP } from "@/lib/admin";
// Player Page Props
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export const metadata: Metadata = {
  title: "Reproductor",
  description: "Aqui se puede reproducir el contenido deseado",
};
// Player Page Main Function
async function PlayerPage({ searchParams }: Props) {
  // Player Page Main Params
  const PARAM_ID = (await searchParams).id;
  const PARAM_TYPE = (await searchParams).type;
  const PARAM_SEASON = (await searchParams).season;
  const PARAM_EPISODE = (await searchParams).episode;
  const ID = typeof PARAM_ID === "string" ? PARAM_ID : "";
  const TYPE = typeof PARAM_TYPE === "string" ? PARAM_TYPE : "";
  const SEASON = typeof PARAM_SEASON === "string" ? PARAM_SEASON : "";
  const EPISODE = typeof PARAM_EPISODE === "string" ? PARAM_EPISODE : "";
  // Function that check if the param submitted is valid
  const ValidNumberParam = (param: string): boolean => {
    if (param === "") {
      return false;
    }
    return /^[0-9]+$/.test(param);
  };
  // Function that check if the information submitted could get a valid file
  const ValidFile = (): boolean => {
    // Check if Type Exists and it is Movies or Series
    if (TYPE === "" || !(TYPE === "movies" || TYPE === "series")) {
      return false;
    }
    // If Type is Movies and ID is not a Valid Code Number, return false
    if (TYPE === "movies" && !ValidNumberParam(ID)) {
      return false;
    }
    // If Type is Series and if ID, SEASON or EPISODE are not a Valid Code Numbers, return false
    if (
      TYPE === "series" &&
      (!ValidNumberParam(ID) ||
        !ValidNumberParam(SEASON) ||
        !ValidNumberParam(EPISODE))
    ) {
      return false;
    }
    // If everything is ok, return true
    return true;
  };
  // If is an invalid file, return Not Found
  if (ValidFile() === false) {
    return (
      <NotFound
        backTo={{
          name: "Inicio",
          href: "/",
        }}
      />
    );
  }
  // Check if the content file exists
  const EXISTS = await fetch(
    `${API_HOST_IP}/api/${TYPE}/stream/${ID}${
      TYPE === "series" ? `/season/${SEASON}/episode/${EPISODE}` : ""
    }`,
    {
      method: "HEAD",
    }
  );
  // Get Content Information
  const CONTENT = await fetch(`${API_HOST_IP}/api/${TYPE}/${ID}`).then(
    (response) => response.json()
  );
  // If the content is a series, Find the Season by Number
  const SEASONS_LIST =
    TYPE === "series"
      ? await FindSeasonByNumber(ID, Number.parseInt(SEASON))
      : undefined;
  // If the content is a series, find the next episode by episode number
  const NEXT_EPISODE =
    TYPE === "series"
      ? await FindNextEpisodeByNumber(ID, SEASON, EPISODE)
      : undefined;
  const EPISODE_METADATA =
    TYPE === "series"
      ? await FindEpisodeMetadataByNumber(ID, SEASON, EPISODE)
      : undefined;
  const HAVE_METADATA =
    TYPE === "series" ? EPISODE_METADATA.beginCredits !== null : true;
  return EXISTS.ok === true &&
    CONTENT.soon === false &&
    HAVE_METADATA === true ? (
    <Player
      id={`${ID}`}
      name={
        TYPE === "movies"
          ? CONTENT.title
          : `${CONTENT.title}: T${SEASON} E${EPISODE}`
      }
      description={
        TYPE === "movies"
          ? CONTENT.description
          : SEASONS_LIST.episodesList.find(
              (episode: { episodeNumber: number }) =>
                episode.episodeNumber === Number.parseInt(EPISODE)
            ).description
      }
      series={
        TYPE === "series"
          ? {
              season: SEASON,
              episode: EPISODE,
              nextEpisode:
                NEXT_EPISODE !== undefined && NEXT_EPISODE.status === undefined
                  ? {
                      season: NEXT_EPISODE.seasonNumber,
                      episode: NEXT_EPISODE.episodeNumber,
                    }
                  : undefined,
              metadata:
                EPISODE_METADATA !== undefined &&
                EPISODE_METADATA.status === undefined
                  ? {
                      beginSummary: EPISODE_METADATA.beginSummary,
                      endSummary: EPISODE_METADATA.endSummary,
                      beginIntro: EPISODE_METADATA.beginIntro,
                      endIntro: EPISODE_METADATA.endIntro,
                      beginCredits: EPISODE_METADATA.beginCredits,
                    }
                  : {
                      beginSummary: null,
                      endSummary: null,
                      beginIntro: null,
                      endIntro: null,
                      beginCredits: null,
                    },
            }
          : undefined
      }
    />
  ) : (
    <NotFound
      backTo={{
        name: "Inicio",
        href: "/",
      }}
    />
  );
}

export default PlayerPage;
