const CACHE_NAME = "static_cache"
const STATIC_ASSETS = [
    '/index.html',
    '/style.css',
    '/game.html',
    '/game.css',
]

async function preCache(){
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(STATIC_ASSETS)
}

self.addEventListener('install', e => {
    console.log('[SW] installed')
    e.waitUntil(preCache())
})

async function cleanupCache(){
    const keys = await cache.keys()
    const keysToDelete = keys.map(key => {
        if(key != CACHE_NAME){
            return cache.delete(key)
        }
    })

    return Promise.all(keysToDelete)
}

self.addEventListener('activate', e => {
    console.log('[SW] activated')
    e.waitUntil(cleanupCache())
})

async function fetchAsset(e){
    try{
        const response = await fetch(e.request)
        return response
    }
    catch(err){
        const cache = await cache.open(CACHE_NAME)
        return cache.match(e.request)
    }
}

self.addEventListener('fetch', e => {
    console.log('[SW] fetched')
    e.respondWith(fetchAsset(e))
})
