# Pharmacy Suite — ఇంటర్నెట్‌లో పెట్టే విధానం (Vercel)

## ఈ ఫోల్డర్‌లో ఏముంది
| ఫైల్ | పని |
|---|---|
| `index.html` | యాప్ (minified — కోడ్ పేర్లు చిన్నవిగా మార్చాం) |
| `i18n/` | 22 భాషల ఫైల్స్ (English యాప్‌లోనే ఉంది) — మొత్తం 23 భాషలు |
| `sw.js`, `manifest.webmanifest`, `icons/` | ఫోన్‌లో **Install**, ఇంటర్నెట్ పోయినా యాప్ ఓపెన్ అవుతుంది |
| `api/scan-invoice.js` | Supplier bill ఫోటో చదవడం (Gemini). **API key ఇక్కడ ఉండదు** — Vercel settings లో మాత్రమే |
| `api/google.js` | Google Drive ఆటో-బ్యాకప్ లాగిన్. **Client secret ఇక్కడ ఉండదు** — Vercel settings లో మాత్రమే |
| `drive-done.html`, `drive-done.js` | Google "Allow" తర్వాత వచ్చే చిన్న పేజీ: కనెక్షన్‌ని యాప్‌కి ఇచ్చి తనంతట తానే మూసుకుంటుంది (యాప్ Chrome లోకి మారదు) |
| `version.json` | ఇప్పటి app version. ఫోన్లు దీన్ని చూసి కొత్త version ని తనంతట తానే తెచ్చుకుంటాయి |
| `api/manifest.js` | Install చేసినప్పుడు ఐకాన్ కింద షాప్ పేరు |
| `pay.html` | WhatsApp లో పంపే UPI చెల్లింపు లింక్ పేజీ — కస్టమర్ ఫోన్‌లో UPI app ని మొత్తంతో తెరుస్తుంది |
| `vercel.json` | Security headers: HSTS, వేరే సైట్ లోపల పెట్టనివ్వదు, camera/mic ఈ సైట్‌కే. Script hash ఉన్న CSP ఇప్పుడు `index.html` లోపలే ఉంటుంది, కాబట్టి ఈ ఫైల్ app version తో మారదు |

## మొదటిసారి పెట్టడం
1. GitHub లో **Private** repository తయారు చేయండి. ఈ ఫోల్డర్ **లోపలి** ఫైల్స్ అన్నీ upload చేయండి (`index.html` repo మొదట్లోనే ఉండాలి).
2. vercel.com → **Add New → Project** → ఆ repo **Import** → Framework Preset: **Other** → Build Command ఖాళీగా వదలండి → **Deploy**.
3. Project → **Settings → Environment Variables**:
   - `GEMINI_API_KEY` = Google AI Studio నుంచి తీసుకున్న key (aistudio.google.com → Get API key)
   - `GEMINI_MODEL` (optional). పెట్టకపోతే `gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-flash-latest`, `gemini-2.5-flash` వరుసగా — ఒకటి busy అయితే వెంటనే తర్వాతిది. Google ఒక model ని తీసేసినా reader ఆగదు.
   - Backup AI keys (optional) — కింద **AI బిల్ రీడర్** భాగం చూడండి.
   - `ALLOWED_ORIGINS` (optional) = మీ సొంత domain, ఉదా. `https://billing.myshop.in`
   తర్వాత **Deployments → Redeploy**.
4. ఫోన్ Chrome లో మీ link ఓపెన్ చేసి **⋮ → Install app**. iPhone లో Safari → Share → **Add to Home Screen**.
5. (optional) `indian_medicines_master.csv` ని `index.html` పక్కనే పెడితే medicine catalog ఆటోమేటిక్‌గా లోడ్ అవుతుంది.

> **Vercel plan:** Free (Hobby) plan వ్యక్తిగత, వ్యాపారేతర వాడకానికి మాత్రమే అని Vercel నియమం. షాప్ వ్యాపారం కోసం **Pro plan** తీసుకోవాలి.

## AI బిల్ రీడర్ — key Vercel లో ఒక్కసారి, అన్ని counters కి (16 Nov 2026)
- **ఏ counter లోనూ key అడగదు.** Key Vercel settings లో ఒక్కసారి పెడితే అన్ని ఫోన్లు server ద్వారానే చదువుతాయి. (పాత version లో server ఆలస్యమైనా, internet ఒక్క క్షణం పోయినా "key పెట్టండి" అని అడిగేది — ఆ bug తీసేశాం. Purchase పేజీలోని "Gemini key" బటన్ కూడా తీసేశాం.)
- **Gemini busy అయితే:** server ఒక model "busy" అన్న వెంటనే, లేదా 9 సెకన్లలో జవాబు మొదలుపెట్టకపోతే, తర్వాతి model ని **అదే సమయంలో** మొదలుపెడుతుంది: Gemini 3.8 Flash → 3.6 Flash → 3.5 Flash-Lite → Flash (latest) → 2.5 Flash. ముందు వచ్చిన సరైన జవాబు తీసుకుని మిగతావి ఆపేస్తుంది (రెండు జవాబులకు డబ్బు కట్టరు). మొత్తం 42 సెకన్లలోపు. అన్నీ busy అయితే యాప్ 5 సెకన్లు ఆగి మళ్ళీ ఒకసారి అడుగుతుంది; అప్పటికీ కాకపోతే basic reader చదువుతుంది, form లో **Read again with AI** బటన్ ఉంటుంది.
- **Counter లో కనిపించేది:** "Gemini 3.6 Flash is reading the bill… 7 lines · 9 s" — ఏ AI చదువుతోంది, ఎన్ని lines అయ్యాయి. చివర "Gemini 3.6 Flash read the bill in 9 s".
- **Billing ఆన్ చేయండి:** aistudio.google.com లో ఆ key ఉన్న project కి billing (Tier 1) ఆన్ చేయండి. Free tier లో "busy" చాలా ఎక్కువ, రోజు limit చాలా చిన్నది — చాలా షాపులకు సరిపోదు. Gemini 3.8 Flash తో ఒక బిల్లుకు సుమారు ₹1 (31 Dec 2026 వరకు రేటు; 1 Jan 2027 నుంచి Google రేటు రెట్టింపు చేస్తోంది). Google Cloud లో budget alert పెట్టండి.
- **Backup AI (optional, సిఫార్సు):** Gemini మొత్తం busy అయినప్పుడు వేరే కంపెనీ AI ఆటోమేటిక్‌గా చదువుతుంది. Vercel → Settings → Environment Variables లో ఒకటి పెట్టి Redeploy చేయండి:
  - **Claude:** console.anthropic.com → API Keys → key తయారు చేసి (credits కొనాలి) `ANTHROPIC_API_KEY` లో పెట్టండి. Model `claude-haiku-5-5`; మార్చాలంటే `ANTHROPIC_MODEL`.
  - **OpenAI / OpenRouter / Groq:** `OPENAI_API_KEY` + `OPENAI_MODEL` (ఫోటోలు చదవగల model పేరు). OpenRouter అయితే `OPENAI_BASE_URL` = `https://openrouter.ai/api/v1`.
  - **Google Cloud Vertex AI లో Gemini** (వేరే capacity): `VERTEX_AI` = `1`. ఇది `FIREBASE_SERVICE_ACCOUNT` నే వాడుతుంది. Google Cloud project లో billing, **Vertex AI API** enable, ఆ service account కి **Vertex AI User** role ఇవ్వాలి.
- **Gemini priority (పెద్ద chain కి):** మీ Google project Tier 2/3 అయితే `GEMINI_PRIORITY` = `1`. ఖర్చు 75–100% ఎక్కువ, కానీ రద్దీలో "busy" చాలా తక్కువ. Tier 1 లో పెట్టినా ఏమీ ఆగదు — server దానంతట అదే సాధారణ tier కి వెళ్తుంది.
- **చెక్ చేయడం:** యాప్ → **Settings → Advanced tools → Bill reader check**. ఏ keys ఉన్నాయో (అవును/కాదు మాత్రమే — key చూపించదు), ఏ వరుసలో ప్రయత్నిస్తుందో, ఇప్పుడు ఎంత వేగంగా జవాబిస్తోందో చూపిస్తుంది. ఇది owner కి మాత్రమే కనిపిస్తుంది.
- **ఈ update లో upload చేయాల్సినవి:** `index.html`, `sw.js`, **`api/scan-invoice.js` (GitHub లో `api` ఫోల్డర్ లోపల — repo మొదట్లో కాదు)**, `vercel.json` (bill reader కి 60 సెకన్లు), `i18n` ఫైల్స్.

## Google Drive ఆటో-బ్యాకప్ (ఒక్కసారి సెటప్, సుమారు 15 నిమిషాలు)
యాప్ షాప్ సొంత Google Drive లోకి, ప్రతి మార్పు జరిగిన కొన్ని సెకన్లలోనే తనంతట తానే బ్యాకప్ చేస్తుంది — రోజంతా, మళ్లీ మళ్లీ లాగిన్ అక్కర్లేదు. దీనికి Google Cloud లో ఒక్కసారి "OAuth client" తయారు చేయాలి:
1. **console.cloud.google.com** → పైన project ఎంచుకునే చోట **New project** → పేరు `Pharmacy Suite` → Create.
2. **APIs & Services → Library** → "Google Drive API" వెతకండి → **Enable**.
3. **Google Auth Platform → Branding**: App name `Pharmacy Suite`, support email (మీ mail) → Save. **Audience** లో User type **External**.
4. **Data Access → Add or remove scopes** → `https://www.googleapis.com/auth/drive.file` టిక్ చేసి Save. (యాప్ తను తయారు చేసే బ్యాకప్ ఫైల్స్‌ను మాత్రమే చూడగలదు — మీ Drive లోని మిగతా ఫైల్స్‌ను కాదు.)
5. **Audience → Publish app** → **In production**. (Testing లోనే ఉంచితే Google 7 రోజులకే అనుమతి రద్దు చేస్తుంది. Google ఏదైనా verification అడిగితే అదే పేజీలో చూపిస్తుంది.)
6. **Clients → Create client** → Application type **Web application** → **Authorized redirect URIs** లో `https://మీ-domain/api/google` (ఉదా. `https://myshop.vercel.app/api/google`) → Create. **Client ID, Client secret** కాపీ చేసుకోండి — secret ఒక్కసారే కనిపిస్తుంది. మిస్ అయితే అదే client పేజీలో **Add secret** నొక్కి కొత్తది తీసుకోండి (వెంటనే కాపీ చేయండి).
7. Vercel → Project → **Settings → Environment Variables**:
   - `GOOGLE_CLIENT_ID` = Client ID
   - `GOOGLE_CLIENT_SECRET` = Client secret
   - `DRIVE_TOKEN_KEY` = ఏదైనా పొడవైన random పదం (40+ అక్షరాలు, password generator వాడండి). దీన్ని మార్చితే అన్ని ఫోన్లు disconnect అవుతాయి.
   - (optional) `GOOGLE_REDIRECT_URI` — మీ సొంత domain వాడితే, 6వ దశలో ఇచ్చిన URI నే ఇక్కడ ఇవ్వండి.
   తర్వాత **Deployments → Redeploy**.
8. యాప్‌లో: **Settings → Advanced tools → Drive backup check** → అన్నీ ✓ పచ్చగా రావాలి, ముఖ్యంగా **Google accepts the client ID and secret** (ఇది Google నే నేరుగా అడిగి చెబుతుంది). ఎరుపు ఉంటే అక్కడే ఏం సరిచేయాలో చూపిస్తుంది, Authorized redirect URI కూడా.
9. **Settings → Data → Connect Google Drive** → యాప్ పైన చిన్న Google విండో → షాప్ Google ఖాతా (registration Gmail ముందే ఎంచుకుని ఉంటుంది) → Allow → విండో తనంతట తానే మూసుకుంటుంది. మొదటి బ్యాకప్ వెంటనే మొదలవుతుంది.

ఎలా పనిచేస్తుంది:
- Drive లో **Pharmacy Suite Backups** ఫోల్డర్. రోజుకు ఒక ఫైల్ (చివరి 14 రోజులవి + ప్రతి నెల మొదటిది ఉంటాయి); పాత నెలలు వాటి సొంత ఫైల్స్‌లో, ఆ నెలలో మార్పు వచ్చినప్పుడే మళ్లీ వెళ్తాయి. gzip వల్ల చాలా చిన్నవి.
- పైన pill లో **Backed up 10:42** కనిపిస్తుంది. Internet లేకపోతే తర్వాత తనే మళ్లీ ప్రయత్నిస్తుంది.
- కొత్త ఫోన్ / ఫోన్ పోయినప్పుడు: లింక్ ఓపెన్ చేసి **Connect Google Drive → Restore from Drive** → రోజు ఎంచుకోండి.
- Google అనుమతి (refresh token) server దగ్గర AES-256-GCM తో sealed గా మారుతుంది; ఫోన్‌లో చదవలేని sealed కాపీ మాత్రమే ఉంటుంది. Client secret ఎప్పుడూ ఫోన్‌కి రాదు.
- **Download backup / Share backup file** కూడా ఉన్నాయి — నెలకోసారి PC లో కూడా ఒక కాపీ ఉంచండి.

## UPI చెల్లింపు
- Counter లో **UPI** ఎంచుకుని Save నొక్కితే ముందు ఆ మొత్తంతో QR వస్తుంది; డబ్బు వచ్చిందని ఫోన్‌లో చూసుకుని **Paid · save bill** నొక్కండి. (QR ప్రతిసారీ వద్దంటే ఆ QR స్క్రీన్‌లోనే టిక్ తీసేయండి.)
- **Credit బిల్లు** WhatsApp లో పంపితే, **Dues reminder** లో కూడా "Tap to pay" లింక్ (`pay.html`) వెళ్తుంది. కస్టమర్ నొక్కితే అతని UPI app (PhonePe, Google Pay, Paytm) మొత్తం నింపి తెరుచుకుంటుంది.
- కొన్ని UPI apps లింక్ నుంచి మొదలైన చెల్లింపును "risky" అని ఆపవచ్చు. అప్పుడు అదే పేజీలో **Copy UPI ID** నొక్కి app లో "Pay to UPI ID" తో కట్టవచ్చు; లేదా QR scan — అది ఎప్పుడూ పనిచేస్తుంది.

## మార్పులు చేసినప్పుడు
- మార్పులు source `index.html` లో చేసి `python3 tools/build_publish.py` రన్ చేయండి. కొత్త `publish/` ఫైల్స్ **అన్నీ** GitHub కి upload చేయండి → Vercel ఆటోమేటిక్‌గా deploy చేస్తుంది. ఫోన్‌లో "A new version of the app is ready" వస్తుంది → **Reload**.
- **ముఖ్యం:** 5 Nov 2026 version నుంచి script hash `index.html` లోపలే ఉంటుంది. ఈ version కి `vercel.json` ఒక్కసారి మార్చాలి; తర్వాతి updates లో సాధారణంగా `index.html` (కొత్త పదాలు ఉంటే `i18n` ఫైల్స్ కూడా) మాత్రమే మార్చాలి. ఫైల్ పేరు ఖచ్చితంగా `index.html` ఉండాలి — `index (6).html`, `index .html` లాంటి పేర్లతో Vercel 404 చూపిస్తుంది.

## Master catalog auto-sync (కొత్త మందులు → మీ review → master JSON/CSV)
షాపుల్లో టైప్ చేసిన కొత్త మందులు (పేరు, salt, pack, HSN, GST, MRP మాత్రమే; purchase rate, షాపు పేరు, కస్టమర్ల వివరాలు పంపరు) మీ review లిస్ట్‌కు వస్తాయి. మీరు Approve చేసినవే రాత్రి master files లో కలుస్తాయి.
1. Vercel → Settings → Environment Variables లో రెండు కొత్త వేల్యూలు పెట్టండి (ప్రతిదీ 30+ అక్షరాల random text, రెండూ వేరుగా ఉండాలి): `MASTER_ADMIN_TOKEN` (యాప్‌లో Review తెరవడానికి) మరియు `MASTER_SYNC_TOKEN` (GitHub Action కోసం). `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DB_URL` ఇప్పటికే ఉన్నాయి. Redeploy చేయండి.
2. `database.rules.json` లో `incoming_master_medicines` కు index (`st`) మాత్రమే ఉంది; browser కి access లేదు, సర్వర్ మాత్రమే service account తో రాస్తుంది. అదే ఫైల్ Firebase rules లో paste చేయండి.
3. GitHub repo లో: `github/sync-master.yml` ను `.github/workflows/sync-master.yml` గా, `github/sync_master.js` ను `tools/sync_master.js` గా పెట్టండి. Settings → Secrets and variables → Actions: Secret `MASTER_SYNC_TOKEN` (Vercel లోని అదే వేల్యూ), Variable `SITE_URL` (మీ Vercel లింక్). ఇక్కడ service account పెట్టవద్దు.
4. master files `data/medicines.json` మరియు `data/master_medicines.csv`. వేరే పేరు/ఫోల్డర్ అయితే yml లో చివరి లైన్ మార్చండి. Actions → "Sync master medicines" → Run workflow తో వెంటనే టెస్ట్ చేయవచ్చు.
5. యాప్‌లో: Reports → Tools → Master catalog → "Review new medicines (admin)". Admin token ఇక్కడ ఒక్కసారి ఎంటర్ చేస్తే ఆ పేజీ మూసేవరకు ఉంటుంది.

## Online orders (కస్టమర్ ఫోన్ నుండి ఆర్డర్)
Settings → Online orders → "Turn on" నొక్కితే మీ షాపుకు ఒక లింక్ (`order.html#k=…`) వస్తుంది. దాన్ని WhatsApp లో పంపండి లేదా "Print QR poster" తో కౌంటర్ దగ్గర పెట్టండి. కస్టమర్ మందుల పేర్లు టైప్ చేసి లేదా ప్రిస్క్రిప్షన్ ఫోటో పెట్టి పంపుతారు. యాప్ తెరిచి ఉన్నప్పుడు ప్రతి 2 నిమిషాలకు కొత్త ఆర్డర్లు వస్తాయి (Short book పేజీ, Home లో బ్యానర్). "Make bill" నొక్కితే స్టాక్‌లోని మందులతో బిల్లు సిద్ధమవుతుంది.
- కావాల్సినవి: Vercel లో `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DB_URL` (staff login కోసం ఇప్పటికే ఉన్నవే), సైట్‌లో `firebase-config.json`, కొత్త `database.rules.json`.
- గోప్యత: లింక్‌లో ఉన్న key తో ఎవరూ ఆర్డర్లు చదవలేరు. ఆర్డర్లు మీ షాపు రహస్య key నుండి వచ్చిన దారిలో ఉంటాయి. యాప్ తీసుకున్న వెంటనే server నుండి తొలగిస్తుంది.
- ఒకే చోటు నుండి 10 నిమిషాల్లో 12 కంటే ఎక్కువ ఆర్డర్లు వస్తే ఆపుతుంది. ఒక షాపుకు 150 కంటే ఎక్కువ ఆర్డర్లు పెండింగ్ ఉంటే కొత్తవి తీసుకోదు.

## v2026.11.19-1: యాప్ PIN తో తెరుచుకోవడం, Settings లో Open/Close, Publish app సమస్య

**1. ఇతర ఫోన్లలో "Access blocked" ఇంకా వస్తే (Publish పని చేయకపోతే)**
- Google Cloud లో **ఏ project లో** Publish చేశారో కాదు, **Vercel లోని `GOOGLE_CLIENT_ID` ఏ project దో** అదే ముఖ్యం. రెండూ ఒకటే అవ్వాలి.
- చెక్: యాప్ → Settings → Advanced tools → **Drive backup check** లో "Client ID" చివర కనిపిస్తుంది. Google Cloud → పైన project ఎంచుకో → **Google Auth Platform → Clients** లో అదే Client ID ఉన్న project లో **Audience → Publish app** (In production) చేయాలి. Branding లో Home page, Privacy policy (`https://medical-pos-suite.vercel.app/privacy.html`), Terms లింకులు + Developer email నింపితేనే Publish బటన్ పని చేస్తుంది.
- Publish కాకముందు తాత్కాలికంగా: Audience → **Add users** లో ఆ షాప్ Gmail పెట్టండి (గరిష్ఠంగా 100, 7 రోజులే).

**2. PIN తో యాప్ తెరవడం**
- Settings → Rules → **Set owner PIN**. అదే PIN యాప్ తెరిచినప్పుడు, 5 నిమిషాలు బయట ఉండి తిరిగి వచ్చినప్పుడు అడుగుతుంది. లాగిన్ వివరాలు మళ్ళీ అడగదు.
- PIN స్క్రీన్‌లో: యాప్ version, **Check for updates**, **Log out**, **Forgot PIN?** ఉంటాయి. Forgot PIN → అదే నంబర్‌తో OTP తో మళ్ళీ లాగిన్ → పాత PIN తీసేసి కొత్తది అడుగుతుంది. వేరే నంబర్ తో లాగిన్ అయితే PIN తీయదు.
- ఫోన్ లో ఒక నంబర్ ఒక ఫోన్ లో మాత్రమే: అదే నంబర్ (ఉదా. 9999999999 టెస్ట్ నంబర్) వేరే ఫోన్/బ్రౌజర్ లో register చేస్తే పాతది మళ్ళీ OTP అడుగుతుంది. బ్రౌజర్ డేటా క్లియర్ చేసినా అంతే.

**3. Settings లో ప్రతి కార్డ్‌కి Open / Close**: ఎంచుకున్నది ఫోన్ గుర్తుంచుకుంటుంది.

**Upload చేయాల్సినవి:** `index.html`, `sw.js`, `version.json`, `DEPLOY.md`, `privacy.html` (repo మొదట్లో); `i18n` లో 22 ఫైల్స్. `api/` మారలేదు.

## ఇతర ఫోన్లలో "Access blocked", మార్పులు సెకన్లలో Drive కి, యాప్ లోపలే బిల్ స్కానర్, ఏజెన్సీ రేట్ల పోలిక (18 Nov 2026, v2026.11.18-1)

**1. ఇతర Gmail లకు "Access blocked: … has not completed the Google verification process" (Error 403: access_denied)**
- కారణం: Google Cloud లో మీ OAuth app ఇంకా **Testing** లో ఉంది. Testing లో Google కేవలం "Test users" లిస్ట్‌లో ఉన్న Gmail లను మాత్రమే అనుమతిస్తుంది (గరిష్ఠంగా 100), వాళ్ళ అనుమతి కూడా **7 రోజుల్లో** రద్దవుతుంది. అందుకే మీ ఫోన్‌లో పని చేస్తోంది, వేరే షాపుల Gmail లకు block అవుతోంది.
- సరిచేయడం (ఒక్కసారి, 1 నిమిషం): console.cloud.google.com → పైన **ఆ client ఉన్న project** ఎంచుకోండి (error లో కనిపించిన client_id మొదటి అంకెలు = ఆ project నంబర్) → **Google Auth Platform → Audience** → **Publish app** → **Confirm**. Publishing status **In production** అని రావాలి.
- యాప్ అడిగే ఒకే ఒక్క అనుమతి `drive.file` ని Google "Non-sensitive" గా చూపిస్తుంది (యాప్ తను తయారు చేసిన బ్యాకప్ ఫైల్స్ మాత్రమే చూస్తుంది). కాబట్టి సాధారణంగా పెద్ద verification అక్కర్లేదు; Google ఏమైనా అడిగితే అదే పేజీలో చూపిస్తుంది.
- Publish చేశాక: ఇప్పటికే connect అయిన ఫోన్ (మీది) ఒకసారి **Disconnect → Connect** చేయండి, అప్పుడు అనుమతి 7 రోజులకు ఆగిపోదు.
- **ప్రతి షాప్ కి తన సొంత Gmail, సొంత Drive:** ఏ ఫోన్ ఏ Gmail తో connect అయిందో, ఆ ఫోన్ బ్యాకప్ ఆ Gmail Drive లోకే వెళ్తుంది. Google screen లో కనిపించే "Developer info / support email" కేవలం యాప్ తయారు చేసిన వాళ్ళ వివరం — డేటా అక్కడికి వెళ్ళదు.
- యాప్ లోపల: Google ఆ "Access blocked" పేజీ చూపించి వెనక్కి రాకపోతే, యాప్‌కి తిరిగి వచ్చినప్పుడు "Publish app" చేయాలని యాప్ చెబుతుంది.

**2. ప్రతి మార్పు ~10 సెకన్లలో Drive కి (data పోకుండా)**
- బిల్లు, purchase (స్కాన్ చేసినది కూడా), స్టాక్, పార్టీ — ఏ మార్పైనా సుమారు 10 సెకన్లలో ఆ counter "changes" ఫైల్‌లో Drive కి వెళ్తుంది (ఒక్కో counter కి ఒకే చిన్న ఫైల్, ప్రతిసారి దాన్నే మారుస్తుంది). యాప్ background కి వెళ్ళిన వెంటనే కూడా పంపుతుంది. పూర్తి daily backup ఎప్పటిలాగే కొన్ని నిమిషాలకు ఒకసారి.
- ఫోన్ data clear అయినా / కొత్త ఫోన్: అదే నంబర్‌తో register → అదే Gmail తో **Connect Google Drive** → షాప్‌కు ఒకే counter ఉంటే తాజా కాపీ వెంటనే చూపిస్తుంది ("Saved in Google Drive at …") → **Restore** → అన్నీ తిరిగి వస్తాయి, చివరి daily backup తర్వాత చేసిన బిల్లులు కూడా.
- Restore list: పైన **Bring back everything (saved …)**, కింద రోజుల వారీగా ("Or go back to the end of an earlier day").
- Reports / GST లో ఫోన్‌లో లేని నెల ఎంచుకుంటే ఆ నెల Drive నుంచి తనంతట తానే వస్తుంది (ముందటి update).
- గమనిక: Google Drive API నియమాల్లో "app content ని Drive కి backup చేయడం" కి Google ముందస్తు అనుమతి అవసరం అని ఉంది. షాపులు ఎక్కువైతే Google ని అడగడం మంచిది; **Download backup** ఫైల్ కూడా అప్పుడప్పుడు WhatsApp/Drive లో దాచుకోండి.

**3. బిల్ స్కానర్ యాప్ లోపలే (camera app కి వెళ్ళదు)**
- **Scan supplier bill** → యాప్ లోపలే కెమెరా. బిల్లు అంచులు నీలి రంగులో కనిపిస్తాయి, ఫోన్ కదలకుండా పట్టుకుంటే పేజీ తనంతట తానే తీసుకుంటుంది (Auto; Manual కూడా ఉంది). పేజీని నిటారుగా చేసి, నీడలు తీసి, సరిగ్గా తిప్పుతుంది. ఒక బిల్లుకు 4 పేజీల వరకు. Crop (మూలలు చేత్తో, magnifier తో), Turn, Retake, Delete. Gallery ఫోటోలు/PDF కూడా.
- ఫోన్ Back బటన్ స్కానర్ లోపలే వెనక్కి వెళ్తుంది, యాప్ నుంచి బయటకు వెళ్ళదు.
- చదవడం ఎప్పటిలాగే మీ server (Gemini) ద్వారానే; పేజీ ఇప్పుడు బిల్లు మాత్రమే (కౌంటర్ బ్యాక్‌గ్రౌండ్ లేదు) కాబట్టి upload చిన్నది.
- LocalWell లో కనిపించేది Google వారి Android scanner (Play Store apps కే అందుబాటు). Website/PWA దాన్ని తెరవలేదు — అదే పనిని (అంచులు, auto capture, నిటారుగా, cleaning) యాప్ లోపలే చేశాం.

**4. ఏజెన్సీ రేట్ల పోలిక** — స్కాన్ చేసిన / కొత్త purchase లో ప్రతి లైన్ **Amount** కింద: వేరే ఏజెన్సీలో తక్కువైతే "Cheaper at … (₹… less)" (ఎరుపు), ఈ బిల్లే తక్కువైతే "Best rate. Next: … (₹… more)" (పచ్చ). నొక్కితే ఆ మందుకు అన్ని ఏజెన్సీల చివరి రేట్లు (discount తర్వాత, pack ప్రకారం). సేవ్ చేసిన purchase లో కూడా.

**5. పైకి లాగితే (pull-down) యాప్ reload అవ్వదు.**

**Upload చేయాల్సినవి (v2026.11.18-1):** repo మొదట్లో `index.html`, `sw.js`, `version.json`, `DEPLOY.md`; `i18n` ఫోల్డర్‌లో 22 ఫైల్స్. `api/` లో ఈసారి మార్పు లేదు.

## Drive "could not be connected": అసలు కారణం, సరిచేసినవి (17 Nov 2026, v2026.11.17-2)
**ఏం జరిగింది:** Google లో Allow నొక్కాక Google ఒక code ఇస్తుంది. మన server (`api/google.js`) ఆ code ని Drive అనుమతిగా మార్చమని Google ని అడుగుతుంది. ఆ అడుగు దగ్గరే Google నిరాకరించింది. Server ఆ కారణాన్ని దాచి "could not be connected" అని మాత్రమే చెప్పేది. యాప్ toast చివర కోడ్ లేకపోవడంతో ఇది తెలిసింది (cookie/claim దాకా రాలేదు, అందుకే 17-1 లోని మార్పులు సాయపడలేదు). ఎక్కువ అవకాశం ఉన్న కారణం: Vercel లోని `GOOGLE_CLIENT_SECRET` ఆ `GOOGLE_CLIENT_ID` ది కాకపోవడం, లేదా ఫోన్‌లో copy చేసినప్పుడు చివర ఖాళీ / కొత్త లైన్ రావడం.

**ఇప్పుడు:**
- Vercel values చివర ఖాళీ, line break ఉన్నా server తనే తీసేస్తుంది.
- Connect ఫెయిల్ అయితే చిన్న విండోలో, యాప్ toast లో Google చెప్పిన కోడ్ కనిపిస్తుంది (ఉదా. `invalid_client`). Setup సమస్య అయితే విండో మూసుకోదు, screenshot తీయొచ్చు.
- **Drive backup check** Google నే నేరుగా అడుగుతుంది: **Google accepts the client ID and secret** ✓/✗. ✗ అయితే ఏం చేయాలో అక్కడే చెబుతుంది. `GOOGLE_CLIENT_ID` విలువ కూడా చూపిస్తుంది (ఇది రహస్యం కాదు, ప్రతి Google sign-in address లో ఉంటుంది), Google Cloud → Clients లిస్ట్‌తో పోల్చుకోవచ్చు. చివరి Connect ఫెయిల్ అయితే దాని కోడ్, సమయం కూడా చూపిస్తుంది.
- 17-1 లో Drive అనుమతిని web address లో పెట్టే మార్పు తీసేశాం (address లు browser history లో, Vercel logs లో ఉండిపోతాయి). అనుమతి మళ్ళీ 5 నిమిషాల HttpOnly cookie లోనే ఉంటుంది.
- Vercel → Logs లో కూడా `google.js: Google refused the code exchange: 401 invalid_client …` లాంటి లైన్ కనిపిస్తుంది (secret ఎప్పుడూ log కాదు).

**కోడ్ అర్థాలు:**
- `invalid_client` → Google ఈ client ID తో ఈ secret ని ఒప్పుకోవట్లేదు. Google Cloud → Clients → మీ web client తెరవండి → **Add secret** → వెంటనే కాపీ → Vercel → `GOOGLE_CLIENT_SECRET` → ⋯ → Edit → పేస్ట్ → Save. అదే పేజీ నుంచి Client ID కాపీ చేసి `GOOGLE_CLIENT_ID` కూడా మళ్ళీ పెట్టండి. తర్వాత **Redeploy**.
- `redirect_uri_mismatch` → Authorized redirect URIs లో `https://medical-pos-suite.vercel.app/api/google` లేదు.
- `invalid_grant` → code పాతది లేదా ఒకసారి వాడేసింది. మళ్ళీ Connect చేయండి.
- `admin_policy_enforced` / `org_internal` → Google Workspace admin అడ్డుకుంటున్నారు, లేదా Audience **Internal** గా ఉంది (**External** చేయండి).
- `google_unreachable` → Google కి చేరలేకపోయాం. కొంచెం ఆగి మళ్ళీ ప్రయత్నించండి.

**DRIVE_TOKEN_KEY:** chat లో ఉదాహరణగా వచ్చిన విలువ పెట్టి ఉంటే, మీరే 40+ random అక్షరాలతో మార్చండి. ఇంకా ఏ షాపూ కనెక్ట్ కాలేదు కాబట్టి ఇప్పుడు మార్చితే ఏమీ పోదు. తర్వాత మార్చితే అన్ని ఫోన్లు మళ్ళీ కనెక్ట్ చేయాలి.

**ఈ update లో upload చేయాల్సినవి:** repo మొదట్లో `index.html`, `sw.js`, `version.json`, `drive-done.html`, `drive-done.js`, `DEPLOY.md`; `api` ఫోల్డర్‌లో `google.js`; `i18n` ఫోల్డర్‌లో 22 ఫైల్స్.

## Google Drive సరిచేసినవి, డేటా రక్షణ, పాత ఫోన్లు (16 Nov 2026, v2026.11.16-8)
**Drive ఎక్కడ ఫెయిల్ అయింది:**
1. **Vercel లో Google settings లేవు.** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DRIVE_TOKEN_KEY` లేకపోతే "Connect Google Drive" ఎన్నిసార్లు నొక్కినా పనిచేయదు. ఇప్పుడు షాప్‌కి "Settings → Data → Download backup తో ఫైల్ ఉంచుకోండి" అని చెబుతుంది. మీకు (app provider) ఏ setting లేదో పేరుతో, redirect URI తో చూపిస్తుంది.
2. **ఇన్‌స్టాల్ చేసిన యాప్ Chrome లోకి మారిపోవడం.** పాత version లో Connect నొక్కితే యాప్ పేజీ మొత్తం Google కి వెళ్ళేది. Android దాన్ని Chrome లో తెరిచేది. Allow తర్వాత కనెక్షన్ ఆ Chrome ట్యాబ్‌లో సేవ్ అయ్యేది, ఇన్‌స్టాల్ చేసిన యాప్‌కి తెలిసేది కాదు. అందుకే కస్టమర్ చేసినా "కనెక్ట్ అవ్వలేదు" అనిపించింది.
   ఇప్పుడు యాప్ యాప్‌లాగే ఉంటుంది. Google లాగిన్ యాప్ పైన చిన్న విండోలో వస్తుంది, Allow తర్వాత అది తనంతట తానే మూసుకుంటుంది. కనెక్షన్ మూడు దారుల్లో యాప్‌కి వస్తుంది, యాప్ మధ్యలో మూసుకుపోయినా తర్వాత తెరిచినప్పుడు తీసుకుంటుంది. ఆ విండో నెట్ నెమ్మదిగా ఉండి కనెక్షన్ తీసుకోలేకపోతే యాప్ తనే తీసుకుంటుంది.
   గమనిక: Google లాగిన్ స్క్రీన్ Google దే. Security కోసం Google దాన్ని ఏ యాప్ లోపలా తెరవనివ్వదు. అందుకే ఒక్క క్షణం పైన ✕ ఉన్న చిన్న Chrome విండో కనిపిస్తుంది. అది మామూలే.
3. **Data clear చేయడం.** Chrome లేదా Android Settings లో "Clear data / Clear storage / Cookies and site data" చేస్తే ఆ ఫోన్‌లోని రికార్డులు మొత్తం పోతాయి. దీన్ని ఏ వెబ్ యాప్ ఆపలేదు. "Cached images and files" మాత్రమే clear చేస్తే రికార్డులు పోవు. ఒకటే రక్షణ: Google Drive బ్యాకప్ (లేదా Cloud shop).
4. **పాత ఫోన్ పాత version లోనే ఉండటం.** ఆ షాప్ ఫోన్ ఇంకా v2026.11.16-5 లో ఉంది, అందుకే reCAPTCHA badge fix రాలేదు. "Check for updates" 1.5 సెకన్లే ఆగేది, నెమ్మది ఫోన్‌లో తప్పుగా "latest" అనేది.

**ఇప్పుడు తనంతట తానే జరిగేవి:**
- Registration అయిన వెంటనే **Keep your shop safe** స్క్రీన్ వస్తుంది → ఒక్క tap → Google (registration Gmail ముందే ఎంచుకుని ఉంటుంది) → Allow → మొదటి బ్యాకప్ వెంటనే. తర్వాత ప్రతి మార్పుకు కొన్ని నిమిషాల్లో బ్యాకప్.
- రికార్డులు ఉండి Drive కనెక్ట్ చేయని పాత షాపులకు అదే స్క్రీన్ Home లో వస్తుంది. బిల్లు లేని ఖాళీ సమయంలోనే, ప్రతి 3 రోజులకు ఒకసారి, కనెక్ట్ అయ్యే వరకు. మధ్యలో Home బ్యానర్ ఉంటుంది.
- Data పోయిన ఫోన్‌లో మళ్ళీ registration చేస్తే **Bring your shop back** వస్తుంది → అదే Google ఖాతా → బ్యాకప్ లిస్ట్ తనంతట తానే తెరుచుకుంటుంది. ముందుగా ఖాళీ బ్యాకప్ రాయదు, కాబట్టి పాత బ్యాకప్ పాడవదు.
- ఫోన్ నిండినప్పుడు Android ఈ యాప్ data తీసేయకుండా persistent storage అడుగుతుంది. Settings → Data లో **Safe from automatic deletion** (Yes/No), **Free space for this app** చూపిస్తుంది.
- **Google ప్రతి షాప్‌ని ఒక్కసారి "Allow" అడుగుతుంది.** ఓనర్ అనుమతి లేకుండా ఎవరి Drive లోనూ రాయడానికి Google ఒప్పుకోదు. ఆ ఒక్క tap ని యాప్ వీలైనంత సులభం చేసింది.

**మీరు చేయాల్సింది (ఒక్కసారి, సుమారు 15 నిమిషాలు). పూర్తి దశలు పైన "Google Drive ఆటో-బ్యాకప్" భాగంలో ఉన్నాయి:**
1. console.cloud.google.com → **Google Drive API** → Enable.
2. Google Auth Platform → Audience → **Publish app → In production**. Testing లో ఉంటే 7 రోజులకే disconnect అవుతుంది, 100 మందికే పనిచేస్తుంది.
3. Clients → **Web application** → Authorized redirect URIs: `https://medical-pos-suite.vercel.app/api/google`. ఖచ్చితంగా ఇదే ఉండాలి, చివర `/` ఉండకూడదు.
4. Vercel → Settings → Environment Variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DRIVE_TOKEN_KEY` (40+ అక్షరాల random) → **Redeploy**.
5. యాప్ → Settings → Advanced tools → **Drive backup check** → అన్నీ ✓ రావాలి. ఎరుపు ఉంటే ఆ లిస్ట్ screenshot పంపండి.

**పాత / తక్కువ storage ఫోన్లు:**
- **Updates తనంతట తానే వస్తాయి:** యాప్ తెరిచిన ప్రతిసారి `version.json` చూస్తుంది. యాప్ రోజంతా తెరిచి ఉన్నా, internet తిరిగి వచ్చినా 2 గంటలకు ఒకసారి చూస్తుంది (1 లక్ష కౌంటర్లకు server ఖర్చు తక్కువగా ఉండటానికి). కొత్త version ముందే download చేసి, Home స్క్రీన్‌లో ఖాళీ సమయంలో (బిల్లు/form తెరిచి లేనప్పుడు) ఒక్కసారి reload అవుతుంది. వేరే స్క్రీన్‌లలో టైప్ చేసినవి పోకుండా **Reload** బటన్ మాత్రమే చూపిస్తుంది. బిల్లు మధ్యలో ఎప్పుడూ ఆపదు, loop అవ్వదు. Settings లో **Check for updates** నొక్కితే వెంటనే చూస్తుంది.
- **Storage దాదాపు నిండితే:** 200 MB కంటే తక్కువ ఉంటే Home లో హెచ్చరిక. 260 MB కంటే తక్కువ ఉంటే 2.5 లక్షల మందుల లిస్ట్ (సుమారు 14 MB) తనంతట తానే download చేయదు. Medicine master లో **Download the medicine list** బటన్ తర్వాత వాడుకోవడానికి ఉంటుంది.
- **బిల్ ఫోటోలు:** 24–50 MP ఫోటోని memory లో పూర్తిగా తెరవకుండా నేరుగా చిన్న సైజ్‌లో (1800 px) తెరుస్తుంది. 2 GB RAM ఫోన్లలో ఇంకా చిన్నగా (1500 px). దీంతో crash, ఆలస్యం తగ్గుతాయి.

**ఈ update లో upload చేయాల్సినవి:**
- repo మొదట్లో: `index.html`, `sw.js`, `vercel.json`, `DEPLOY.md`, కొత్తవి `version.json`, `drive-done.html`, `drive-done.js`
- `api` ఫోల్డర్ లోపల: `google.js`
- `i18n` ఫోల్డర్ లోపల: 22 భాషల ఫైల్స్
- Vercel తనంతట తానే deploy చేస్తుంది. Environment Variables మార్చితే మాత్రం **Redeploy** చేయాలి.

## యాప్ పేరు = షాప్ పేరు (16 Nov 2026, v2026.11.16-7)
- Settings → Shop లో **Shop name** సేవ్ చేస్తే, "Install app" తర్వాత ఫోన్ హోమ్ స్క్రీన్‌పై యాప్ ఐకాన్ కింద ఆ షాప్ పేరు వస్తుంది (ఉదా: Vasundhara Medical Shop).
- దీనికి `api/manifest.js` కావాలి. ఇది తప్పకుండా `api` ఫోల్డర్ లోపల ఉండాలి. ఇది లేకపోతే యాప్ పాత "Pharmacy Suite" పేరుతోనే ఇన్‌స్టాల్ అవుతుంది, ఇన్‌స్టాల్ ఆగదు.
- ఐకాన్ కింద 12–15 అక్షరాలే పడతాయి. అందుకే పొడవైన పేర్లలో చివరి "Medical Shop / Pharmacy / Stores" లాంటి పదాలు తీసేస్తాం (Vasundhara Medical Shop → Vasundhara). పూర్తి పేరు యాప్ info లో, యాప్ తెరిచినప్పుడు కనిపిస్తుంది. **App name on the phone** లో ఓనర్ తనకు కావాల్సిన పేరు పెట్టుకోవచ్చు.
- **ముఖ్యం:** ముందు షాప్ పేరు సేవ్ చేసి, తర్వాతే ఇన్‌స్టాల్ చేయండి. ఇప్పటికే ఇన్‌స్టాల్ అయిన యాప్ కొన్ని రోజుల్లో కొత్త పేరు తీసుకుంటుంది (Chrome ఒకసారి అడగవచ్చు). వెంటనే కావాలంటే యాప్ తీసేసి మళ్ళీ ఇన్‌స్టాల్ చేయవచ్చు. కానీ ముందు Drive backup తీసుకోండి. తీసేటప్పుడు Android/Chrome "data కూడా తొలగించాలా?" అని అడిగితే **వద్దు** అనండి.
- ఐకాన్ బొమ్మ (symbol) అందరికీ ఒకటే. షాప్ లోగో ఐకాన్‌గా కావాలంటే అది ఆన్‌లైన్‌లో (Firebase Storage) పెట్టాలి, అది తర్వాతి పని.

## Save ఆగిపోవడం, reCAPTCHA బ్యాడ్జ్ (16 Nov 2026, v2026.11.16-6)
- **Save ఆగిపోవడం:** యాప్ పైన "Starting…" లోనే ఉండిపోతే (ఫోన్ storage జవాబు ఇవ్వకపోతే), Save బటన్ ఎటువంటి మెసేజ్ లేకుండా ఎప్పటికీ ఆగేది. ఇప్పుడు:
  - 15 సెకన్లలో "ఎందుకు సేవ్ కాలేదో" చెప్పి, Save బటన్ మళ్ళీ వస్తుంది.
  - పైన ఎరుపు నోటీసు ఏ అడుగు దగ్గర ఆగిందో చెబుతుంది, దానితో పాటు **Reload** బటన్ ఉంటుంది.
  - అదే ఫోన్‌లో యాప్ ఇంకో కాపీ (ఇంకో Chrome ట్యాబ్ లేదా ఇన్‌స్టాల్ చేసిన యాప్) save మధ్యలో ఆగిపోతే, 3 సెకన్లలో "waiting for another copy" అని చెప్పి, 12 సెకన్లలో సేవ్ పూర్తి చేస్తుంది.
  - సేవ్ అవుతున్నప్పుడు బటన్ మీద "Saving…" కనిపిస్తుంది.
  - సేల్ బిల్ సేవ్‌లో error వస్తే ఇప్పుడు మెసేజ్ వస్తుంది. ఇంతకు ముందు నిశ్శబ్దంగా పోయేది.
- **సలహా:** ఒక ఫోన్‌లో యాప్ ఒక్క చోటే తెరవండి, ఇన్‌స్టాల్ చేసిన యాప్ లేదా ఒక Chrome ట్యాబ్. రెండూ ఒకేసారి తెరవకండి.
- **reCAPTCHA బ్యాడ్జ్:** లాగిన్ తర్వాత కింద మెనూ మీద ఉండిపోయి చివరి బటన్‌ను కప్పేది. ఇప్పుడు లాగిన్ తర్వాత పూర్తిగా తీసేస్తాం. లాగిన్ స్క్రీన్‌పై బ్యాడ్జ్ దాగి ఉంటుంది, దాని బదులు "Protected by Google reCAPTCHA · Privacy · Terms" లైన్ ఉంటుంది (బ్యాడ్జ్ దాచినప్పుడు Google పెట్టమనే లైన్ ఇదే). ఆ లైన్ నొక్కితే బ్యాడ్జ్ కనిపిస్తుంది, మళ్ళీ నొక్కితే దాగుతుంది.

## లాగిన్ స్క్రీన్ సరిచేసినవి (16 Nov 2026, v2026.11.16-5)
- **పేజీ చిన్నగా రావడం:** ఏ ఫోన్‌లో 💻 Desktop view ఆన్ చేసి ఉంటే, లాగిన్ స్క్రీన్ 1280 px వెడల్పుతో చాలా చిన్నగా వచ్చేది. ఇప్పుడు లాగిన్ స్క్రీన్ ఎప్పుడూ ఫోన్ సైజ్‌లోనే వస్తుంది. లాగిన్ తర్వాత ఆ ఫోన్ Desktop view తిరిగి వస్తుంది. Chrome లో “Desktop site” ఆన్ ఉన్నా కార్డ్ ఫోన్ సైజ్‌కు పెద్దదవుతుంది, దాన్ని ఎలా ఆఫ్ చేయాలో కూడా చూపిస్తుంది.
- **Resend OTP:** Google robot check (reCAPTCHA) బాక్స్ స్క్రీన్ మళ్ళీ గీసినప్పుడు పోయేది, అందుకే రెండోసారి OTP పంపడం ఫెయిల్ అయ్యేది. ఇప్పుడు ప్రతి Send OTP కి కొత్త బాక్స్.
- **తప్పు “OTP sent”:** నంబర్ మార్చినా పాత OTP బాక్స్ ఉండేది, పంపడం ఫెయిల్ అయినా “OTP sent to …” అనేది. ఇప్పుడు నంబర్ మారితే పాత బాక్స్ పోతుంది. ఫెయిల్ అయితే అసలు కారణం నంబర్ కిందే ఎరుపులో వస్తుంది (ఉదా: `auth/billing-not-enabled` → Blaze plan కావాలి).
- **స్క్రీన్ ఆగిపోవడం:** OTP సరైనదైనా database జవాబు ఇవ్వకపోతే స్క్రీన్ అలాగే ఆగిపోయేది. ఇప్పుడు ప్రతి అడుగుకు సమయ పరిమితి ఉంది: OTP check 25 s, database చదవడం 6 s, సేవ్ 10 s. Database జవాబు ఇవ్వకపోయినా ఫోన్ verify అయితే యాప్ ఓపెన్ అవుతుంది. వివరాలు ఫోన్‌లో ఉండి, తర్వాత ఆటోమేటిక్‌గా ఆన్‌లైన్‌లో సేవ్ అవుతాయి.
- **“Checking the OTP…”:** OTP చెక్ అవుతున్నప్పుడు బటన్‌లు అదే చూపిస్తాయి. ఆలస్యమైతే స్పష్టమైన మెసేజ్ వస్తుంది. మళ్ళీ Verify నొక్కితే ఆలస్యంగా వచ్చిన సక్సెస్ కూడా లెక్కలోకి వస్తుంది.
- **“OTP problem? Check the connection”** (లాగిన్ స్క్రీన్ కింద): ఇంటర్నెట్, firebase-config.json, Google login library, OTP service + ఈ వెబ్‌సైట్ Authorized domains లో ఉందా, Google robot check, Database, చివరి OTP error code, ఫోన్/Chrome వెర్షన్. ఏ కౌంటర్‌లో సమస్య వచ్చినా ఈ లిస్ట్ screenshot పంపమనండి.

**Real SMS ఖర్చు (Google Identity Platform pricing, Nov 2026):** India కి ఒక SMS కి $0.07 (సుమారు ₹6). రోజుకు మొదటి 10 SMS ఉచితం. Test numbers కి SMS పోదు, ఖర్చు లేదు. 1 లక్ష కౌంటర్లు ఒక్కోసారి రిజిస్టర్ అయితే సుమారు $7,000. తక్కువ ఖర్చు కావాలంటే తర్వాత MSG91 / 2Factor వంటి DLT SMS (సుమారు ₹0.2) server నుంచి పంపవచ్చు. దానికి DLT రిజిస్ట్రేషన్, `FIREBASE_SERVICE_ACCOUNT` కావాలి.

## Registration & login (మొదటి స్క్రీన్: పేరు, ఫోన్ OTP, సిటీ, జిల్లా, రాష్ట్రం, పిన్ కోడ్, Gmail)
`firebase-config.json` ఉన్న వెబ్‌సైట్‌లో, ప్రతి కొత్త ఫోన్‌లో యాప్ ఓపెన్ అయ్యే ముందు ఈ స్క్రీన్ తప్పనిసరిగా వస్తుంది. QR తో join అయ్యే staff ఫోన్లకు ఇది రాదు. దీన్ని ఆపాలంటే `firebase-config.json` లో `"registration": false` పెట్టండి.
1. Firebase console → Authentication → Sign-in method → **Phone** ని Enable చేయండి.
2. Authentication → Settings → **Authorized domains** లో మీ Vercel domain ఉందో లేదో చూడండి (లేకపోతే add చేయండి).
3. అసలు నంబర్లకు Phone OTP SMS కి **Blaze (pay-as-you-go)** plan తప్పనిసరి (1 Sep 2024 నుంచి; free plan లో `auth/billing-not-enabled` వస్తుంది). India కి ఒక SMS సుమారు $0.07. Authentication → Settings → **SMS region policy** లో India మాత్రమే allow చేయండి, ఇది దుర్వినియోగం తగ్గిస్తుంది.
4. కొత్త `database.rules.json` ని Realtime Database → Rules లో publish చేయండి (`reg` భాగం కొత్తది). వివరాలు `reg/<uid>` లో ఉంటాయి: ఆ నంబర్ వాళ్ళు, central admin మాత్రమే చదవగలరు.
5. టెస్ట్ కోసం Authentication → Phone → "Phone numbers for testing" లో ఒక నంబర్, OTP add చేసుకోవచ్చు (SMS ఛార్జ్ లేకుండా).
- ఒక నంబర్ ఒక్కసారి ఒక ఫోన్‌లోనే: అదే నంబర్ వేరే ఫోన్‌లో రిజిస్టర్ చేస్తే, పాత ఫోన్ ఆన్‌లైన్‌కు వచ్చినప్పుడు OTP మళ్ళీ అడుగుతుంది. పాత ఫోన్ ఆఫ్‌లైన్‌లో ఉన్నంత సేపు ఇది తెలియదు.
- రిజిస్టర్ అయినవాళ్ళ లిస్ట్: Firebase console → Realtime Database → `reg`.

## 1 లక్ష షాపులు — ఏది సిద్ధంగా ఉంది, మీరు ఏమి చేయాలి
**యాప్‌లో చేసినవి:** Central admin ఇప్పుడు అన్ని షాపులను ఒకేసారి download చేయదు (30 షాపుల పేజీ, search, "Count all shops" keys మాత్రమే చదువుతుంది). పెండింగ్ payments ఒక చిన్న queue నుండి వస్తాయి. Master catalog API index తో చదువుతుంది. పెద్ద షాపు (15,000 మందులు, ఒక సంవత్సరం బిల్లులు, 2.5 లక్షల catalog) తక్కువ ధర ఫోన్‌లో hang కాకుండా టెస్ట్ చేశాం (`tools/perf_big_test.py`).
1. **కొత్త Firebase rules తప్పనిసరి:** `database.rules.json` ని Firebase console → Realtime Database → Rules లో paste చేసి Publish చేయండి (indexes `at`, `nl`, `st` మరియు payment queue `ph/reqq` ఇందులో ఉన్నాయి). Index లేకపోతే admin పేజీలు నెమ్మదిగా వస్తాయి.
2. **Firebase plan:** Spark (free) plan లో ఒకేసారి 100 connections మాత్రమే. Blaze plan లో ఒక database కు 2,00,000 connections, సెకనుకు సుమారు 1,000 writes. Cloud వాడే షాపులు 50,000 దాటితే రెండో database (sharding) అవసరం; అది తర్వాతి దశ. ఫోన్‌లో మాత్రమే (local) వాడే షాపులకు server లోడ్ ఉండదు.
3. **Gemini ఖర్చు జాగ్రత్త:** అన్ని షాపులు మీ ఒక్క key వాడితే బిల్ మీకే వస్తుంది. Vercel లో `SCAN_LIMIT_DEVICE_DAY` (ఉదా: 30 — ఒక ఫోన్ రోజుకు) మరియు `SCAN_LIMIT_ALL_DAY` (అన్ని షాపులు కలిపి రోజుకు) పెట్టండి. ఇవి పని చేయాలంటే `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DB_URL` ఉండాలి. ఖర్చు తగ్గించాలంటే `GEMINI_MODEL` లో Flash-Lite model పెట్టి కొన్ని బిల్లులతో accuracy చూసుకోండి. కస్టమర్ ఫోటోలకు free tier కాకుండా paid tier వాడండి.
4. **Vercel:** అమ్మకానికి వాడే యాప్‌కు Pro plan అవసరం; functions తమంతట తామే scale అవుతాయి.
5. **Medicine catalog download:** ప్రతి కొత్త ఫోన్ `data/medicines.json` ని ఒక్కసారి తీసుకుంటుంది (compress అయ్యాక సుమారు 3–4 MB). 1 లక్ష ఫోన్లకు ఇది సుమారు 400 GB. Vercel Hobby plan లో నెలకు 100 GB మాత్రమే, కాబట్టి ఎక్కువ ఫోన్లు చేరే నెలల్లో Pro plan (1 TB) తీసుకోండి.

## తక్కువ ధర ఫోన్‌లో వేగం (14 Nov 2026)
- **Medicine catalog:** 2.5 లక్షల మందులను ఇప్పుడు "packed" గా ఉంచుతుంది. మెమరీ 78 MB నుంచి 32 MB కి తగ్గింది, మొదటి search సుమారు 3 రెట్లు వేగం (6x నెమ్మది CPU లో 1.7 s → 0.6 s). Search ఫలితాలు పాత దానితో సరిగ్గా ఒకటే (2.5 లక్షల catalog పై 191 పోలికలు). పాత ఫోన్లలో ఉన్న catalog మొదటి search లో ఒక్కసారి కొత్త రూపానికి మారుతుంది.
- **కొత్త ఫోన్‌లో catalog మొదటి download:** background worker లో జరుగుతుంది, స్క్రీన్ ఆగదు.
- **తెల్లని స్క్రీన్:** Google Fonts కోసం ఇక ఆగదు; యాప్ లోడ్ అవుతున్నప్పుడు spinner కనిపిస్తుంది.
- **నెమ్మది ఇంటర్నెట్:** install అయిన యాప్ కొత్త పేజీ కోసం 2 సెకన్లు మాత్రమే ఆగుతుంది, తర్వాత ఫోన్‌లో ఉన్న కాపీతో తెరుచుకుంటుంది (కొత్తది తర్వాతి సారికి సేవ్ అవుతుంది). సర్వర్ error ఇచ్చినా (ఉదా. `index (3).html` పేరుతో upload) ఫోన్‌లోని కాపీ తెరుచుకుంటుంది. ఈ మార్పు కోసం `sw.js` కూడా upload చేయాలి.
- **Catalog ఫైల్ రెండుసార్లు ఉండదు:** `data/medicines.json` ని offline cache లో పెట్టదు (యాప్ దగ్గర packed కాపీ ఉంటుంది), ఫోన్ storage ఆదా.
- **Registration check:** 3 గంటలకు ఒకసారి మాత్రమే, ఫోన్ ఖాళీగా ఉన్నప్పుడు, పని అయిన వెంటనే database connection మూసేస్తుంది. 1 లక్ష ఫోన్లు సెకనుకు సుమారు 10 చిన్న reads మాత్రమే.
- **💻 / Desktop site:** ఫోన్‌లో కంప్యూటర్ లేఅవుట్ ఆన్‌లో ఉంటే యాప్ వారానికి ఒకసారి చెబుతుంది (💻 కి ఒక్క నొక్కుతో ఫోన్ వ్యూ).
- టెస్ట్: `python3 tools/phone_speed_test.py --master data/medicines.json` (CPU 6x నెమ్మది + 1.6 Mbit/s లైన్ లో కొలుస్తుంది).

## Security — నిజాయితీగా
- API key, passwords ఏవీ యాప్ కోడ్‌లో లేవు. Gemini / Claude / OpenAI keys Vercel settings లో మాత్రమే ఉంటాయి; ఏ ఫోన్‌కీ రావు.
- కోడ్ minify చేశాం, చదవడం కష్టం. కానీ browser లో రన్ అయ్యే ఏ కోడ్ అయినా 100% దాచడం ఎవరికీ సాధ్యం కాదు — అందుకే రహస్యాలన్నీ server వైపే ఉంచాం.
- GitHub repo ని **Private** గా ఉంచండి. Source ఫైల్స్ (`tools/`, `i18n_src/`) ఎవరికీ ఇవ్వకండి.
- Google Cloud console లో ఆ API key కి quota / budget limit పెట్టండి — ఎవరైనా దుర్వినియోగం చేసినా బిల్లు పెరగదు.
- Bill reader ఒకే IP నుంచి 10 నిమిషాల్లో 40 కంటే ఎక్కువ requests ఒప్పుకోదు; వేరే సైట్‌ల నుంచి వచ్చే requests ని తిరస్కరిస్తుంది.
- షాప్ data (bills, stock, parties) ఆ ఫోన్/కంప్యూటర్ browser లోనే ఉంటుంది. **Google Drive ఆటో-బ్యాకప్ ఆన్ చేయండి** (పైన చూడండి); లేకపోతే వారానికి ఒకసారైనా **Settings → Download backup** చేయండి. Browser data clear చేస్తే ఫోన్‌లోని data పోతుంది — Drive లో ఉన్నది మిగులుతుంది.
- Vercel link లో ప్రతి device కి దాని data దానిదే. అన్ని counters మధ్య live sync కావాలంటే Claude లోని shared link వాడండి.

## GST filing
- యాప్ GSTR-1 JSON, GSTR-2B match, GSTR-3B worksheet, CSV ఫైల్స్ తయారు చేస్తుంది. **Check** లో errors 0 చేసుకున్నాకే JSON download చేయండి (errors ఉంటే యాప్ ముందే హెచ్చరిస్తుంది).
- gst.gov.in → Returns Dashboard → GSTR-1 → **Prepare Offline → Upload** → JSON ఫైల్ ఎంచుకోండి. తర్వాత GSTR-3B లో యాప్ worksheet తో సరిపోల్చండి.
- **Final submit gst.gov.in లో మీ సొంత login + OTP / EVC తో మీరే చేయాలి.** యాప్ ఎప్పుడూ GST portal password అడగదు.
- Portal కి నేరుగా API ద్వారా file చేయడం GSP (GST Suvidha Provider) license ఉన్నవారికే సాధ్యం — అది తర్వాతి upgrade.
- మొదటి ఒకటి రెండు నెలలు మీ CA తో ఒకసారి సరిచూడించుకోండి.

## అనువాదాలు
- 22 భాషలు యంత్ర సహాయంతో అనువదించాం. Santali, Manipuri, Bodo, Dogri, Kashmiri, Sindhi వంటి భాషల్లో ఆ భాష మాట్లాడే వారికి ఒకసారి చూపించండి.
- భాష ఎంపికలో **Improve this translation** తో ఏ మాటనైనా మార్చుకోవచ్చు; ఆ మార్పులను export చేసి `i18n_src/` లో కలిపితే అందరికీ వస్తాయి.

## 2026.11.19-2 — స్కానర్: రంగు బెడ్‌షీట్/కౌంటర్ మీద బిల్ (Telugu)
- పింక్/రంగుల బెడ్‌షీట్ మీద లేత ఆకుపచ్చ బిల్ ఉంటే, డిటెక్షన్ బిల్‌ని బెడ్‌షీట్‌తో కలిపేసి పెద్ద వంకర ఫ్రేమ్ చూపేది. ఇప్పుడు కెమెరా మధ్యలో ఉన్న పేపర్ రంగును గుర్తించి, ఆ రంగు కాని భాగాన్ని (బెడ్‌షీట్) వదిలేస్తుంది.
- మొత్తం ఫ్రేమ్‌నే "బిల్" అనుకునే సందర్భంలో ఫ్రేమ్ చూపదు (Manual గా తీసుకోవచ్చు).
- అప్‌లోడ్: index.html, sw.js, version.json (repo root).

## 2026.11.19-4 — స్కానర్: అంచులు కట్ కాకుండా, నీడలో కూడా (Telugu)
- బిల్ చుట్టూ ఆకుపచ్చ/రంగు మార్జిన్‌తో సహా మొత్తం పట్టుకుంటుంది.
- అన్ని వైపులా 3% అదనపు మార్జిన్ తీసుకుంటుంది, అంచు కట్ అవ్వదు.
- ఫోన్ నీడ పడిన మూలను కూడా కలుపుకుంటుంది.
- స్లో ఫోన్‌లో కెమెరా ఆగకుండా, లైవ్ చిత్రం తనంతట తానే చిన్నదవుతుంది.
- ఫోటో తీశాక "Whole photo" బటన్: కట్ లేకుండా మొత్తం ఫోటో తీసుకోవడానికి.
- అప్‌లోడ్: index.html, sw.js, version.json, DEPLOY.md (repo root).

## 2026.11.23-1 — స్కానర్ వేగం (Telugu)
- బిల్ ఒకసారి దొరికాక, తర్వాతి ఫ్రేమ్‌లలో పాత అంచుల దగ్గరే వెతుకుతుంది (~0.3 ms). ప్రతి 12వ ఫ్రేమ్‌లో పూర్తి తనిఖీ.
- ఆటో క్యాప్చర్ వేగం: స్థిరంగా ఉన్నాక ~0.55 సెకన్లలో తీసుకుంటుంది (ముందు ~0.85 సె).
- అప్‌లోడ్: index.html, sw.js, version.json, DEPLOY.md

## 2026.11.23-2 — స్కానర్ అడ్వాన్స్‌డ్ టూల్స్ (Telugu)
- **Web Worker:** బిల్ వెతికే పని ఇప్పుడు వేరే థ్రెడ్‌లో జరుగుతుంది. స్క్రీన్, బటన్లు ఎప్పుడూ ఆగవు.
- **ప్రతి కెమెరా ఫ్రేమ్:** requestVideoFrameCallback తో ప్రతి కొత్త చిత్రాన్ని ఒక్కసారే చూస్తుంది (సెకనుకు ~25–30 సార్లు).
- **ఫోన్‌కు తగ్గ పద్ధతి:** ImageBitmap (GPU) లేదా పిక్సెల్స్ — మొదటి 28 ఫ్రేమ్‌లు కొలిచి ఆ ఫోన్‌లో వేగంగా ఉన్నదాన్ని ఎంచుకుంటుంది.
- **షార్ప్‌నెస్ గేట్:** ఫోకస్ పూర్తయ్యే వరకు ("Focusing…") ఆగి, అక్షరాలు స్పష్టంగా ఉన్నప్పుడే ఫోటో తీస్తుంది.
- **గ్లేర్ హెచ్చరిక:** ట్యూబ్‌లైట్ వెలుగు బిల్‌పై మెరిస్తే "ఫోన్ కొంచెం వంచండి" అని చెబుతుంది.
- **చీకటి హెచ్చరిక:** చాలా చీకటిగా ఉంటే ⚡ లైట్ వేయమని చెబుతుంది.
- **ట్యాప్-టు-ఫోకస్:** కెమెరా చిత్రంపై ఎక్కడ నొక్కితే అక్కడ ఫోకస్ (ఫోన్ అనుమతిస్తే).
- **స్పీడ్ చూపు:** స్కానర్ పైన "Scan supplier bill" టైటిల్ నొక్కితే ms లో వేగం కనిపిస్తుంది; మళ్ళీ నొక్కితే దాగుతుంది.
- ఫోటో తీశాక బిల్ సరిచేయడం (straighten) కూడా వేరే థ్రెడ్‌లో.
- Worker పని చేయని పాత బ్రౌజర్‌లో పాత పద్ధతిలోనే పని చేస్తుంది.
- అప్‌లోడ్: index.html, sw.js, version.json, DEPLOY.md (repo root) + i18n/ 22 ఫైళ్లు.

## 2026.11.23-3 — లేబుల్స్, వేగమైన బిల్ రీడింగ్, ఒక్క టచ్ రీస్టోర్, PIN లాగిన్ (Telugu)
- **లేబుల్స్:** "Print on" లో రెండు ఆప్షన్లు:
  - **Label printer · one after another:** ప్రతి పేజీ సరిగ్గా లేబుల్ సైజ్. ఫోన్‌లో **PDF** బటన్ నొక్కి, లేబుల్ ప్రింటర్ యాప్‌లో తెరిస్తే లేబుల్స్ వరుసగా వస్తాయి.
  - **A4 sheet · side by side:** ఒక A4 షీట్‌లో పట్టినన్ని లేబుల్స్ పక్కపక్కన.
  - ముందు Android "Save as PDF / Letter" ప్రతి లేబుల్‌కు ఒక పూర్తి పేజీ ఇచ్చేది. అదే 21 పేజీల సమస్య.
- **బిల్ రీడింగ్ వేగం:**
  - ఫోటో చిన్న WebP గా పంపుతుంది.
  - జవాబు చిన్న రూపంలో (ప్రతి లైన్ ఒక array) వస్తుంది.
  - AI ఆలోచించే సమయం తక్కువ (minimal).
  - 5 సెకన్లలో రాకపోతే రెండో రీడర్ కూడా మొదలవుతుంది.
  - స్క్రీన్‌పై AI పేరు చూపదు. సెకన్లు (0.1 s) మాత్రమే చూపుతుంది.
  - ఐచ్ఛికం (Vercel env):
    - `SCAN_THINKING` = `low`: accuracy కొంచెం ఎక్కువ, వేగం కొంచెం తక్కువ.
    - `SCAN_START` = `2`: ప్రతి బిల్‌కు మొదటి నుంచే రెండు రీడర్లు. వేగం పెరుగుతుంది, కానీ AI ఖర్చు దాదాపు రెండింతలు.
- **Google Drive రీస్టోర్:**
  - **Restore everything** ఒక్క బటన్. అన్ని ఫోన్ల తాజా బ్యాకప్‌లు ఒకే షాప్‌గా కలిసి వస్తాయి, పాత నెలలు కూడా.
  - తేదీ నొక్కితే ఆ రోజు చివరికి ఉన్నట్టుగా మొత్తం షాప్ వస్తుంది.
  - ఒక్క ఫోన్ కాపీ మాత్రమే కావాలంటే కింద దాచిన "One phone’s copy only" లో ఉంది.
- **PIN లాగిన్ (OTP లేకుండా):**
  - యాప్ మళ్ళీ ఇన్‌స్టాల్ చేసినా, వేరే ఫోన్ అయినా "Already registered? Log in with mobile number + PIN" నొక్కి నంబర్ + PIN తో లాగిన్ అవ్వొచ్చు. SMS ఖర్చు లేదు.
  - కొత్త ఫైల్: `api/owner-pin.js`. ఇప్పటికే ఉన్న `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DB_URL` నే వాడుతుంది. కొత్త key అవసరం లేదు.
  - ఐచ్ఛికం: `PIN_PEPPER` (30+ అక్షరాల random text). ఒకసారి పెట్టాక మార్చకండి. మారిస్తే అందరి PIN లు మళ్ళీ సెట్ చేయాలి.
  - PIN server లో salt + PBKDF2 (150,000 rounds) hash గా మాత్రమే ఉంటుంది (`ph/osec`). ఇప్పటి rules ప్రకారం ఏ browser కూ అక్కడ access లేదు. Rules మార్పు అవసరం లేదు.
  - 5 తప్పు PIN లకు 15 నిమిషాల lock. మళ్ళీ తప్పితే lock సమయం రెట్టింపు అవుతుంది.
  - Central admin నంబర్ (`admins/<uid>` లో ఉన్న account) కు PIN లాగిన్ ఉండదు. అది ఎప్పుడూ OTP తోనే (భద్రత కోసం).
  - షాప్‌లో Owner PIN సెట్ చేసి ఉండాలి (Settings → Rules → "Set owner PIN"). PIN లేకపోతే PIN లాగిన్ కుదరదు.
  - ఇప్పటికే ఉన్న షాపులు: కొత్త వెర్షన్‌లో ఒక్కసారి PIN తో యాప్ unlock చేస్తే (లేదా PIN మార్చితే) ఆ PIN server కు వెళ్తుంది. ఆ తర్వాతే వేరే ఫోన్‌లో PIN లాగిన్ పనిచేస్తుంది.
- **Settings:** Settings తెరిచిన ప్రతిసారీ అన్ని కార్డులు మూసి ఉంటాయి.
- **అప్‌లోడ్ (GitHub):**
  - repo root: index.html, sw.js, version.json, DEPLOY.md
  - `i18n/` ఫోల్డర్: 22 ఫైళ్లు
  - `api/` ఫోల్డర్: scan-invoice.js, owner-pin.js (కొత్తది)

## 2026.11.23-4 — Google సైన్-ఇన్ (Cloud shop, Team & logins, Central admin) సరిచేయడం (Telugu)
**సమస్య:** "Sign in with Google" నొక్కితే `Error 400: redirect_uri_mismatch` (`https://pharmacy-suite-pos.firebaseapp.com/__/auth/handler`). ఇది Google Cloud లోని OAuth client సెట్టింగ్. యాప్ కోడ్ బగ్ కాదు. Cloud shop లోకి వెళ్ళకపోతే "Add staff" రాదు. అందుకే staff QR కనిపించలేదు.

**యాప్‌లో మార్చినవి:**
- Google సైన్-ఇన్ పేజీలు ఇప్పుడు మన వెబ్‌సైట్ అడ్రస్ నుంచే వస్తాయి: `vercel.json` లో `/__/auth/` → Firebase forwarding. Installed app లో popup బదులు పేజీయే Google కి వెళ్ళి తిరిగి వస్తుంది. Chrome third-party storage block సమస్య కూడా రాదు.
- Popup మూసేస్తే యాప్ పేజీ వదిలి వెళ్ళదు. "Google sign-in did not finish" అని స్పష్టంగా చెబుతుంది.
- Google నుంచి తిరిగి వచ్చాక "Put … in the cloud?" వెంటనే అడుగుతుంది.
- Team & logins పేజీలో ఓనర్ ఫోన్‌లో "Staff: join your shop" మడిచి ఉంటుంది (ఓనర్ పొరపాటున అక్కడ scan చేయకుండా).

**Google Cloud లో ఒక్కసారి చేయాల్సింది (5 నిమిషాలు):**
1. Firebase console → Authentication → Sign-in method → Google (pencil) → "Web SDK configuration" → **Web client ID** చూడండి. ఏమీ మార్చకండి.
2. Google Cloud console (project `pharmacy-suite-pos`) → APIs & Services → Credentials → OAuth 2.0 Client IDs లో **అదే Client ID** ఉన్న client తెరవండి (సాధారణంగా "Web client (auto created by Google Service)").
3. **Authorized redirect URIs** లో ఈ రెండూ ఉండాలి. లేనివి "ADD URI" తో చేర్చండి. ఉన్నవి ఏవీ delete చేయకండి:
   - `https://medical-pos-suite.vercel.app/__/auth/handler`
   - `https://pharmacy-suite-pos.firebaseapp.com/__/auth/handler`
4. **Authorized JavaScript origins** లో `https://medical-pos-suite.vercel.app` లేకపోతే చేర్చండి. **SAVE**.
5. Firebase → Authentication → Settings → Authorized domains లో `medical-pos-suite.vercel.app` ఉందో చూడండి (OTP పనిచేస్తోంది కాబట్టి ఉండే ఉంటుంది).
6. Google మార్పు అమలు కావడానికి 5 నిమిషాల నుంచి కొన్ని గంటలు పట్టొచ్చు.

**Staff QR (ఓనర్ ఫోన్):** Settings → Cloud shop & staff logins → **Sign in with Google** → **Copy to cloud** → Team & logins → **Add staff** (పేరు, మొబైల్, role, 4–6 అంకెల PIN) → QR వస్తుంది. Staff తమ ఫోన్ కెమెరాతో QR scan చేసి PIN వేస్తారు.

**Staff slot:** staff లాగిన్‌కు paid slot లేదా free trial కావాలి. లేకపోతే "Your staff slot is not paid" వస్తుంది.
- Central admin → Staff slot price → **Free trial days for a new staff login** (ఉదా: 7) → Save.
- Central admin బటన్ రావాలంటే మీ Google account UID ని Realtime Database → Data లో `admins/<UID>` = `true` గా పెట్టాలి. UID: Firebase → Authentication → Users.

**అప్‌లోడ్ (GitHub):**
- repo root: index.html, sw.js, version.json, DEPLOY.md, **vercel.json** (ఈసారి తప్పనిసరి)
- `i18n/` ఫోల్డర్: 22 ఫైళ్లు

## 2026.11.23-5 — Drive: ఒక్కసారి అనుమతి, ఫోన్‌లో ఉంచే కాలం, తేదీలతో restore, ఫోన్ల ఎంపిక, GST ఆలస్య ఫీజు (Telugu)

**1. Drive అనుమతి — ఒక్కసారి, తర్వాత అంతా ఆటోమేటిక్**
- Registration పూర్తయ్యాక (Cloud shop లో Google sign-in + **Copy to cloud** తర్వాత) వెంటనే "Connect Google Drive" ప్రశ్న వస్తుంది. ఒక్కసారి Allow చేస్తే ఆ తర్వాత ప్రతి మార్పు కొన్ని సెకన్లలో Drive కి వెళ్తుంది.
- Drive అనుమతిని Firebase Google sign-in తో కలపడానికి Google ఒప్పుకోదు. అందుకే ఇది చిన్న రెండో స్టెప్ (ఒక్కసారి మాత్రమే).
- Cloud shop ఓనర్‌కు కూడా వస్తుంది (మీ సొంత Drive లో రెండో కాపీ). Staff ఫోన్లకు రాదు.
- Cloud shop లో Drive కాపీ ఆ ఫోన్‌లో లోడ్ అయిన నెలల వరకే. పూర్తి డేటా cloud లో ఉంటుంది.

**2. Keep on this phone (Settings → Data → Google Drive backup)**
- ఎంపికలు: **3 / 6 / 12 months / Everything**. ముందే 12 months.
- ఆ కాలం కంటే పాత నెలలు Drive లోనే ఉంటాయి. ఫోన్ నుంచి తీసేముందు యాప్ Drive లోని ఆ నెల ఫైల్‌ను తిరిగి చదివి, ప్రతి record ఫోన్‌లో ఉన్నట్టే ఉందని పోలుస్తుంది. తేడా ఉంటే ముందు Drive కాపీ సరిచేసి, తర్వాతే తీస్తుంది.
- Reports / GST / ITR లో పాత నెల ఎంచుకుంటే Drive నుంచి తెరుచుకుంటుంది. తెరిచిన నెల 3 రోజులు ఫోన్‌లో ఉంటుంది.
- **Everything** ఎంచుకుంటే ఏదీ తీయదు.
- ఎందుకు: Local shop లో అన్ని నెలలూ ఫోన్ memory లోకి లోడ్ అవుతాయి. సంవత్సరాలు గడిచాక పాత ఫోన్లు నెమ్మదించకుండా ఇది ఆపుతుంది. ఫోన్‌లో "10,240 MB" అంటే ఖాళీ స్థలం. అసలు పరిమితి RAM మరియు వేగం.
- **Download backup** ఫైల్‌లో ఫోన్‌లో ఉన్న నెలలే ఉంటాయి. పూర్తి కాపీ Drive లో ఉంటుంది.
- Cloud shop లో అన్ని నెలలూ cloud లోనే ఉంటాయి. ఈ ఎంపిక అక్కడ కనిపించదు.

**3. Restore తేదీలతో**
- Settings → Data → Google Drive backup → **Restore from Drive** → **Only some dates**: From – To (ఒకసారికి గరిష్ఠం 1 సంవత్సరం) → **Bring back these dates**.
- ఆ రోజుల bills, purchases, payments Reports / GST కోసం తిరిగి వస్తాయి. ఫోన్‌లో ఇప్పటికే ఉన్నవి అలాగే ఉంటాయి. Stock, dues మారవు.
- ఆ నెల "కొంత భాగమే ఉంది" అని లెక్క. Reports / GST లో ఆ నెల "not loaded" చూపిస్తుంది. load నొక్కితే మిగతా రోజులు Drive నుంచి వస్తాయి. ఆలోపు మీరు చేసిన మార్పులు అలాగే ఉంటాయి.
- **Restore everything** ఇప్పుడు "ఉంచే కాలం" (12 నెలలు) లోని నెలలనే తెస్తుంది. పాతవి Drive లో ఉండి, ఎంచుకున్నప్పుడు తెరుచుకుంటాయి.

**4. ఫోన్ల జాబితా ("9 phones" ఎందుకు వచ్చింది)**
- Drive లో ప్రతి ఇన్‌స్టాల్ (యాప్ మళ్ళీ ఇన్‌స్టాల్, Chrome data clear, కొత్త ఫోన్) ఒక "phone" గా లెక్క. టెస్టింగ్‌లో చాలాసార్లు ఇన్‌స్టాల్ చేయడం వల్ల 9 అయ్యాయి.
- Restore sheet లో **Phones in this backup**: ప్రతి దానికీ టిక్ బాక్స్, పేరు, చివరి save తేదీ, size, పాత నెలల సంఖ్య.
  - టిక్ తీసినవి **Restore everything** లో కలవవు.
  - **Only this one** = ఆ ఫోన్ కాపీ మాత్రమే.
  - **Remove** = ఆ ఇన్‌స్టాల్ ఫైళ్లను Drive నుంచి శాశ్వతంగా తొలగిస్తుంది (PIN ఉంటే PIN, తర్వాత నిర్ధారణ అడుగుతుంది).
- ఇప్పుడు వాడుతున్న ఫోన్‌ను, లేదా ఈ ఫోన్ restore అయిన ఫోన్‌ను Remove చేయలేరు.
- ఇంకా వాడుతున్న ఫోన్‌ను Remove చేయకండి. పాత టెస్ట్ ఇన్‌స్టాల్స్‌ను మాత్రమే చేయండి.

**5. GST**
- GSTIN నమోదు చేయకపోతే late fee, interest, "days late" చూపదు. బదులు "GSTIN not set" మరియు కారణం చూపుతుంది (Settings → Shop లో GSTIN వేయండి).
- GST checks లో కొత్త హెచ్చరిక: ఈ period sales సంవత్సరానికి ₹5 కోట్లు దాటి, Settings → GST filing లో "Turnover last year (AATO)" తక్కువగా ఉంటే. మీ షాప్‌కు **Above ₹5 crore** ఎంచుకోండి. Late fee గరిష్ఠం, 6-అంకెల HSN, e-invoice దీనిపై ఆధారపడతాయి.
- Late fee నియమం (పరీక్షించాను): ₹50 రోజుకు (nil return ₹20 రోజుకు, గరిష్ఠం ₹500). గరిష్ఠ పరిమితి గత సంవత్సరం turnover బట్టి: ₹1.5 కోట్ల వరకు ₹2,000; ₹1.5–5 కోట్లు ₹5,000; ₹5 కోట్ల పైన ₹10,000. CGST + SGST కలిపి.

**6. అనువాదాలు**
- 22 భాషలలో 18 లో కొత్త 40 వాక్యాలు అనువదించాను. ks, brx, mni, sat లో ఇంకా ఇంగ్లిష్ కనిపిస్తుంది (తప్పు అనువాదం కంటే ఇంగ్లిష్ మేలు). వాటికి నిపుణుల అనువాదం కావాలి.

**7. నిజాయితీగా**
- నా పరీక్షలు నకిలీ Google Drive, నకిలీ Firebase తో జరిగాయి. నిజమైన Google, Vercel లో మొదటిసారి మీ ఫోన్‌లోనే పని చేస్తుందో చూడాలి.
- మొదట ఒక్క ఫోన్‌లో ప్రయత్నించండి: Settings → Data → Google Drive backup లో Keep on this phone ను **12 months** గా ఉంచి, **Back up now** నొక్కండి. తర్వాత Restore sheet లో ఫోన్ల జాబితా చూడండి.
- బ్రౌజర్ కోడ్ పూర్తిగా దాచడం ఎవరికీ సాధ్యం కాదు. కోడ్ minify చేసి ఉంటుంది. రహస్య keys (Gemini, Google client secret) కోడ్‌లో లేవు, Vercel లో మాత్రమే.

**అప్‌లోడ్ (GitHub):**
- repo root: index.html, sw.js, version.json, DEPLOY.md
- `i18n/` ఫోల్డర్: 22 ఫైళ్లు
- `api/` మరియు `vercel.json` మారలేదు, ముట్టుకోకండి.

## 2026.11.23-6 — వేగం: login, Google sign-in, app తెరవడం (Telugu)

**0. ముందు నిజాయితీగా:** "0.05 మిల్లీసెకన్" సాధ్యం కాదు. ఫోన్ నుంచి Vercel కి, Vercel నుంచి Firebase కి ప్రతి ప్రయాణానికి భౌతికంగానే 50–300 మిల్లీసెకన్లు పడుతుంది. ఇంటర్నెట్ లేని పనులు (బిల్ చేయడం, స్టాక్ చూడటం) ఇప్పటికే ఫోన్‌లోనే జరుగుతాయి. నేను చేసింది: (a) ఇంటర్నెట్ అవసరమైన చోట వేచి ఉండే వరుసలను తగ్గించడం, (b) మీరు నంబర్/PIN టైప్ చేస్తున్న సమయంలోనే వెనుక పనులు చేసి పెట్టడం, (c) లైన్ నెమ్మదిగా ఉంటే app ఆగి చూడకుండా వెంటనే తెరవడం.

**1. స్క్రీన్‌షాట్లలో కనిపించిన అసలు సమస్య (Settings లో "FIREBASE_DB_URL is missing in Vercel settings")**
- Vercel లో `FIREBASE_DB_URL` లేకపోవడం వల్ల Online orders, PIN login, staff login, Medicine master పని చేయలేదు.
- ఇప్పుడు ఆ setting లేకపోయినా server, మీ website లోని `firebase-config.json` నుంచి database చిరునామా తీసుకుంటుంది (అది మీ Firebase project కే చెందినదైతేనే; వేరే చిరునామా అయితే నమ్మదు). కాబట్టి upload చేయగానే ఇవి పని చేస్తాయి.
- అయినా Vercel → Settings → Environment Variables లో `FIREBASE_DB_URL` (Firebase console → Realtime Database పైన కనిపించే చిరునామా, `https://….firebaseio.com` లేదా `….firebasedatabase.app`) జోడించి Redeploy చేయడం మంచిది: ఒక చిన్న అడుగు తగ్గుతుంది.

**2. కొలిచిన తేడాలు (నకిలీ నెమ్మది లైన్ తో; నిజమైన Vercel/Firebase లో కాదు)**
| | ముందు (-5) | ఇప్పుడు (-6) |
|---|---|---|
| App తెరవడం, website 1 సెకను ఆలస్యంగా ఇస్తే | 1.4 సె | 0.35 సె |
| App తెరవడం, website 3 సెకన్లు ఆలస్యంగా ఇస్తే | 2.1–2.4 సె | 0.35 సె |
| Firebase login service డౌన్‌లోడ్ (3 ఫైళ్లు, ఒక్కొక్కటి 0.5 సె) | 1.5 సె | 0.5 సె |
| Cloud owner start (రెండు 0.4 సె reads + 0.9 సె షాప్ పేరు) | 1.7 సె | 0.4 సె |
| Staff PIN login, ప్రతి database call 250 ms అనుకుంటే (cold / warm) | 1277 / 1025 ms | 1027 / 774 ms |
| Owner PIN login (cold / warm) | 1026 / 773 ms | 1009 / 753 ms |
- వేగవంతమైన లైన్ లో app తెరవడం రెండింటికీ ఒకటే (సుమారు 0.35 సెకన్లు, ఖాళీ షాప్ తో). తేడా నెమ్మది లైన్ లో కనిపిస్తుంది.

**3. ఏం మార్చాను**
- **App తెరవడం:** ఇంతవరకు నెమ్మది లైన్ లో ఫోన్‌లో ఉన్న copy చూపడానికి ముందు 2 సెకన్లు వేచి ఉండేది. ఇప్పుడు saved copy వెంటనే తెరుచుకుంటుంది; కొత్త version వెనుక నేపథ్యంలో దిగుతుంది, వచ్చినప్పుడు "A new version of the app is ready · Reload" అని చెబుతుంది. (కొత్త version మొదటి సారి తెరిచినప్పుడు కాకుండా కొన్ని సెకన్ల తర్వాత నోటీసుగా వస్తుంది.)
- **Login screen (mobile + PIN):** screen తెరిచిన వెంటనే (మీరు టైప్ చేస్తుండగానే) Firebase login service లోడ్ అవుతుంది, `api/owner-pin` ని "మేల్కొలుపు" (ping) పంపుతారు. Log in నొక్కాక PIN తనిఖీ, login service రెండూ ఒకేసారి జరుగుతాయి. connection తెగిపోతే లేదా gateway error (502/504) వస్తే ఒక్కసారి మళ్ళీ ప్రయత్నిస్తుంది (తప్పు PIN ని ఎప్పుడూ రెండుసార్లు పంపదు). 4 సెకన్లు దాటితే "Slow connection. Still logging in…" అని చూపుతుంది.
- **Firebase scripts:** 3 ఫైళ్లు ఒకదాని తర్వాత ఒకటి కాకుండా ఒకేసారి దిగుతాయి (క్రమంలోనే నడుస్తాయి). Google sign-in చిరునామా తనిఖీ కూడా అదే సమయంలో జరుగుతుంది.
- **Google sign-in "blank page" కు ఒక కారణం:** ఇంతవరకు తనిఖీ 3 సెకన్లలో రాకపోతే "ఈ website కు forwarding లేదు" అని 6 గంటలు గుర్తుంచుకునేది; అప్పుడు Google sign-in `…firebaseapp.com/__/auth/handler` ఖాళీ పేజీకి వెళ్ళేది (మీ స్క్రీన్‌షాట్లలో ఉన్నట్లు). ఇప్పుడు: 6 సెకన్లు వేచి చూస్తుంది; నెమ్మదిగా వస్తే గుర్తుంచుకోదు (మళ్ళీ అడుగుతుంది); నిజంగా "లేదు" అని వస్తే 10 నిమిషాలే గుర్తుంచుకుంటుంది; "ఉంది" అయితే 7 రోజులు.
- **Cloud owner start:** "admin ఆ?" మరియు "ఏ షాప్?" ఒకేసారి అడుగుతుంది; షాప్ పేరు కోసం వేచి ఉండదు.
- **Server (api):** Google access token ఒక్కసారే తీసుకుంటుంది (ఒకేసారి 12 reads మొదలైనా ఒక్క request). Staff login లో database ప్రయాణాలు 4 నుంచి 3 కి. PIN hash ను server ఆగకుండా లెక్కిస్తుంది (ఈలోగా database చదువుతుంది). Staff login కు కూడా ping.

**4. మీరు చేయాల్సినవి (ఇవి నేను చేయలేను)**
- **Vercel function region:** Vercel → Project → Settings → Functions → Function Region. మీ Realtime Database చిరునామాలో `asia-southeast1` ఉంటే Singapore (sin1) ఎంచుకోండి. చిరునామా `….firebaseio.com` (US) అయితే default అలాగే ఉంచండి. (database తో server దగ్గరగా ఉంటే ప్రతి login లో 3–4 ప్రయాణాలు వేగంగా అవుతాయి.)
- **Google sign-in forwarding తనిఖీ:** Chrome లో `https://medical-pos-suite.vercel.app/__/auth/handler` తెరవండి. Firebase పేజీ (ఖాళీగా ఉండవచ్చు, కానీ "404" కాదు) వస్తే సరి. 404 వస్తే `vercel.json` ఇంకా upload కాలేదు (ఈసారి అది మారలేదు; ముందు ఇచ్చినదే వాడండి).
- **PIN login పని చేయాలంటే** ఆ నంబర్ PIN server కి చేరి ఉండాలి. అది గతంలో server లేనప్పుడు పంపలేకపోయి ఉండవచ్చు: Settings లో PIN ని ఒకసారి మళ్ళీ save చేయండి (పాత PIN నే మళ్ళీ ఇవ్వవచ్చు), లేదా OTP తో ఒకసారి login అవ్వండి.
- ఇంకా నెమ్మదిగా ఉంటే: ఏ screen లో, ఎన్ని సెకన్లు, wifi లేదా mobile data — చెప్పండి. Login screen లో "OTP problem? Check the connection" నొక్కితే ప్రతి భాగం ఎన్ని ms పడుతోందో చూపే జాబితా వస్తుంది; దాని screenshot పంపండి.

**5. ఇంకా మిగిలిన నెమ్మదితనం (నిజం)**
- పేజీ స్క్రిప్ట్ చాలా పెద్దది (సుమారు 0.9 MB). నెమ్మదైన ఫోన్లో తెరవడానికి సగానికి పైగా సమయం దాన్ని "చదవడానికే" పోతుంది (నా కొలతలో CPU 4 రెట్లు నెమ్మది చేసినప్పుడు 640 ms లో సుమారు 340 ms). దీన్ని తగ్గించాలంటే app ను పలు ఫైళ్లుగా విడగొట్టాలి; అది పెద్ద మార్పు కాబట్టి మీరు చెబితేనే చేస్తాను.
- Google Drive అనుమతి తెర (accounts.google.com) వేగం Google చేతిలో ఉంది.

**6. అనువాదాలు:** 1 కొత్త వాక్యం ("Slow connection. Still logging in…") 18 భాషలలో. ks, brx, mni, sat లో ఇంగ్లిష్.

**7. పరీక్షలు:** కొత్త: `speed_test.py` (scripts సమాంతరం, sign-in చిరునామా నియమాలు, owner start, login warm-up/retry/హింట్, నెమ్మది లైన్ లో తెరవడం), `stafflogin_test.js`, `apis_test.js`; `ownerpin_test.js` విస్తరణ (database చిరునామా fallback, ping, వేగం). నకిలీ Google/Firebase తో; నిజమైన దానిలో మొదటిసారి మీ ఫోన్‌లోనే.

**అప్‌లోడ్ (GitHub):**
- repo root: index.html, sw.js, version.json, DEPLOY.md
- `i18n/` ఫోల్డర్: 18 ఫైళ్లు (as, bn, doi, gu, hi, kn, kok, mai, ml, mr, ne, or, pa, sa, sd, ta, te, ur). మిగిలిన 4 మారలేదు.
- `api/` ఫోల్డర్: `owner-pin.js`, `staff-login.js`, `order.js`, `master.js` (4 ఫైళ్లు; `google.js`, `manifest.js`, `scan-invoice.js` మారలేదు).
- `vercel.json` మారలేదు.

## 2026.11.23-7 / -8 — Desktop view లో scanner సగమే కనిపించడం; cloud shop "not answering" (Telugu)

**Scanner (-8):** మీ phone లో 💻 Desktop view on లో ఉంది, page zoom చేసి ఉంది. Desktop view లో app 1280 px వెడల్పుగా వేస్తుంది, అందుకే bill camera తెర కూడా 1280 px వెడల్పుగా వచ్చింది. మీకు దాని పై-ఎడమ భాగం మాత్రమే కనిపించింది: shutter button, Auto/Manual, తీసిన pages strip అన్నీ screen కింద, కనపడని భాగంలో ఉన్నాయి. మీరు camera చిత్రంలో ఒక మూల మాత్రమే చూస్తున్నారు కాబట్టి "Fit the whole bill in view" అని చూపింది.
- ఇప్పుడు: Desktop view on లో ఉన్నా, zoom చేసి ఉన్నా, camera తెర ఎప్పుడూ phone size లో, zoom లేకుండా వస్తుంది. Close చేశాక Desktop view తిరిగి వస్తుంది (login screen లాగే).
- పరీక్ష: `deskscan_test.py` (Desktop view 0.33 / 0.6 / 1.5 zoom, phone view pinch zoom, 130% అక్షరాలు). పాత version లో ఈ test fail అయింది, కొత్తదిలో pass.
- phone లో app ను phone view లోనే వాడండి (Desktop view లో app నెమ్మది, అక్షరాలు చిన్నవి). పైన ఉన్న 💻 button తో మార్చవచ్చు.

**Cloud shop not answering (-7):** cloud shop తెరిచేటప్పుడు ఏ దశలో ఆగుతోందో ఇప్పుడు చెబుతుంది. Login service download 25 సెకన్లు, sign-in check 15 సెకన్లు, shop lookup (database) 20 సెకన్లు దాటితే వేచి ఉండదు: "The cloud shop needs the internet" screen లో ఆ దశ పేరు, "Try again", "Use this phone’s own data" వస్తాయి. నోటీసులో కూడా [ ] లో దశ పేరు ఉంటుంది.

**Upload (GitHub, root):** index.html, sw.js, version.json (DEPLOY.md ఐచ్ఛికం). `api/`, `i18n/`, `vercel.json` మారలేదు.

## 2026.11.23-9 — Cloud shop / Staff login: database స్పందించకపోవడం (Telugu)

**మీ screenshot:** "shop lookup (database) did not answer". Google sign-in పని చేస్తోంది (Google ఖాతా ఎంపిక తెర వచ్చింది), కానీ Firebase Realtime Database నుంచి సమాధానం రావడం లేదు. Staff login కి ముందు owner phone లో shop cloud లోకి వెళ్ళాలి, అది కూడా ఇదే database మీద ఆధారపడుతుంది. అందుకే Team పేజీలో మళ్ళీ "Sign in with Google" కనిపించింది, ఏ సందేశమూ లేకుండా.

**app లో దొరికిన ఒక లోపం (సరిచేశాను):** Firebase database కి "live connection" (websocket) తెరుచుకోకపోతే, Firebase రెండో మార్గం (long-polling) వాడుతుంది. ఆ మార్గం database చిరునామా నుంచి scripts లోడ్ చేస్తుంది. మా security నియమాలు (Content-Security-Policy) వాటిని అడ్డుకున్నాయి, అందుకే reads శాశ్వతంగా ఆగిపోయాయి. ఇప్పుడు `*.firebasedatabase.app`, `*.firebaseio.com` నుంచి మాత్రమే అనుమతి (Firebase సూచించినదే). వేరే ఏ website scripts కూడా ఇంకా అడ్డుకోబడతాయి (test చేశాను).

**ఇప్పుడు కారణం screen మీదే:** database ఆగితే app ఒకసారి HTTPS ద్వారా అడిగి, కారణం చెబుతుంది:
- "There is no Realtime Database at …" → ఆ చిరునామాలో database లేదు: Firebase console → Realtime Database లో సృష్టించండి (location: Singapore asia-southeast1), లేదా సరైన చిరునామా firebase-config.json లో పెట్టండి
- "switched off" → console లో database ఆఫ్ అయి ఉంది
- "does not reach the cloud database" → ఈ network/SIM database ని చేరనివ్వడం లేదు: Wi-Fi లేదా వేరే SIM
- "rules do not let this account in" → Firebase console → Realtime Database → Rules లో app rules publish చేయండి
- "answers over the internet, but its live connection does not open" → network websocket ని అడ్డుకుంటోంది. ఈ version లో long-polling అనుమతి ఉంది కాబట్టి నెమ్మదిగా అయినా పని చేయాలి; లేకపోతే Wi-Fi లేదా వేరే SIM
- Team పేజీ "Sign in with Google": 25 సెకన్లలో database స్పందించకపోతే button కింద ఇదే కారణం వస్తుంది, button మళ్ళీ పని చేస్తుంది (ఇంతకు ముందు ఏమీ చెప్పకుండా ఆగిపోయేది).

**పరీక్షలు:** కొత్త `cloudwhy_test.py`: long-polling scripts (పాత version లో block అయ్యాయి, కొత్తదిలో లోడ్ అవుతాయి), ఇతర websites scripts ఇంకా block, 6 కారణాలు, start lock screen, Team పేజీ. నిజమైన Firebase SDK, నిజమైన database ఇక్కడి నుంచి చేరలేను కాబట్టి అవి నకిలీలతో; నిజమైనది మీ phone లోనే తెలుస్తుంది.

**అనువాదాలు:** 5 కొత్త వాక్యాలు 18 భాషలలో.

**Upload (GitHub):**
- root: index.html, sw.js, version.json (DEPLOY.md ఐచ్ఛికం)
- `i18n/` ఫోల్డర్: as, bn, doi, gu, hi, kn, kok, mai, ml, mr, ne, or, pa, sa, sd, ta, te, ur (18 ఫైళ్లు)
- `api/`, `vercel.json` మారలేదు

## 2026.11.23-10 — Bill scan వేగం/నమ్మకం, prescription AI, staff login సులభం (Telugu)

**1. Bill scan ఎందుకు "పని చేయలేదు" (మీ Bill reader check screenshot):** మన app నెమ్మది కాదు. Google Gemini అన్ని models "This model is currently experiencing high demand" (503) అని తిరస్కరించాయి. Gemini 2.5 Flash కొత్త users కి మూసేశారు. Free tier key కి రద్దీ సమయంలో Google ముందు paid users కే ఇస్తుంది.
- **ఇప్పుడు:** 7 Gemini models వరుస (3.8 Flash, 3.7 Flash, 3.5 Flash-Lite, 3.6 Flash, 3.5 Flash, 3.1 Flash-Lite, Flash latest). ప్రతి దానికి వేరే capacity ఉంది. 2.5 Flash తీసేశాను.
- అన్నీ "busy" అంటే server 1.5 సెకన్లు ఆగి మరో round ప్రయత్నిస్తుంది (రద్దీ తరచు సెకన్లలో తగ్గుతుంది).
- ఒక model తిరస్కరించిన "thinking level" ను server గుర్తుంచుకుంటుంది. ఇంతకు ముందు ప్రతి bill కి ఒక వృథా request పోయేది.
- **మీరు చేయాల్సింది (అసలు పరిష్కారం):** Google AI Studio లో మీ Gemini key project కి Billing ఆన్ చేయండి (paid tier). రద్దీలో paid requests కి ప్రాధాన్యం ఉంటుంది. 3.8 Flash ధర (సంవత్సరాంతం వరకు) 10 లక్షల input tokens కి $0.75, output కి $3.75. ఒక bill కి సుమారు ₹1 లోపు. ఇంకా భద్రత కోసం Vercel లో `ANTHROPIC_API_KEY` (backup reader) వేయవచ్చు: Gemini మొత్తం బిజీ అయినా అది చదువుతుంది.

**2. వేగం: photo తీసిన క్షణమే reading మొదలు**
- Camera తెరవగానే bill reader server "మేల్కొంటుంది" (cold start ఆగదు).
- Page తీసి సిద్ధం అవగానే (మీరు Read నొక్కక ముందే) AI కి పంపుతుంది. మీరు page చూసి Read నొక్కేసరికి సమాధానం దాదాపు వచ్చేస్తుంది. వేరే page తీస్తే పాతది ఆపి కొత్తది చదువుతుంది.
- కొలత (నకిలీ reader తో, page సిద్ధమైన 1.5 సె తర్వాత Read నొక్కితే): reader 3 సె తీసుకుంటే Read తర్వాత 3.2 సె → **1.5 సె**; reader 6 సె అయితే 6.1 → 4.5 సె.
- Camera "full photo" కోసం 3.5 సెకన్లు వేచి ఉండేది, ఇప్పుడు 1.5 సెకన్లు. ఆలస్యమైతే video frame వాడుతుంది (AI కి సరిపోతుంది).
- **నిజం:** "మిల్లీసెకన్లలో పూర్తి bill" ఏ AI తోనూ సాధ్యం కాదు. ఒక bill చదవడానికి AI కి 3–10 సెకన్లు పడుతుంది. పూర్తిగా తప్పులు లేకుండా, క్షణంలో రావాలంటే distributor పంపే **Bill file (CSV / Excel)**: Purchase పేజీలో ఆ button ఉంది (AI అవసరం లేదు, చదవడంలో తప్పులు ఉండవు). చాలా పెద్ద apps కూడా ఇలాగే distributor files దిగుమతి చేస్తాయి.

**3. Prescription:** ఇంతవరకు phone లోని basic reader (Tesseract) చదివేది: చేతి రాత అసలు చదవలేదు. ఇప్పుడు bill లాగే AI readers చదువుతాయి (మీ stock పేర్లను సహాయంగా ఇస్తుంది, కానీ రాయని మందు ఎప్పుడూ జోడించదు). Camera లో page సిద్ధం కాగానే చదవడం మొదలు. AI అందుబాటులో లేకపోతేనే basic reader.

**4. Staff login (Kumar phone: "FIREBASE_DB_URL is missing")**
- అసలు కారణం: Vercel లో staff login కి కావలసిన settings లేవు. ఇప్పుడు server **ఏది లేదో సరిగ్గా** చెబుతుంది: service account key లేదు / సగం paste అయింది / వేరే Firebase project key / database చిరునామా తప్పు / database చదవనివ్వడం లేదు.
- Owner Team పేజీ తెరవగానే server ను పూర్తిగా తనిఖీ చేస్తుంది. Staff login పని చేయకపోతే ఎరుపు box లో కారణం, Vercel లో ఏం వేయాలో (మీ database చిరునామాతో) చూపుతుంది. QR చూపించే sheet లో కూడా అదే హెచ్చరిక.
- **మీరు Vercel → Settings → Environment Variables లో చేయాల్సింది:**
  - `FIREBASE_SERVICE_ACCOUNT`: Firebase console → ⚙ Project settings → Service accounts → Generate new private key. Download అయిన file మొత్తం ( `{` నుంచి `}` వరకు) copy చేసి paste చేయండి. project **pharmacy-suite-pos** దే అయి ఉండాలి.
  - `FIREBASE_DB_URL` = `https://pharmacy-suite-pos-default-rtdb.asia-southeast1.firebasedatabase.app`
  - Save → Deployments → Redeploy. తర్వాత Team పేజీలో "Check again".
- **సులభం చేసినవి:** 123456 లాంటి సులభ PIN ను ఇక తిరస్కరించదు. "ఈ PIN సులభంగా ఊహించవచ్చు, అయినా వాడాలా?" అని అడిగి, మీరు "Use this PIN" అంటే save చేస్తుంది.
- Staff slot కి 7 రోజులు ఉచితం (మొదటి login నుంచి). Central admin లో వేరే సంఖ్య (0 = ఉచితం లేదు) పెట్టవచ్చు. Team పేజీలో "Not paid" బదులు "7 free days from the first login".
- Team పేజీలో Save ఎప్పుడూ శాశ్వతంగా ఆగదు (25 సెకన్లలో కారణం).

**5. పరీక్షలు:** కొత్త `scanflow_test.py` (camera → lines సమయం, ముందే చదవడం, prescription, busy), `teamsetup_test.py`; `scanapi_test.js` (thinking level గుర్తు, రెండో round, warm-up, prescription), `stafflogin_test.js` (9 కారణాలు, 7 రోజుల trial). నిజమైన Gemini/Firebase ఇక్కడి నుంచి చేరలేను: అవి నకిలీలతో.

**అనువాదాలు:** 12 కొత్త వాక్యాలు 18 భాషలలో.

**Upload (GitHub):**
- root: index.html, sw.js, version.json (DEPLOY.md ఐచ్ఛికం)
- `api/` ఫోల్డర్: `scan-invoice.js`, `staff-login.js`, `owner-pin.js`, `order.js`, `master.js` (5 ఫైళ్లు)
- `i18n/` ఫోల్డర్: as, bn, doi, gu, hi, kn, kok, mai, ml, mr, ne, or, pa, sa, sd, ta, te, ur (18)
- `vercel.json` మారలేదు. root లో పొరపాటున ఉన్న `owner-pin.js`, `scan-invoice.js` delete చేయవచ్చు (అవి ఏమీ చేయవు).

---

## 2026.11.23-11 — Scanner: bill అంచులు దానంతట అదే, సరిగ్గా (bill + prescription)

**ఎందుకు తప్పు వచ్చేది (పూర్తి విశ్లేషణ)**
- పాత finder "photo లో అతి పెద్ద తెల్లటి/కాగితం రంగు భాగం = bill" అని ఊహించేది. మీ counter మీద తెల్లటి Hello Kitty బట్ట, granite, tube light వెలుతురు ఉన్నాయి: బట్ట కూడా కాగితం రంగే. అందుకే నీలం గీత బట్ట మీదకు వెళ్లేది, లేదా bill మధ్యలో కోసేది.
- Bill దగ్గరగా పట్టుకుంటే అది photo అంచును తాకుతుంది. పాత finder దాన్ని "bill కాదు" అనుకుని "Move closer" / "Fit the whole bill in view" అని ఆగిపోయేది.
- Bill కనిపించినా ఒక మూల ఒక photo నుంచి తరువాతి photo కి కొంచెం కదిలేది. ఆ చిన్న కదలిక చూసి "phone కదులుతోంది" అనుకుని మళ్ళీ మళ్ళీ "Hold steady…" చూపేది, page ఎప్పటికీ తీసుకునేది కాదు.
- Camera లోని grain వల్ల sharpness లెక్క మూడో వంతు ఎగిరి పడేది: "ఇంకా focus అవుతోంది" అనుకుని ఎక్కువ సేపు వేచి ఉండేది.
- (ముందు రోజు) Desktop view లో scanner పెద్దగా మారేది: అది -8 లో సరిచేశాం.

**ఇప్పుడు ఏమి మారింది**
- కొత్త finder రంగు చూడదు, **కాగితం అంచులు (గీతలు)** చూస్తుంది: నాలుగు నేరైన అంచులు, లోపల ఒకే రకమైన కాగితం, బయట వేరే నేపథ్యం. Bill లోపలి ముద్రిత గీతలను (table lines) అంచులుగా తీసుకోదు.
- Bill photo అంచును తాకినా (దగ్గరగా పట్టుకున్నా) తీసుకుంటుంది: photo లో సగానికి పైగా bill ఉంటే చాలు.
- "Phone స్థిరంగా ఉందా" అనేది చివరి photo తో కాదు, ఒక సెకనులోని photo ల మధ్యస్థ మూలలతో చూస్తుంది. ఒక్క photo లో bill కనబడకపోయినా wait మళ్ళీ మొదలవదు.
- Page తీసిన తర్వాత పెద్ద photo లో మళ్ళీ అంచులు కచ్చితంగా వెతికి, ప్రతి వైపు **3% అదనపు margin** తో కోస్తుంది (bill అక్షరాలు ఎప్పుడూ కోతకు గురికావు).
- Prescription బటన్ కూడా ఇదే scanner: అదే అంచులు, అదే margin.

**కొలతలు (నిజమైన photo లతో)**
- మీ shop bill photo లు 17 + 24 Nov మీ 3 camera screenshots + 12 కలిపిన photo లు = 32: కొత్తది 31 లో bill సరిగ్గా, తప్పు box 0. పాతది 15 లో సరిగ్గా, 13 లో తప్పు box.
- పెద్ద పరీక్ష (80 photo లు, కష్టమైనవి కలిపి): సరిగ్గా 14 → 48, తప్పు box 34 → 7.
- మీ 3 screenshots లాంటి camera video: page దానంతట అదే తీసుకుంది, bill 97–100% లోపల, కోత bill కంటే 1.09–1.13 రెట్లు (అదే చిన్న margin). Bill కనిపించిన తర్వాత సుమారు 1 సెకనులో page తీస్తుంది (camera తెరవడానికి ~1.3 సె అదనం). "Hold steady" సరిచేయక ముందు కొత్త finder తో కూడా ఒక దృశ్యంలో 25 సెకన్లు వేచినా page తీయలేదు.
- వేగం: ఒక్కో frame కి 9.5 ms; 4 రెట్లు నెమ్మది phone CPU లో కూడా 46 ms.

**ఇంకా ఉన్న పరిమితులు (నిజాయితీగా)**
- చాలా చీకటి, చాలా blur, కాగితాలు ఒకదానిపై ఒకటి, లేదా bill నేపథ్యం ఒకే రంగు (తెల్ల bill తెల్ల కాగితాల కుప్ప మీద): frame రాకపోవచ్చు. అప్పుడు కింద బటన్ నొక్కండి: page తీసి అంచులు మళ్ళీ వెతుకుతుంది, లేకపోతే మొత్తం photo.
- మంచి ఫలితం కోసం: bill ను ముదురు/వేరే రంగు ఉపరితలం మీద పెట్టండి, మొత్తం bill కనిపించేలా లేదా screen నిండేలా పట్టుకోండి.

**పరీక్షలు:** కొత్త `finder_test.py` (32 నిజమైన photo లు, `tools/fixtures/finder/`), `camreal_test.py` (మీ 3 దృశ్యాలు camera video గా: bill + prescription). పాత scanner పరీక్షలు అన్నీ pass.

**Upload (GitHub):**
- root: `index.html`, `sw.js`, `version.json` (DEPLOY.md ఐచ్ఛికం)
- `api/`, `i18n/`, `vercel.json`: ఈసారి మారలేదు.

---

## 2026.11.23-12 — ఖాతా (Khata / Credit): కొంత చెల్లింపు, bill వారీ history, ఖాతా summary

**ముందే app లో ఉన్నవి (మార్చలేదు, బలపరిచాం):** Credit bill, Parties/Dues పేజీ (To collect, Remind today), ledger (running balance తో), Receive payment, WhatsApp/SMS reminder (UPI pay link తో), చెల్లిస్తానన్న తేదీ, Statement (print/WhatsApp), వయసు వారీ బాకీ (0–30, 31–60…), credit limit (agency కి మాత్రమే ఉండేది).

**కొత్తవి:**
1. **Bill సమయంలో కొంత చెల్లింపు:** Payment లో Credit ఎంచుకుంటే "ఇప్పుడు చెల్లించినది ₹" box + Cash / UPI / Card. వెంటనే కనిపిస్తుంది: ఇప్పుడు చెల్లించినది, ఈ bill నుంచి ఖాతాలో, ఈ bill కి ముందు బాకీ, **ఈ bill తర్వాత మొత్తం బాకీ**. ఉదా: bill ₹850, ఇచ్చింది ₹500 → ఖాతాలో ₹350 మాత్రమే.
   - Save చేస్తే: bill (credit) + ఆ bill మీద ₹500 చెల్లింపు రెండూ ఖాతాలో పడతాయి. రోజు cash లెక్కలో ₹500 వస్తుంది. బాకీ ఎవరూ చేత్తో టైప్ చేయరు: బిల్లులు − చెల్లింపులు − returns నుంచే లెక్క.
   - బిల్లు కంటే ఎక్కువ టైప్ చేస్తే ఆపుతుంది. Credit limit దాటితే customer కి కూడా హెచ్చరిక (ఇప్పుడు చెల్లించినది తీసేసి లెక్క).
2. **Print / PDF / thermal / WhatsApp bill లో:** Paid now (UPI), On credit (this bill), Previous due, **TOTAL DUE**. WhatsApp UPI link మిగిలిన మొత్తానికే.
3. **Customer / patient ఖాతా పేజీ (Parties → పేరు):**
   - పైన 3 cards: మొత్తం బిల్లులు (ఎన్ని bills, ఎప్పటి నుంచి), మొత్తం చెల్లించినది (చివరి చెల్లింపు), **పెండింగ్ బాకీ** (ఎరుపు).
   - వయసు వారీ బాకీ bar.
   - Bill వారీ పట్టిక: తేదీ, Bill no (ఏ staff), మందుల సంఖ్య, Bill మొత్తం, చెల్లించినది, బాకీ, స్థితి (**Paid / Part paid / Due** + ఎన్ని రోజులు). Filters: చెల్లించలేదు / కొంత / చెల్లించారు / అన్నీ. Bill తాకితే bill తెరుస్తుంది.
   - బాకీ ఉన్న ప్రతి bill పక్కన **Receive** బటన్: ఆ bill కే జమ. మామూలు Receive payment పాత bills ను ముందుగా తీరుస్తుంది. Save చేయగానే పేజీ కొత్త బాకీతో refresh.
   - Ledger లో: "బిల్లు సమయంలో చెల్లించారు · bill నంబర్", ఏ staff / ఏ phone నుంచి.
4. Dues report, reminders, export అన్నీ ఇదే bill వారీ లెక్క వాడతాయి (అన్ని చోట్ల ఒకే అంకె).
5. కొంత చెల్లించిన bill ను cancel చేస్తే: చెల్లించిన డబ్బు customer ఖాతాలో advance గా ఉంటుంది (తదుపరి bill కి), app అది చెబుతుంది.

**Offline / cloud:** అన్నీ ముందు ఈ phone లో save (internet లేకపోయినా), తర్వాత cloud shop లో అన్ని counters కి sync. చెల్లింపుకు staff పేరు, device పేరు నమోదు.

**పరీక్ష:** కొత్త `khata_test.py` (23 checks: ₹500 పాత బాకీ → ₹500 bill లో ₹300 UPI → బాకీ ₹700, print/WhatsApp, ఖాతా cards, Part paid/Due, ఒక bill మీద Receive, మామూలు Receive, credit limit, ఎక్కువ టైప్, cancel). మిగతా పరీక్షలు అన్నీ.

**అనువాదాలు:** 23 కొత్త వాక్యాలు 18 భాషలలో.

**Upload (GitHub):**
- root: `index.html`, `sw.js`, `version.json` (DEPLOY.md ఐచ్ఛికం)
- `i18n/` ఫోల్డర్: as, bn, doi, gu, hi, kn, kok, mai, ml, mr, ne, or, pa, sa, sd, ta, te, ur (18)
- `api/` మారలేదు. -11 (scanner) upload చేయకపోతే ఇదే దాన్ని కూడా కలిగి ఉంది.

## 2026.11.23-13 — Master ఆటో-అప్‌డేట్ (5 షాపుల ఓటు), Purchase search, ఆటో backup/restore

**1. Medicine master: షాపుల ఓట్లతో HSN / GST తనంతట అదే సరిదిద్దడం**
- ప్రతి షాప్‌లో item save చేసినప్పుడు, supplier bill save చేసినప్పుడు (scan అయినా, type అయినా) ఆ మందు HSN, GST సర్వర్‌కు **ఓటుగా** వెళ్తుంది. పేరు, salt, pack, company, HSN, GST మాత్రమే. కొనుగోలు రేటు, షాప్ పేరు, ఫోన్, పేషెంట్లు ఎప్పుడూ వెళ్లవు.
- ఒక owner login = ఒక ఓటు (ఎన్ని counters, ఎన్నిసార్లు పంపినా). Login సర్వర్‌లో hash గా మాత్రమే ఉంటుంది.
- **కనీసం 5 షాపులు** పంపి, వాటిలో **80% (10 లో 8)** ఒకే విలువ చెబితే → తనంతట అదే నిర్ణయం. ఆ రాత్రి 2 గంటలకు GitHub Action `data/medicines.json`, `data/master_medicines.csv` లో రాస్తుంది. పాత విలువ ఉంచబడుతుంది (Undo చేయవచ్చు).
- 5+ షాపులు ఉన్నా 80% కలవకపోతే → **Review** లో "Shops disagree" గా వస్తుంది; మీరు సరైనది ఒక్క tap తో ఎంచుకుంటారు. మీరు ఎంచుకున్నది 30 రోజులు ఓట్లతో మారదు.
- **ఫోన్లకు**: Action కొత్తగా `data/master_changes.json` (చిన్న ఫైల్) రాస్తుంది. ప్రతి ఫోన్ రోజుకు ఒకటి-రెండు సార్లు దీన్ని మాత్రమే తీసుకుంటుంది (14 MB మళ్లీ కాదు). కొత్తగా approve అయిన మందులు కూడా ఇందులో వెళ్లి search లో కనిపిస్తాయి. మార్పులు 30,000 దాటితే ఫైల్ మళ్లీ మొదలవుతుంది, ఫోన్లు పూర్తి list ఒక్కసారి తనంతట అదే తీసుకుంటాయి (చోటు ఉంటేనే).
- మార్చాలంటే (Vercel → Environment Variables, optional): `MASTER_MIN_SHOPS` (default 5), `MASTER_AGREE` (default 0.8).
- Firebase → Realtime Database → Rules లో ఈ index లు కలపండి (లేకపోయినా పనిచేస్తుంది, కొంచెం నెమ్మదిగా):
  ```
  "master_auto": { ".indexOn": ["sy", "at"] }
  ```
  `master_votes`, `master_auto`, `master_dispute` కు browser access ఇవ్వకండి (సర్వర్ మాత్రమే service account తో రాస్తుంది).

**2. Purchase లో search bar**
- Supplier పేరు టైప్ చేస్తే: మొత్తం బాకీ, pending bills ఒక్కొక్కటి, ఎన్ని రోజుల కింద వచ్చింది, overdue, చివరి payment, 12 నెలల కొనుగోలు. "Open account" తో ఖాతా.
- Bill no., GSTIN, మందు పేరు, మొత్తం (₹), తేదీ (12/06/2025) తో కూడా వెతకవచ్చు.
- ఫోన్‌లో లేని నెల తేదీ టైప్ చేస్తే, ఆ నెల Google Drive నుంచి తనంతట అదే వస్తుంది. Find bill లో కూడా అంతే.
- Short book / Orders / Ward indents లో కూడా search.

**3. Backup / restore పూర్తిగా ఆటోమేటిక్**
- Google Drive connect చేసినప్పుడు దాని sealed అనుమతి owner login తో పాటు సర్వర్‌లో ఉంచబడుతుంది (అదే sealed copy; `DRIVE_TOKEN_KEY` లేకుండా ఎవరూ తెరవలేరు; app చేసిన backup files మాత్రమే చూడగలదు).
- Chrome data clear అయినా / కొత్త ఫోన్ అయినా: **మొబైల్ నంబర్ + PIN** (లేదా OTP) → Google మళ్లీ అడగదు, ప్రశ్న లేదు → షాప్ తాజా copy తనంతట అదే తిరిగి వస్తుంది ("Your shop is back").
- "Keep on this phone" default ఇప్పుడు **Automatic**: రికార్డులు ఎక్కువైతే / ఫోన్ నెమ్మదిగా తెరిస్తే / చోటు తక్కువైతే 12 → 6 → 3 నెలలు ఉంచి, మిగతా నెలలు Drive కి (Drive లో అదే ఉందని check చేసిన తర్వాతే). ఇది నిశ్శబ్దంగా జరుగుతుంది. పాత తేదీ ఎంచుకుంటే (Reports, GST, Day book, search) ఆ నెల తిరిగి వస్తుంది.

**Upload (GitHub):** `index.html`, `sw.js`, `api/master.js`, `api/owner-pin.js`, `DEPLOY.md`, 18 `i18n/*.json`, `tools/sync_master.js` (← `github/sync_master.js`), `.github/workflows/sync-master.yml` (← `github/sync-master.yml`). `data/master_changes.json` ను Action మొదటి రాత్రి తనే చేస్తుంది.
