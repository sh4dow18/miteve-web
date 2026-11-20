---
name: issue-feature
description: Use when asked to generate a GitHub issue for a new feature in miteve-web to output copyable Spanish markdown with only the project fields.
license: MIT
compatibility: opencode
---

# Issue Feature — markdown copiable, nivel proceso

This skill covers ONLY issue text generation for features. It does NOT change code, create branches, or file the issue. Sin templates `.github/` aún: este formato ES el estándar a usar.

## Orden

- Input: solo el título. Inferir contenido razonable + contexto repo; nunca inventar scope ajeno.
- Output: SOLO bloque markdown copiable, sin intro/outro, con EXACTAMENTE estos campos en orden:
  `## Historia de Usuario`, `## Descripción`, `## Criterios de Aceptación`, `## Objetivo`, `## Reportado por`, `## Mockups`.
- `Historia de Usuario`: formato `**Como** [rol]`, `**Quiero** [funcionalidad]`, `**Para** [beneficio]`.
- `Criterios de Aceptación`: checklist `- [ ] ...` derivado del título.
- `Objetivo`: checkboxes `Player, Downloads/PWA, Home/Catálogo, Auth/Admin, API/Upload, SEO/A11y, UI-System, General`; marcar solo lo implicado.
- `Mockups`: `_N/A_` si no hay. Todo español, proceso, sin código/SQL/archivos/secrets.

## Ejemplo formato

```md
## Historia de Usuario
**Como** usuario móvil
**Quiero** descargar una temporada completa
**Para** verla sin conexión

## Descripción
Permitir descarga masiva desde el detalle con selector de calidad y progreso.

## Criterios de Aceptación
- [ ] Modal masivo visible desde detalle TV-show
- [ ] Progreso por episodio y cancelación
- [ ] Contenido disponible en /downloads offline

## Objetivo
- [ ] Player
- [x] Downloads/PWA
- [ ] Home/Catálogo
- [ ] Auth/Admin
- [ ] API/Upload
- [ ] SEO/A11y
- [ ] UI-System
- [ ] General

## Reportado por
_Por definir_

## Mockups
_N/A_
```

## Verificación

- 6 secciones exactas, historia Como/Quiero/Para, español.

## Out of scope

- Do NOT commit/push ni llamar GitHub API. Solo markdown.
- Do NOT definir flujo end-to-end aquí. See `issue-flow`.
- Do NOT definir rama/commit aquí. See `git-flow`.
