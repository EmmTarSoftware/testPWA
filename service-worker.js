self.addEventListener('install', event => {
  console.log('Service Worker installé.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activé.');
});



// Action lorsque l'utilisateur clique sur la notification (actuellement ferme la notification)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  console.log('Notification cliquée.');
});
