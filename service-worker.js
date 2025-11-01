
// Service Worker sin caché: siempre requiere red
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => new Response(
        `<!doctype html><meta charset="utf-8">
        <title>Conexión requerida</title>
        <style>body{font-family:system-ui;margin:2rem;line-height:1.6}</style>
        <h1>Sin conexión</h1>
        <p>Esta app requiere internet para funcionar.</p>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      ))
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});