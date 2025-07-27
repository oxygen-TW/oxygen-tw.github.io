const CACHE_NAME = "fx-rate-v1.1";

const BASE = "/fxcalc"; // 根目錄，根據你的實際部署路徑調整

const ASSETS = [
    `${BASE}/`, // 通常會轉向 index.html
    `${BASE}/index.html`,
    `${BASE}/manifest.json`,
    `${BASE}/icons/icon-192.png`,
    `${BASE}/icons/icon-512.png`,
    // 請將你所有的 CSS、JS、字體檔、Bootstrap CDN 等列到這裡
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// 2. 安裝階段：快取指定資源
self.addEventListener("install", (evt) => {
evt.waitUntil(
    caches
    .open(CACHE_NAME)
    .then((cache) => cache.addAll(ASSETS))
    .then(() => {
        // 安裝完成後立即進入 activate 階段
        return self.skipWaiting();
    })
);
});

// 3. 啟用階段：清理舊快取，並讓新 SW 立即控制頁面
self.addEventListener("activate", (evt) => {
evt.waitUntil(
    caches
    .keys()
    .then((keys) => {
        return Promise.all(
        keys
            .filter((key) => key !== CACHE_NAME) // 只保留當前版本
            .map((key) => caches.delete(key)) // 刪除舊版快取
        );
    })
    .then(() => {
        // 立刻讓此 SW 控制所有 client（包括當前開啟的頁面）
        return self.clients.claim();
    })
);
});

// 4. 攔截網路請求：先從快取取，沒有就 fetch
self.addEventListener("fetch", (evt) => {
evt.respondWith(
    caches.match(evt.request).then((resp) => resp || fetch(evt.request))
);
});

// 5. 接收頁面訊息，執行 skipWaiting()
self.addEventListener("message", (event) => {
if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
}
});
