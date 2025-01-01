// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker enregistré avec succès.'))
        .catch(err => console.error('Erreur lors de l\'enregistrement du Service Worker :', err));
}

// Vérifier l'état des notifications
const notificationStatus = document.getElementById('notificationStatus');
const updateNotificationStatus = () => {
    notificationStatus.checked = Notification.permission === 'granted';
};
updateNotificationStatus();

// Bouton pour demander la permission des notifications
document.getElementById('requestPermission').addEventListener('click', () => {
    Notification.requestPermission().then(updateNotificationStatus);
});

// Bouton pour tester l'envoi d'une notification
document.getElementById('testNotification').addEventListener('click', () => {
    if (Notification.permission === 'granted' && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(swRegistration => {
            swRegistration.showNotification('Test Notification', {
                body: 'Ceci est une notification de test.',
                icon: 'logo-test.png', // Assurez-vous d'avoir une icône ici
                vibrate: [200, 100, 200],
            });
        });
    } else {
        alert('Les notifications ne sont pas autorisées.');
    }
});
