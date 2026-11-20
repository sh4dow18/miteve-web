---
name: motion-ux
description: Use when adding animations in miteve-web with framer-motion for reveals, rows, modals, and hero transitions.
license: MIT
compatibility: opencode
---

# Motion UX — animation feel only

This skill covers ONLY motion. It does NOT cover SEO, copy, or data fetching. (Reemplaza GSAP/Lenis del proyecto origen: aquí el stack es `framer-motion` 12 + CSS keyframes en `globals.css`.)

## Orden

1. Librería única: `framer-motion` (`motion.div`, `AnimatePresence`). Sin GSAP/Lenis salvo PR justificado. Keyframes legacy en `globals.css` (`fadeUp`, `slideInLeft/Right`, `breathe`, `shimmer`) solo para maintenance/skeletons; lo nuevo va con framer-motion.
2. Colocación: lógica en el widget/feature dueño (`HeroSection.tsx`, `ContentRow.tsx`, `HomeClientShell.tsx`), nunca `<script>` inline de 20 líneas ni `useEffect` con rAF manual si framer lo resuelve.
3. Performance: animar `transform/opacity` only (`y`, `opacity`, `scale`). Listas con `staggerChildren` + `viewport={{ once: true }}`. Matar animaciones en unmount (`AnimatePresence exit`).
4. UX: hero visible sin scroll (sin `initial={{opacity:0}}` bloqueante si JS falla → contenido visible por defecto, animar solo `animate` desde visible). Respetar `prefers-reduced-motion: reduce` → `useReducedMotion()` de framer-motion para desactivar.
5. Copy-safe: números con `Intl.NumberFormat`, texto vía strings ES (ver `i18n-next`). Motion nunca hardcodea copy.

## Naming

- Variants nombradas `fadeUp`, `staggerRow`, `modalSpring`. `transition={{ duration: 0.25, ease: "easeOut" }}` estándar; spring solo modales (`QualityModal`, `BulkDownloadModal`).

## Ejemplos miteve-web

- ✅ `HomeClientShell` reveal de filas `ContentRow` con `whileInView once`; `PlayerSkeleton` shimmer CSS; `maintenance/page.tsx` `fadeDown/fadeUp`.
- ❌ Animar `top/left/width` del sidebar; ❌ `Lenis` smooth-scroll global sin justificación; ❌ hero oculto hasta scroll.

## Verificación

- 60fps, sin jank en 360px, sin CLS, sin warnings consola. Probar con teclado + reduced-motion on. Ver `apply-qa`, `a11y`.

## Out of scope

- Do NOT decidir layout de archivos aquí. Ver `next-architecture`.
- Do NOT definir SEO/meta aquí. See `seo-performance`.
- Do NOT definir tokens aquí. See `tailwind-theming`.
