---
name: a11y
description: Use when building or remediating any UI in miteve-web to enforce accessibility with keyboard, TV navigation, contrast, and touch targets.
license: MIT
compatibility: opencode
---

# A11y — accessibility only

This skill covers ONLY a11y. It does NOT cover SEO, motion curves, or copy translation.

## Orden checklist

1. Semántica: `header/main/nav/footer/section` con `aria-label` si hay 2+ landmarks. Un `h1` por ruta en `src/app/*`. Skip link `Saltar al contenido` → `#main`.
2. Teclado: todo CTA/link/menu/FAQ operable con Tab/Enter/Space/Escape. Focus visible (`:focus-visible` ring vía tokens). Prohibido `div onClick` sin `role=button tabIndex=0` + handler de teclado.
3. TV: variantes `*TV.tsx` (`PlayerTV.tsx`, `HeroSectionTV.tsx`, `ContentRowTV.tsx`, `DetailTV.tsx`, `BrowseDetailTV.tsx`) conmutadas por `useTV()`; navegación espacial con `useFocusable` + `useKeyboardNavigation` (`src/shared/lib/hooks/`); foco inicial en hero/play y retorno de foco en modales (`QualityModal`, `BulkDownloadModal`).
4. Contraste + touch: texto 4.5:1, large 3:1, target táctil 44px min sobre fondo `#141414`. Probar ambos estados de `sonner` Toaster.
5. Media/forms: `alt` descriptivo (decorativo `alt=""`), `video::cue` legible (ya en `globals.css`), captions/transcript cuando aplique; forms (`bug-report`, `login`, `suggest-content`) con `<label>` explícito, `aria-describedby` en errores ES friendly, éxito con `aria-live="polite"`.
6. Motion: respetar `prefers-reduced-motion` (ver `motion-ux`).

## Naming

- Keys de errores/aria vía strings ES centralizados (ver `i18n-next`): `Player_Error_Load`, `Common_Cerrar`. Componentes accesibles base en `src/shared/ui/*` (shadcn/Radix) — preferirlos.

## Ejemplos miteve-web

- ✅ `src/widgets/download/ui/QualityModal.tsx` con foco atrapado + Escape cierra + `aria-label` por calidad (360p/1080p).
- ✅ `ContentRowTV` navegable por filas con `useKeyboardNavigation`, `rowIndex/totalRows` de `HOME_ROW_INDICES`.
- ❌ `DownloadButton` como `div onClick` sin rol; ❌ error solo en rojo sin texto (`aria-describedby` ausente).

## Verificación

- Playwright solo-teclado + Lighthouse a11y 95+, sin `aria-*` misuse, sin `button/a` vacíos. Ver `apply-qa`.

## Out of scope

- Do NOT define copy text here. See `i18n-next`.
- Do NOT define SEO tags here. See `seo-performance`.
- Do NOT define animation timing here. See `motion-ux`.
- Do NOT definir estilos visuales aquí. See `tailwind-theming`.
