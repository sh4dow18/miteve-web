---
name: profiles-parental
description: Use when working on profiles switching or parental controls in miteve-web under src/features/profile and switch-profiles with AdultProfileContext PIN guards.
license: MIT
compatibility: opencode
---

# Profiles Parental — profiles + PIN guards only

This skill covers ONLY `src/features/profile/**`, `src/features/switch-profiles/**` y `src/shared/lib/AdultProfileContext.tsx`. It does NOT cover auth JWT, API routes, analytics, ni theming.

## Checklist accionable

- [ ] Fuente de verdad: `AdultProfileContext` (`src/shared/lib/AdultProfileContext.tsx`: `{ activeProfile, isAdult, unlockAdult(pin), lockAdult, switchProfile }`). `src/features/switch-profiles/page.tsx` + `model/useSwitchProfiles.ts` + `ui/AddProfileModal.tsx` leen de ahí; prohibido `useState` de perfil duplicado en rows (`ProfileContentRow.tsx`, `useProfileRow.ts`).
- [ ] Switch: `switch-profiles/page.tsx` lista perfiles (avatar Radix + nombre), crea vía `AddProfileModal` (zod: nombre 2-20 chars, ES amable), cambia con `switchProfile(id)` + `router.replace('/')`. Persistencia en `localStorage`/cookie ligera + sync `new-api` si hay sesión.
- [ ] PIN parental: contenido adulto (`isAdultRequired`) exige `unlockAdult(pin)` (PIN 4 dígitos, intentos limitados 5 + cooldown 60s, mensaje `"PIN incorrecto, intenta de nuevo"`). PIN nunca en `localStorage` plano ni en URL; solo memoria + hash servidor. `lockAdult` al cambiar de perfil o cerrar sesión.
- [ ] Guards: `useGenrePage`/`GenrePageNormal/TV`, `BrowseDetail`/`DetailTV`, `HeroSection` filtran u ocultan adultos si `!isAdult` (blur + candado + CTA `"Pide el PIN a un adulto"`). `src/proxy.ts` NO decide parental (solo JWT/health); el guard es cliente sobre contexto.
- [ ] Ejemplo: `TopTenRow.tsx` vs `TopTenRowTV.tsx` reciben `items` ya filtrados por `getHomePageData(profileId)`; `Detail.tsx` pide PIN vía modal Radix antes de `Player`.

## Orden por archivo

- `AdultProfileContext.tsx`: tipos → provider + `useAdultProfile()` hook → `unlock/lock/switch` con `useCallback`. `model/useSwitchProfiles.ts`: profiles CRUD + PIN verify vía `axios`. `ui/`: solo presenta props.

## Naming

- `AdultProfileContext`, `useAdultProfile`, `useSwitchProfiles`. Props `profile`, `isLocked`, `onUnlock`. Rutas `switch-profiles`, `profile`. Mensajes ES.

## Verificación

- Sin PIN → ruta/contenido adulto muestra lock, nunca video; PIN ok → desbloquea sesión; `grep -r "pin" src --include="*.tsx" -i | grep -i "localStorage"` vacío (sin PIN persistido).
- `npx vitest run` cubre `useSwitchProfiles` (switch, PIN ok/ko, lock) y guards filtran fixture adulto.

## Out of scope

- Do NOT define JWT/session here. See `auth-client`.
- Do NOT define proxy guards here. See `next-routes-scope`.
- Do NOT define download/history sync here. See `continue-watching-history`.
- Do NOT define comment validation here. See `comments-reports`.
- Do NOT define styling here. See `tailwind-theming`.
