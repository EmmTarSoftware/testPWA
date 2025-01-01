self.addEventListener('install', event => {
  console.log('Service Worker installé.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activé.');
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
          if (clientList.length > 0) {
              return clientList[0].focus();
          }
          return clients.openWindow('/');
      })
  );
});
