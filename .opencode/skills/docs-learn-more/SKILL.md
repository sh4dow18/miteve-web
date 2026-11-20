---
name: docs-learn-more
description: Use when writing user-facing docs in miteve-web under documentation/learn-more with purpose who what flow prose, plus README and ROUTES_LIST index.
license: MIT
compatibility: opencode
---

# Docs Learn More — prosa usuario, sin código

This skill covers ONLY `documentation/learn-more/**`, `README.md` real y `ROUTES_LIST` como índice. It does NOT cover código fuente, API, tests, ni estilos.

## Checklist accionable

- [ ] Estructura por página: `documentation/learn-more/<tema>/page.md(x)` con 4 secciones fijas: `Purpose` (por qué existe), `Who` (para quién), `What` (qué puede hacer), `Flow` (pasos 1-2-3 en ES amable). Sin bloques de código, sin imports, sin snippets TS. Ejemplo: `learn-more/downloads` → Purpose offline viajes / Who perfiles adultos / What 360p-1080p / Flow elegir calidad → verificar → ver en `/downloads`.
- [ ] `README.md` real: reemplazar default `create-next-app`. Incluye: qué es miteve-web (streaming Next.js 16 + PWA), stack (React 19, Tailwind v4, zustand, shaka, IndexedDB), `npm run dev/build/start`, envs requeridas (tabla nombre + dónde conseguirla, sin valores), estructura FSD 1 párrafo, link a `documentation/learn-more` y `ROUTES_LIST`.
- [ ] `ROUTES_LIST` como índice: toda página documentada existe en `src/shared/config/routes.ts`; docs listan links vía `routeToHref()` (`downloads`, `search`, `genre`, `switch-profiles`), nunca paths hardcodeados. `src/app/sitemap.ts` y docs leen la misma fuente.
- [ ] Tono ES amable, frases cortas, sin jerga (`"Toca Descargar y elige calidad"` no `"ejecuta el job ffmpeg"`). Capturas/gifs opcionales en `public/docs/*`, nunca binarios en `documentation/`.
- [ ] Cada PR que agregue ruta UI actualiza su doc `learn-more` + `README` si cambia setup. Docs huérfanas (sin ruta en `ROUTES_LIST`) se borran.

## Orden por archivo

- Doc: título H1 → `Purpose` → `Who` → `What` (bullets) → `Flow` (lista numerada) → `Ver también` (links `ROUTES_LIST`). `README`: intro → stack → quickstart → envs → estructura → docs.

## Naming

- Carpetas kebab-case English (`learn-more/continue-watching`); títulos ES. Archivos `page.md` o `README.md`. Links con slug de ruta (`/downloads`, no `/Descargas`).

## Verificación

- `grep -r "```" documentation/learn-more` vacío (sin código); `npm run build` no rompe por docs; cada slug documentado existe en `ROUTES_LIST` (`grep <slug> src/shared/config/routes.ts`).
- `README.md` no contiene `"Get started by editing"` del template.

## Out of scope

- Do NOT document API internals here. See `next-routes-scope`, `ffmpeg-upload-jobs`.
- Do NOT define routes here (only index them). See `next-architecture`.
- Do NOT write code examples here. See `vitest-unit-testing`, `storybook-driven-ui`.
- Do NOT define SEO meta here. See `seo-performance`.
- Do NOT define i18n mechanics here. See `i18n-next`.
