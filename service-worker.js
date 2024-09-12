self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('ladipage-pwa-cache').then(function(cache) {
      return cache.addAll([
        '/',
        'https://preview.ldpdemo.com/test-code',
        'https://severside-json.github.io/notification/notifications.json',
        'https://severside-json.github.io/notification/icon-192x192.png',
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

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Default title', body: 'Default body' };
  const options = {
    body: data.body,
    icon: 'https://raw.githubusercontent.com/username/repo/main/icons/icon-192x192.png',
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
