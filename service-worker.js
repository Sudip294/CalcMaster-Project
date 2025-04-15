const CACHE_NAME = 'calcmaster-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/html-file/BMI.html',
  '/html-file/AgeCount.html',
  '/style-file/style.css',
  '/style-file/bmi.css',
  '/style-file/agecount.css',
  '/script-file/script.js',
  '/script-file/bmi.js',
  '/script-file/agecount.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
  '/images/calcimg.png',
  '/images/calclogo.png',
  // Add audio files if needed
  '/audio/0.mp3',
  '/audio/1.mp3',
  '/audio/2.mp3',
  '/audio/3.mp3',
  '/audio/4.mp3',
  '/audio/5.mp3',
  '/audio/6.mp3',
  '/audio/7.mp3',
  '/audio/8.mp3',
  '/audio/9.mp3',
  '/audio/arithmetic.mp3',
  '/audio/backspace.mp3',
  '/audio/clear.mp3',
  '/audio/dot.mp3',
  '/audio/equal.mp3'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - respond with cached assets or fetch from network
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Handle navigation requests - serve cached index.html for offline support
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    // Handle other requests - cache first, then network fallback
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
