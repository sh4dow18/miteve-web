---
name: issue-flow
description: Use when working an issue end-to-end in miteve-web from creation through branch, commits, PR, QA, and merge.
license: MIT
compatibility: opencode
---

# Issue Flow — end-to-end issue lifecycle only

This skill covers ONLY orchestrating the full lifecycle in order. It does NOT replace the atomic skills it chains.

Trigger phrases: "trabaja el issue #X", "lleva este issue de punta a punta", "haz el flujo completo del issue".

## Orden (nunca saltar, nunca reordenar)

1. **Issue**: generar markdown con `issue-bug` / `issue-feature` / `issue-task` (Objetivo: `Player, Downloads/PWA, Home/Catálogo, Auth/Admin, API/Upload, SEO/A11y, UI-System, General`). Crearlo en GitHub, tomar el `#` real. Nunca inventar números.
2. **Branch**: desde `develop` actualizado (`git checkout develop && git pull`), crear `Tipo/<issue>-descripcion-corta` per `git-flow` (`Feature|Fix|Refactor|Docs`, scope obligatorio en commits).
3. **Implement**: per `next-architecture` (FSD + barrels + ROUTES_LIST + proxy) + `ts-format-next` + `i18n-next` (strings ES, `lang="es"`) + `tailwind-theming` (tokens, sin hex) + `pwa-player` si toca offline/player + `auth-client` si toca sesión/guards. Secretos per `conn-secrets`.
4. **Commits**: `#<issue> tipo(scope): desc` en inglés lowercase per `git-flow`. Branch `#` == commit `#` == issue `#`. Hook `.husky/commit-msg` + commitlint bloquean violación.
5. **PR**: push, abrir PR título exactamente = branch name, target `develop`, body per `pr-description`. Nunca asignar Reviewers/Assignees/Labels a mano.
6. **QA**: correr `apply-qa` en la rama (Playwright visible, build limpio, player/offline + admin spot-check, SEO/a11y). Reportar solo en formato proyecto. `REQUEST_CHANGES` si hay hallazgos. Nunca aprobar sin autorización explícita.
7. **Merge**: tras approval + CI verde, squash and merge, borrar rama, sync `develop` local. Versión per `version-tag` si aplica release.

## Reglas

- Nunca commit directo a `develop`/`main`.
- Branch `#` == commit `#` == issue `#`, siempre.
- Verificar `git config --get core.hooksPath` → `.husky` antes de empezar.
- CI (build) verde antes de pedir review. `npm run build` gate.

## Verificación

- Issue existe con `#` real; rama/commits/PR enlazados; QA reportado; merge solo con aprobación.

## Out of scope

- Do NOT definir branch/commit naming aquí. See `git-flow`.
- Do NOT definir issue markdown aquí. See `issue-bug`, `issue-feature`, `issue-task`.
- Do NOT definir PR body aquí. See `pr-description`.
- Do NOT definir QA detail aquí. See `apply-qa`.
- Do NOT definir versioning aquí. See `version-tag`.
