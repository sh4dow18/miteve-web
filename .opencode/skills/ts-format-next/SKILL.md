---
name: ts-format-next
description: Use when writing or remediating any TypeScript or TSX file in miteve-web to enforce React 19, server/client, naming, and import order standards.
license: MIT
compatibility: opencode
---

# TS Format Next — .ts/.tsx remediation checklist

Self-contained checklist. Do NOT change business logic, only apply standards. Goal: any dev can read and maintain it.

## 1. Orden del archivo

- Orden top→bottom: `"use client"` (solo si el componente usa hooks/browser APIs) → imports → tipos/interfaces → constantes → componente/función pública → helpers privados.
- Imports ordenados: `react`/`next/*` primero, luego `@/entities`, `@/features`, `@/widgets`, `@/shared`, relativos al final. Ej real:
  `src/features/player/model/usePlayer.ts`: react → `next/navigation` → `@/shared/config/env` → `@/entities/content/model/types` → `@/features/player/model/getPlayerData` → `@/shared/lib/auth`.
- Sin líneas en blanco entre secciones. Header `// ── ... ──` solo para bloques grandes (ver `offline-db.ts`).

## 2. Server vs Client

- Archivos en `src/app/` son Server Components por defecto: NO llevan `"use client"` salvo interactividad. Ej: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/manifest.ts` sin directiva.
- `"use client"` obligatorio en: `src/features/home/page.tsx`, `src/features/player/model/usePlayer.ts`, `src/widgets/player/ui/Player.tsx`, `src/shared/lib/hooks/*`.
- Nunca uses `window`/`localStorage`/`document` sin guard `typeof window === "undefined"` (ver `src/shared/lib/auth.ts: getToken`).

## 3. Naming y declaraciones

- Todo código y comentarios en inglés; UI visible en español vía strings centralizados (ver `i18n-next`).
- Variables/fns `camelCase` (`recentContents`, `heroContent`), componentes/tipos `PascalCase` (`ContentRowTV`, `MainProfile`), listas con sufijo `List` (`contentsList`), vacío `[]` nunca `new Array()`.
- Props y retornos siempre tipados explícitos; prohibido `any` sin narrowing. Callbacks descriptivos (`content => content.id`, nunca `x => x`). Sin single-letter salvo índice `i`.
- Objetos una propiedad por línea si >1 prop. Condicionales/loops siempre con braces, nunca oneliner. Estricto `===`/`!==`. `const` por defecto.
- Fechas con `Intl.DateTimeFormat`, nunca concatenación manual. Ver `date-fns` solo para cálculo, no para display raw.

## 4. Ejemplos miteve-web

- ✅ `interface HomePageData { recentContents: Content[]; comingSoonContents: Content[]; heroContent: Content | null; }` en `src/features/home/page.tsx`.
- ✅ `type WebkitVideoElement = HTMLVideoElement & { webkitEnterFullscreen?: () => void; }` para Safari/iOS en `usePlayer.ts`.
- ✅ `export type MainProfile = { id: string; name: string; avatar?: string; }` en `src/shared/lib/auth.ts`.
- ❌ `any` en props de `ContentCard`; ❌ `"use client"` en `layout.tsx`; ❌ `== null` en vez de `!= null` con check explícito.

## Verificación

- `npx tsc --noEmit` (TS 5 strict) 0 errores; `npm run lint` (eslint flat next/core-web-vitals) 0 warnings; `npm run build` limpio. Ver `next-build-run`.

## Out of scope

- Do NOT decide capas/import direction here. See `next-architecture`.
- Do NOT define error helpers here. See `error-handling`.
- Do NOT define user-visible copy here. See `i18n-next`.
- Do NOT define test commands here. See `next-build-run`.
