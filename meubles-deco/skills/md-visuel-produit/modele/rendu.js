// Usage : node rendu.js produits/<produit>.json sorties/<produit>.png [paysage|carre|story]
// Le format peut aussi venir du champ "format" du JSON (paysage par défaut).
// Rendu x2 : paysage 3468 × 1814, carré 2160 × 2160, story 2160 × 3840.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const TAILLES = { paysage: [1734, 907], carre: [1080, 1080], story: [1080, 1920] };
(async () => {
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = process.argv[3] || 'sortie.png';
  data.format = process.argv[4] || data.format || 'paysage';
  const [w, h] = TAILLES[data.format] || TAILLES.paysage;
  const opts = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {};
  const b = await chromium.launch(opts);
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.addInitScript(d => { window.DATA = d; }, data);
  await p.goto('file://' + path.join(__dirname, 'modele-affiche-produit.html'), { waitUntil: 'load', timeout: 20000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  // Contrôle automatique : rien ne doit dépasser de son bloc
  const debords = await p.evaluate(() => [...document.querySelectorAll('.titre,.liste,.prix,.service,.texte,.site')]
    .filter(e => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > innerWidth || e.getBoundingClientRect().bottom > innerHeight)
    .map(e => e.className));
  if (debords.length) console.warn('ATTENTION débordement :', debords.join(', '));
  const police = await p.evaluate(() => [...document.fonts].some(f => /Montserrat|Gotham/.test(f.family) && f.status === 'loaded') ? 'Montserrat/Gotham' : 'SECOURS (Inter) : Google Fonts injoignable');
  console.log('police :', police);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await p.screenshot({ path: out });
  await b.close();
  console.log('ok', out, data.format);
})();
