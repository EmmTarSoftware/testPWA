// Enregistrement du service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker enregistré avec succès.'))
        .catch(err => console.error('Erreur lors de l\'enregistrement du Service Worker :', err));
} else {
    console.error('Les Service Workers ne sont pas supportés par ce navigateur.');
}





// Gestion des éléments DOM
let pMobileNotifyStatusRef = document.getElementById("pMobileNotifyStatus"),
    rewardsKeyArrayToNotifyCue = [],//tableau vidé par la boucle de notification au fur et à mesure
    isMobileNotifyInProgress = false; // pour ne pas lancer la boucle en doublon si traitement en cours

// Vérifie si le navigateur supporte les notifications
const isNotificationSupported = () => 'Notification' in window;







// Demande l'autorisation pour les notifications
const requestNotificationPermission = async () => {

    console.log(" [NOTIFY] [MOBILE] : demande d'autorisation");

    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        localStorage.setItem('MSS_notifyPermission', permission); // Mémorise la décision
        console.log(" [NOTIFY] [MOBILE] : enregistrement de la décision " + permission);
        updateStatusDisplay();
        return permission;
    }
    return Notification.permission;
};


function sendRewardMobileNotify(title, body, badgeReward) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(swRegistration => {
            swRegistration.showNotification(title, {
                badge: "notifyBadge48.png",
                icon: "Logo_MSS-192.png",
                body: body,
                vibrate: [200, 100, 200],
                requireInteraction: true, // Force l'interaction utilisateur
                priority: 'high' // Force la priorité (bien que non standard)
            });            
        });
    }
}



// TEST TEST TEST TEST 

function test() {
    onReceiveNotifyMobileEvent(["KARATE","BASKETBALL","DE-RETOUR"]);
}


function onReceiveNotifyMobileEvent(rewardsKeysArray) {
    if (Notification.permission === 'granted') {
        
        // Ajout des nouvelles notifications dans la file d'attente
        rewardsKeyArrayToNotifyCue.push(...rewardsKeysArray);

        // Ne lance la boucle de traitement que si elle n'est pas encours
        // Car sinon juste le fait d'alimenter l'arret ci-dessus suffit à la faire continuer son traitement
        if (!isMobileNotifyInProgress) {
            // Lancement de la boucle de traitement
            console.log(" [NOTIFY] [MOBILE] Lancement de la boucle de traitement. Activation du boolean");
            isMobileNotifyInProgress = true;
            onTraiteMobileNotify(); 
        }
        

    } else if (Notification.permission === 'denied') {
        console.log(" [NOTIFY] [MOBILE] Notification NON autorisées ! ");
        return
    } else{
        eventFirstMobileNotify(rewardsKeysArray);
    }
}



// première notification mobile
const eventFirstMobileNotify = async (rewardsKeysArray) => {

    console.log(" [NOTIFY] [MOBILE] première notication.");

    // Première récompense
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
        // Ajout des nouvelles notifications dans la file d'attente
        rewardsKeyArrayToNotifyCue.push(...rewardsKeysArray);
        console.log(" [NOTIFY] [MOBILE] Lancement de la boucle de traitement. Activation du boolean");
        isMobileNotifyInProgress = true;
        onTraiteMobileNotify();
    }
};




function onTraiteMobileNotify() {
    // index zero de la file d'attente
    let rewardKey = rewardsKeyArrayToNotifyCue[0];

    sendRewardMobileNotify('Récompense :', allRewardsObject[rewardKey].title,allRewardsObject[rewardKey].imgRef);

    console.log("[NOTIFY] [MOBILE] Traitement pour " + rewardKey);

    // Retire l'index zero de la file d'attente
    rewardsKeyArrayToNotifyCue.shift();

    console.log("[NOTIFY] [MOBILE] File d'attente :" + rewardsKeyArrayToNotifyCue);

    setTimeout(() => {
        if (rewardsKeyArrayToNotifyCue.length > 0) {            
            onTraiteMobileNotify();
        } else {
            console.log("[NOTIFY] [MOBILE] fin de traitement. Libération du boolean");
            isMobileNotifyInProgress = false;
        }
    }, 2000);
}



// Verification des notifications mobile au démarrage
function onInitMobileNotify() {
    if (!isNotificationSupported()) {
        pMobileNotifyStatusRef.innerHTML = 'Notifications : Non supportées par ce navigateur';
        return;
    }

    // Vérifie l'état actuel et met à jour l'affichage
    const savedPermission = localStorage.getItem('MSS_notifyPermission');
    if (savedPermission) {
        Notification.permission = savedPermission; // Pour l'affichage uniquement
    }
    updateStatusDisplay();

};


// Met à jour l'état affiché à l'utilisateur
function updateStatusDisplay (){
    const permission = Notification.permission;
    if (permission === 'granted') {
        pMobileNotifyStatusRef.innerHTML = 'Notifications : Activées';
    } else if (permission === 'denied') {
        pMobileNotifyStatusRef.innerHTML = 'Notifications : Refusées';
    } else {
        pMobileNotifyStatusRef.innerHTML = 'Notifications : Non configurées';
    }
};





document.getElementById('shareButton').addEventListener('click', function() {
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
        const imageElement = document.getElementById('image');
        
        // Créer un objet File pour l'image
        fetch(imageElement.src)
            .then(response => response.blob())  // Récupérer l'image sous forme de Blob
            .then(blob => {
                const file = new File([blob], "image.png", { type: "image/png" });
                
                // Partager l'image
                navigator.share({
                    files: [file],  // L'image à partager
                    title: 'Voici une image à partager',
                    text: 'Jetez un œil à cette image !',
                })
                .then(() => {
                    console.log('Image partagée avec succès !');
                })
                .catch((error) => {
                    console.error('Erreur de partage : ', error);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'image : ', error);
            });
    } else {
        alert("L'API Web Share n'est pas supportée sur ce navigateur.");
    }
});






onInitMobileNotify();









async function selectSaveLocation() {
    try {
        autoSaveFile = await window.showSaveFilePicker({
            suggestedName: `MSS_AutoSave.json`,
            types: [
                {
                    description: "Fichiers JSON",
                    accept: { "application/json": [".json"] }
                }
            ]
        });
        console.log("Emplacement de sauvegarde défini.");
    } catch (error) {
        console.error("L'utilisateur a annulé la sélection de l'emplacement.", error);
        alert("erreur",error);
    }
}