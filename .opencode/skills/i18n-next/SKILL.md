---
name: i18n-next
description: Use when adding or fixing any user-visible text in miteve-web to centralize Spanish strings and prepare next-intl.
license: MIT
compatibility: opencode
---

# I18n Next — user-visible Spanish text only

This skill covers ONLY localization. It does NOT cover component choice, colors, or formatting.

## Orden

1. **Fix inmediato**: `<html lang="en">` en `src/app/layout.tsx` → `lang="es"` (UI 100% español; bug verificado).
2. **Centralizar**: todo texto visible sale de `page.tsx`/`ui/*.tsx` a un módulo de strings ES (p. ej. `src/shared/i18n/es.ts` o por-feature `config/*.constants.ts` como `HOME_ROWS` en `src/features/home/config/home.constants.ts`). Nunca hardcodear ES en 2+ lugares.
3. **Keys**: formato `Seccion_Elemento` (`Hero_Titulo`, `Player_Error_Reproducir`, `Common_Cerrar`, `Download_Calidad_Titulo`). Componentes reutilizables reciben la key, no el valor traducido.
4. **Preparar next-intl**: cuando se adopte, envolver con `t("Key")`; hoy, importar del módulo central. `metadata.title/description` de `ROUTES_LIST` ya están en ES — mantenerlos como fuente para SEO.

## Naming

- Keys `PascalCase` por segmento con `_`: `Seccion_Subseccion_Elemento`. Ficheros `es.ts` (hoy), `en.ts` futuro. Sin `lorem`, sin strings EN mezclados en UI ES.

## Ejemplos miteve-web

- ✅ `HOME_ROWS.recent / comingSoon` centralizados; `ROUTES_LIST` titles/summaries ES; toasts `sonner` ES ("No se pudo reproducir...").
- ❌ `"Ver ahora"` hardcodeado en `HeroSection.tsx` + `ContentCard.tsx` duplicado → constante/key compartida.
- ❌ `lang="en"` actual con `description` ES (inconsistente para crawlers/lectores).

## Verificación

- `grep -rn 'lang=' src/app/layout.tsx` → `"es"`; `grep` texto duplicado entre widgets tiende a 0; Lighthouse i18n OK.

## Out of scope

- Do NOT elegir componentes aquí. Ver `next-architecture`.
- Do NOT definir colores aquí. See `tailwind-theming`.
- Do NOT definir SEO tags aquí. See `seo-performance`.
