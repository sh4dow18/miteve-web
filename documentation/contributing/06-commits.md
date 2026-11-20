# Convenciones de Commits

> Formato, tipos y buenas prácticas para mensajes de commit en MiTeVe-Web.

---

## Formato del mensaje

```text
#<issue> <tipo>: <descripción>
```

### Ejemplos

```text
#123 feat: add player offline support
#456 fix: resolve search empty state
#789 refactor: split content-row widget
#101 docs: update contributing guide
```

---

## Tipos de commit

| Tipo | Propósito | Ejemplo |
| ---- | --------- | ------- |
| `feat` | Nueva funcionalidad | `#123 feat: add downloads offline page` |
| `fix` | Corrección de bug | `#456 fix: resolve admin guard redirect` |
| `refactor` | Refactorización sin cambio de comportamiento | `#789 refactor: split content-row widget` |
| `docs` | Cambios en documentación | `#101 docs: update contributing guide` |
| `style` | Cambios de formato (no afecta código) | `#102 style: apply prettier formatting` |
| `test` | Agregar o modificar tests | `#103 test: add vitest for search filter` |
| `chore` | Tareas de mantenimiento | `#104 chore: update next to 16.2` |

---

## Reglas

### 1. Siempre incluir el número de issue

Mal: `feat: add player`. Bien: `#123 feat: add player offline support`.

### 2. Un commit = un cambio lógico

Mal: `#123 feat: add downloads and fix upload bug`.
Bien: `#123 feat: ...` + `#124 fix: ...` por separado.

### 3. Mensaje descriptivo

Mal: `#456 fix: change code`. Bien: `#456 fix: resolve search empty state`.

### 4. En inglés

Los mensajes van en inglés para consistencia.

### 5. Sin punto final

Mal: `#123 feat: add player.` Bien: `#123 feat: add player offline support`.

### 6. Minúsculas después del tipo (recomendado)

```text
#123 feat: add player offline support
```

---

## Validación automática

| Dónde | Archivo | Cuándo | Qué valida |
| ----- | ------- | ------ | ---------- |
| Local | `.husky/commit-msg` (`commitlint`) | Al hacer `git commit` | Formato `^#[0-9]+ (feat\|fix\|...)` |
| Remoto | `.github/workflows/commitlint.yml` | Al abrir/actualizar PR | Formato + correlación rama↔commit + `Docs/*` solo `docs:` + título PR == rama |

Si la rama o el mensaje no cumplen, el commit o el PR se bloquea. En `Fix/123-tarea` solo
`#123 ...`. En `Docs/123-...` solo `docs: ...`.

### Husky — Hook local

Husky corre `commitlint --edit` con `@commitlint/config-conventional` extendido:

```bash
npm run lint
npm run build
npx vitest run
```

Verificación con:

```bash
git config --get core.hooksPath  # debe mostrar .husky
```

Si ves `Commit rechazado`:

```bash
# Mal: sin #
git commit -m "fix bug"

# Mal: otro issue en la rama
git commit -m "#83 fix: tarea"   # en Fix/123-tarea → esperado #123

# Mal: Docs/* con otro tipo
git commit -m "#123 feat: docs"  # en Docs/123-... solo docs:

# Bien
git commit -m "#123 fix: correct bug description"
git commit -m "#123 docs: update guide"
```

Ver también [Configuración de GitHub](19-github-config.md).

---

## Ejemplos reales del proyecto

```text
#12 feat: add home hero section
#45 fix: resolve player buffer loading
#67 refactor: apply search filter pattern
#88 docs: update faq and contributing
```

---

## Qué NO commitear

| Archivo / Carpeta | Razón |
| ----------------- | ----- |
| `.env*.local` | Keys (`TMDB_API_KEY`, `SECURITY_PASSWORD`) |
| `.next/` | Build de Next.js |
| `node_modules/` | Dependencias npm |
| `out/` | Export estático |
| `*.log` | Logs locales |
| `.vercel/` | Estado de Vercel CLI |

---

## Verificar antes de commitear

- [ ] `npm run lint` pasa sin errores
- [ ] `npm run build` compila
- [ ] `npx vitest run` pasa (o no hay tests)
- [ ] El mensaje sigue `#<issue> <tipo>: <desc>` en inglés
- [ ] El `#` coincide con la rama
- [ ] No incluye archivos sensibles
- [ ] Rutas nuevas registradas en `src/shared/config/routes.ts`
