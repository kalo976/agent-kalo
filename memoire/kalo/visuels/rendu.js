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
  await p.goto('file://' + path.join(__dirname, 'modele-nouvel-arrivage.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: out });
  await b.close();
  console.log('ok', out);
})();
