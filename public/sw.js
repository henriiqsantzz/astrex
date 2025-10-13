self.addEventListener('push', function(event) {
  let payload = { title: 'Astrex', description: '' };
  try {
    payload = event.data ? event.data.json() : payload;
  } catch(e) {}
  const title = payload.title || 'Astrex';
  const options = {
    body: payload.description || '',
    icon: 'public/icons/astrex.ico',
    badge: 'public/icons/astrex.ico',
    vibrate: [100,50,100],
    data: { dateOfArrival: Date.now() }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// allow local in-page tests
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'local-notification') {
    const { title, description } = event.data;
    self.registration.showNotification(title, { body: description, icon: 'public/icons/astrex.ico' });
  }
});
