const CACHE_NAME = 'flocus-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/timers.js',
  '/js/backgrounds.js',
  '/js/sounds.js',
  '/js/storage.js',
  '/js/sw-register.js',
  '/icons/settings.svg',
  '/icons/play.svg',
  '/icons/pause.svg',
  '/icons/reset.svg',
  '/icons/delete.svg',
  '/assets/images/backgrounds/bg1.jpg',
  '/assets/images/backgrounds/bg2.jpg',
  '/assets/images/backgrounds/bg3.jpg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Cache-first for app shell; network-first for CDN audios, falling back to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }
  if(/pixabay\.com\/download\/audio\//.test(url.href)){
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache)=>{
        try{
          const network = await fetch(event.request);
          cache.put(event.request, network.clone());
          return network;
        }catch(_e){
          const cached = await cache.match(event.request);
          if(cached) return cached;
          throw _e;
        }
      })
    );
  }
});


