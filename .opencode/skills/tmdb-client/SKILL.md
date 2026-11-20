---
name: tmdb-client
description: Use when touching TMDB access in miteve-web via src/shared/api/tmdb.ts with server cache dedupe rate-limit retry and image fallback.
license: MIT
compatibility: opencode
---

# TMDB Client — src/shared/api/tmdb.ts only

This skill covers ONLY el cliente TMDB centralizado. It does NOT cover UI, routes API propias, secretos fuera de `env.ts`, ni mappers de dominio (esos van en `entities/content`).

## Checklist accionable

- [ ] Único punto de acceso: todo fetch TMDB pasa por `src/shared/api/tmdb.ts` (`searchMulti`, `getMovieDetail`, `getTvDetail`, `getSeason`, helpers de imagen). Prohibido `fetch('api.themoviedb.org')` en features/widgets/app. Verificar con `grep -r "themoviedb" src --include="*.ts*" | grep -v "shared/api/tmdb"`.
- [ ] Key solo servidor: leer `TMDB_API_KEY` desde `src/shared/config/env.ts` (server-only). Nunca `NEXT_PUBLIC_*` para la key; cliente consume vía loaders (`getHomePageData`, `getTvShowsPageData`, `getTmdbMovieDetail`) o routes proxy. `grep TMDB_API_KEY` nunca en `ui/` ni `page.tsx` cliente.
- [ ] Cache + dedupe: `cache: 'force-cache'` / `next: { revalidate: 3600 }` en server fetches; dedupe de requests concurrentes misma URL (`cache()` de React o Map de promesas). Listas home/movies/tv-shows reutilizan loader (`getMoviesPageData`), no triple fetch.
- [ ] Rate-limit + retry: throttle simple (≈ 40 req/10s TMDB) + retry exponencial 429/5xx (máx 3, `Retry-After` respetado). Error final → fallback amable ES (`"No pudimos cargar este catálogo, intenta de nuevo"`), log vía `error-handling`, nunca stack al cliente.
- [ ] Imágenes: `https://image.tmdb.org/t/p/{w342|w500|w780|original}` con `remotePatterns` en `next.config.ts`; `next/image` con `sizes` responsivo. Fallback: poster nulo → placeholder local `/placeholder-poster.png` + `alt` real. Ejemplo: `ContentCard.tsx` y `HeroSection.tsx` nunca construyen URL manual, usan helper `tmdbImage(path, size)`.
- [ ] Tipos: respuestas mapeadas a `Content`/`EpisodeMetadata` de `src/entities/content/model/types.ts` en el borde del cliente; UI recibe tipos de dominio, no JSON crudo TMDB.

## Orden por archivo

- `tmdb.ts`: consts (`BASE_URL`, `IMG_BASE`) → `getHeaders()` (Bearer server) → `tmdbFetch(path)` (dedupe+retry+cache) → funciones dominio → `tmdbImage()` helper. Todo `async`, tipado estricto, sin JSX.

## Naming

- Funciones `get*`/`search*` English (`searchMulti`, `getSeasonEpisodes`). Helper imagen `tmdbImage`. Logs `actionName: "TMDB.searchMulti"`.

## Verificación

- `grep -rn "api.themoviedb\|TMDB_API_KEY" src --include="*.tsx" | grep -v "shared/api/tmdb\|config/env"` vacío.
- `next.config.ts` tiene `images.remotePatterns` con `image.tmdb.org`; `npm run build` 0 errores.
- Simular 429 con test `vitest-unit-testing`: retry 3 + fallback ES renderizado.

## Out of scope

- Do NOT define domain mappers here (only raw client + image helper). See `next-architecture` (`entities/content`).
- Do NOT define secrets storage here. See `conn-secrets`.
- Do NOT define route handlers here. See `next-routes-scope`.
- Do NOT define error surfacing copy here beyond fallback. See `error-handling`.
- Do NOT put TMDB calls in stories. See `storybook-driven-ui`.
