interface Container {
  id: number;
  name: string;
  elementsList: ContainerElement[];
}

interface ContainerElement {
  id: number;
  position: number;
  content: MiniContent;
}

interface MiniContent {
  id: string;
  cover: string;
  title: string;
}

interface Content {
  id: string;
  title: string;
  year: number;
  tagline: string | null;
  description: string;
  rating: number;
  age: number;
  cover: string;
  background: string;
  trailer: string;
  trailerDuration: number;
  comingSoon: boolean;
  createdDate: string;
  note: string | null;
  genresList: Genre[];
  type: string;
  seasonsList: Season[];
}

interface Genre {
  id: number;
  name: string;
}

interface Season {
  id: string;
  seasonNumber: number;
  episodesList: Episode[];
}

interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  cover: string;
}

interface EpisodeMetadata {
  id: string;
  title: string;
  episodeNumber: number;
  beginSummary: number | null;
  endSummary: number | null;
  beginIntro: number | null;
  endIntro: number | null;
  beginCredits: number | null;
}
