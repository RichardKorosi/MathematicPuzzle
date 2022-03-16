const cache_container = "My_Cache_v1";
const files = [
  "./",
  "https://cdn.interactjs.io/v1.9.20/interactjs/index.js",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./pwa_zaklad.png",
  "./script.js",
  "./ulohy.json",
  "./serviceWorker.js",
  "./android-launchericon-192-192.png",
  "./android-launchericon-512-512.png",
  "./256.png",
  "./android-launchericon-144-144.png",
  "./android-launchericon-96-96.png",
  "./android-launchericon-72-72.png",
  "./android-launchericon-48-48.png",
  "./x.mp3",
];

// Nainstaluj service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cache_container).then((cache) => {
      cache.addAll(files);
    })
  );
});

// Ber z Cache-ky ak sa da
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })()
  );
});
