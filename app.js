// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker enregistré avec succès.'))
        .catch(err => console.error('Erreur lors de l\'enregistrement du Service Worker :', err));
} else {
    console.error('Les Service Workers ne sont pas supportés par ce navigateur.');
}





// Gestion des éléments DOM
const addSessionButton = document.getElementById('addSession');
const testNotificationButton = document.getElementById('testNotification');
const statusDisplay = document.getElementById('status');

// Variables pour suivre les sessions et l'état des notifications
let sessionCount = 0;


// Vérifie si le navigateur supporte les notifications
const isNotificationSupported = () => 'Notification' in window;


// Met à jour l'état affiché à l'utilisateur
const updateStatusDisplay = () => {
    const permission = Notification.permission;

    if (permission === 'granted') {
        statusDisplay.textContent = 'Notifications : Activées';
    } else if (permission === 'denied') {
        statusDisplay.textContent = 'Notifications : Refusées';
    } else {
        statusDisplay.textContent = 'Notifications : Non configurées';
    }
};










// Demande l'autorisation pour les notifications
const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        localStorage.setItem('MSS_notifyPermission', permission); // Mémorise la décision
        updateStatusDisplay();
        return permission;
    }
    return Notification.permission;
};


// Envoie une notification
function sendRewardMobileNotify (title, body,badge) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(swRegistration => {
            swRegistration.showNotification(title, {
                icon: "Logo_MSS-192.png",
                body: body,
                image : badge,
                vibrate: [200, 100, 200],
            });
        });
    }
};

// première notification mobile
const eventFirstMobileNotify = async (rewardKey) => {

    console.log(" [NOTIFY] [MOBILE] première notication. Demande d'autorisation");

    // Première récompense
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
        sendRewardMobileNotify('Récompense :', allRewardsObject[rewardKey].title,allRewardsObject[rewardKey].imgRef);
    }
};

// Test manuel des notifications
const eventMobileNotify = (rewardKey) => {
    if (Notification.permission === 'granted') {
        sendRewardMobileNotify('Récompense :', allRewardsObject[rewardKey].title,allRewardsObject[rewardKey].imgRef);
    } else {
        console.log("Notification mobile non active !");
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    if (!isNotificationSupported()) {
        statusDisplay.textContent = 'Notifications : Non supportées par ce navigateur';
        return;
    }

    // Vérifie l'état actuel et met à jour l'affichage
    const savedPermission = localStorage.getItem('MSS_notifyPermission');
    if (savedPermission) {
        Notification.permission = savedPermission; // Pour l'affichage uniquement
    }
    updateStatusDisplay();

});


function test() {
    eventMobileNotify()
}