---
name: security-headers-csp
description: Use when editing security headers and CSP in miteve-web next.config.ts for shaka tmdb images vercel with frame-ancestors and report-only first.
license: MIT
compatibility: opencode
---

# Security Headers CSP — next.config only

This skill covers ONLY `headers()` en `next.config.ts` + CSP (shaka, TMDB imgs, Vercel) + `frame-ancestors`. It does NOT cover JWT auth, secretos, proxy guards lógicos, ni analytics.

## Checklist accionable

- [ ] Base en `next.config.ts` `async headers()`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (o solo `frame-ancestors`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima (`camera=(), microphone=(), geolocation=()` + lo que pida PWA).
- [ ] CSP con report-only primero: desplegar `Content-Security-Policy-Report-Only` 1 semana (preview), revisar violaciones, luego promover a `Content-Security-Policy`. `report-uri /api/csp-report` (o endpoint Vercel) sin PII.
- [ ] Allowlist miteve-web: `default-src 'self'`; `img-src 'self' data: blob: https://image.tmdb.org https://*.vercel.app` (+ dominios CDN video si aplica); `media-src 'self' blob: https:` (shaka DASH/HLS + offline); `script-src 'self' 'unsafe-inline' 'unsafe-eval'` solo lo mínimo que exija Next/shaka (documentar cada excepción); `connect-src 'self' https://api.themoviedb.org ${API_HOST_IP} https://*.vercel.app`; `frame-src` solo youtube-embed (`YoutubeVideo.tsx`); `frame-ancestors 'none'` (sin embeds de miteve en terceros).
- [ ] Shaka check: `Player.tsx`/`PlayerTV.tsx` reproducen DASH con CSP activa (blob + segmentos permitidos); si falla, ampliar `media-src/connect-src` al CDN real, nunca `*`. TMDB: `ContentCard`, `HeroSection` cargan `image.tmdb.org` vía `next/image remotePatterns` + CSP.
- [ ] Ejemplo header: `Content-Security-Policy: default-src 'self'; img-src 'self' data: https://image.tmdb.org; media-src 'self' blob: https:; connect-src 'self' https://api.themoviedb.org; frame-ancestors 'none'`.

## Orden por archivo

- Solo `next.config.ts`: `images.remotePatterns` junto a `headers()`. Comentar cada origen no-`'self'` con `// por qué: <componente que lo pide>`.

## Naming

- Directivas lowercase (`frame-ancestors`, `report-uri`). Comentarios `// CSP: <directiva> para <uso>`.

## Verificación

- `curl -I localhost:3000/` muestra headers; DevTools console 0 violaciones CSP en `/`, `/search`, `/player/[id]`; `npm run build` verde.
- Tras promover a enforce, smoke `vercel-deploy-preview` (player + posters + preview) sin regresión.

## Out of scope

- Do NOT define JWT/proxy logic here. See `next-routes-scope`, `auth-client`.
- Do NOT define secrets here. See `conn-secrets`.
- Do NOT define deploy flow here (only headers part). See `vercel-deploy-preview`.
- Do NOT define image client logic here. See `tmdb-client`.
- Do NOT define PWA playback here. See `pwa-player`.
