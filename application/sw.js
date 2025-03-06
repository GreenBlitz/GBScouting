const PRECACHE = 'precache';

const PRECACHE_URLS = [
  'index.html',
  './', 
  'styles.css',
  'script.js',
  'main.tsx',
  'manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
    .then(cache => cache.addAll(PRECACHE_URLS))
    .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', event=> {
  if (!event.request.url.includes(event.request.referrer)){
    return;
  }
  event.respondWith(fromCache(event.request));
  event.waitUntil(
    update(event.request)
  );
});

function fromCache(request) {
  return caches.open(PRECACHE).then(cache=> {
    return cache.match(request);
  });
}

function update(request) {
  return caches.open(PRECACHE).then(cache=> {
    return fetch(request).then(function(response) {
      return cache.put(request, response.clone()).then(function() {
        return response;
      });
    });
  });
}