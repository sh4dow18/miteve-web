---
name: next-build-run
description: Use when installing, running, building, testing, or previewing miteve-web locally with npm, Next.js, vitest, and Storybook.
license: MIT
compatibility: opencode
---

# Next Build Run — local install/dev/build/test only

This skill covers ONLY install/dev/build/start/lint/test/storybook. It does NOT cover secrets, versioning, or deploys.

## Orden de comandos

1. `npm ci` (Node LTS; nunca `npm install` en CI/QA).
2. `npm run dev` → `http://localhost:3000` (puerto Next por defecto; verificar con output del CLI si cambia por `PORT`).
3. `npm run build` → output `.next/`. Luego `npm run start` para preview prod local.
4. `npm run lint` → eslint flat `next/core-web-vitals`, 0 warnings tolerados en QA.
5. Tests: `vitest` + `@testing-library/react` + `jsdom` (`vitest.config.ts`, `vitest.setup.ts`). Hoy sin tests escritos: al agregar, co-locar `*.test.ts(x)` junto al módulo y correr `npx vitest run`.
6. Storybook 10: `npm run storybook` → `:6006`; `npm run build-storybook` para verificar stories.

## Reglas Next 16.2.2

- `next.config.ts`: `reactStrictMode: true`, `images.remotePatterns` incluye `https://image.tmdb.org` y `http://localhost`. Toda imagen TMDB nueva debe pasar por `next/image` (AVIF/WebP automático).
- Nunca commitear `.next/`, `node_modules/`, `storybook-static/`, `.env*` reales.
- Si cambia dominio prod, sincronizar `metadataBase`/canonical en `layout.tsx` + `sitemap.ts` (ver `seo-performance`).

## Verificación

- Build limpio: 0 errores TS, 0 warnings eslint. `npm run build` es gate de `srp-audit`, `version-tag` y `apply-qa`.

## Out of scope

- Do NOT set secrets here. See `conn-secrets`.
- Do NOT decide versionado aquí. See `version-tag`.
- Do NOT escribir assertions de QA aquí. See `apply-qa`.
