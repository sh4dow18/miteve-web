---
name: srp-audit
description: Use when reviewing a file in miteve-web to verify Single Responsibility Principle and relocate misplaced functions to their correct FSD module.
license: MIT
compatibility: opencode
---

# SRP Audit — single-responsibility file review and relocation

This skill covers ONLY auditing one target file for SRP and moving misplaced logic to its correct owner. It does NOT cover formatting, secrets, or API exposure.

Trigger phrases: "revisa si cumple SRP", "acoplarlo", "esta funcion pertenece a otro archivo", "viola responsabilidad unica".

## Orden

### 1. Define la responsabilidad esperada

- Derivar de nombre + carpeta + capa FSD:
  - `src/app/**/page.tsx` → routing + composición para esa ruta only.
  - `src/features/<d>/page.tsx|model/|ui/` → una acción de negocio de `<d>` only.
  - `src/widgets/<s>/ui/|model/` → presentación de la sección `<s>` only.
  - `src/entities/<d>/` → tipos + mappers + API pura de `<d>` only, sin UI.
  - `src/shared/` → reutilizable only.
  - `src/app/api/*` → boundary server (ffmpeg/upload) only.
- Un dominio por archivo. Si el archivo tiene 2 responsabilidades, ya falla SRP.

### 2. Inventaría cada función

- Listar handlers/helpers con firma + 1 línea. Para cada uno: entidad tocada, data source, si el caller necesita la UI dueña. No confiar en el nombre: leer el cuerpo.

### 3. Clasifica

- `native`: opera sobre la UI/página dueña u orquesta datos donde la UI dueña es requerida.
- `misplaced`: opera sobre dominio ajeno sin necesitar la UI dueña. Ej: cálculo de episodios dentro de `HeroSection.tsx` → `src/features/tv-shows/model/` o `entities/content`.
- `mixed`: hace ambas → partir: UI queda, data se extrae a `entities/shared`, se importa.
- Señales típicas miteve-web: fetch TMDB/`STREAM_HOST_IP` dentro de `ui/*.tsx`; copy ES + colores en `entities/`; query de downloads dentro de player; `getJWTAuthorities` duplicado fuera de `proxy.ts`/`auth.ts`; lógica shaka en `page.tsx` en vez de `usePlayer.ts`.

### 4. Decide target (mover, no copiar)

- Default: dueño del dominio (`src/entities/content/`, `src/shared/lib/`, `src/shared/api/tmdb.ts`, `src/features/<d>/model/`). Respetar `app -> features -> widgets -> entities -> shared`. `shared/entities` nunca importan `features/widgets/app`.
- Cortar del origen, pegar en target, actualizar imports/barrels (`index.ts`), props donde aplique. Nunca duplicar fetch. Errores vía `error-handling`, fechas `Intl.DateTimeFormat`.

### 5. Naming

- Nuevo helper: verbo + dominio (`getPlayerData`, `pickRandomContainerContent`, `saveDownload`). Hook `use*` en `model/`.

## Verificación

- Re-inventario: origen solo `native`. `grep` nombre viejo: 0 referencias rotas. `npm run build` 0 errores (ver `next-build-run`).

## Out of scope

- Do NOT definir formato aquí. See `ts-format-next`.
- Do NOT definir theming aquí. See `tailwind-theming`.
- Do NOT definir API scope aquí. See `next-routes-scope`.
