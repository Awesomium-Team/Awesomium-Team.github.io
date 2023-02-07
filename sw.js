// Copyright 2022 Awesomium team LLC. All Rights Reserved.

const staticCacheName = 'static-awt-llc-cache-v1';
const dynamicCacheName = 'dynamic-awt-llc-cache-v1';

const staticAssets = [
    './',
    './index.html',
    './files/images/awteam.png',
    './files/images/blueprint_up.svg',
    './files/images/blueprint_down.svg',
    './files/images/ue.png',
    './files/Icons/android-chrome-144x144.png',
    './files/Icons/android-chrome-192x192.png',
    './files/js/loading.js',
    './files/css/styles.css',
    './files/js/scrolling.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
});

self.addEventListener('fetch', event => {
    event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}
async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./index.html');
        } else {
            return caches.match('./index.html');
        }
    }
}
