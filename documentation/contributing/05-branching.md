# Estrategia de Ramas

> Naming convention y flujo de branching en MiTeVe-Web.

---

## Rama base

La rama principal de desarrollo es **`develop`**. `main` es estable (producción en Vercel).
Todas las ramas de trabajo nacen desde `develop` y se fusionan de vuelta a ella.

```text
develop ─────●─────●─────●─────●─────●─────●─────●──────
               \         /       \         /
                ●───────●         ●───────●
           Feature/123        Fix/456
```

---

## Naming convention

### Formato general

```text
Tipo/<issue>-descripcion-corta
```

### Tipos de ramas

| Tipo | Propósito | Ejemplo |
| ---- | --------- | ------- |
| `Feature/` | Nuevas funcionalidades | `Feature/12-home-hero` |
| `Fix/` | Corrección de bugs | `Fix/45-player-buffer` |
| `Refactor/` | Refactorización de código | `Refactor/67-search-filter` |
| `Docs/` | Solo documentación | `Docs/88-update-faq` |

> **Nota Docs**: en ramas `Docs/123-...` solo se permiten commits `#123 docs: ...`.

### Reglas de naming

1. **Siempre incluir el número de issue**: facilita el tracking.
2. **Descripción corta**: máximo 4-5 palabras.
3. **Separador**: guion `-` entre palabras.
4. **Sin caracteres especiales**: solo letras, números y guiones.
5. **Minúsculas**: la descripción va en minúsculas.

### Ejemplos reales del proyecto

```text
Feature/12-home-hero-section
Fix/45-player-buffer-loading
Refactor/67-search-filter-pattern
Docs/88-update-contributing-faq
Fix/53-admin-guard-redirect
Feature/61-downloads-offline-db
```

---

## Crear una rama

```bash
git checkout develop
git pull origin develop
git checkout -b Feature/123-player-offline
git branch
```

Debe mostrar `* Feature/123-player-offline`.

---

## Sincronizar con develop

```bash
git checkout develop
git pull origin develop
git checkout Feature/123-player-offline
git merge develop
```

O con rebase:

```bash
git checkout Feature/123-player-offline
git rebase develop
```

---

## Después del merge

```bash
git checkout develop
git pull origin develop
git branch -d Feature/123-player-offline
git push origin --delete Feature/123-player-offline
```

---

## Validación automática

Misma regex `^(Feature|Fix|Refactor|Docs)/[0-9]+-[a-z0-9-]+$`:

| Dónde | Archivo | Cuándo valida |
| ----- | ------- | ------------- |
| Local (recomendado) | Husky `commit-msg` / `pre-commit` | Al hacer `git commit` |
| Remoto (GitHub) | `.github/workflows/branch-lint.yml` | En cada `create`/`push`/`pull_request` |

```bash
^(Feature|Fix|Refactor|Docs)/[0-9]+-[a-z0-9-]+$
# Válido:   Feature/123-player-offline
# Inválido: feature/123-player (tipo minúscula), Feature/player (falta 123), Feature/#123-player (con #)
```

Exentas: `main`, `develop`, `release/*`, `hotfix/*`. Además el commit se bloquea si el
`#` del commit no coincide con el `#` de la rama. Ver [Commits](06-commits.md).

Renombrar sin perder commits:

```bash
git branch -m Vieja Nueva && git push -u origin Nueva && git push origin --delete Vieja
```

## Ramas protegidas

| Rama | Protección |
| ---- | ---------- |
| `develop` | Requiere PR + al menos 1 aprobación |
| `main` | Solo desde `develop`, requiere PR + 2 aprobaciones |
| `release/*` | Solo por hotfix, requiere PR + 2 aprobaciones |

---

## Errores comunes

| Error | Solución |
| ----- | -------- |
| Crear rama desde `main` | `git checkout -b Feature/123-desc develop` |
| Olvidar el número de issue | `git branch -m Feature/desc Feature/123-desc` |
| Conflicto con `develop` | Merge o rebase de `develop` primero |
| Push sin upstream | `git push -u origin Feature/123-desc` |
