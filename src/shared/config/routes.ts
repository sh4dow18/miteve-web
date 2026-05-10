import type { Metadata } from "next";
import {
  Clapperboard,
  Film,
  Home,
  Shield,
  TriangleAlert,
  Tv,
  type LucideIcon,
} from "lucide-react";

export type Route = {
  readonly path: string;
  readonly title: string;
  readonly summary: string;
  readonly Icon: LucideIcon;
  readonly inSitemap: boolean;
  readonly inHome: boolean;
  readonly metadata: Metadata;
};

export const ROUTES_LIST: Route[] = [
  {
    path: "",
    title: "Inicio",
    summary: "Explora Miteve y descubre el catalogo de peliculas y series.",
    Icon: Home,
    inSitemap: true,
    inHome: false,
    metadata: {
      title: "Inicio",
      description: "Explora Miteve y descubre el catalogo de peliculas y series.",
    },
  },
  {
    path: "home",
    title: "Inicio",
    summary: "Panel principal con novedades, destacados y proximos estrenos.",
    Icon: Home,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Inicio",
      description:
        "Panel principal con novedades, destacados y proximos estrenos.",
    },
  },
  {
    path: "movies",
    title: "Peliculas",
    summary:
      "Aqui se pueden ver todas las peliculas que ofrece Miteve para reproducir.",
    Icon: Film,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Peliculas",
      description:
        "Aqui se pueden ver todas las peliculas que ofrece Miteve para reproducir.",
    },
  },
  {
    path: "tv-shows",
    title: "Series",
    summary:
      "Aqui se pueden ver todas las series que ofrece Miteve para reproducir.",
    Icon: Tv,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Series",
      description:
        "Aqui se pueden ver todas las series que ofrece Miteve para reproducir.",
    },
  },
  {
    path: "admin",
    title: "Administracion",
    summary: "Panel para gestionar contenido, contenedores, generos y episodios.",
    Icon: Shield,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "Panel de Administracion",
      description:
        "Gestiona contenido, contenedores, generos, temporadas y episodios.",
    },
  },
  {
    path: "content/[id]",
    title: "Contenido",
    summary: "Detalle del contenido seleccionado.",
    Icon: Clapperboard,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "Contenido",
      description: "Detalle del contenido seleccionado.",
    },
  },
  {
    path: "player/[id]",
    title: "Reproductor",
    summary: "Aqui se puede visualizar el contenido seleccionado.",
    Icon: Clapperboard,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "Reproductor",
      description: "Aqui se puede visualizar el contenido seleccionado.",
    },
  },
  {
    path: "maintenance",
    title: "En mantenimiento",
    summary:
      "Estamos mejorando tu experiencia. Volveremos pronto con novedades.",
    Icon: TriangleAlert,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "En mantenimiento",
      description:
        "Estamos mejorando tu experiencia. Volveremos pronto con novedades.",
    },
  },
];

export const ROUTES_MAP = Object.fromEntries(
  ROUTES_LIST.map((route) => [route.path, route])
) as Record<string, Route>;

export function routeToHref(path: string): string {
  if (path === "") return "/";
  return `/${path.replace(/^\/+/, "")}`;
}
