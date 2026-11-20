---
name: ffmpeg-upload-jobs
description: Use when working on transcode or upload verification jobs in miteve-web under src/app/api/ffmpeg and src/app/api/upload/verify with jobId polling.
license: MIT
compatibility: opencode
---

# FFmpeg Upload Jobs — transcode + verify only

This skill covers ONLY `src/app/api/ffmpeg/360p|1080p/route.ts`, `src/app/api/ffmpeg/job/[id]/route.ts`, `src/app/api/upload/verify|verify-dash/route.ts`. It does NOT cover player playback, TMDB, auth guards, ni UI de subida.

## Checklist accionable

- [ ] Creación: `POST src/app/api/ffmpeg/360p/route.ts` y `POST .../1080p/route.ts` validan input con `zod` (sourceUrl/fileId, perfil) → encolan job → retornan `{ jobId }` 202. Sin transcodificar inline en el POST; sin pricing math.
- [ ] Polling: `GET src/app/api/ffmpeg/job/[id]/route.ts` retorna `{ jobId, status: 'queued'|'running'|'done'|'error', progress?: number, outputUrl?, error? }`. Cliente (`useOfflineDownload`, `useBulkOfflineDownload`) pollea con backoff (2s→5s→15s, tope ~5min) y corta en `done/error`.
- [ ] Verify: `POST src/app/api/upload/verify/route.ts` (archivo suelto) y `POST .../verify-dash/route.ts` (manifiesto DASH: valida MPD + segmentos accesibles) → `{ ok: boolean, details? }`. Firma/body-raw verificado ANTES de `req.json()` si hay webhook.
- [ ] Errores ES amables: `done` con `outputUrl` firmada/relativa; `error` con mensaje genérico (`"La conversión falló, intenta de nuevo"`) + `logError` interno con `jobId`. Nunca stack/paths internos al cliente (ver `error-handling`).
- [ ] Limpieza: jobs temporales expiran (TTL o cron de purga); `outputUrl` caduca; no dejar artefactos >24h sin referencia. Idempotencia por `idempotency-key` o `fileId+perfil` → mismo `jobId` si ya `queued/running`.
- [ ] Ejemplo flujo: `QualityModal.tsx` → `POST /api/ffmpeg/1080p` → `{jobId}` → poll `GET /api/ffmpeg/job/[id]` → `done` → `POST /api/upload/verify-dash` → guardar en `offline-db.ts` + toast `sonner` ES.

## Orden por archivo

- `route.ts`: `export async function POST/GET(req: NextRequest)` → `zod.parse` → `handleAsync` → UNA fn lib (`enqueueJob`, `getJob`, `verifyManifest`) → `NextResponse.json`. Sin JSX, sin fetch TMDB.

## Naming

- Rutas kebab-case (`verify-dash`). Handlers `GET/POST` mayúsculas. `actionName` logs: `"FFmpeg.1080p.POST"`, `"FFmpeg.Job.GET"`, `"Upload.verifyDash.POST"`. Estados lowercase exactos `queued/running/done/error`.

## Verificación

- `curl -X POST localhost:3000/api/ffmpeg/360p -d '{}'` → 400 zod ES; job real → 202 `{jobId}`; `GET /api/ffmpeg/job/<id>` transiciona `queued→running→done`.
- `POST /api/upload/verify-dash` con MPD roto → `{ ok: false }` 4xx, sin 500 sin manejar.
- `grep SECRET` en estas routes no expone claves; `npm run build` verde.

## Out of scope

- Do NOT implement player playback here. See `pwa-player`.
- Do NOT define proxy guards here. See `next-routes-scope`.
- Do NOT define IndexedDB schema here (only write result to it). See `continue-watching-history`, `next-architecture`.
- Do NOT define secrets here. See `conn-secrets`.
- Do NOT define upload UI here. See `tailwind-theming`, `next-architecture`.
