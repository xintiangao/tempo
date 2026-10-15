import { build, files, version } from '$service-worker';
const HOME = new URL(self.registration.scope).pathname;
const CACHE_PREFIX = `workout-timer-${HOME}-`;
const CACHE = `${CACHE_PREFIX}${version}`;
const assets = [...new Set([...build, ...files, HOME])];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(HOME)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch { return event.request.mode === 'navigate' ? (await cache.match(HOME)) || Response.error() : Response.error(); }
  }));
});
