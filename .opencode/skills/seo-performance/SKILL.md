---
name: seo-performance
description: Use when changing any public route, layout, image, or metadata in miteve-web to enforce SEO tags and Core Web Vitals budgets.
license: MIT
compatibility: opencode
---

# SEO Performance — ranking + speed only

This skill covers ONLY SEO tags and loading performance. It does NOT cover copy writing, visual theming, or animations.

## Orden checklist

1. Metadata por ruta: `src/app/layout.tsx` (`title: "Miteve"`, description ES) + `metadata` por entrada en `ROUTES_LIST` (`src/shared/config/routes.ts`); `title` único <60 chars, description 140–160 chars; `sitemap.ts` lee `ROUTES_LIST` filtrado `inSitemap`; `manifest.ts` (nombre, iconos 192/512, `theme_color #000000`) y `not-found.tsx` con `noindex`.
2. Corregir `<html lang="en">` → `lang="es"` en `layout.tsx` (UI 100% español).
3. Imágenes: `next/image` siempre (AVIF/WebP automático), `width/height` explícitos, `loading="lazy"` bajo fold, `fetchpriority="high"` + `preload /logo.png` solo LCP hero. `remotePatterns` ya incluye `image.tmdb.org`. OG 1200x630 <300KB. Sin PNG 4MB en `public/`.
4. Fuentes: variable woff2, `font-display:swap`, preconnect, máx 2 familias.
5. JS budget: Server Components por defecto; `"use client"` solo donde interactividad lo exige (`home/page.tsx`, `Player.tsx`, hooks); shaka-player con import dinámico `ssr:false` en player para no inflar bundle inicial. Animaciones `transform/opacity` only (ver `motion-ux`).

## Naming

- `metadata.title/description` en ES por entrada de `ROUTES_LIST`. Slugs kebab-case. `routeToHref()` para canonical, nunca string duplicado.

## Ejemplos miteve-web

- ✅ `layout.tsx` + `Toaster` + preload logo LCP; `manifest.ts` standalone; `sitemap.ts` desde `ROUTES_LIST`.
- ❌ `lang="en"` actual; ❌ `<img src="https://image.tmdb.org/...">` crudo en `ContentCard.tsx` en vez de `next/image`.

## Verificación

- `npm run build` + `npm run start`, Lighthouse 90+ performance/SEO, LCP <2.5s móvil, 0 errores consola, 0 network `>=400`. Ver `apply-qa`, `next-build-run`.

## Out of scope

- Do NOT write copy here. See `i18n-next`.
- Do NOT define animation curves here. See `motion-ux`.
- Do NOT define colors/layout here. See `tailwind-theming`, `next-architecture`.
