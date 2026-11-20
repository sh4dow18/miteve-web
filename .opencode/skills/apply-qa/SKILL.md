---
name: apply-qa
description: Use when doing strict exhaustive QA in miteve-web on the current active branch with visible Playwright browser tests, full CRUD plus player/PWA/admin flows, no code changes, and PR observations in project format with user-gated approve and merge.
license: MIT
compatibility: opencode
---

# Apply QA — Single Responsibility: probar la rama actual en navegador y reportar

This skill covers ONLY QA exhaustiva visible en navegador con Playwright sobre la rama actual activa para cualquier módulo web. It does NOT edit code, migrations, ports, or switch branches.

## Rules

- Este skill siempre aplica a la rama actual activa. Nunca pruebe otra rama a menos que el usuario lo especifique explícitamente con nombre de rama.
- Antes de cualquier prueba, identificar la PR asociada a la rama (`list_pull_requests` + `pull_request_read get`) y leer sus observaciones existentes (`get_comments` + `get_reviews` + `get_review_comments`). Si la PR ya tiene observaciones, el alcance de la pasada es SOLO el recheck de esas observaciones (más regresión mínima del flujo tocado); si no tiene observaciones, el alcance es todo lo del PR. En ambos casos, todo en una sola pasada exhaustiva: planificar la ruta completa al inicio (build → alcance PR → observaciones → credenciales → recorrido → limpieza → reporte), no pedir confirmaciones intermedias salvo bloqueo real (credenciales, riesgo irreversible no autorizado).
- Prohibido dar reportes intermedios: aunque encuentre errores durante la pasada, no los reporte ni los anuncie en el chat hasta el final; anótelos en silencio y continúe con el recorrido. Solo al cerrar la pasada única entregue el reporte completo.
- Para probar todo por UI use Playwright con `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill_form`, `browser_evaluate`, `browser_console_messages` y `browser_network_requests`. Navegador visible por defecto para que el usuario mire. Solo headless si lo pide explícito.
- Estabilidad de sesión larga: tras cada `browser_navigate` esperar render (2-4s) y re-capturar `browser_snapshot` antes de interactuar; los refs expiran tras cada re-render, nunca reutilizar refs viejos en `browser_click`/`browser_fill_form`. Si cae `browser/context closed`, recuperar navegando de nuevo a la URL del módulo, no abortar la pasada. Para inputs React usar `focus` + typing real + `Enter`; verificar estado deshabilitado con snapshot `[disabled]`. Para diálogos Radix, localizar por `[role="dialog"]` + texto inicial y cerrar por `button[aria-label="Close"]` o `Escape`.
- En la revisión exigir build sin errores nuevos: `npm ci`, `npm run build` 0 errores 0 warnings, `npm run lint` limpio. Sin esto no hay QA válida. Para servidores de larga vida (`npm run dev` / `npm run start`) usar `timeout` grande o el shell los mata a los 120s.
- Shell Windows (PowerShell): no existe `wc` (usar `Measure-Object`), no hay heredoc `<<` (escribir `.py` con la herramienta `write` y ejecutarlo con `python`, no `python3`).
- Identifique la PR conectada a la rama actual con `list_pull_requests` + `pull_request_read get/get_files`. Alcance = `git diff --name-only origin/develop...HEAD` más módulos del body. Vale para cualquier rama y módulo. Dejar constancia de base/head/SHA y conteo de archivos.
- Servir: `npm run start` (build prod) o `npm run dev`; verificar `200 /`, `200 /home`, `/movies`, `/tv-shows`, `/downloads`, `/maintenance`, `/404` (not-found), `/player/[id]`.
- No hay usuario admin por defecto. Siempre pida al usuario los usuarios y contraseñas a usar en las pruebas antes de empezar, una sola vez al inicio de la pasada. No inventar credenciales ni saltar re-auth.
- En entorno de pruebas siempre está permitido crear y borrar real con datos propios `QA_*` (crear → probar → borrar si hay delete; si no hay delete, documentar rastro). Sobre fixtures compartidos sin vía de restauración, no borrar: documentar como límite. Si no se puede, el sistema debe decirlo con mensaje agradable al usuario, nunca caerse ni mostrar mensaje técnico. Repórtelo si falla.
- Por cada módulo pruebe flujo completo por UI con Playwright en esta sola pasada: hero visible sin scroll, rows (`ContentRow`/`ContentRowTV`), CTAs, sidebar, responsive 360/768/1280, formularios (`login`, `register`, `bug-report`, `suggest-content`), validación vacío y límites, crear/editar/borrar donde aplique, links externos con `target=_blank`, con limpieza. No omitir módulos por parecer solo informativos o de lectura.
- Player + PWA en la misma pasada: reproducir DASH shaka-player (360p/1080p, AV1), calidades, subtítulos `::cue`, `EndTimeOverlay`, iOS fullscreen (webkit), `?offline=true` en airplane, `/downloads` lista/reproduce/borra, SW registrado sin 404, `offline-db.ts` conteo base restaura.
- Admin + proxy en la misma pasada: sin token → `/admin` → `/404`; token sin `read-admin-page` → `/404`; API down → `/maintenance`; airplane → `/downloads`.
- En cada revisión, actuar además como usuario malicioso para endurecer la app: datos inválidos (tipos, fechas, textos larguísimos), duplicados, inyección SQL/XSS en búsqueda/comentarios, IDs inexistentes/negativos/cero, payloads masivos y búsquedas con caracteres especiales. Nada debe tumbar la app: todo rechazo con mensaje amable vía `sonner`, sin `500` sin manejar, sin consola `error` nueva, sin registros corruptos; lo que se cree a prueba eliminarlo y confirmar el conteo base.
- Registre consola `error`, network `>=400` salvo `204`. Guarde evidencias en `.playwright-mcp/` (capturas, HAR si aplica) y anote IDs exactos (content.id/slug, profileId, downloadId) + viewports. No deje `QA_*` salvo destructivo autorizado.
- SEO/a11y/motion en la misma pasada: `<title>`, description, canonical, OG, sitemap, manifest, `lang="es"`; teclado-only run, `useTV`/`useKeyboardNavigation`/`useFocusable`, contraste sobre `#141414`, touch 44px; `framer-motion` sin jank, respeta `prefers-reduced-motion`; Lighthouse objetivo 90+ performance/SEO/a11y. Vitest: `npx vitest run` si existen tests.
- Documentar al final lo verificado OK en positivo y los límites no verificables (sin device iOS real, sin Chromecast real, sin spam masivo, sin dañar fixtures) fuera del comentario PR, en el chat.
- Nunca edite el código. Es solo revisión de QA exhaustiva.

## Reporte y cierre

- Reporte solo errores con: página/ruta, pasos, comportamiento encontrado, problema que genera, esperado. Incluya URLs, mensajes exactos, viewport e IDs.
- Al cerrar la pasada única, entregar en el chat: build (errores/warnings), alcance aplicado (recheck de observaciones o revisión completa), lo verificado módulo por módulo o punto por punto, hallazgos numerados y límites no verificables. Después, entregar el texto exacto y completo del comentario PR en bloque copiable, sin pedir datos que ya se probaron.
- Si hay hallazgos, no los anuncie ni solicite cambios en medio de la pasada; anótelos y continúe. Solo repórtelos al final en el cierre, y espere a que el usuario confirme o quiera agregar algo más que decidió probar manualmente.
- Observaciones PR solo en formato proyecto: un solo comentario general `# Observaciones (DD de Mes del YYYY HH:MMam/pm)`, luego `## Ubicación / Sección` y `### Categoría`, un bullet por observación con los 3 elementos. Nada de texto libre.
- Si hay observaciones, `REQUEST_CHANGES`, nunca apruebe.
- Nunca apruebe directo. Aunque no haya observaciones, siempre pida autorización al usuario para aprobar.
- Publicar el comentario y el review solo con OK explícito del usuario; nunca auto-publicar al terminar la pasada.
- Si el usuario aprueba al final, entonces acepte la PR, haga squash and merge de la PR y borre la rama al haber completado el merge con éxito.

## Out of scope

- Do NOT edit code or ports. See `next-build-run`.
- Do NOT inventar credenciales ni saltar re-auth.
- Do NOT cambiar de rama. Solo rama actual salvo especificación explícita.
- Do NOT definir build aquí. See `next-build-run`.
- Do NOT definir guards aquí. See `auth-client`, `next-routes-scope`.
