var CACHE_NAME = "ahsant-cache-v1";

self.addEventListener("install", function(event){
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(self.clients.claim());
});

// Network-first for navigation & same-origin requests, falling back to cache when offline.
self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache){
      return fetch(event.request)
        .then(function(response){
          if(response && response.status === 200){
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(function(){
          return cache.match(event.request);
        });
    })
  );
});
