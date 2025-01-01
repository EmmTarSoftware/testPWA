self.addEventListener('install', event => {
  console.log('Service Worker installé.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activé.');
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  console.log('Notification cliquée.');
});
