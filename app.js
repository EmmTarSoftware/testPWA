// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker enregistré avec succès.'))
        .catch(err => console.error('Erreur lors de l\'enregistrement du Service Worker :', err));
}

// Gestion des éléments DOM
const toggleNotifications = document.getElementById('toggleNotifications');
const requestPermissionButton = document.getElementById('requestPermission');
const testNotificationButton = document.getElementById('testNotification');

// Vérifie et met à jour l'état de la checkbox
const updateToggleState = () => {
    if (Notification.permission === 'granted') {
        toggleNotifications.disabled = false;
        const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        toggleNotifications.checked = notificationsEnabled;
    } else {
        toggleNotifications.disabled = true;
        toggleNotifications.checked = false;
    }
};

// Demander la permission
requestPermissionButton.addEventListener('click', async () => {
    const permission = await Notification.requestPermission(); // Attendre que la permission soit définie
    if (permission === 'granted') {
        console.log('Notifications autorisées');
    } else {
        console.log('Notifications refusées');
    }
    updateToggleState(); // Mettre à jour l'état après la demande
});

// Activer ou désactiver les notifications
toggleNotifications.addEventListener('change', () => {
    localStorage.setItem('notificationsEnabled', toggleNotifications.checked);
});

// Test d'envoi de notification
testNotificationButton.addEventListener('click', () => {
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';

    if (Notification.permission === 'granted' && notificationsEnabled) {
        navigator.serviceWorker.ready.then(swRegistration => {
            swRegistration.showNotification('Recompense obtenue !', {
                body: 'Course à pied LVL 10',
                icon: 'logo-test.png',
                vibrate: [200, 100, 200],
            });
        });
    } else if (Notification.permission !== 'granted') {
        alert('Vous devez autoriser les notifications pour les activer.');
    } else {
        alert('Les notifications sont désactivées.');
    }
});

// Initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Vérifie l'état des autorisations au chargement
    updateToggleState();
});
