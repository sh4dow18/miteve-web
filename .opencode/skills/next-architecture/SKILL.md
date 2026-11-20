---
name: next-architecture
description: Use when creating or modifying any code in miteve-web to enforce FSD layers app, features, widgets, entities, shared plus barrels and ROUTES_LIST.
license: MIT
compatibility: opencode
---

# Next Architecture — FSD layer separation only

This skill covers ONLY layer separation for the Next.js 16 App Router streaming app. It does NOT cover formatting, theming, secrets, or API logic.

## Layers (FSD estricto)

- `src/app/`: thin routes only (`(main)/`, `player/[id]/`, `api/`). Componen `features`/`widgets`, leen `shared/config/routes.ts`. Sin lógica de negocio, sin fetch directo, sin copy hardcodeado.
- `src/features/<dominio>/`: unidad de negocio con `page.tsx` + `model/` + `ui/` + `lib/` + `config/` co-locados. Ej: `src/features/home/page.tsx`, `src/features/player/model/usePlayer.ts`, `src/features/player/model/getPlayerData.ts`. Una acción por feature.
- `src/widgets/<seccion>/`: sección compuesta con `ui/` + `model/` + `index.ts` barrel. Ej: `src/widgets/player/ui/Player.tsx`, `src/widgets/player/ui/PlayerTV.tsx`, `src/widgets/content-row/ui/ContentRow.tsx`, `src/widgets/hero-section/ui/HeroSection.tsx`.
- `src/entities/<dominio>/`: tipos + mappers + API pura. Ej: `src/entities/content/model/types.ts` (`Content`, `EpisodeMetadata`), `src/entities/content/api/index.ts`. Sin UI, sin fetch con side-effects de vista.
- `src/shared/`: reutilizable only — `ui/` (`ContentCard.tsx`, `FavoriteButton.tsx`), `lib/` (`auth.ts`, `offline-db.ts`, `hooks/useTV.ts`), `config/` (`routes.ts`, `env.ts`), `api/tmdb.ts`. Nunca importa de `app/features/widgets/entities`.

## Direction

`app -> features -> widgets -> entities -> shared`. `shared` nunca importa hacia arriba. `entities` nunca importa `widgets`. Prohibido import invertido.

## ROUTES_LIST fuente de verdad

- Toda ruta nueva se registra en `src/shared/config/routes.ts` (`ROUTES_LIST`, `ROUTE`, `routeToHref`). `src/app/sitemap.ts` y navegación leen de ahí, nunca duplican paths.
- Ejemplo: `path: "downloads"` con `inSitemap: false`; el sidebar/home usan `ROUTES_LIST` filtrado por `inHome`.

## proxy.ts guards

- `src/proxy.ts` es el único guard de acceso: `/admin` exige cookie `miteve_token` con autoridad `read-admin-page` (redirect `/404`); `/downloads` y `/player/[id]?offline=true` bypasean el health-check para PWA offline; resto valida `HEAD ${API_HOST_IP}/utils/health` con fallback `/maintenance` o `/downloads` sin internet.

## Orden por archivo

- `page.tsx`: `"use client"` si aplica, imports `@/` primero, tipos, componente default fino (< 60 líneas) que compone widgets.
- `model/use*.ts`: hook con `useCallback/useRef/useState/useEffect` tipados (`ReactChangeEvent`, `ReactKeyboardEvent`).
- `ui/*.tsx`: props tipadas, variante TV separada (`*TV.tsx`: `PlayerTV.tsx`, `HeroSectionTV.tsx`, `ContentRowTV.tsx`, `DetailTV.tsx`) conmutada por `useTV()`.
- `index.ts`: barrel que re-exporta lo público del widget/feature.

## Naming

- Componentes `PascalCase` = nombre archivo (`Player.tsx` → `Player`). Hooks `use*` en `model/`. Variantes TV con sufijo `TV`. Rutas kebab-case. Alias `@/*` siempre, nunca `../../..`.

## Violation examples to fix

- Fetch TMDB dentro de `HeroSection.tsx` → mover a `src/shared/api/tmdb.ts` o `src/entities/content/api/index.ts`.
- Lógica de player (shaka, fullscreen iOS) dentro de `src/app/player/[id]/page.tsx` → mover a `src/features/player/model/usePlayer.ts`, page solo compone `<Player/>`.
- Nuevo `Button` copiado en 3 widgets → reutilizar `src/shared/ui/*` (shadcn/cva).
- `getTvShowsPageData` duplicado en page → vive en `src/features/tv-shows/model/getTvShowsPageData.ts`.
- String de ruta `"/downloads"` hardcodeado → usar `routeToHref("downloads")` + `ROUTES_LIST`.

## Verificación

- `grep` imports invertidos: ningún archivo en `shared/` o `entities/` importa `@/features`, `@/widgets` o `@/app`.
- Cada widget tiene `index.ts` barrel; cada feature co-loca `page.tsx/model/ui/lib/config`.
- `npm run build` con 0 errores. Ver `next-build-run`.

## Out of scope

- Do NOT define formatting here. See `ts-format-next`.
- Do NOT define build/dev commands here. See `next-build-run`.
- Do NOT define API route bodies here. See `next-routes-scope`.
- Do NOT define theming here. See `tailwind-theming`.
- Do NOT define auth token logic here. See `auth-client`.
