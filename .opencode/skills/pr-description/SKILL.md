---
name: pr-description
description: Use when asked for a pull request description in miteve-web to output copyable Spanish markdown per project template at process level.
license: MIT
compatibility: opencode
---

# PR Description — markdown per template, process level only

This skill covers ONLY PR text generation. It does NOT change code, run builds, or decide branch names.

## Orden

- Base: diff rama actual vs `develop` (`git status`, `git diff`, `git log --oneline -10`). Nunca inventar cambios.
- Output: SOLO bloque markdown copiable con:
  `# Pull Request`, `## Historia de Usuario (Como/Quiero/Para)`, `## Descripcion`, `## Cambios realizados`, `## Como probar`, `## Criterios de Aceptacion`, `## Capturas (si aplica)`.
- Nivel proceso, NO técnico: describir qué puede hacer ahora el visitante y cómo fluye (player offline, descargas, login, catálogo). Sin method names, sin SQL, sin listas de archivos salvo necesario para probar.
- Target `develop` salvo `develop->main` o `main->release/*` checkpoint. Título vive en `git-flow`; este skill solo escribe el body.
- Ramas `Docs/*`: body solo acepta cambios `docs:`.

## Ejemplo formato

```md
# Pull Request
## Historia de Usuario (Como/Quiero/Para)
**Como** usuario sin internet
**Quiero** ver mis descargas
**Para** seguir viendo offline

## Descripcion
La página /downloads ahora lista y reproduce contenido descargado sin conexión.

## Cambios realizados
- Lista offline con portada y progreso
- Reproducción offline en player
- Toast ES ante error de lectura

## Como probar
1. Descargar una película en 360p
2. Activar modo avión
3. Ir a /downloads y reproducir

## Criterios de Aceptacion
- [ ] Lista visible sin internet
- [ ] Play offline sin errores
- [ ] Build limpio

## Capturas (si aplica)
_Agregar evidencia_
```

## Verificación

- 7 secciones, español, refleja diff real contra `develop`, sin secrets.

## Out of scope

- Do NOT commit/push aquí. Solo markdown.
- Do NOT incluir secrets, connection strings o IPs.
- Do NOT definir branch naming aquí. See `git-flow`.
