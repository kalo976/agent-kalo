// Usage : node rendu.js produit.json sortie.png
// produit.json : {fond, titre, produit, specs[], prix, classe, photo} (photo = chemin relatif au dossier visuels)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = process.argv[3] || 'sortie.png';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1734, height: 907 }, deviceScaleFactor: 2 });
  await p.addInitScript(d => { window.DATA = d; }, data);
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('file://' + path.join(__dirname, 'modele-nouvel-arrivage.html'));
  await p.addStyleTag({ content: "@font-face{font-family:'Open Sans';src:url('file://" + path.join(__dirname,'fonts','opensans-latin.woff2') + "') format('woff2');font-weight:300 800;font-stretch:75% 100%}" });
  await p.evaluate(() => { document.querySelector('.logo').src = 'logo-octobre-rose-rogne.png'; });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: out });
  await b.close();
  console.log('ok', out);
})();
