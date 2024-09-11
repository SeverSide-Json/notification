// Tên cache của bạn
const CACHE_NAME = 'my-pwa-cache-v1';

// Các tài nguyên cần được cache
const urlsToCache = [
  '/', // Trang chủ
  '/?path=manifest.json', // Manifest
  '/?path=style.css', // Tệp CSS
  '/images/icon-192x192.png', // Biểu tượng ứng dụng
  '/images/icon-512x512.png' // Biểu tượng lớn hơn
];

// Khi service worker được cài đặt (install)
self.addEventListener('install', (event) => {
  // Đợi cho đến khi cache được mở và các tệp được thêm vào cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Khi service worker kích hoạt (activate)
self.addEventListener('activate', (event) => {
  // Xóa các cache cũ nếu tên cache khác với cache hiện tại
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Old cache removed:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Đáp ứng các yêu cầu mạng
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Nếu tài nguyên đã có trong cache, trả về từ cache
        if (response) {
          return response;
        }
        // Nếu không có trong cache, tải tài nguyên từ mạng
        return fetch(event.request).then((response) => {
          // Kiểm tra nếu response là hợp lệ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Sao chép response vào cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
