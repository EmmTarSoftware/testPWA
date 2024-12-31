self.addEventListener('push', function(event) {
  const options = {
      body: event.data ? event.data.text() : 'Notification par défaut',
      icon: '/icon.png',
      badge: '/badge.png'
  };

  event.waitUntil(
      self.registration.showNotification('Titre de la notification', options)
  );
});
