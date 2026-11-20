---
name: version-tag
description: Use when bumping versions in miteve-web for syncing package version with shared config and GitHub release tags.
license: MIT
compatibility: opencode
---

# Version Tag — versioning only

This skill covers ONLY version numbers and tags. It does NOT cover git branch naming or build commands.

## Orden

1. Crear si no existe `src/shared/config/version.ts` exportando `UserVersion` (X.Y, display footer/app-info) y `TechVersion` (X.Y.Z).
2. Bump en sync: `UserVersion` (ej `1.2`) + `TechVersion` (ej `1.2.0`) en `version.ts` + `"version"` en `package.json` (debe igualar `TechVersion`).
3. Mantener display alineado: footer/app-info leen `UserVersion`, nunca string hardcodeado.
4. Tags/releases SOLO desde GitHub UI sobre `release/X.Y.Z`, nunca `git tag` local.
5. Verificar con `npm run build` tras el bump (ver `next-build-run`).

## Naming

- `UserVersion`: `"1.2"` (string). `TechVersion`: `"1.2.0"` (string = `package.json` version). Rama release: `release/X.Y.Z`.

## Ejemplo `version.ts`

```ts
export const UserVersion = "0.2";
export const TechVersion = "0.2.0";
```

## Verificación

- `package.json version === TechVersion`; footer muestra `UserVersion`; build limpio; tag creado solo en GitHub UI.

## Out of scope

- Do NOT decidir branch names aquí. See `git-flow`.
- Do NOT definir build aquí. See `next-build-run`.
