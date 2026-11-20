# Flujo de Trabajo

> Ciclo completo de desarrollo en MiTeVe-Web.

---

## Diagrama del flujo de desarrollo

```text
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│ Issue  │───▶│ Branch │───▶│  Code  │───▶│ Commit │───▶│  Push  │───▶│   PR   │───▶│ Review │───▶│ develop│
│(tarea) │    │(crear) │    │(desarr)│    │(guardar)│   │(subir) │    │(crear) │    │(revisar)│   │(actual)│
└────────┘    └────────┘    └────────┘    └────────┘    └────────┘    └────────┘    └────────┘    └────────┘
```

---

## Diagrama del flujo de release

```text
                          develop
                             │
                             │ (cada 2-3 semanas)
                             ▼
                         PR a main
                             │
                             ▼
                    ┌───────────────────┐
                    │  QA en preview    │
                    │  Vercel           │
                    └────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        ┌───────────┐                ┌────────────┐
        │ Aprobado  │                │ No aprobado│
        └─────┬─────┘                └─────┬──────┘
              │                             │
              ▼                             │
     ┌─────────────────┐                    │
     │  release/X.Y.Z  │                    │
     └────────┬────────┘                    │
              │                             │
              ▼                             │
        ┌───────────┐                        │
        │  Release  │                        │
        └───────────┘                        │
                                             │
               ┌─────────────────────────────┘
               │
               ▼
      Volver a develop para corregir
      y repetir el ciclo
```

---

## Flujo de hotfix

```text
Si hay error en producción:
        │
        ├─── Release NO es el último ──▶ Crear rama desde release/X.Y.Z
        │
        └─── Release ES el último ─────▶ Crear rama desde main
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │ hotfix/X.Y.(Z+1)│
                                     └────────┬────────┘
                                              │
                                              ▼
                                     ┌──────────────┐
                                     │ QA aprueba   │
                                     └──────┬───────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │ release/X.Y.(Z+1)│
                                   └─────────────────┘
```

**Ejemplo**: si el release actual es `1.0.0`, el hotfix crea `1.0.1`.

---

## Pasos detallados

### 1. Issue

Todo trabajo comienza con un issue en **GitHub Projects**.

- **Bugs**: documentar con pasos para reproducir (plantilla `bug_report.yml`)
- **Features**: historia `Como / Quiero / Para` (plantilla `feature_request.yml`)
- **Tareas**: checklist general (plantilla `task.yml`)

### 2. Branch

Crear una rama desde `develop` con el naming correcto.

```bash
git checkout develop
git pull origin develop
git checkout -b Feature/123-player-offline
```

Ver [Estrategia de Ramas](05-branching.md).

### 3. Code

Desarrollar en FSD (`src/app`, `src/features/*`, `src/widgets/*`, `src/shared/*`).

- Seguir skills `ts-format-next` + `next-architecture`
- No importar hacia arriba (`entities` nunca importa de `features`)
- Registrar rutas nuevas en `src/shared/config/routes.ts` (`ROUTES_LIST`)
- Probar con `npm run dev` antes de commitear

### 4. Commit

```bash
git add .
git commit -m "#123 feat: add player offline support"
```

Ver [Convenciones de Commits](06-commits.md).

### 5. Push

```bash
git push origin Feature/123-player-offline
```

### 6. Pull Request

Crear un PR contra `develop` desde GitHub.

- **Título**: nombre exacto de la rama (ej: `Feature/123-player-offline`)
- **Descripción**: completar `.github/pull_request_template.md`
  (Historia de Usuario, Descripción, Cambios realizados, Cómo probar,
  Criterios de Aceptación, Capturas si aplica)

Ver [Pull Requests](07-pull-requests.md).

### 7. Review

- Checks: CI (`lint` + `build` + `vitest`), Commitlint, Branch Lint
  (ver [Configuración de GitHub](19-github-config.md)).
- Al abrir el PR (incluso draft), `auto-assign.yml` pone `reviewers`/`assignee`/`labels`
  automáticamente. No rellenar a mano.

### 8. Merge

Después de la aprobación, merge a `develop`.

- Usar **Squash and Merge**
- Eliminar la rama después del merge
- Vercel genera preview por PR automáticamente

---

## Ramas principales

| Rama | Propósito |
| ---- | --------- |
| `main` | Última versión estable aprobada por QA (deploy Vercel producción) |
| `develop` | Rama base para desarrollo activo (deploy Vercel preview) |
| `Feature/*` | Nuevas funcionalidades (ej: `Feature/123-home-hero`) |
| `Fix/*` | Corrección de bugs (ej: `Fix/45-player-buffer`) |
| `Refactor/*` | Refactorización (ej: `Refactor/67-search-filter`) |
| `Docs/*` | Solo documentación |
| `release/*` | Rama de release (`release/1.2.0`), trazabilidad e histórico |
| `hotfix/*` | Corrección urgente en producción |

---

## Proceso de release

QA prueba en el **preview de Vercel** del PR `develop` → `main`.

### Ciclo normal

1. Cada **2 a 3 semanas** se crea PR de `develop` → `main`.
2. QA revisa el preview de Vercel.
3. **Si QA aprueba**: se crea rama `release/X.Y.Z` desde `main` y se genera el release.
4. **Si QA no aprueba**: comentarios → arreglos en `develop` → nuevo PR → repetir.

### Release sin QA (Alpha)

Si por calendario o urgencia se sube sin QA:

- Versión `X.Y.Z Alpha`, rama `release/X.Y.Z-Alpha`.

### Hotfix en producción

1. Verificar si el release con problemas es el último.
   - No es el último: rama desde `release/X.Y.Z` afectado.
   - Es el último: rama desde `main`.
2. Crear `hotfix/X.Y.(Z+1)`.
3. QA aprueba en preview.
4. Crear `release/X.Y.(Z+1)`.

---

## Convención de commits

```text
#<issue> <tipo>: <descripción>
```

```bash
#123 feat: add player offline support
#456 fix: resolve search empty state
#789 refactor: split content-row widget
#101 docs: update contributing guide
```

Ver [Convenciones de Commits](06-commits.md).

---

## Flujo rápido (resumen)

```bash
# 1. Actualizar develop
git checkout develop && git pull

# 2. Crear rama
git checkout -b Feature/123-player-offline

# 3. Desarrollar y commitear
npm run dev
git add . && git commit -m "#123 feat: add player offline support"

# 4. Verificar antes del push
npm run lint && npm run build && npx vitest run

# 5. Push
git push origin Feature/123-player-offline

# 6. Crear PR en GitHub contra develop

# 7. Después del merge, eliminar rama
git branch -d Feature/123-player-offline
```
