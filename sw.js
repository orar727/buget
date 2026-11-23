// Keeps the app opening without internet. Bump the version after each update.
const V='buget-v4';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin===location.origin){
    // network first for the page, so updates arrive; cache for everything when offline
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
  }else if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n})));
  }
});
