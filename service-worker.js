// service-worker.js

const CACHE_NAME = "triberium-cache-v1";
const ASSETS_TO_CACHE = [
  "/index.html",
  "/home.html",
  "/profile.html",
  "/admin.html",
  "/css/style.css",
  "/css/feed.css",
  "/css/profile.css",
  "/css/admin.css",
  "/js/firebase.js",
  "/js/auth.js",
  "/js/posts.js",
  "/js/likes.js",
  "/js/comments.js",
  "/js/tbm.js",
  "/js/profile.js",
  "/js/moderation.js",
  "/js/pwa.js",
  "/pwa/manifest.json"
];

// Install event: caching files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      return cachedRes || fetch(event.request);
    })
  );
});