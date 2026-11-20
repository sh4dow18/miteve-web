# Pull Requests

> Cómo crear, revisar y mergear Pull Requests en MiTeVe-Web.

---

## Crear un PR

Siempre desde la interfaz de GitHub, no por CLI.

1. Push de tu rama.
2. GitHub → `Pull requests` → `New pull request`.
3. Base `develop`, comparar tu rama.
4. Título = nombre exacto de la rama.
5. Completar la plantilla y `Create pull request`.

---

## Título del PR

Debe ser **el nombre exacto de la rama**:

```text
Feature/123-player-offline
Fix/45-player-buffer
```

> **Excepción checkpoint**: `develop` → `main` y `main` → `release/*` no siguen esta
> regla (son sincronizaciones). Ver [Configuración de GitHub](19-github-config.md).

---

## Descripción del PR

Ya viene pre-llenada por `.github/pull_request_template.md`. No la borres.

```markdown
# Pull Request

## Historia de Usuario

**Como** <!-- Rol (ej: usuario registrado, administrador) -->
**Quiero** <!-- Funcionalidad -->
**Para** <!-- Beneficio -->

## Descripción

<!-- Detalle de cambios -->

## Cambios realizados

- <!-- Cambio 1 -->
- <!-- Cambio 2 -->

## Cómo probar

1. <!-- Paso 1 -->
2. <!-- Paso 2 -->
3. <!-- Paso 3 -->

## Criterios de Aceptación

- [ ] <!-- Criterio 1 -->
- [ ] <!-- Criterio 2 -->

## Capturas (si aplica)

<!-- Screenshots -->
```

| Sección | Obligatoria |
| ------- | ----------- |
| Historia de Usuario (`Como / Quiero / Para`) | Sí |
| Descripción | Sí |
| Cambios realizados (`- `) | Sí |
| Cómo probar (`1. 2. 3.`) | Sí |
| Criterios de Aceptación (`- [ ]`) | Sí |
| Capturas | Si aplica |

### Ejemplo

```markdown
# Pull Request

## Historia de Usuario

**Como** usuario registrado
**Quiero** descargar un capítulo
**Para** verlo sin conexión

## Descripción

Se agregó descarga offline en `/downloads` con IndexedDB (`src/shared/lib/offline-db.ts`)
y player en modo `?offline=true`.

## Cambios realizados

- Guardar stream en IndexedDB desde `src/features/downloads`
- Player offline en `src/widgets/player`
- Guard `/downloads` en `src/proxy.ts`

## Cómo probar

1. Ir a `/downloads`
2. Descargar un capítulo
3. Apagar internet y reproducir con `?offline=true`

## Criterios de Aceptación

- [ ] Descarga y reproduce sin internet
- [ ] No pide health a `miteve-api` en offline
- [ ] `npm run lint` y `npm run build` pasan

## Capturas (si aplica)

Screenshot de `/downloads` con contenido offline.
```

---

## Proceso de review

### 1. Checks automáticos

| Check | Workflow | Qué hace |
| ----- | -------- | -------- |
| CI | `ci.yml` | `npm ci` + `npm run lint` + `npm run build` + `npx vitest run` (no falla si no hay tests) |
| Commitlint | `commitlint.yml` | Valida `#<issue> <tipo>:` y título == rama (excepto checkpoints) |
| Branch Lint | `branch-lint.yml` | Valida `Tipo/123-desc` |
| Auto Assign | `auto-assign.yml` | Asigna `sh4dow18` como reviewer (si no es autor), assignee = autor, copia labels del issue |

El PR no se mergea si algún check falla.

### 2. Revisión de código

- `develop` necesita **1 aprobación**, `main` / `release/*` necesitan **2**.
- Verificar FSD (`app → features → widgets → entities → shared`), barrels, `ROUTES_LIST`, `proxy.ts`.

### 3. Feedback

```bash
git add .
git commit -m "#123 fix: address review feedback"
git push origin Feature/123-player-offline
```

### 4. Aprobación

Tras resolver feedback, el reviewer aprueba.

---

## Observaciones del PR

Formato estándar obligatorio (un solo comentario general, no solo inline):

```markdown
# Observaciones (DD de Mes del YYYY HH:MMam/pm)
Durante la revisión de los cambios realizados en esta Pull Request se identificaron los siguientes puntos que se deben atender.

## [Ubicación / Ruta / Funcionalidad]

### [Categoría: Experiencia de Usuario (UX) / Diseño / Arquitectura / Funcionalidad / Reglas de Negocio / SEO / Accesibilidad / Código]

- [Descripción: qué se encontró, qué problema genera y qué se espera.]

## [Otra Ubicación / Ruta]

### [Categoría]

- [Descripción.]
```

Categorías comunes en web: UX, Diseño (Tailwind/shadcn), Arquitectura (FSD, `proxy.ts`, `ROUTES_LIST`),
Funcionalidad, SEO (`metadata` en `routes.ts`), Accesibilidad, Código.

Reglas:

1. Una observación por bullet.
2. Siempre 3 elementos: encontrado, problema, esperado.
3. Ser específico (ruta, paso, captura, criterio que falla).
4. Sin vaguedades (`no funciona`, `revisar esto`).
5. Sin observaciones → aprobar directo. Con observaciones → no aprobar hasta re-validar.

---

## Mergear un PR

### Método: Squash and Merge

1. Verificar aprobaciones (1 en `develop`, 2 en `main`/`release/*`).
2. `Squash and merge` → confirmar mensaje → eliminar rama.

```bash
git checkout develop
git pull origin develop
git branch -d Feature/123-player-offline
```

---

## Tamaño del PR

| Tamaño | Líneas | Ejemplo |
| ------ | ------ | ------- |
| Pequeño | 1-100 | Fix de player |
| Mediano | 100-500 | Feature de search |
| Grande | 500+ | Refactor FSD |

Mantener PRs pequeños. Si es grande, dividirlo.

---

## Errores comunes

| Error | Solución |
| ----- | -------- |
| PR contra rama incorrecta | Cerrar y reabrir contra `develop` |
| Commits sucios | Squash and Merge |
| PR sin issue | Crear issue primero |
| Conflictos | Resolver antes del merge |
| Preview Vercel roto | Revisar `npm run build` local y `.env.local` |
