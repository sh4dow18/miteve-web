# Contributing a MiTeVe-Web

> Guía de referencia para el equipo de MiTeVe-Web, adaptada de dh-vimax.

## Qué es MiTeVe-Web

Frontend streaming en Next.js 16 + React 19 + FSD. Consume miteve-api (new-api) con JWT dual localStorage y cookie.

## Arquitectura

src/app con rutas, src/features con 21 features, src/widgets, src/entities/content, src/shared con api, config y lib. Proxy.ts con guards y health-check. ROUTES_LIST como fuente de verdad.

## Cómo contribuir

1. Lee documentation/contributing/01-requirements.md y 02-getting-started.md.
2. Flujo: issue en GitHub Projects, branch desde develop, code, commit, push, PR contra develop, review y squash merge. Ver 04-workflow.md.
3. Ramas Tipo/issue-descripcion, commits #issue tipo: desc, PR título igual a rama. Ver 05-branching.md, 06-commits.md, 07-pull-requests.md.
4. Estilo: skills ts-format-next, next-architecture, tailwind-theming. Docs: documentation/contributing.
