---
name: auth-client
description: Use when working on login, JWT session, admin guards, or maintenance redirects in miteve-web with dual localStorage and cookie token.
license: MIT
compatibility: opencode
---

# Auth Client — session + guards only

This skill covers ONLY auth cliente (`src/shared/lib/auth.ts`) + guard Edge (`src/proxy.ts`) + páginas `/admin`, `/login`, `/maintenance`. It does NOT cover secrets/env config ni API business.

## Orden

1. **Sesión dual**: `setToken()` escribe `localStorage miteve_token` + cookie `miteve_token` (misma key, `SameSite=Strict`, `max-age` desde `exp` JWT) para que el Edge la lea. `getToken()` con guard SSR. `clearToken()` borra ambos. Nunca solo uno.
2. **Decode Edge-safe**: `atob` (no `Buffer`) en `proxy.ts:getJWTAuthorities` y `auth.ts:decodePayload`; authorities desde `authorities ?? roles`, array u string separado por espacios.
3. **Guards proxy**: `/admin` exige `read-admin-page` o redirect `/404`; `/downloads` y `/player/*?offline=true` bypass; resto health-check `HEAD ${API_HOST_IP}/utils/health` → `/maintenance` (API caída) o `/downloads` (sin internet, probado contra `google.com/generate_204`).
4. **UI**: `src/features/login/page.tsx` (+ register, `profile/switch`), `AdultProfileContext.tsx`, `getMainProfile/setMainProfile` (`miteve_main_profile`), `hasAuthority(token, "read-admin-page")` para ocultar links admin en sidebar.

## Naming

- Keys: `miteve_token`, `miteve_main_profile`. Autoridad: `read-admin-page`. `actionName`: `"Auth.login"`, `"Proxy.adminGuard"`.

## Ejemplos miteve-web

- ✅ Login OK → `setToken(jwt)` → cookie visible en Edge → `/admin` pasa; logout → `clearToken()` + `clearMainProfile()`.
- ❌ Guardar JWT solo en cookie httpOnly manual (rompe `getToken` cliente) o solo localStorage (rompe guard Edge `/admin`).
- ❌ `Buffer.from(payload, "base64")` en `proxy.ts` (Edge Runtime lo rompe).

## Verificación

- Sin token → `/admin` → `/404`; token sin autoridad → `/404`; API down → `/maintenance`; airplane → `/downloads`. `npm run build` limpio.

## Out of scope

- Do NOT definir env/secretos aquí. See `conn-secrets`.
- Do NOT definir API bodies aquí. See `next-routes-scope`.
- Do NOT definir copy ES aquí. See `i18n-next`.
- Do NOT definir QA browser aquí. See `apply-qa`.
