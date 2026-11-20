---
name: search-filter-pattern
description: Use when building search or genre filtering in miteve-web under src/features/search and src/features/genre with 300ms debounce shareable URLSearchParams skeletons and empty states.
license: MIT
compatibility: opencode
---

# Search Filter Pattern — search + genre only

This skill covers ONLY `src/features/search/**` + `src/features/genre/**` (debounce, URL params, skeletons, empty-states). It does NOT cover TMDB client internals, player, perfiles, ni analytics.

## Checklist accionable

- [ ] Estructura: `src/features/search/page.tsx` fina compone `SearchResultsGrid.tsx` + `SearchDefaultGrid.tsx`, lógica en `src/features/search/model/useSearchPage.ts`. Género: `src/features/genre/page.tsx` + `GenresIndexNormal/TV.tsx` + `GenrePageNormal/TV.tsx`, datos en `src/features/genre/model/useGenrePage.ts`. Variante TV conmutada por `useTV()`, nunca `if (isTV)` inline gigante.
- [ ] Debounce 300ms: input → `useDebounce(query, 300)` en `useSearchPage`/`useTmdbSearch` (`src/features/suggest-content/model/useTmdbSearch.ts` como referencia); cancela request previa (`AbortController` o guarda `requestId`). No llamar `searchMulti` por keystroke.
- [ ] URL compartible: estado vive en `URLSearchParams` (`?q=`, `?genre=`, `?page=`); `router.replace` en debounce, lectura inicial desde `searchParams`. Copiar URL reproduce la búsqueda. Ejemplo: `/search?q=dune` renderiza mismo grid en Normal y TV.
- [ ] Skeletons: carga → `CatalogueLoadingSkeleton` (`src/shared/ui/CatalogueLoadingSkeleton.tsx`) con misma grilla que `SearchResultsGrid`; nunca spinner suelto fullscreen. Error TMDB → fallback ES + reintentar (ver `tmdb-client`).
- [ ] Empty-states ES: sin query → `SearchDefaultGrid` (tendencias/sugerencias); 0 resultados → ilustración + `"No encontramos nada para '<q>'"` + botón limpiar. Género vacío → `"Este género aún no tiene contenido"`.
- [ ] Grid: `ContentCard`/`ContentCardTV` (`src/shared/ui/`) con `tmdbImage(path,'w342')`; paginación o scroll infinito con `page` en URL; foco TV navegable (`useKeyboardNavigation`).

## Orden por archivo

- `model/useSearchPage.ts`: `useState query` → `useDebounce` → `useEffect` sync URL → `useQuery/fetch searchMulti` → `{ results, isLoading, isEmpty }`. `ui/*.tsx`: props `{ items: Content[] }`, sin fetch.

## Naming

- Hooks `useSearchPage`, `useGenrePage`, `useTmdbSearch`. Props `query`, `results`, `onQueryChange`. Params URL `q`, `genre`, `page`.

## Verificación

- Escribir `q` rápido → 1 sola llamada `searchMulti` (test `vitest-unit-testing` con timers); recargar `?q=` conserva resultados; SR `a11y` input con `label` (ver `a11y`).
- `grep -r "fetch.*themoviedb" src/features/search src/features/genre` vacío (pasa por `tmdb-client`).

## Out of scope

- Do NOT define TMDB fetch/retry here. See `tmdb-client`.
- Do NOT define card visuals here. See `storybook-driven-ui`, `tailwind-theming`.
- Do NOT define player entry here. See `continue-watching-history`, `pwa-player`.
- Do NOT define analytics of searches here. See `analytics-player-events`.
- Do NOT define FSD layers here. See `next-architecture`.
