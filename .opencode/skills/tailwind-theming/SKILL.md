---
name: tailwind-theming
description: Use when styling miteve-web with Tailwind v4 theme tokens, dark fixed background, MUI, Radix, shadcn, and sonner toasts.
license: MIT
compatibility: opencode
---

# Tailwind Theming — styling only

This skill covers ONLY visual styling. It does NOT cover component choice, copy, or page structure.

## Orden de decisión

1. Token en `@theme` (`src/app/globals.css`: `--color-primary: #2d9cdb`, `--color-primary-light: #5bc3ff`) → clase Tailwind (`bg-primary text-primary-light`).
2. Si no existe token: ¿es brand/estado? → agregarlo a `@theme`. ¿one-off layout? → utilidad Tailwind arbitraria solo como excepción.
3. `dark` es fijo `#141414` (`<div className="min-h-screen bg-[#141414] text-white">` en `layout.tsx`): todo componente nuevo debe verse bien sobre ese fondo + mobile drawer/dialogs.
4. `next-themes` instalado pero SIN usar: no agregar toggle claro/oscuro salvo decisión explícita; si se activa, migrar `bg-[#141414]` a token semántico primero.

## Naming

- Clases: utilidades Tailwind + variantes (`md:`, `lg:`) + props del design-system (shadcn `cva` variants). `style="..."` prohibido salvo token CSS (`style={{ background: "var(--color-primary)" }}`).
- Componentes shadcn en `src/shared/ui/*` con `cva` + `clsx` + `tailwind-merge` + icono `lucide-react`. MUI 7 solo para complejos (Dialog/DataGrid-like admin); Radix como primitiva headless; no duplicar Button/Dialog en ambos sistemas.

## Ejemplos miteve-web

- ✅ `bg-[#141414] text-white` shell global; `text-primary` acentos; `Toaster richColors position="top-center" closeButton` en `layout.tsx`.
- ✅ `video::cue` subtítulos con text-shadow en `globals.css`.
- ❌ `bg-[#ff0000]` hardcodeado para error → token semántico + `sonner` toast ES friendly.
- ❌ Nuevo `Card` artesanal en un widget → reutilizar `src/shared/ui/*`.

## Verificación

- `grep -rn "#[0-9a-fA-F]\{3,6\}" src --include=*.tsx | grep -v "141414\|globals.css"` debe tender a vacío (solo excepciones justificadas).
- Revisar 360px/768px/1280px + drawer/dialogs mobile. Ver `apply-qa`, `a11y`.

## Out of scope

- Do NOT elegir componentes aquí. Ver `next-architecture`.
- Do NOT agregar copy aquí. Ver `i18n-next`.
- Do NOT definir motion curves aquí. Ver `motion-ux`.
- Do NOT definir errores/toasts lógica aquí. Ver `error-handling`.
