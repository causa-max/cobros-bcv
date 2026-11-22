const CACHE_NAME = 'cobros-bcv-v4';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ARCHIVOS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('dolarapi') || e.request.url.includes('er-api')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, copia));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
