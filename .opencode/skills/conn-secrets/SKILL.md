---
name: conn-secrets
description: Use when configuring environment variables in miteve-web via shared config env with public versus server-only separation.
license: MIT
compatibility: opencode
---

# Conn Secrets — env config only

This skill covers ONLY env/secret config vía `src/shared/config/env.ts`. It does NOT cover data fetching or API logic.

## Orden

1. Centralizar TODO acceso en `src/shared/config/env.ts`: `API_HOST_IP` (`NEXT_PUBLIC_API_HOST_IP`), `STREAM_HOST_IP` (`NEXT_PUBLIC_STREAM_HOST_IP`) — públicas, usadas por `usePlayer.ts`, `proxy.ts`, `tmdb.ts`; `TMDB_API_KEY`, `SECURITY_PASSWORD`, `DATABASE_URL` — SOLO servidor (`src/app/api/*`, nunca `NEXT_PUBLIC_`, nunca importadas desde `"use client"`).
2. Archivos: `.env.local` untracked + `.env.example` con placeholders vacíos. Nunca commitear reales.
3. Prod: variables en dashboard Vercel, no en código. Rotar si se filtran.
4. Si falla conexión (TMDB/backend), revisar env + `next.config.ts remotePatterns` + health `${API_HOST_IP}/utils/health` antes de tocar código.

## Naming

- Cliente: prefijo `NEXT_PUBLIC_*`. Servidor: sin prefijo. Importar siempre desde `@/shared/config/env`, nunca `process.env.*` directo en features/widgets.

## Ejemplos miteve-web

- ✅ `usePlayer.ts` importa `API_HOST_IP, STREAM_HOST_IP` de `@/shared/config/env`; `proxy.ts` igual (Edge lee `process.env` vía ese módulo).
- ❌ `const key = process.env.TMDB_API_KEY` dentro de `HeroSection.tsx` (cliente) → mover a `src/app/api/tmdb/*` o `src/shared/api/tmdb.ts` server-side.
- ❌ `NEXT_PUBLIC_TMDB_API_KEY` expone quota al bundle.

## Verificación

- `grep -rn "process\.env" src --include=*.ts*` solo aparece en `src/shared/config/env.ts`. `npm run build` limpio; `git status` sin `.env.local`.

## Out of scope

- Do NOT write fetch queries here. Ver `next-architecture`, `srp-audit`.
- Do NOT definir guards JWT aquí. See `auth-client`.
- Do NOT correr migraciones/DDL contra prod sin issue + PR.
