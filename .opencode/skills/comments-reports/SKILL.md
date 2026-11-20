---
name: comments-reports
description: Use when building comments bug reports or content suggestions in miteve-web with useComments zod validation and friendly Spanish messages.
license: MIT
compatibility: opencode
---

# Comments Reports — useComments + bug/suggest only

This skill covers ONLY `useComments`, `CommentsSection`, `src/features/bug-report/**`, `src/features/suggest-content/**` con `zod`. It does NOT cover player, perfiles, deploy, ni analytics.

## Checklist accionable

- [ ] Comentarios: `src/widgets/content-detail/model/useComments.ts` + `ui/CommentsSection.tsx` (`Detail.tsx`/`DetailTV.tsx` lo componen). CRUD vía `axios` + JWT; validación `zod` (texto 1-500 chars, sin HTML — strip tags); optimista con rollback en error; toast `sonner` ES (`"Comentario publicado"`, `"No pudimos publicar, intenta de nuevo"`).
- [ ] Bug-report: `src/features/bug-report/page.tsx` (form: título, descripción, pasos, `contentId?` pre-rellenado desde `Detail`). zod + `POST new-api/bug-report`; éxito → pantalla confirmación + link volver; error → mensaje amable, nunca stack.
- [ ] Suggest: `src/features/suggest-content/page.tsx` + `model/useSuggestContent.ts` + `useSuggestContentPage.ts` + `ui/TmdbSuggestSearch.tsx` (busca vía `tmdb-client` con debounce 300ms) + `getSuggestContentPageData.ts`. Submit `POST new-api/suggest` con `{ tmdbId, title, reason? }`; duplicado → `"Ya recibimos esta sugerencia, ¡gracias!"`.
- [ ] Moderación mínima: `isAdult`/autor desde `AdultProfileContext`; reportar comentario (flag) con confirmación Radix `AlertDialog`; sin palabras técnicas al usuario. Rate-limit cliente (1 comentario/10s, 1 reporte/min) + server valida.
- [ ] Ejemplo schema: `z.object({ text: z.string().trim().min(1, 'Cuéntanos tu idea').max(500, 'Máximo 500 caracteres'), contentId: z.string().min(1) })`. Todos los mensajes usuario en ES.

## Orden por archivo

- `model/useComments.ts`: schema zod → `useState` lista → `post/delete/report` con `handleAsync` → retorno `{ comments, post, isPosting }`. `page.tsx` fina: form + `react-hook-form`+zod si complejo, si no controlado simple.

## Naming

- `useComments`, `CommentsSection`, `useSuggestContent`, `TmdbSuggestSearch`, `bug-report`, `suggest-content`. `actionName`: `"Comments.post"`, `"Suggest.submit"`, `"BugReport.submit"`.

## Verificación

- `npx vitest run` cubre schemas (vacío, >500, HTML strip) + `useComments` optimista/rollback + duplicado suggest.
- Manual: post vacío → error ES inline; sin red → toast amable; `grep -r "stack\|500" src/features/bug-report src/features/suggest-content --include="*.tsx"` sin leaks técnicos al UI.

## Out of scope

- Do NOT define TMDB client internals here. See `tmdb-client`.
- Do NOT define search page pattern here. See `search-filter-pattern`.
- Do NOT define auth/session here. See `auth-client`.
- Do NOT define error infra here (only use it). See `error-handling`.
- Do NOT define docs prose here. See `docs-learn-more`.
