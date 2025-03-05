const cacheName = 'cache-v1';
const resourcesToPrecache = [
    '/',
    '/index.html',
    '/App.css',
    '/index.css',
    '/main.tsx',
    '/offline.html'  // Fallback page
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching:', resourcesToPrecache);
            return cache.addAll(resourcesToPrecache)
                .catch(err => console.error('Failed to cache:', err));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== cacheName) {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.mode === 'navigate') {
        e.respondWith(
            caches.match('/index.html').then(response => {
                return response || fetch(e.request);
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(response => {
                return response || fetch(e.request);
            }).catch(() => {
                return caches.match('/offline.html');
            })
        );
    }
});
