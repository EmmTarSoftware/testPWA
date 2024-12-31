// Récupération du chemin de base
const serviceWorkerUrl = self.location.href;
const basePath = serviceWorkerUrl.replace(/service-worker\.js$/, '');

console.log(`[SERVICE WORKER] : BasePath = ${basePath}`);

// Nom de la version du cache
const CACHE_VERSION = "V23";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Fichiers à mettre en cache
const STATIC_FILES = [
  `${basePath}offline.html`,
  `${basePath}images/Icon-No-Network.webp` // image pour l'état hors ligne
];

// Liste des fichiers explicites pour les trois dossiers

// Ici ne pas mettre le fichier Icon-No-Network car déjà dans STATIC_FILES
// Pas de doublon
const ICONS = [
 
];

const IMAGES = [
 
];

const BADGES = [
 
];



// Combiner toutes les ressources dans un seul tableau et dédupliquer
//Ajout de Set pour s'assurer qu'aucune URL dupliquée ne soit incluse dans ALL_FILES_TO_CACHE
const ALL_FILES_TO_CACHE = [...new Set([...STATIC_FILES, ...ICONS, ...IMAGES, ...BADGES])];

// Évènement d'installation
self.addEventListener("install", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Installation`);

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Mise en cache des fichiers`);
      await cache.addAll(ALL_FILES_TO_CACHE);
    })()
  );
});

// Évènement d'activation
self.addEventListener("activate", (event) => {
  console.log(`[SERVICE WORKER] : Activation`);

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE) {
            console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Suppression de l'ancien cache ${key}`);
            return caches.delete(key);
          }
        })
      );
    })()
  );

  self.clients.claim(); // Contrôler immédiatement les pages
});




// Verification des ressources lors des demandes
self.addEventListener("fetch", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Interception de ${event.request.url}`);

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResponse = await cache.match(event.request);

      // Si la ressource est en cache, retourne-la immédiatement
      if (cachedResponse) {
        // Retourner la réponse en cache immédiatement, tout en récupérant une nouvelle version en arrière-plan
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Mettre à jour le cache en arrière-plan avec la nouvelle version de la ressource
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Si une erreur de réseau survient, retourner la page offline.html si elle est dans le cache
          return cache.match(`${basePath}offline.html`);
        });

        // Retourner la réponse en cache immédiatement et récupérer une nouvelle version en arrière-plan
        return cachedResponse || fetchPromise;
      }

      // Si la ressource n'est pas dans le cache et qu'il n'y a pas de réseau, retourner offline.html
      try {
        const networkResponse = await fetch(event.request);
        // Si la requête réseau réussit, on met à jour le cache
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Erreur réseau pour ${event.request.url}`);
        // En cas d'échec, retourner la page offline.html

        console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Renvoie la page offline.html`);

        return cache.match(`${basePath}offline.html`);
      }
    })()
  );
});



self.addEventListener('push', function(event) {
  const options = {
      body: event.data ? event.data.text() : 'Notification par défaut',
      icon: `${basePath}images/Logo_PWA-192.png`,
  };

  event.waitUntil(
      self.registration.showNotification('Titre de la notification', options)
  );
});
