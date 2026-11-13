// Zheroes : service worker minimal (installation en appli). Toujours le réseau d'abord, le cache seulement hors ligne.
const C='zheroes-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)).catch(()=>{}); return res; }).catch(()=>caches.match(r)));
});
