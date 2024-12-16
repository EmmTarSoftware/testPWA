// Récupération du chemin de base
const serviceWorkerUrl = self.location.href;
const basePath = serviceWorkerUrl.replace(/service-worker\.js$/, '');

console.log(`[SERVICE WORKER] : BasePath = ${basePath}`);

// Nom de la version du cache
const CACHE_VERSION = "V1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Fichiers à mettre en cache
const STATIC_FILES = [
  `${basePath}offline.html`,
  `${basePath}images/Icon-No-Network.webp` // image pour l'état hors ligne
];

// Liste des fichiers explicites pour les trois dossiers



const IMAGES = [
  `${basePath}images/Logo_PWA-192.png`,
  `${basePath}images/Logo_PWA-512.png`,
  `${basePath}images/Test-PWA-Logo.ico`
];




// Combiner toutes les ressources dans un seul tableau et dédupliquer
//Ajout de Set pour s'assurer qu'aucune URL dupliquée ne soit incluse dans ALL_FILES_TO_CACHE
const ALL_FILES_TO_CACHE = [...new Set([...STATIC_FILES, ...IMAGES])];

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

// Évènement de fetch (récupération des ressources)
self.addEventListener("fetch", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Interception de ${event.request.url}`);

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      // Vérifier si la ressource est dans le cache
      const cachedResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Mettre à jour le cache avec la réponse réseau
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch((error) => {
          console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Erreur réseau pour ${event.request.url}`);
          return cachedResponse; // Utiliser la réponse en cache en cas d'échec
        });

      // Retourner la réponse en cache immédiatement, tout en récupérant une nouvelle version en arrière-plan
      return cachedResponse || fetchPromise;
    })()
  );
});
