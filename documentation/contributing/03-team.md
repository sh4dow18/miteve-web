# Equipo de Desarrollo

> Colaboradores, roles y responsabilidades en MiTeVe-Web.

---

## Estructura del equipo

**MiTeVe Team** es el dueño de `miteve-web` y responsable de su desarrollo, despliegue en
Vercel y publicación como TWA / Android.

| Equipo | Rol |
| ------ | --- |
| **MiTeVe Team** | Dueño del repo. Desarrollo, QA, releases y deploys |
| **QA** | Pruebas en preview de Vercel antes de `main` |
| **Usuario** | Reporta bugs y sugiere contenido (issues con `Bug` / `Solicitud`) |

---

## Colaboradores activos

| Usuario GitHub | Rol |
| -------------- | --- |
| `@sh4dow18` | Administrador del repositorio, desarrollo full stack (Next.js + API) |

> El workflow `auto-assign.yml` asigna reviewers a todo `team = ['sh4dow18']`
> excepto al autor, y pone al autor como assignee.

---

## Áreas de responsabilidad

Todos trabajan en todas las capas FSD (`app → features → widgets → entities → shared`).

### Excepción: cambios de esquema de BD

Cualquier cambio de esquema (tablas, columnas, constraints) **no se hace en este repo**.
Vive en `miteve-api`. Ver `14-database-migrations.md` (stub) y skill `db-migrations` en api.

En `miteve-web` solo se tocan:

- Contratos de API (`src/shared/api/*`, `src/app/api/*`)
- IndexedDB offline (`src/shared/lib/offline-db.ts`) — versión `DB_VERSION` con migración local

---

## Metodología de trabajo

Se usa **Kanban** en GitHub Projects (sin SCRUM).

1. Las tareas las crea MiTeVe Team, QA o usuarios (issues).
2. Se trabajan por prioridad.
3. Sin dailies ni ceremonias.

---

## Canales de comunicación

| Canal | Uso |
| ----- | --- |
| GitHub Issues | Bugs, features, tareas (plantillas en `.github/ISSUE_TEMPLATE/`) |
| GitHub Pull Requests | Revisión y aprobación de código |
| GitHub Projects | Seguimiento Kanban |

---

## Proceso de onboarding

Para nuevos miembros:

1. **Acceso**: solicitar acceso a `sh4dow18`.
2. **Herramientas**: instalar lo de [Requisitos](01-requirements.md).
3. **Clonar y ejecutar**: seguir [Primeros Pasos](02-getting-started.md).
4. **Conocer el flujo**: leer [Flujo de Trabajo](04-workflow.md) y [Estrategia de Ramas](05-branching.md).
5. **Estilo**: familiarizarse con [Estilo de Código](08-code-style.md) y skills `ts-format-next`, `next-architecture`.
6. **Primer task**: empezar con una tarea pequeña asignada por MiTeVe Team.
