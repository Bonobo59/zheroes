// Zheroes : service worker minimal (installation en appli). Toujours le réseau d'abord, le cache seulement hors ligne.
const C='zheroes-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)).catch(()=>{}); return res; }).catch(()=>caches.match(r)));
});
// Notifications « À toi de jouer » : un clic ouvre (ou ramène) le jeu sur la bonne partie
self.addEventListener('notificationclick',e=>{
  e.notification.close(); const d=e.notification.data||{};
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    const c=cs.find(x=>x.url.startsWith(self.registration.scope));
    if(c){ c.postMessage({zhOpen:d}); return c.focus(); }
    return self.clients.openWindow(self.registration.scope+'#open='+(d.k||'')+':'+(d.id||''));
  }));
});
