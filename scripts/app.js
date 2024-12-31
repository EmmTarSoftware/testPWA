document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour vérifier et demander la permission
    function verifierEtDemanderPermission() {
        // Vérifier si la permission a déjà été demandée
        const permissionDemandee = localStorage.getItem('notificationPermissionDemandee');

        // Si elle n'a jamais été demandée, demandez-la
        if (permissionDemandee !== 'true') {
            if ('Notification' in window && 'serviceWorker' in navigator) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log("Permission accordée.");
                        afficherNotification("Bienvenue ! Les notifications sont activées.");
                    } else {
                        console.warn("Permission refusée ou ignorée.");
                    }
                    // Marquer que la permission a été demandée
                    localStorage.setItem('notificationPermissionDemandee', 'true');
                }).catch(err => {
                    console.error("Erreur lors de la demande de permission :", err);
                });
            } else {
                console.error("Les notifications ou les Service Workers ne sont pas supportés par ce navigateur.");
            }
        } else {
            console.log("Permission déjà demandée. État actuel : ", Notification.permission);
        }
    }

    // Fonction pour afficher une notification via le Service Worker
    function afficherNotification(message) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && Notification.permission === 'granted') {
                    registration.showNotification("Notification", {
                        body: message,
                        icon: "/icon.png",
                        badge: "/badge.png"
                    });
                } else {
                    console.warn("Aucun Service Worker enregistré ou permission refusée.");
                }
            }).catch(err => console.error("Erreur lors de la récupération du Service Worker :", err));
        } else {
            console.error("Les Service Workers ne sont pas supportés par ce navigateur.");
        }
    }

    // Appeler la fonction pour vérifier et demander la permission
    verifierEtDemanderPermission();

    // Exemple : envoyer une notification lorsque l'utilisateur clique sur un bouton
    document.getElementById('testNotification').addEventListener('click', () => {
        afficherNotification("Ceci est une notification de test !");
    });
});
