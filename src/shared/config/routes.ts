import type { Metadata } from "next";
import {
  Clapperboard,
  Film,
  HelpCircle,
  Home,
  Info,
  LogIn,
  Search,
  Shield,
  TriangleAlert,
  Tv,
  UserPlus,
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
      description:
        "Explora Miteve y descubre el catalogo de peliculas y series.",
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
    path: "search",
    title: "Buscar",
    summary:
      "Encuentra peliculas y series por nombre dentro del catalogo de Miteve.",
    Icon: Search,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Buscar",
      description:
        "Encuentra peliculas y series por nombre dentro del catalogo de Miteve.",
    },
  },
  {
    path: "faq",
    title: "FAQ",
    summary:
      "Preguntas frecuentes sobre cuenta, perfiles, reproduccion y soporte.",
    Icon: HelpCircle,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Preguntas frecuentes",
      description:
        "Encuentra respuestas a las dudas mas comunes sobre el uso de Miteve.",
    },
  },
  {
    path: "admin",
    title: "Administracion",
    summary:
      "Panel para gestionar contenido, contenedores, generos y episodios.",
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
  {
    path: "login",
    title: "Login",
    summary:
      "Inicia sesion para sincronizar tus preferencias y continuar donde lo dejaste.",
    Icon: LogIn,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "Login",
      description:
        "Inicia sesion para sincronizar tus preferencias y continuar donde lo dejaste.",
    },
  },
  {
    path: "register",
    title: "Registrar usuario",
    summary:
      "Crea tu cuenta para guardar favoritos y recomendaciones personalizadas.",
    Icon: UserPlus,
    inSitemap: false,
    inHome: false,
    metadata: {
      title: "Registrar usuario",
      description:
        "Crea tu cuenta para guardar favoritos y recomendaciones personalizadas.",
    },
  },
  {
    path: "appInfo",
    title: "Info",
    summary: "Detalles sobre la aplicación Miteve.",
    Icon: Info,
    inSitemap: true,
    inHome: true,
    metadata: {
      title: "Información de la aplicación",
      description: "Detalles sobre la aplicación Miteve.",
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
