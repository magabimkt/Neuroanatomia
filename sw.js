const CACHE = 'neuro-sem-neura-v0.3.2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './assets/mapas/01_neurulacao.jpg',
  './assets/mapas/02_potencial_acao.jpg',
  './assets/mapas/03_celulas_gliais.jpg',
  './assets/mapas/04_lobos_cerebro.jpg',
  './assets/mapas/05_nucleos_base.jpg',
  './assets/mapas/06_tratos_medula.jpg',
  './assets/mapas/07_sna.jpg',
  './assets/mapas/08_nervos_cranianos_p1.jpg',
  './assets/mapas/09_nervos_cranianos_p2.jpg',
  './assets/mapas/10_circuitos_dopamina.jpg',
  './assets/mapas/11_tronco_encefalico.jpg',
  './assets/mapas/12_esquizofrenia.jpg',
  './assets/mapas/organizacao-sistema-nervoso.svg',
  './assets/mapas/medula-espinhal.svg',
  './assets/mapas/tronco-encefalico.svg',
  './assets/mapas/cerebelo.svg',
  './assets/mapas/diencefalo.svg',
  './assets/mapas/telencefalo.svg',
  './assets/mapas/sistema-limbico.svg',
  './assets/mapas/nervos-cranianos.svg',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=Atkinson+Hyperlegible:wght@400;700&family=IBM+Plex+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Don't intercept cross-origin iframe requests
  if (new URL(e.request.url).origin !== location.origin) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
