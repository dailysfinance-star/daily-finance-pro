/* Daily Finance Pro — service worker
   • Network-first: online అయితే ఎప్పుడూ తాజా వెర్షన్ (GitHub/Vercel లో కొత్త ఫైల్ పెడితే వెంటనే అప్‌డేట్).
   • ఆఫ్‌లైన్ అయితే చివరిసారి సేవ్ అయిన కాపీ నుంచి తెరుచుకుంటుంది (పాస్‌బుక్ లింక్ కూడా).
   • ఇదే ఆరిజిన్ GET అభ్యర్థనలు మాత్రమే — Firebase / Google / WhatsApp కాల్స్‌ను ఇది ఎప్పుడూ ముట్టుకోదు. */
const V = 'dfp-v32';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'customer.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-pb-192.png', 'icon-pb-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(r, { cache: 'no-cache' }).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === 'navigate' ? caches.match('index.html').then(x => x || caches.match('./')) : undefined)))
  );
});
