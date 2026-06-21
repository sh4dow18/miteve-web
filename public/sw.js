// ── Miteve Service Worker ─────────────────────────────────────────────────────
// Handles PWA installation detection and app-shell caching.
// Shaka Player manages its own offline DASH segment storage (IndexedDB).

const CACHE_NAME = "miteve-shell-v1";

// App shell assets to cache for offline navigation
const SHELL_URLS = ["/", "/downloads", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache a navigation URL so it works offline (e.g. player routes for downloaded content)
async function cacheUrl(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    // Use include credentials to match typical navigation requests
    const request = new Request(url, { credentials: "include" });
    const existing = await cache.match(request);
    if (existing) return;
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
  } catch {
    // Ignore cache errors
  }
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_URLS" && Array.isArray(event.data.urls)) {
    event.waitUntil(Promise.all(event.data.urls.map(cacheUrl)));
  }
});

// Network-first for navigation, fallback to cache or /offline.html
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin, _next/static, API, stream requests
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    request.url.includes("stream")
  ) {
    return;
  }

  // Navigation requests: network first → cache → offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cache fresh navigation responses
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match("/offline.html"))
            .then((res) => res ?? new Response("Offline", { status: 503 }))
        )
    );
    return;
  }
});
