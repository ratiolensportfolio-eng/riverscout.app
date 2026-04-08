// RiverScout Service Worker — offline river pages for Pro users
const CACHE_NAME = 'riverscout-v1'
const OFFLINE_CACHE = 'riverscout-offline'

// App shell — always cache these
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.svg',
]

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== OFFLINE_CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache for saved pages
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return

  // For saved river pages and API data — check offline cache first if network fails
  if (url.pathname.startsWith('/rivers/') || url.pathname.startsWith('/api/stocking') || url.pathname.startsWith('/api/pro/historical')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clone = response.clone()
            caches.open(OFFLINE_CACHE).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // For app shell — stale while revalidate
  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetching = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        return cached || fetching
      })
    )
    return
  }
})

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SAVE_RIVER_OFFLINE') {
    const { urls } = event.data
    if (urls && urls.length > 0) {
      caches.open(OFFLINE_CACHE).then((cache) => {
        return Promise.all(
          urls.map((url) =>
            fetch(url).then((res) => {
              if (res.ok) cache.put(url, res)
            }).catch(() => {})
          )
        )
      }).then(() => {
        // Notify all clients that save is complete
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ type: 'RIVER_SAVED_OFFLINE' }))
        })
      })
    }
  }

  if (event.data?.type === 'GET_CACHED_RIVERS') {
    caches.open(OFFLINE_CACHE).then((cache) => {
      cache.keys().then((keys) => {
        const riverPaths = keys
          .map((k) => new URL(k.url).pathname)
          .filter((p) => p.startsWith('/rivers/'))
          .map((p) => {
            const parts = p.split('/')
            return { state: parts[2], slug: parts[3] }
          })
        // Deduplicate
        const unique = [...new Map(riverPaths.map((r) => [`${r.state}/${r.slug}`, r])).values()]
        event.source.postMessage({ type: 'CACHED_RIVERS', rivers: unique })
      })
    })
  }

  if (event.data?.type === 'REMOVE_RIVER_OFFLINE') {
    const { pathPrefix } = event.data
    caches.open(OFFLINE_CACHE).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((key) => {
          if (new URL(key.url).pathname.startsWith(pathPrefix)) {
            cache.delete(key)
          }
        })
      })
    })
  }
})
