---
name: pwa-player
description: Use when working on offline downloads, service worker, IndexedDB, or the shaka-player DASH playback experience in miteve-web.
license: MIT
compatibility: opencode
---

# PWA Player — offline + playback only (skill NUEVO, sin origen)

This skill covers ONLY PWA offline (`public/sw.js`, `offline.html`, `manifest.ts`, `offline-db.ts`, hooks) + `shaka-player` DASH en `widgets/player` + `features/player`. It does NOT cover auth, SEO, or API routes.

## Orden checklist

1. **SW**: `public/sw.js` registrado en `layout.tsx` (`navigator.serviceWorker.register('/sw.js')`). Cache-first app-shell + `/downloads`; network-first player online. `offline.html` fallback. Versionar cache al cambiar assets.
2. **IndexedDB**: `src/shared/lib/offline-db.ts` (`DB miteve-offline`, store `downloads`, `keyPath: "key"`) guarda SOLO metadata (`OfflineDownload`: `key = contentId` o `contentId-sN-eN`, `offlineUri` de Shaka, `downloadedAt`, `sizeBytes`). Segmentos los guarda Shaka en su propia DB — nunca duplicar blobs.
3. **Hooks**: `useOfflineDownload` (una peli/episodio), `useBulkOfflineDownload` (temporada completa), `usePWA` (estado install/offline). Errores vía `error-handling` + toast ES reintentable.
4. **UI**: `src/widgets/download/ui/` (`DownloadButton`, `BulkDownloadButton`, `QualityModal` con opciones 360p/1080p, `BulkDownloadModal`) + `src/features/downloads/page.tsx` + `ui/DownloadCard.tsx`. Progreso visible, cancelar, borrar, tamaño estimado.
5. **Player**: `src/widgets/player/ui/Player.tsx` (+ `PlayerTV.tsx`, `EndTimeOverlay`) + `src/features/player/model/usePlayer.ts` (shaka DASH, `STREAM_HOST_IP` de `env.ts`, calidades 360p↔1080p AV1, `OfflinePlayerPage.tsx` cuando `?offline=true` usa `offlineUri` de IndexedDB). Fixes iOS: tipos `WebkitVideoElement` (`webkitEnterFullscreen`), `WebkitContainer`, `WebkitDocument`; probar `webkitDisplayingFullscreen` y salida limpia.
6. **Guards**: `proxy.ts` bypass `/downloads` y `/player/*?offline=true` (ver `next-routes-scope`, `next-architecture`).

## Naming

- Keys `contentId-sN-eN` (`s`eason/`e`pisode). `actionName`: `"OfflineDownload.save"`, `"Player.loadOffline"`. Calidades `360p/720p/1080p` consistentes en modal + player + verify-dash.

## Ejemplos miteve-web

- ✅ `saveDownload({ key: "abc-s1-e3", offlineUri, ... })` tras descarga Shaka; `getDownloads()` lista `/downloads`; `player/[id]?offline=true` reproduce sin red.
- ❌ Guardar `ArrayBuffer` de video en `miteve-offline`; ❌ `localStorage` para metadata binaria; ❌ asumir fullscreen API desktop en iOS.

## Verificación

- Flujo: online → descargar 360p → airplane mode → `/downloads` lista → play offline OK → borrar libera. DevTools Application: ambas DB visibles. `npm run build` limpio.

## Out of scope

- Do NOT definir guards de ruta aquí. See `next-routes-scope`.
- Do NOT definir error copy aquí. See `error-handling`, `i18n-next`.
- Do NOT definir SEO/manifest meta aquí. See `seo-performance`.
- Do NOT definir auth aquí. See `auth-client`.
