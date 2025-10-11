self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('notifylab-v1').then(cache => cache.addAll([
    './', './index.html', './main.js', './manifest.json',
    '/icons/astrex.png', '/icons/astrex.png', './icons/badge.png',
    './icons/swatch-c6.png', './icons/swatch-e.png', './icons/swatch-b.png', './icons/swatch-f.png',
    './icons/swatch-kiwify.png'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
    if (all && all.length) all[0].focus(); else clients.openWindow('/');
  })());
});
