/**
 * Caching Service Worker.
 * 
 * This service worker, always returns first the cached response if there is one
 * if there isn't then it will return a fresh one and store it in the cache for later use.
 * if there was then the worker will refresh the image in cache in the background with a new one.
 * 
 * This should reduce latency of the website but it won't reduce traffic. Good for offline apps that
 * don't demand up to date resources.
 * 
 */

 const VERSION = 16;
 const CACHE_NAME = `cache-v${VERSION}`;
 
 const log = msg => console.log(`${CACHE_NAME}: ${msg}`);
 const getCache = async () => { return await caches.open(CACHE_NAME); }
 
 const storeResponseInCacheIfOk = async (request, response) => {
     const cache = await getCache();
 
     if (response.ok) {
         log(`Storing resource ${request.url} in cache`);
         await cache.put(request, response);
     }
 };
 
 const clearOldCaches = async () => {
     const cacheNames = await caches.keys();
     const oldCacheNames = cacheNames.filter(name => name !== CACHE_NAME);
     
     for (let name of oldCacheNames) {
         await caches.delete(name);
         log(`Cleared ${name}`);
     }
 };
 
 /**
  * 
  * @param {Request} request 
  */
 const createRetrieveAndRefresh = (request) => {
     let clonedFreshResponse = undefined;
 
     const retriever = async () => {
         const cache = await getCache();
         const maybeResponse = await cache.match(request);
 
         if (maybeResponse) {
             log(`Found cached resource for ${request.url}`);
             return maybeResponse;
         }
 
         log(`No cached resource found for ${request.url}. Fetching`);
         const freshResponse = await fetch(request);
         clonedFreshResponse = freshResponse.clone();
         return freshResponse;
     }
 
     /**
      * 
      * @param {Promise<Response>} retrieverPromise 
      */
     const refresher = async (retrieverPromise) => {
 
         log(`Waiting for retrieve() for ${request.url} to finish`);
         await retrieverPromise;
 
         if (clonedFreshResponse) {
             await storeResponseInCacheIfOk(request, clonedFreshResponse);
             return;
         }
 
         const freshResponse = await fetch(request);
         await storeResponseInCacheIfOk(request, freshResponse);
     }
 
     return [retriever, refresher];
 }
 
 self.addEventListener("install", () => log("Installing"));
 
 self.addEventListener("activate", (event) => {
     log("Clearing old caches");
     event.waitUntil(clearOldCaches());
 });
 
 self.addEventListener("fetch", (event) => {
     log(`Captured fetch for ${event.request.url}`);
 
     const [retrieve, refresh] = createRetrieveAndRefresh(event.request);
     const retrievePromise = retrieve();
     const refreshPromise = refresh(retrievePromise);
 
     event.respondWith(retrievePromise);
     event.waitUntil(refreshPromise);
 
 });