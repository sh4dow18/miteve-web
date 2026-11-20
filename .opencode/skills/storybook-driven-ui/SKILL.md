---
name: storybook-driven-ui
description: Use when creating or editing Storybook 10 stories in miteve-web with nextjs-vite for ContentCard HeroSection PlayerSkeleton and player controls with a11y addon.
license: MIT
compatibility: opencode
---

# Storybook Driven UI — stories only, no logic

This skill covers ONLY `*.stories.tsx` con Storybook 10 (`@storybook/nextjs-vite`) + addon a11y. It does NOT cover tests vitest, lógica de hooks, theming tokens, ni player runtime.

## Checklist accionable

- [ ] Stories co-locadas: `src/shared/ui/ContentCard.stories.tsx`, `ContentCardTV.stories.tsx`, `src/widgets/hero-section/ui/HeroSection.stories.tsx`, `src/widgets/player/ui/PlayerSkeleton.stories.tsx`. Una story por variante (Normal/TV), nunca lógica dentro.
- [ ] CSF3 tipado: `import type { Meta, StoryObj } from '@storybook/react'`; `meta satisfies Meta<typeof ContentCard>`; args tipados del componente real. Controles (`control: 'text' | 'boolean' | 'select'`) para `title`, `posterPath`, `isFavorite`, `progress`.
- [ ] Casos obligatorios: `Default`, `Loading/Skeleton` (`CatalogueLoadingSkeleton`, `PlayerSkeleton`), `Empty` (sin poster → fallback), `LongTitle` (overflow), `TV` (`ContentCardTV`, `HeroSectionTV` con foco visible). Hero con fixture de `src/entities/content/model/types.ts` (`Content`).
- [ ] A11y addon: cada story pasa `a11y` sin violaciones (roles, `alt` en poster, contraste, foco TV con `useTV()` mockeado por args, no hook real). Añadir `parameters: { a11y: { disable: false } }` si el preset lo exige.
- [ ] Sin lógica: la story solo pasa `args`; fetch/mappers vienen de fixtures (`src/entities/content/api` mockeado afuera). Prohibido `fetch TMDB`, `usePlayer`, `axios`, `zustand` dentro de `.stories.tsx`.
- [ ] Comandos: `npm run storybook` (dev `:6006`), `npm run build-storybook` antes de PR con stories nuevas.

## Orden por archivo

- Imports tipo → `meta` default export → `type Story = StoryObj<typeof X>` → stories nombradas (`Default`, `WithoutPoster`, `Playing`). Fixtures arriba, nunca fetch inline.

## Naming

- `X.stories.tsx` junto a `X.tsx` (`ContentCard.tsx` → `ContentCard.stories.tsx`). Títulos `miteve/Shared/ContentCard`, `miteve/Widgets/HeroSection`. Variantes TV con sufijo `TV` (`ContentCardTV`).

## Verificación

- `npm run build-storybook` 0 errores; panel A11y sin violaciones en las 5 stories núcleo.
- `grep -l "fetch\|axios\|usePlayer" src/**/*.stories.tsx` vacío.
- `npm run lint` limpio en stories (ver `ts-format-next` para estilo).

## Out of scope

- Do NOT write vitest tests here. See `vitest-unit-testing`.
- Do NOT define theme tokens here. See `tailwind-theming`.
- Do NOT define player/shaka logic here. See `pwa-player`.
- Do NOT define FSD placement here. See `next-architecture`.
- Do NOT define motion params here. See `motion-ux`.
