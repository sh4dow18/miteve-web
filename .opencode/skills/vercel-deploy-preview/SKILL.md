---
name: vercel-deploy-preview
description: Use when deploying miteve-web to Vercel production or preview, managing server vs public env vars, health-check proxy, sitemap manifest checks and rollback.
license: MIT
compatibility: opencode
---

# Vercel Deploy Preview — release only

This skill covers ONLY deploy Vercel (prod/preview), envs, smoke checks y rollback. It does NOT cover código de features, tests, Storybook, ni transcode jobs.

## Checklist accionable

- [ ] Ramas: `main` → producción; PR → preview URL única. Nunca deploy directo a prod desde rama feature; merge a `main` vía PR (ver `git-flow`).
- [ ] Envs: server-only (`TMDB_API_KEY`, `API_HOST_IP`, `DATABASE_URL`, upload secrets) en Vercel dashboard Production+Preview, nunca en código. Cliente solo `NEXT_PUBLIC_*` (`NEXT_PUBLIC_API_URL`, flags). `src/shared/config/env.ts` valida con `zod` y falla build si falta requerida. `grep NEXT_PUBLIC` no contiene secretos.
- [ ] Pre-deploy local: `npm run build` verde + `npx vitest run` + `npm run build-storybook` si hubo UI. `next.config.ts` con `images.remotePatterns` (`image.tmdb.org`) y `headers()` de `security-headers-csp`.
- [ ] Smoke post-deploy (prod Y preview): `/` 200, `/player/[id]` 200, `/downloads` 200 offline-bypass, `/maintenance` solo cuando `HEAD ${API_HOST_IP}/utils/health` falla (lógica `src/proxy.ts`). `src/app/sitemap.ts` incluye rutas `ROUTES_LIST inSitemap:true`; `/manifest.webmanifest` + iconos PWA 200.
- [ ] Health-check: `proxy.ts` es la sonda — si API cae, redirect `/maintenance`, no 500 crudo. Verificar forzando `API_HOST_IP` inválido en preview y confirmando `/maintenance` amable ES.
- [ ] Rollback: Vercel → Deployments → Promote previous production; o `git revert` + re-deploy. Anotar causa en PR (`pr-description`). Nunca `vercel --force` sobre prod sin avisar.

## Orden por archivo

- No hay archivo propio: cambios solo en `next.config.ts`, `src/proxy.ts`, `src/shared/config/env.ts`, `src/app/sitemap.ts`, `public/manifest*`. Cada cambio con su skill dueña (headers → `security-headers-csp`).

## Naming

- Envs `UPPER_SNAKE`; públicas con prefijo `NEXT_PUBLIC_`. Deployments nombrados por rama/PR (`miteve-web-git-<rama>-*.vercel.app`).

## Verificación

- `curl -I <preview>/` 200; `curl <preview>/sitemap.xml` contiene rutas; Lighthouse PWA instalable; `vercel env ls` sin secretos en `NEXT_PUBLIC_*`.
- `npm run build` reproduce el bundle de prod localmente.

## Out of scope

- Do NOT define CSP/headers bodies here. See `security-headers-csp`.
- Do NOT define proxy guard logic here (only smoke it). See `next-routes-scope`.
- Do NOT define sitemap content rules here. See `seo-performance`, `next-architecture` (`ROUTES_LIST`).
- Do NOT define secrets rotation here. See `conn-secrets`.
- Do NOT define QA flows here. See `apply-qa`.
