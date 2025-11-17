// Meta-L Audio Controller - Service Worker (v5 - 2025)
// Works perfectly on GitHub Pages with subfolder repo (meta-l-audio-app)

const CACHE_NAME = 'meta-l-audio-v5';
const BASE_PATH = '/meta-l-audio-app';  // ← Critical for your repo!

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/logo.png`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`,
  `${BASE_PATH}/screenshot1.png`,
  `${BASE_PATH}/screenshot2.png`
];

// Install → Cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate → Remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch → Serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});

// Optional: Show notification when offline (cool touch)
self.addEventListener('fetch', event => {
  if (!navigator.onLine && event.request.mode === 'navigate') {
    console.log('Meta-L is running OFFLINE');
  }
});
