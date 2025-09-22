const CACHE_NAME = 'sonic-cd-wasm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/sw.js',
  '/bin/index.data',
  '/bin/index.wasm',
  // Add any other assets you want cached, such as images or CSS:
  // '/styles.css',
  // '/favicon.ico',
  // '/images/logo.png',
];

// On install, cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Serve cached assets if available, else fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true})
      .then(response => response || fetch(event.request))
  );
});
