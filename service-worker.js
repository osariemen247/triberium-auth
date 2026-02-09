// service-worker.js
// Simple cache-first PWA strategy for TRIBERIUM MVP

const CACHE_NAME = 'triberium-cache-v1';
const urlsToCache = [
  './index.html',
  './home.html',
  './css/feedStyles.css',
  './css/profileStyles.css',
  './css/adminStyles.css',
  './css/searchStyles.css',
  './css/walletStyles.css',
  './css/notificationsStyles.css',
  './js/firebaseModule.js',
  './js/feedModule.js',
  './js/profileModule.js',
  './js/adminModule.js',
  './js/followModule.js',
  './js/searchModule.js',
  './js/walletModule.js',
  './js/notificationsModule.js',
  './js/uiUtilitiesModule.js',
  './pwa/icons/icon-192x192.png'
];

// Install Service Worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate Service Worker and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: serve from cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
