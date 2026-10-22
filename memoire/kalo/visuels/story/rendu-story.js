const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.addInitScript(d => { window.DATA = d; }, data);
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('file://' + path.join(__dirname, 'modele-story.html'));
  await p.addStyleTag({ content: "@font-face{font-family:'Open Sans';src:url('file://" + path.join(__dirname,'fonts','opensans-latin.woff2') + "') format('woff2');font-weight:300 800;font-stretch:75% 100%}" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: process.argv[3] });
  await b.close(); console.log('ok', process.argv[3]);
})();
