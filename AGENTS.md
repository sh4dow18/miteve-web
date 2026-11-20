# AGENTS.md — miteve-web

Next.js 16 + React 19 + TypeScript. FSD: src/app, features, widgets, entities, shared. Alias @ hacia src.

## Commands

- Install: npm ci. Dev: npm run dev. Build: npm run build. Start: npm run start. Lint: npm run lint.
- Tests: npx vitest run. Storybook: npm run storybook.

## Wiring

- Entrypoint src/app/layout.tsx. Proxy src/proxy.ts con JWT Edge y health-check a maintenance.
- ROUTES_LIST en src/shared/config/routes.ts. Env en src/shared/config/env.ts. Barbells index.ts por entidad.
- Player con shaka-player, offline con offline-db.ts IndexedDB, hooks usePlayer, useOfflineDownload, useTV, useFocusable.

## Conventions

- ts-format-next, next-architecture, tailwind-theming dark #141414, error-handling con sonner, a11y con variantes TV.
- Texto visible en español, lang es, preparar next-intl.

## Git guardrails

- Branch desde develop: Tipo/issue-descripcion, tipos Feature, Fix, Refactor, Docs.
- Commit: #issue tipo: desc en inglés minúsculas, tipos feat, fix, refactor, docs, style, test, chore.
- PR título igual a rama, base develop, plantilla completa. Merges: develop 1 aprobación, main y release 2.
