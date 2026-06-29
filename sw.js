const CACHE_NAME = "neuro-sem-neura-v1-2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./quiz.html",
  "./jogos.html",
  "./manifest.json",
  "./offline.html",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/mapas/01_neurulacao.png",
  "./assets/mapas/02_potencial_acao.png",
  "./assets/mapas/03_celulas_gliais.png",
  "./assets/mapas/04_lobos_cerebro.png",
  "./assets/mapas/05_nucleos_base.png",
  "./assets/mapas/06_tratos_medula.png",
  "./assets/mapas/07_sna.png",
  "./assets/mapas/08_nervos_cranianos_p1.png",
  "./assets/mapas/09_nervos_cranianos_p2.png",
  "./assets/mapas/10_circuitos_dopamina.png",
  "./assets/mapas/11_tronco_encefalico.png",
  "./assets/mapas/12_esquizofrenia.png",
  "./assets/mapas/13_cerebelo.png",
  "./assets/mapas/14_diencefalo.png",
  "./assets/mapas/15_sistema_limbico.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match("./offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
