---
name: analytics-player-events
description: Use when adding playback analytics in miteve-web with play pause seek ended error events batched offline-queued in IndexedDB and opt-out without PII.
license: MIT
compatibility: opencode
---

# Analytics Player Events — sin PII, batch + offline

This skill covers ONLY eventos `play/pause/seek/ended/error` del player con batch, cola offline y opt-out. It does NOT cover continue-watching funcional, comentarios, deploy, ni CSP.

## Checklist accionable

- [ ] Eventos mínimos: `player.play`, `player.pause`, `player.seek`, `player.ended`, `player.error` emitidos desde `src/features/player/model/usePlayer.ts` (shaka events + controles `Player.tsx`/`PlayerTV.tsx`). Payload: `{ event, contentId, profileId(hash), positionSec, durationSec, quality?, errorCode?, at }`. NUNCA email, nombre perfil, IP, JWT, PIN.
- [ ] Batch: buffer en memoria (20 eventos o 30s, lo primero) → `POST new-api/analytics/batch`. `seek` throttled (máx 1/5s); `error` siempre inmediato + `logError` (ver `error-handling`).
- [ ] Offline queue: sin red → guardar en `src/shared/lib/offline-db.ts` store `analytics-queue`; reenviar al `online`/`usePWA` con backoff, deduplicar por `eventId (crypto.randomUUID)`. Cola acotada (500) con drop-oldest + contador `dropped`.
- [ ] Opt-out: flag `analyticsOptOut` por perfil (`localStorage miteve_analytics_optout=1` + server si hay sesión); `Settings`/perfil con switch Radix `"Ayúdanos a mejorar"`; opt-out corta emisión y vacía cola pendiente. Sin banner que bloquee player.
- [ ] Ejemplo: `usePlayer.on('pause') → track('player.pause', { positionSec })`; `EndTimeOverlay` dispara `player.ended`; `shaka onError` → `player.error { errorCode }` + toast ES al usuario (sonner), detalle técnico solo al log.

## Orden por archivo

- `shared/lib/analytics.ts` (nuevo si no existe): `track(event, props)` → buffer → `flush()`; `usePlayer` solo llama `track`, nunca `fetch` directo. Tipos estrictos `PlayerEvent`.

## Naming

- Eventos `player.<verbo>` lowercase (`player.play`). Store idb `analytics-queue`. Función `trackPlayerEvent`. Header batch `X-Analytics-Batch: 1`.

## Verificación

- `npx vitest run` cubre: batch flushea a N=20, `seek` throttled, offline encola + reenvía, opt-out silencia todo; `grep -r "email\|token\|pin" src/shared/lib/analytics*` vacío (sin PII).
- DevTools offline → eventos en idb `analytics-queue`; online → `POST /analytics/batch` 200 y cola vacía.

## Out of scope

- Do NOT define resume/history here. See `continue-watching-history`.
- Do NOT define shaka playback here (only hook events). See `pwa-player`.
- Do NOT define error UI copy here beyond toast. See `error-handling`.
- Do NOT define CSP connect-src for endpoint here (coordinate). See `security-headers-csp`.
- Do NOT define PII/profiles logic here. See `profiles-parental`.
