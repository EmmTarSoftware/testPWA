// Fonction pour demander la permission des notifications si nécessaire
function demanderPermissionNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') { // La permission n'a pas encore été demandée
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log("Permission accordée pour les notifications.");
                } else if (permission === 'denied') {
                    console.log("Permission refusée.");
                } else {
                    console.log("Permission ignorée.");
                }
            });
        } else {
            console.log(`Permission existante : ${Notification.permission}`);
        }
    } else {
        alert("Les notifications ne sont pas supportées par ce navigateur.");
    }
}

// Fonction pour envoyer une notification
function envoyerNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message, {
            icon: './images/Logo_PWA-192.png', // Chemin vers une icône (optionnel)
            body: "Cliquez pour en savoir plus !", // Sous-titre
        });
    } else {
        alert("Les notifications ne sont pas autorisées.");
    }
}


// Exemple : simulation d'une récompense gagnée
function recompenseGagnee() {
    const message = "Félicitations ! Vous avez gagné une récompense 🎉";
    envoyerNotification(message);
}

// Initialisation de l'application
function initialiserApplication() {
    // Vérifier et demander la permission une seule fois
    demanderPermissionNotification();

}


function onTestNotify(){
    recompenseGagnee();
}



// Lancer l'application
initialiserApplication();
