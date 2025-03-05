const { response } = require("express")

const cacheName = 'static'
const resourcesToPrecache = [
    '/.'
]

self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(cacheName)
        .then(caches=>{
            return caches.addAll(resourcesToPrecache)
        })
    )
})

self.addEventListener('fetch', e=>{
    e.respondWith(
        caches.match(e.request).then(response=>{
            return response || fetch(e.request)
        })
    )
})