// Simple service worker for MagicMuse PWA
// Note: This service worker can be disabled via the VITE_PLUGIN_PWA_DISABLED environment variable
// See register-sw.js for the logic that controls service worker registration

const CACHE_NAME = 'magicmuse-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.webmanifest'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Bypass for Vite-specific paths and other dev server assets
  if (url.origin === self.location.origin) {
    if (
      url.pathname.startsWith('/@vite/') ||
      url.pathname.startsWith('/@react-refresh') ||
      url.pathname.startsWith('/src/') ||
      url.pathname === '/register-sw.js'
    ) {
      // Optional: For debugging, you can uncomment the line below
      // console.log('SW: Bypassing cache for dev URL:', event.request.url);
      event.respondWith(fetch(event.request));
      return;
    }
  }
  // Skip caching for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Skip caching for non-GET requests
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
            console.error('SW: Network fetch failed for:', event.request.url, error);
            throw error; // Re-throw to ensure the fetch promise rejection is propagated
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
