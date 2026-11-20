---
name: issue-task
description: Use when asked to generate a GitHub issue for a general task in miteve-web to output copyable Spanish markdown with only the project fields.
license: MIT
compatibility: opencode
---

# Issue Task — markdown copiable, nivel proceso

This skill covers ONLY issue text generation for tasks. It does NOT change code, create branches, or file the issue. Sin templates `.github/` aún: este formato ES el estándar a usar.

## Orden

- Input: solo el título. Inferir contenido razonable + contexto repo; nunca inventar scope ajeno.
- Output: SOLO bloque markdown copiable, sin intro/outro, con EXACTAMENTE estos campos en orden:
  `## Descripción`, `## Tareas`, `## Objetivo`, `## Reportado por`.
- `Descripción`: UN solo párrafo, sin saltos ni listas.
- `Tareas`: checklist `- [ ] ...` derivado del título.
- `Objetivo`: checkboxes `Player, Downloads/PWA, Home/Catálogo, Auth/Admin, API/Upload, SEO/A11y, UI-System, General`; marcar solo lo implicado.
- Todo español, proceso, sin código/SQL/archivos/secrets.

## Ejemplo formato

```md
## Descripción
Migrar los strings duplicados del home a un módulo central ES para preparar next-intl.

## Tareas
- [ ] Inventariar strings en home/widgets
- [ ] Centralizar en módulo ES con keys Seccion_Elemento
- [ ] Verificar build sin regresión visual

## Objetivo
- [ ] Player
- [ ] Downloads/PWA
- [x] Home/Catálogo
- [ ] Auth/Admin
- [ ] API/Upload
- [ ] SEO/A11y
- [x] UI-System
- [ ] General

## Reportado por
_Por definir_
```

## Verificación

- 4 secciones exactas, descripción un párrafo, español.

## Out of scope

- Do NOT commit/push ni llamar GitHub API. Solo markdown.
- Do NOT definir flujo end-to-end aquí. See `issue-flow`.
- Do NOT definir rama/commit aquí. See `git-flow`.
