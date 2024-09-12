self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('ladipage-pwa-cache').then(function(cache) {
      return cache.addAll([
        'https://severside-json.github.io/notification/', // Đường dẫn chính xác đến trang gốc của bạn
        'https://severside-json.github.io/notification/notifications.json', // Đường dẫn đến manifest
        'https://severside-json.github.io/notification/icon-192x192.png', // Icon
      ]);
    })
  );
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
