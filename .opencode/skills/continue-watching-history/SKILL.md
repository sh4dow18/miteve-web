---
name: continue-watching-history
description: Use when implementing resume playback in miteve-web with useContinueWatchingEntry History EndTimeOverlay and sync to new-api continue-watching history plus IndexedDB.
license: MIT
compatibility: opencode
---

# Continue Watching History — reanudar only

This skill covers ONLY reanudar + historial: `useContinueWatchingEntry`, `History`, `EndTimeOverlay`, sync `new-api/continue-watching|history` + `offline-db.ts`. It does NOT cover player shaka internals, perfiles PIN, ni analytics.

## Checklist accionable

- [ ] Escritura: `src/widgets/content-detail/model/useContinueWatchingEntry.ts` guarda `{ contentId, profileId, positionSec, durationSec, updatedAt }` throttled (cada 10s + `pause/seek/ended/beforeunload`). Umbral: guarda si `position > 30s` y `restante > 60s`; si termina (`EndTimeOverlay`), marca visto y elimina entrada.
- [ ] Lectura: `ContinueWatchingRow.tsx` / `ContinueWatchingRowTV.tsx` (`src/features/home/ui/`) leen entradas del perfil activo ordenadas `updatedAt desc`, con barra progreso + `"Continuar desde 12:34"`. `History` (page/row) es log inmutable aparte, nunca se borra al terminar.
- [ ] Overlays: `src/widgets/player/ui/EndTimeOverlay.tsx` + `EndTimeOverlayTV.tsx` (`Siguiente episodio` / `Ver de nuevo` / `Volver`) disparan `onEnded` → limpia continue-watching + escribe `history`. D-pad TV: foco inicial en `Siguiente`.
- [ ] Sync: `POST new-api/continue-watching` y `POST new-api/history` (axios + JWT de `auth-client`, `profileId` en body); offline → cola en `src/shared/lib/offline-db.ts` (stores `continue-watching`, `history`) y re-sync al volver red (`usePWA`/`online` event). Last-write-wins por `updatedAt`. Nunca PII fuera de ids.
- [ ] Ejemplo: `usePlayer.ts` `onTimeUpdate` → `useContinueWatchingEntry.save(position)` → `Player.tsx` muestra `"Reanudar"` si `position > 0`; `verify` de descarga offline actualiza misma entrada local.

## Orden por archivo

- Hook entry: `save/pause/resume/clear` con `useCallback` + throttle; componente row: solo lee hook + renderiza `ContentCard` con `progress`. Sync fn en `entities/content/api` o `shared/api`, nunca en `ui/`.

## Naming

- `useContinueWatchingEntry`, `ContinueWatchingRow(TV)`, `EndTimeOverlay(TV)`, stores idb `continue-watching`, `history`. Endpoints `continue-watching`, `history`. Campos `positionSec`, `durationSec`.

## Verificación

- `npx vitest run` cubre: guarda throttled, no guarda <30s, `ended` limpia + escribe history, sync reintenta offline (mock `offline-db`).
- Manual: ver 2min → salir → `ContinueWatchingRow` muestra progreso; terminar → desaparece y aparece en `History`.

## Out of scope

- Do NOT define shaka/playback here. See `pwa-player`.
- Do NOT define IndexedDB schema general here (only these stores). See `next-architecture`.
- Do NOT define player event batching here. See `analytics-player-events`.
- Do NOT define profile switching here. See `profiles-parental`.
- Do NOT define download jobs here. See `ffmpeg-upload-jobs`.
