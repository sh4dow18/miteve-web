# Requisitos

> Herramientas, versiones y configuraciones necesarias para trabajar en MiTeVe-Web.

---

## Herramientas obligatorias

| Herramienta | Versión mínima | Propósito |
| ----------- | -------------- | --------- |
| Node.js     | LTS (22.x)     | Ejecutar Next.js 16 + React 19 (CI usa `lts/*`) |
| npm         | 10.x           | Instalar dependencias (`npm ci`), scripts (`dev`, `build`, `lint`) |
| Git         | Última versión | Control de versiones |

Verificar:

```bash
node --version
npm --version
git --version
```

---

## Herramientas recomendadas

| Herramienta    | Propósito |
| -------------- | --------- |
| **VS Code**    | IDE principal (con extensiones ESLint + Tailwind CSS) |
| **Vercel CLI** | Previsualizar deploys (`npx vercel --prod` solo release) |
| **Postman**    | Probar `miteve-api` (`/utils/health`) y rutas `src/app/api/*` |
| **Figma**      | Mockups de Player, Home, Search (enlazar en issues) |
| **OpenCode**   | Agente de IA para desarrollo (recomendado) |

---

## Alternativas aceptables

| Herramienta      | Uso |
| ---------------- | --- |
| GitHub Desktop   | Alternativa gratuita a GitKraken para Git gráfico |
| pnpm / yarn      | Solo local; CI usa siempre `npm ci` |
| GitHub Copilot   | Alternativa a OpenCode como agente de IA |

---

## Permisos en el repositorio

MiTeVe-Web usa repositorio personal de `sh4dow18` con colaboradores.

| Rol             | Permisos |
| --------------- | -------- |
| **Colaborador** | Clonar, push en ramas de trabajo, crear PRs, issues |
| **Administrador** (`sh4dow18`) | Todo lo anterior + settings, branch protection, releases |

---

## Acceso a servicios

MiTeVe-Web no usa SQL Server local. Todo es vía variables de entorno + APIs externas.

| Servicio | Dónde se configura | Descripción |
| -------- | ------------------ | ----------- |
| `miteve-api` | `NEXT_PUBLIC_API_HOST_IP` en `.env.local` | Backend de contenido, auth, admin |
| TMDB | `TMDB_API_KEY` en `.env.local` | Catálogo y búsqueda (`src/features/browse-detail`, `src/features/search`) |
| Vercel | Dashboard de Vercel | Deploy de `develop` (preview) y `main` (producción) |

> **Nota**: Nunca commitear `.env*.local` con keys reales. Ver skill `conn-secrets`.
> Si `NEXT_PUBLIC_API_HOST_IP` falla, verificar que `miteve-api` esté arriba (`/utils/health`).

---

## Configuración de Git

```bash
git --version
git config user.name "Tu Nombre"
git config user.email "tu.email@ejemplo.com"
```

---

## Verificación de entorno

Antes de empezar a desarrollar, verifica que:

- [ ] Node LTS instalado (`node --version`)
- [ ] `npm ci` corre sin errores
- [ ] `npm run dev` levanta `http://localhost:3000`
- [ ] `npm run lint` y `npm run build` pasan
- [ ] Tienes `.env.local` con `NEXT_PUBLIC_API_HOST_IP` y `TMDB_API_KEY`
- [ ] Tienes acceso al repositorio en GitHub
- [ ] Git está configurado con tu identidad
