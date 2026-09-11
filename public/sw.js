const CACHE_NAME = "sudan-chemistry-offline-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/favicon-32x32.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/app-logo.jpg",
  "/sudan-bot-avatar.png"
];

// Install Event - Resilient pre-caching
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[ServiceWorker] Could not pre-cache: ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate Event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Cache-First with Background Revalidation & Offline Navigation Fallback
self.addEventListener("fetch", (event) => {
  // Only intercept same-origin HTTP/HTTPS GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. If cached, serve immediately and update in background if online
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Offline - normal behavior
          });
        return cachedResponse;
      }

      // 2. Not cached yet - fetch and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // 3. If offline and navigating to a page, fallback to cached index.html
          if (event.request.mode === "navigate") {
            return caches.match("/") || caches.match("/index.html");
          }
        });
    })
  );
});
