const cacheName = 'cache-v1';
const resourcesToPrecache = [
    '/',
    '/index.html',
    '/App.css',
    '/index.css',
    '/main.tsx',
];

self.addEventListener('install', event=>{
    console.log('service worker install event');
    event.waitUntil(
        caches.open(cacheName).then(cache=>{
            return cache.addAll(resourcesToPrecache)
        })
    )
})

self.addEventListener('fetch', event=>{
    event.respondWith(caches.match(event.request).then(cachedResponse=>{
        return cachedResponse || fetch(event.request)
    }));
});
