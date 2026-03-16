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
  createdDate: string;
  note: string | null;
  genresList: Genre[];
  type: string;
}

interface Genre {
  id: number;
  name: string;
}