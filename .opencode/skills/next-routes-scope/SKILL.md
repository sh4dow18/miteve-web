---
name: next-routes-scope
description: Use when adding or editing server endpoints in miteve-web under src/app/api plus proxy.ts guards with zod validation.
license: MIT
compatibility: opencode
---

# Next Routes Scope — server boundary only

This skill covers ONLY `src/app/api/*` route handlers + `src/proxy.ts`. It does NOT cover business math, data fetching UI, or page structure.

## Orden permitido

- Solo existen dos familias de rutas API: `src/app/api/ffmpeg/*` (transcode/probe) y `src/app/api/upload/*` (incl. `verify-dash/route.ts`). Más `tmdb/seasons/scrape/archive` legacy: no crear nuevas familias sin PR justificado.
- Rutas thin: validar input con `zod` → llamar UNA fn de `entities`/`shared/lib` → retornar JSON. Sin pricing math, sin parseo markdown, sin lógica de player en la route.
- Patrón App Router: `export async function GET/POST(req: NextRequest)` en `route.ts`. Webhook/verify con body raw + firma ANTES de `req.json()`.

## Naming

- Segmentos kebab-case English (`verify-dash`, no `verifyDash`). Handlers `GET`/`POST` mayúsculas. `actionName` para logs en formato `"Upload.verifyDash.POST"`.
- Errores vía `error-handling` (`handleAsync`/`logError`), mensajes usuario en ES friendly, nunca stack técnico al cliente. Verificación de firma fallida → `logError` + genérico 500/401.

## Ejemplos miteve-web

- ✅ `src/app/api/upload/verify-dash/route.ts`: valida payload zod, verifica manifiesto DASH, retorna JSON.
- ✅ `src/proxy.ts`: guard `/admin` por autoridad JWT `read-admin-page`; bypass `/downloads` y `/player/*?offline=true`; health-check `HEAD ${API_HOST_IP}/utils/health` → `/maintenance` o `/downloads`.
- ❌ Query TMDB o cálculo de episodios dentro de `route.ts` → mover a `src/entities/content/api/index.ts` o `src/shared/api/tmdb.ts`.
- ❌ Página `src/app/(main)/*` llamando `/api/*` para contenido ya disponible vía `getPlayerData`/TMDB lib → leer directo, no round-trip.

## Verificación

- `npm run build` 0 errores; probar rutas con `curl` local (`GET /api/...` 200/4xx esperado, nunca 500 sin manejar); `grep SECRET` confirma que ninguna route expone `TMDB_API_KEY`/`DATABASE_URL` al cliente.

## Out of scope

- Do NOT implementar lógica de negocio aquí. Ver `next-architecture`, `srp-audit`.
- Do NOT definir formato TS aquí. See `ts-format-next`.
- Do NOT definir secretos aquí. See `conn-secrets`.
- Do NOT definir guards de cliente aquí. See `auth-client`.
