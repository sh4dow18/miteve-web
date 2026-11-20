---
name: git-flow
description: Use when creating branches, commits, or PRs in miteve-web for branch naming, conventional commits with scope, and PR targets.
license: MIT
compatibility: opencode
---

# Git Flow — git conventions only

This skill covers ONLY branch/commit/PR naming. It does NOT cover version bumping or code style.

## Orden

1. Branch desde `develop` actualizado: `Tipo/<issue>-short-description`, tipos `Feature|Fix|Refactor|Docs` capitalizados. Descripción en inglés, lowercase, `-` separado (ej `Feature/123-player-offline-mode`). Exentos: `main`, `develop`, `release/*`, `hotfix/*`.
2. Commit conventional + issue: `#<issue> <tipo>(<scope>): <desc>` en inglés lowercase. Tipos `feat|fix|refactor|docs|style|test|chore`. **Scope obligatorio** (endurece el `feat/fix` vago): ej `#123 feat(player): add offline fallback`, `#45 fix(auth): refresh admin cookie max-age`. Branch `#` == commit `#`. Ramas `Docs/*` solo aceptan `docs:`.
3. PR: título exactamente = branch name; target `develop`; body según `pr-description`. Hooks: verificar `git config --get core.hooksPath` → `.husky` (commitlint conventional + `commit-msg` bloquea violación).
4. Merges: `develop` 1 approval, `main`/`release/*` 2 approvals. Squash and merge, borrar rama, sync `develop` local.
5. Nunca commitear `.next/`, `node_modules/`, `storybook-static/`, `.env*` reales.

## Naming

- Scope = área FSD: `player|auth|downloads|home|admin|api|i18n|pwa|routes|theming|qa`. Ej: `#78 feat(downloads): add bulk modal`, `#90 fix(routes): guard offline player`.

## Verificación

- `git log --oneline -5` muestra `#<issue> tipo(scope): desc`; `git status` limpio de artefactos; hooks activos.

## Out of scope

- Do NOT bump versions here. See `version-tag`.
- Do NOT definir QA aquí. See `apply-qa`.
- Do NOT definir PR body aquí. See `pr-description`.
