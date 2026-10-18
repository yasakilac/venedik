// Precache listesi derleme sırasında vite.config.ts tarafından doldurulur.
const CACHE_NAME = 'veneto-app-cache-__BUILD__';
const TILE_CACHE = 'veneto-osm-tiles-v1';
const PRECACHE = __PRECACHE__;
const SCOPE = self.registration.scope;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE.map((p) => new URL(p, SCOPE).href)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== TILE_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!url.protocol.startsWith('http')) return;

  // Harita karolarını uygulamanın kendi tile önbelleği yönetir.
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('cartocdn.com')) return;
  if (url.origin !== self.location.origin) return;

  // Sayfa açılışı: önce önbellek (hızlı + offline), arkada güncelle.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(new URL('index.html', SCOPE).href).then(
        (cached) =>
          cached ||
          fetch(req).catch(() => caches.match(SCOPE))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});
