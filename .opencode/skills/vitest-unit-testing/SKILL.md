---
name: vitest-unit-testing
description: Use when writing or modifying unit tests in miteve-web with vitest plus RTL and jsdom, covering data loaders hooks and offline-db with 80 percent domain coverage.
license: MIT
compatibility: opencode
---

# Vitest Unit Testing — RTL + jsdom only

This skill covers ONLY unit/component tests with `vitest` + `@testing-library/react` + `jsdom`. It does NOT cover Storybook stories, E2E, build/deploy, or player runtime logic.

## Checklist accionable

- [ ] Config base intacta: `vitest.config.ts` (environment `jsdom`, setup `vitest.setup.ts` con `@testing-library/jest-dom`). No cambiar a `node` para tests de UI.
- [ ] Data loaders puros primero: `src/features/home/model/getHomePageData.ts`, `src/features/movies/model/getMoviesPageData.ts`, `src/features/tv-shows/model/getTvShowsPageData.ts`, `src/features/player/model/getPlayerData.ts`. Mockear `src/shared/api/tmdb.ts` y `src/entities/content/api/index.ts` con `vi.mock`, nunca red real.
- [ ] Hooks con `renderHook` + `act`: `src/features/player/model/usePlayer.ts`, `src/features/home/model/useHomeShell.ts`, `src/features/search/model/useSearchPage.ts`, `src/features/genre/model/useGenrePage.ts`. Ejemplo: avanzar timers para debounce antes de `expect`.
- [ ] `src/shared/lib/offline-db.ts`: usar `fake-indexeddb` o mock de `idb`; cada test limpia stores (`continue-watching`, `history`, `downloads`) en `beforeEach`. Nunca IndexedDB real del navegador.
- [ ] Componentes puros con RTL: `src/shared/ui/ContentCard.tsx`, `src/widgets/hero-section/ui/HeroSection.tsx`, `src/widgets/player/ui/PlayerSkeleton.tsx`. Aserciones por rol/texto accesible (`getByRole`, `getByText`), nunca por clase Tailwind.
- [ ] Cobertura 80% en dominios: `entities/content`, `features/player/model`, `features/search/model`, `shared/lib`. Correr `npx vitest run --coverage` y subir solo esos paths si el global baja por UI legacy.
- [ ] Comando canónico: `npx vitest run` (CI). `npx vitest` watch solo local. Nuevo test co-locado: `model/__tests__/usePlayer.test.ts(x)` o junto al módulo `*.test.ts`.

## Orden por archivo

- Test: imports `vitest` (`describe/it/expect/vi`) → RTL → módulo bajo test vía `@/` → mocks `vi.mock` arriba → `describe` por función/hook → `it` caso feliz + borde + error.
- Mock TMDB: `vi.mock('@/shared/api/tmdb', () => ({ searchMulti: vi.fn() }))`; retornar fixture tipado `Content[]`, no `any`.

## Naming

- Archivos `*.test.ts` (lógica) / `*.test.tsx` (UI). `describe` = nombre módulo (`getHomePageData`), `it` = comportamiento (`retorna rows vacías con fallback amable`).
- Fixtures en `__fixtures__/` o inline tipados (`mockContent: Content`). Sin snapshots gigantes sin revisar.

## Verificación

- `npx vitest run` 0 fallos; `npx vitest run --coverage` ≥ 80% en los 4 dominios listados.
- `grep -r "fetch(" src/**/*.test.*` no llama red real; todo IO mockeado.
- `npm run build` sigue en verde tras agregar tests (ver `next-build-run`).

## Out of scope

- Do NOT write Storybook stories here. See `storybook-driven-ui`.
- Do NOT define FSD placement here. See `next-architecture`.
- Do NOT define formatting here. See `ts-format-next`.
- Do NOT define API route bodies here. See `next-routes-scope`, `ffmpeg-upload-jobs`.
- Do NOT define TMDB client logic here (only mock it). See `tmdb-client`.
