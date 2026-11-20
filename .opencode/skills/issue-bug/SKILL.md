---
name: issue-bug
description: Use when asked to generate a GitHub issue for a bug in miteve-web to output copyable Spanish markdown with only the project fields.
license: MIT
compatibility: opencode
---

# Issue Bug — markdown copiable, nivel proceso

This skill covers ONLY issue text generation for bugs. It does NOT change code, create branches, or file the issue. Sin templates `.github/` aún: este formato ES el estándar a usar.

## Orden

- Input: solo el título. Inferir contenido razonable + contexto repo; nunca inventar scope ajeno.
- Output: SOLO bloque markdown copiable, sin intro/outro, con EXACTAMENTE estos campos en orden:
  `## Descripción`, `## Pasos para reproducir`, `## Comportamiento esperado`, `## Comportamiento actual`, `## Objetivo`, `## Reportado por`, `## Capturas`.
- `Pasos para reproducir`: lista numerada empezando `1. Ir a '...'`.
- `Objetivo`: checkboxes `Player, Downloads/PWA, Home/Catálogo, Auth/Admin, API/Upload, SEO/A11y, UI-System, General`; marcar solo lo implicado, default `General` si dudoso.
- `Reportado por`: dejar sin marcar salvo indicación.
- `Capturas`: `_Agregar evidencia_` si no hay.
- Todo en español, nivel proceso (qué ve el usuario), sin method names, sin SQL, sin listas de archivos, sin secretos/IPs.

## Ejemplo formato

```md
## Descripción
El reproductor no reanuda en iOS tras bloquear pantalla.

## Pasos para reproducir
1. Ir a '/player/abc'
2. Reproducir y bloquear pantalla
3. Desbloquear

## Comportamiento esperado
- [ ] La reproducción continúa o muestra retomar

## Comportamiento actual
Se congela en negro sin controles.

## Objetivo
- [x] Player
- [ ] Downloads/PWA
- [ ] Home/Catálogo
- [ ] Auth/Admin
- [ ] API/Upload
- [ ] SEO/A11y
- [ ] UI-System
- [ ] General

## Reportado por
_Por definir_

## Capturas
_Agregar evidencia_
```

## Verificación

- 7 secciones exactas, español, sin código/secrets.

## Out of scope

- Do NOT commit/push ni llamar GitHub API. Solo markdown.
- Do NOT definir flujo end-to-end aquí. See `issue-flow`.
- Do NOT definir rama/commit aquí. See `git-flow`.
