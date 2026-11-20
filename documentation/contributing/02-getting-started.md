# Primeros Pasos

> Cómo clonar, configurar y ejecutar el proyecto MiTeVe-Web.

---

## Clonar el repositorio

```bash
git clone https://github.com/sh4dow18/miteve-web.git
cd miteve-web
```

Cambiar a la rama de desarrollo:

```bash
git checkout develop
```

---

## Instalar dependencias

```bash
npm ci
```

> CI usa siempre `npm ci` (no `npm install`) para builds reproducibles.

---

## Configurar variables de entorno

Crear `.env.local` en la raíz (no se commitea):

```bash
NEXT_PUBLIC_API_HOST_IP=http://localhost:8080
NEXT_PUBLIC_STREAM_HOST_IP=http://localhost:8081
TMDB_API_KEY=tu_tmdb_key
SECURITY_PASSWORD=tu_password_local
```

| Variable | Dónde se usa |
| -------- | ------------ |
| `NEXT_PUBLIC_API_HOST_IP` | `src/shared/config/env.ts` → `src/proxy.ts` (`/utils/health`), `src/shared/api/*`, `src/app/api/*` |
| `NEXT_PUBLIC_STREAM_HOST_IP` | Player y streaming (`src/features/player`, `src/widgets/player`) |
| `TMDB_API_KEY` | Solo servidor (`src/app/api/*`, `src/features/browse-detail`, `src/features/search`) |
| `SECURITY_PASSWORD` | Solo servidor, rutas API internas |

> Ver skill `conn-secrets` para rotar keys sin commitearlas.

---

## Ejecutar la aplicación

```bash
npm run dev
```

Abrir `http://localhost:3000`. El proxy (`src/proxy.ts`) redirige a `/maintenance` si
`miteve-api` responde error, o a `/downloads` si no hay internet.

Otros comandos:

| Comando | Para qué |
| ------- | -------- |
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción (igual que CI y Vercel) |
| `npm run start` | Servir build local (`npm run build` primero) |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npx vitest run` | Tests unitarios (si hay `*.test.*`) |

---

## Estructura FSD

```text
src/
├── app/                  # Next.js App Router (rutas, layout, api, proxy helpers)
│   ├── (main)/           # Grupo (home, movies, tv-shows, search, faq)
│   ├── api/              # Route handlers (TMDB proxy, health)
│   ├── player/           # src/app/player/[id]
│   ├── maintenance/      # Fallback cuando apiOk == false
│   ├── layout.tsx        # Layout raíz
│   └── manifest.ts       # PWA
├── proxy.ts              # Middleware: auth /admin, offline /downloads, health check
├── features/             # Casos de uso por dominio (home, search, player, downloads, admin, auth...)
│   ├── home/
│   ├── search/
│   ├── player/
│   ├── downloads/
│   ├── admin/
│   ├── login/ register/ account/
│   └── app-info/         # config/app-info.constants.ts (versión visible)
├── entities/             # Modelos de dominio (content/)
├── widgets/              # Composición (hero-section, content-row, player, sidebar...)
├── shared/               # Cross-cutting
│   ├── config/           # env.ts, routes.ts (ROUTES_LIST, ROUTES_MAP)
│   ├── api/              # Cliente axios hacia miteve-api
│   ├── lib/              # auth.ts, offline-db.ts (IndexedDB), utils.ts
│   └── ui/               # shadcn/ui + tailwind
└── proxy.ts              # Ver arriba
```

### Regla de dependencias FSD

```text
app → features → widgets → entities → shared
```

- `app/` puede importar de `features`, `widgets`, `entities`, `shared`.
- `features/` puede importar de `widgets`, `entities`, `shared`. Nunca de `app/`.
- `entities/` y `shared/` no importan hacia arriba.
- Barrels por carpeta (`index.ts`) para imports limpios.

Ver skill `next-architecture`.

---

## Wiring clave (leer antes de cambiar)

- Entrypoint: `src/app/layout.tsx` + `src/proxy.ts`. Rutas centrales en
  `src/shared/config/routes.ts` (`ROUTES_LIST`, `ROUTES_MAP`, `routeToHref`).
- Proxy (`src/proxy.ts`): guarda `/admin` con claim `read-admin-page` en cookie
  `miteve_token`; `/downloads` siempre accesible offline (PWA); `/player/[id]?offline=true`
  salta el health check; resto verifica `HEAD ${API_HOST_IP}/utils/health`.
- Sitemap y Home usan `inSitemap` / `inHome` de `ROUTES_LIST` (`src/app/sitemap.ts`).
- Offline: `src/shared/lib/offline-db.ts` (IndexedDB) + `src/features/downloads`.

---

## Verificar que funciona

1. `npm run dev` → abrir `http://localhost:3000`
2. Verificar que `/home` carga el hero y las filas de contenido
3. Probar `/search`, `/player/[id]`, `/downloads` (offline)
4. Verificar que no hay errores en consola del navegador
5. Probar login si `miteve-api` está arriba

---

## Problemas comunes al iniciar

| Problema | Solución |
| -------- | -------- |
| `npm ci` falla | Borrar `node_modules` + `package-lock.json` y reintentar; verificar Node LTS |
| `npm run build` falla | Leer error de TypeScript/ESLint; `npm run lint` primero |
| `/maintenance` siempre | `NEXT_PUBLIC_API_HOST_IP` mal o `miteve-api` caído (`/utils/health`) |
| Redirección a `/downloads` | Sin internet (proxy detecta con `google.com/generate_204`) |
| `/admin` → 404 | Falta claim `read-admin-page` en JWT (`miteve_token`) |
| Puerto en uso | `PORT=3001 npm run dev` |
