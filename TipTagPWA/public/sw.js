const CACHE_VERSION = 'v2'
const CACHE_NAME = `tiptag-${CACHE_VERSION}`

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon.svg',
]

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  cacheFirst: ['/_next/static/', '/icons/', '/fonts/'],
  // Network first for API and dynamic content
  networkFirst: ['/api/', '/_next/data/'],
  // Stale while revalidate for HTML pages
  staleWhileRevalidate: ['/'],
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('tiptag-') && cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('[SW] Claiming clients')
        return self.clients.claim()
      })
  )
})

// Helper: Check if URL matches any pattern
function matchesPattern(url, patterns) {
  return patterns.some(pattern => url.includes(pattern))
}

// Helper: Cache first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('[SW] Cache first fetch failed:', error)
    throw error
  }
}

// Helper: Network first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Helper: Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(CACHE_NAME)
        cache.then(c => c.put(request, response.clone()))
      }
      return response
    })
    .catch((error) => {
      console.error('[SW] Revalidate failed:', error)
      return null
    })

  return cached || fetchPromise
}

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = request.url

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip non-http(s) requests
  if (!url.startsWith('http')) return

  // Skip external requests
  if (!url.startsWith(self.location.origin)) return

  // Determine strategy based on URL
  let strategy

  if (matchesPattern(url, CACHE_STRATEGIES.cacheFirst)) {
    strategy = cacheFirst
  } else if (matchesPattern(url, CACHE_STRATEGIES.networkFirst)) {
    strategy = networkFirst
  } else if (request.mode === 'navigate' || matchesPattern(url, CACHE_STRATEGIES.staleWhileRevalidate)) {
    strategy = staleWhileRevalidate
  } else {
    strategy = networkFirst
  }

  event.respondWith(
    strategy(request).catch(() => {
      // Fallback for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/') || new Response(
          '<!DOCTYPE html><html><body><h1>離線模式</h1><p>請稍後再試</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        )
      }
      return new Response('Offline', { status: 503 })
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes())
  }
})

async function syncNotes() {
  try {
    // Get pending sync actions from IndexedDB
    console.log('[SW] Syncing notes...')

    // Notify clients that sync is complete
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now(),
      })
    })
  } catch (error) {
    console.error('[SW] Sync failed:', error)
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data)

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)

  const data = event.data?.json() || {}
  const title = data.title || 'TipTag'
  const options = {
    body: data.body || '有新的更新',
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg',
    vibrate: [100, 50, 100],
    tag: data.tag || 'tiptag-notification',
    renotify: true,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event)

  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        // Open new window if needed
        if (self.clients.openWindow) {
          return self.clients.openWindow(url)
        }
      })
  )
})

console.log('[SW] Service worker loaded')
