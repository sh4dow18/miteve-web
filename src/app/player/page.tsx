interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function Player({ searchParams }: Props) {
  const TYPE = (await searchParams).type;
  const ID = (await searchParams).id;
  const SEASON = (await searchParams).season;
  const EPISODE = (await searchParams).episode;
  return (
    <div className="flex-1 relative">
      <video
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        src={`/videos/${TYPE}/${ID}${
          TYPE === "movies"
            ? `.webm`
            : `/Temporada ${SEASON}/Episodio ${EPISODE}.webm`
        }`}
        controls
        autoPlay
      />
    </div>
  );
}

export default Player;
