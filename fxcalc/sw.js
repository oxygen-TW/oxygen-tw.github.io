const CACHE_NAME = 'fx-rate-v1';

const BASE = '/fxcalc'; // 根目錄，根據你的實際部署路徑調整

const ASSETS = [
    `${BASE}/`,                    // 通常會轉向 index.html
    `${BASE}/index.html`,
    `${BASE}/manifest.json`,
    `${BASE}/icons/icon-192.png`,
    `${BASE}/icons/icon-512.png`,
    // 請將你所有的 CSS、JS、字體檔、Bootstrap CDN 等列到這裡
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
];

self.addEventListener('install', evt => {
evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
);
});

self.addEventListener('fetch', evt => {
evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
);
});
