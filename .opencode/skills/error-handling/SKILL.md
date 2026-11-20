---
name: error-handling
description: Use when handling errors in miteve-web via shared lib helpers and sonner toasts with friendly Spanish messages.
license: MIT
compatibility: opencode
---

# Error Handling — error handling only

This skill covers ONLY error handling via `src/shared/lib/errors.ts` + `sonner`. It does NOT cover formatting or business logic.

## Orden

1. Crear/usar `src/shared/lib/errors.ts` con `handleAsync<T>(fn, actionName)` para async con resultado y `logError(level, actionName, error)` para log manual. Si no existe aún, crearlo con esa firma antes de dispersar try/catch.
2. Toda llamada riesgosa (player shaka, offline-db, TMDB, upload/ffmpeg) envuelta en `handleAsync` con `actionName` explícito: `"Player.load"`, `"DownloadButton.onClick"`, `"Upload.verifyDash.POST"`.
3. Display: `toast.error(...)` ES friendly vía strings centralizados (ver `i18n-next`), nunca traceback ni 500 crudo. Log técnico solo server (`api/`, `proxy.ts`), nunca exponer `TMDB_API_KEY`/`DATABASE_URL` en mensaje cliente.

## Naming

- `actionName` formato `"Componente.accion"` o `"Ruta.METODO"`. Niveles `logError`: `error|warn|info`. Mensajes ES: `"No pudimos cargar el contenido. Intenta de nuevo."`.

## Ejemplos miteve-web

- ✅ `usePlayer.ts`: fallo shaka → `logError("error", "Player.load", err)` + `toast.error("No se pudo reproducir...")` + fallback offline (`player?offline=true`).
- ✅ `useOfflineDownload.ts` / `useBulkOfflineDownload.ts`: fallo IndexedDB → toast ES + estado reintentable.
- ✅ `proxy.ts` health-check: `catch` → `apiOk=false`, redirect `/maintenance` o `/downloads`, sin filtrar detalles del backend.
- ❌ `try { ... } catch (e) { console.log(e) }` disperso en `Player.tsx`, `DownloadButton.tsx`, `useComments.ts`.

## Verificación

- `grep -rn "console\.\(log\|error\)" src` solo permite `console.warn("[SW]...")` del registro SW y logs vía `logError`. `npm run build` limpio.

## Out of scope

- Do NOT define formatting here. See `ts-format-next`.
- Do NOT define user copy here. See `i18n-next`.
- Do NOT define API scope here. See `next-routes-scope`.
- Do NOT definir toasts visuales aquí. See `tailwind-theming`.
