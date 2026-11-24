/* Pharmacy Suite service worker.
   Lets the installed app open without internet. Shop data never passes through here: it stays in the browser (IndexedDB).
   - the page itself: the saved copy opens at once (no waiting for the line, however slow it is) while the fresh one is fetched and
     saved for the next open. A new version is announced by the app itself (version.json: "A new version is ready · Reload").
     The very first open, before anything is saved, comes from the network
   - language files (versioned with ?v=), icons, fonts and the CDN libraries: cache first
   - other pages (pay.html): network first, kept separately, so they never replace the app
   - /api/ calls (bill reading, Drive sign-in), version.json (how the app learns of an update), the medicine catalog files (data/, *.csv: the app keeps its own packed
     copy), Google sign-in pages (/__/auth/, forwarded to Firebase) and anything that is not a GET: never cached */
const V = '42db3da25c0a';
const CORE = 'core-' + V, RT = 'rt-' + V;
const PAGE = './';
const PRE = [PAGE, 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
const CDN = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(PRE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CORE && k !== RT).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (same && (/\/(api|data)\//.test(url.pathname) || /^\/__\//.test(url.pathname) || /\.csv$/i.test(url.pathname) || /\/version\.json$/.test(url.pathname))) return;   // version.json: always the server's answer
  if (req.mode === 'navigate') { e.respondWith(same && /\/(index\.html)?$/.test(url.pathname) ? pageFirst(e) : netFirst(req)); return; }   // only the app itself is kept as "the page"
  if (same) { e.respondWith(/\/(i18n|icons)\//.test(url.pathname) ? cacheFirst(req) : netFirst(req)); return; }
  if (CDN.test(req.url)) e.respondWith(cacheFirst(req));
});

function pageFirst(e) {
  const req = e.request; let done;
  e.waitUntil(new Promise(r => { done = r; }));   // keep working until the fresh copy is saved, even when the saved one was shown
  const net = fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CORE).then(c => c.put(PAGE, copy)).then(done, done); } else done();
    return res;
  }, err => { done(); throw err; });
  return caches.match(PAGE).then(hit => {
    if (!hit) return net;   // the very first open: only the network has it
    net.catch(() => {});    // offline now: the saved copy is what opens, nothing to report
    return hit;
  });
}

async function netFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(RT)).put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await caches.match(req);
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') (await caches.open(RT)).put(req, res.clone());
  return res;
}
