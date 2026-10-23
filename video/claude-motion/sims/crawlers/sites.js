// Sixteen generic web pages for the swarm to crawl: encyclopedia, search,
// news, forum, social feed, code host, shop, inbox, Q&A, docs, video, sheet.
// No real brands, logos or people: names and domains are made up (.example).
// Each entry: {url, theme: 'light' | 'dark', html}. Styles: style.css (.s-*).

const P = (s) => `<p>${s}</p>`;
const img = (h, a, b, extra = '') => `<div class="s-img" style="height:${h}px;background:linear-gradient(135deg,${a},${b})${extra}"></div>`;

const wiki = (title, lead, infobox, sections, refs) => `
<div class="s-wiki">
  <div class="wk-top"><span class="wk-logo">◎ Encyclopedia</span><div class="wk-search">Search Encyclopedia</div></div>
  <div class="wk-tabs"><b>Article</b><span>Talk</span><i></i><b>Read</b><span>Edit</span><span>View history</span></div>
  <h1>${title}</h1>
  <div class="wk-from">From Encyclopedia, the free encyclopedia</div>
  ${infobox}
  ${lead.map(P).join('')}
  ${sections.map(([h, ps]) => `<h2>${h}</h2>${ps.map(P).join('')}`).join('')}
  <h2>References</h2>
  <ol class="wk-refs">${refs.map((r) => `<li>^ ${r}</li>`).join('')}</ol>
</div>`;

const search = (q, results) => `
<div class="s-search">
  <div class="sr-top"><span class="sr-logo">seek</span><div class="sr-box">${q}<span>⌕</span></div></div>
  <div class="sr-tabs"><b>All</b><span>Images</span><span>News</span><span>Videos</span><span>Maps</span><span>More</span></div>
  <div class="sr-count">About 2,140,000 results (0.31 seconds)</div>
  ${results.map(([site, title, snip]) => `<div class="sr-r"><div class="sr-site"><i></i>${site}</div><a>${title}</a><p>${snip}</p></div>`).join('')}
</div>`;

const news = (mast, kicker, head, dek, by, paras, side) => `
<div class="s-news">
  <div class="nw-mast">${mast}</div>
  <div class="nw-nav"><span>World</span><span>Tech</span><span>Business</span><span>Science</span><span>Opinion</span><span>Culture</span></div>
  <div class="nw-grid">
    <div class="nw-main">
      <div class="nw-kick">${kicker}</div>
      <h1>${head}</h1>
      <div class="nw-dek">${dek}</div>
      <div class="nw-by">${by}</div>
      ${img(330, '#c9d6e2', '#7d93a8')}
      <div class="nw-cap">Illustration</div>
      ${paras.map(P).join('')}
    </div>
    <div class="nw-side"><h3>Most read</h3>${side.map((s, i) => `<div class="nw-mr"><b>${i + 1}</b><span>${s}</span></div>`).join('')}</div>
  </div>
</div>`;

const forum = (items) => `
<div class="s-forum">
  <div class="fm-top"><b>▲ newsdesk</b><span>new | past | comments | ask | show | jobs | submit</span><span class="fm-login">login</span></div>
  ${items.map(([t, site, pts, by, ago, c], i) => `<div class="fm-it"><span class="fm-n">${i + 1}.</span><div><div class="fm-t">▲ ${t} <i>(${site})</i></div><div class="fm-m">${pts} points by ${by} ${ago} | hide | ${c} comments</div></div></div>`).join('')}
</div>`;

const social = (posts) => `
<div class="s-social">
  <div class="so-top"><b>Home</b><span>For you</span><span class="on">Following</span></div>
  ${posts.map(([name, handle, ago, text, stats, media]) => `
  <div class="so-post"><div class="so-av" style="background:${media ? '#3d7bff' : '#a98bff'}"></div><div class="so-b">
    <div class="so-h"><b>${name}</b><span>${handle} · ${ago}</span></div>
    <div class="so-t">${text}</div>
    ${media ? img(220, '#1b2a44', '#5a3d8a', ';border-radius:16px;margin:12px 0 4px') : ''}
    <div class="so-s"><span>↩ ${stats[0]}</span><span>⟲ ${stats[1]}</span><span>♡ ${stats[2]}</span><span>▥ ${stats[3]}</span></div>
  </div></div>`).join('')}
</div>`;

const PAGES = [
  // row 0
  {url: 'seek.example/search?q=how+do+ai+agents+browse+the+web', theme: 'light', html: search('how do ai agents browse the web', [
    ['agents-handbook.example', 'How AI agents browse the web: a practical guide', 'An agent opens a real browser, reads the page as text or pixels, decides what to click, and repeats until the task is done or it gives up.'],
    ['devnotes.example › blog', 'Browser agents explained in 5 minutes', 'Most browser agents run a loop: observe the page, pick an action, act, observe again. The hard part is knowing when to stop.'],
    ['forum.newsdesk.example', 'Ask: how do you keep an agent from looping on a page?', 'Give it a step budget, log every action, and make "I am stuck" a valid answer. Agents loop when every option looks equally good.'],
    ['research-digest.example', 'Agents that read the web for you', 'Instead of ten tabs you send one agent. It reads the pages, keeps the quotes, and comes back with sources you can check.'],
    ['buildlog.example › posts', 'I gave an agent 50 tabs and a deadline', 'It read every page, wrote a summary per tab, and flagged three that contradicted each other. Then it asked which one to trust.'],
    ['robots-guide.example', 'robots.txt for the agent era', 'Crawlers used to index pages. Agents act on them. Site owners are starting to write separate rules for each.'],
    ['qa.example › questions', 'Can two agents share one browser session?', 'Yes, but give each its own tab and a lock on the cart. Otherwise they will both buy the same thing.'],
  ])},
  {url: 'morningledger.example/tech/agents-on-the-web', theme: 'light', html: news('The Morning Ledger', 'Technology', 'Your next visitor might not be a person', 'Agents now read, compare and click on behalf of people. Site owners are redesigning for readers that never scroll.', 'By the Ledger tech desk · 6 min read', [
    'For twenty years the web was built for eyes. Pages were long, images were big, and buttons were placed where a thumb could find them. That assumption is breaking.',
    'A growing share of page views now comes from software agents: programs that open a page, read it in a fraction of a second, and move on to the next one. They do not see the hero image. They read the text, the prices and the fine print.',
    'Some publishers block them. Others are building a second version of every page, plain and structured, for agents only. A few are doing both.',
    'The change is visible in small places. Checkout forms that used to hide the total until the last step now show it first, because agents compare totals before anything else.',
  ], ['Agents now book more trips than travel desks', 'What happens when two agents negotiate', 'The case for boring, readable websites', 'Inside a newsroom that writes for bots', 'Why your inbox is full of agent receipts'])},
  {url: 'chirp.example/home', theme: 'dark', html: social([
    ['build log', '@buildlog', '2m', 'gave one agent a wiki page. it spawned subagents. 9 seconds later there were 256 of them reading the whole site', ['48', '310', '2.1K', '84K'], true],
    ['agent 017', '@agent_017', '14m', 'status: read 1,204 pages today. found 3 broken links, 1 typo in a price, 0 reasons to stop', ['12', '40', '391', '9K'], false],
    ['night shift', '@nightshift_ops', '31m', 'the agents never log off. we just check the morning summary and approve the drafts', ['7', '22', '180', '6K'], false],
    ['web weekly', '@webweekly', '1h', 'thread: what changes when half your readers are software', ['33', '95', '640', '21K'], true],
  ])},
  {url: 'vidtube.example/feed', theme: 'dark', html: `
<div class="s-video">
  <div class="vd-top"><b>▶ vidtube</b><div class="vd-search">Search</div></div>
  <div class="vd-chips"><span class="on">All</span><span>AI agents</span><span>Coding</span><span>Live</span><span>Science</span><span>Spiders</span></div>
  <div class="vd-grid">${[
    ['I let 100 agents run my website for a week', 'build log', '412K views · 3 days ago', '#3d1d5a', '#ff3db4'],
    ['Spider silk is stronger than you think', 'nature lab', '1.2M views · 2 weeks ago', '#1d3a2a', '#4dff9a'],
    ['How web crawlers actually work', 'cs explained', '880K views · 1 month ago', '#14304d', '#19c3ff'],
    ['One prompt, 256 subagents', 'agent diaries', '96K views · 5 hours ago', '#4d2a14', '#ff6a3d'],
    ['Watching a jumping spider hunt in slow motion', 'macro world', '3.4M views · 1 year ago', '#3a3a14', '#ffd23d'],
    ['Agents vs captchas: who wins in 2026', 'web weekly', '201K views · 6 days ago', '#2a1d4d', '#a98bff'],
  ].map(([t, ch, m, a, b]) => `<div class="vd-c">${img(190, a, b, ';border-radius:14px')}<div class="vd-t">${t}</div><div class="vd-m">${ch}<br>${m}</div></div>`).join('')}</div>
</div>`},

  // row 1
  {url: 'newsdesk.example/news', theme: 'light', html: forum([
    ['Show: a swarm of crawler agents that reads a site in seconds', 'github.example', 412, 'pmc', '3 hours ago', 188],
    ['Spider silk proteins made in yeast at industrial scale', 'nature-digest.example', 290, 'arachne', '5 hours ago', 97],
    ['Robots.txt was never meant for agents', 'blog.example', 254, 'kv', '6 hours ago', 141],
    ['Ask: how do you budget tokens for long-running agents?', 'newsdesk.example', 198, 'tm', '7 hours ago', 203],
    ['The web is quietly becoming an API', 'essays.example', 176, 'jb', '8 hours ago', 64],
    ['Why my agent kept buying the same book', 'postmortem.example', 161, 'lw', '9 hours ago', 88],
    ['A minimal browser for agents, in 600 lines', 'code.example', 143, 'dn', '10 hours ago', 52],
    ['Jumping spiders can see in colour, and plan routes', 'science.example', 131, 'ro', '11 hours ago', 39],
    ['We replaced our nightly cron jobs with agents', 'eng.example', 120, 'sh', '12 hours ago', 77],
    ['Ballooning: how spiderlings travel hundreds of km', 'wildlife.example', 111, 'mf', '13 hours ago', 26],
    ['Agents that ask before they click', 'ux.example', 98, 'ae', '14 hours ago', 31],
    ['Crawling 1B pages on a single machine', 'infra.example', 92, 'zz', '15 hours ago', 45],
    ['The case for plain HTML in 2026', 'web.example', 87, 'cb', '16 hours ago', 58],
    ['Show: watch your agents as spiders on a map of your site', 'demo.example', 80, 'qq', '17 hours ago', 22],
    ['Silk, steel and Kevlar: a fair comparison', 'materials.example', 74, 'ps', '18 hours ago', 19],
  ])},
  {url: 'en.encyclopedia.example/wiki/Spider', theme: 'light', html: wiki('Spider', [
    'Spiders are eight-legged arachnids of the order Araneae. Almost all of them make <a>silk</a>, and most use <a>venom</a> to subdue their prey. More than 50,000 species have been described, and they live on every continent except <a>Antarctica</a>.',
    'A spider\'s body has two main parts, the <a>cephalothorax</a> and the <a>abdomen</a>, joined by a narrow waist. The legs, the fangs and most of the eyes sit on the front part; the silk glands and <a>spinnerets</a> sit at the back.',
  ], `<div class="wk-box"><div class="wk-bt">Spider</div>${img(230, '#d8cdb8', '#8a7a5c')}<div class="wk-bc">Temporal range: Carboniferous – present</div><div class="wk-bt2">Scientific classification</div><table>${[['Kingdom', 'Animalia'], ['Phylum', 'Arthropoda'], ['Subphylum', 'Chelicerata'], ['Class', 'Arachnida'], ['Order', 'Araneae']].map(([a, b]) => `<tr><td>${a}:</td><td><a>${b}</a></td></tr>`).join('')}</table></div>`, [
    ['Silk', ['Silk comes out of the spinnerets as a liquid and hardens as it is pulled. One spider can make several kinds: dragline silk for safety lines, sticky threads for capture, and soft silk for wrapping eggs.', 'Weight for weight, dragline silk is comparable to high-grade steel in strength and far more elastic.']],
    ['Webs and hunting', ['Many spiders build webs and wait. Others hunt on foot, ambush prey from burrows, or <a>jump</a> on it from a distance. Some spin no web at all and use silk only for travel and shelter.']],
    ['Ballooning', ['Young spiders of many species travel by <a>ballooning</a>: they climb to a high point, release a few threads, and let the wind and electric fields lift them. Spiderlings have been caught far out at sea and kilometres above the ground.']],
  ], ['Field guide to spiders of the world, 2nd ed., p. 12.', 'Silk: structure, proteins and mechanical properties. Review, vol. 41.', 'Hunting strategies in non-web-building spiders. Notes, p. 88.', 'Aerial dispersal of spiderlings. Proceedings, vol. 7.', 'Arachnid anatomy for beginners, ch. 3.', 'Venom and digestion in Araneae. Review, vol. 19.'])},
  {url: 'codehost.example/acme/crawler', theme: 'dark', html: `
<div class="s-repo">
  <div class="rp-top"><b>⌂</b><span>acme / <b>crawler</b></span><em>Public</em></div>
  <div class="rp-tabs"><b>Code</b><span>Issues 42</span><span>Pull requests 7</span><span>Actions</span><span>Wiki</span><span>Insights</span></div>
  <div class="rp-bar"><span class="rp-br">⑂ main</span><span>3 branches · 28 tags</span><span class="rp-go">Code ▾</span></div>
  <div class="rp-files">
    <div class="rp-h"><b>agent-17</b> spawn: cap children per page at 16 <i>· 4m ago · 1,284 commits</i></div>
    ${[['src', 'spawn subagents on a beat grid', '4m'], ['src/agent', 'agent: read, decide, move', '1h'], ['src/pages', 'snapshot real pages for the wall', '3h'], ['tests', 'add 256-agent soak test', '1d'], ['docs', 'how the swarm splits work', '2d'], ['.github/workflows', 'nightly crawl on 16 pages', '5d'], ['README.md', 'swarm: one agent becomes 256', '4m'], ['package.json', 'bump playwright', '6d'], ['LICENSE', 'MIT', '1y']].map(([f, m, t]) => `<div class="rp-f"><span class="rp-fn">${f.includes('.') ? '▤' : '▸'} ${f}</span><span class="rp-fm">${m}</span><span class="rp-ft">${t}</span></div>`).join('')}
  </div>
  <div class="rp-readme"><div class="rp-rh">README.md</div><h2>crawler</h2><p>One agent reads a page. When the page is big, it spawns a subagent and gives it half. Every two beats the swarm doubles, until every page has its own reader.</p><pre>npx crawler --start https://example.com --max-agents 256
✓ 1 → 2 → 4 → 8 → 16 → 32 → 64 → 128 → 256
✓ 16 pages · 3,412 words read · 0 pages twice</pre><p>Agents share one queue and never read the same page twice. Each one writes what it found to a single log you can read in the morning.</p></div>
</div>`},
  {url: 'shop.example/p/silk-thread-500m', theme: 'light', html: `
<div class="s-shop">
  <div class="sh-top"><b>shop</b><div class="sh-search">Search products</div><span>Account</span><span>Cart (2)</span></div>
  <div class="sh-crumbs">Home › Craft › Thread › Natural fibres</div>
  <div class="sh-grid">
    <div>${img(470, '#f3e9d8', '#cdb48a', ';border-radius:12px')}<div class="sh-th">${[0, 1, 2, 3].map(() => img(88, '#efe4d0', '#d8c3a0', ';border-radius:8px')).join('')}</div></div>
    <div class="sh-info"><h1>Natural Silk Thread, 500 m Spool</h1><div class="sh-st">★★★★☆ <a>4.6 · 1,284 ratings</a></div><div class="sh-pr">$12.99</div><div class="sh-ship">Free delivery Thursday. In stock.</div><div class="sh-btn">Add to cart</div><div class="sh-btn2">Buy now</div>
    <ul><li>Fine, strong and slightly elastic</li><li>Hand-wound, 500 metres per spool</li><li>Good for embroidery, repairs and fishing flies</li><li>Ships in a recyclable box</li></ul></div>
  </div>
  <h2>Customer reviews</h2>
  <div class="sh-rev"><b>★★★★★ Stronger than it looks</b><p>Used it to repair a net. Thin, but it holds. Will buy again.</p></div>
  <div class="sh-rev"><b>★★★★☆ My agent ordered three</b><p>I asked for one spool. The agent compared prices across nine shops and decided three was the better deal. It was right.</p></div>
  <div class="sh-rev"><b>★★★☆☆ Tangles easily</b><p>Great thread, but unwind it slowly. It has a mind of its own.</p></div>
</div>`},

  // row 2
  {url: 'mail.example/inbox', theme: 'light', html: `
<div class="s-mail">
  <div class="ml-top"><b>✉ mail</b><div class="ml-search">Search mail</div></div>
  <div class="ml-grid"><div class="ml-side"><div class="ml-compose">✎ Compose</div>${['Inbox 24', 'Starred', 'Snoozed', 'Sent', 'Drafts 3', 'Agents', 'Receipts', 'Spam'].map((s, i) => `<div class="${i ? '' : 'on'}">${s}</div>`).join('')}</div>
  <div class="ml-list">${[
    ['Agent #17', 'Morning summary: 1,204 pages read', 'Nothing urgent. Three prices changed overnight, one link is broken.', '07:02'],
    ['Crawler bot', 'Your crawl finished', '16 pages, 256 agents, 0 errors. Full log attached.', '06:48'],
    ['Billing', 'Invoice for September', 'Your usage this month is attached. Most of it came from one night.', 'Oct 1'],
    ['Agent #4', 'I need a decision', 'Two suppliers, same price. One ships faster, the other has better reviews.', 'Oct 1'],
    ['Newsdesk digest', 'Top stories this week', 'A swarm of crawler agents, silk made in yeast, and the case for plain HTML.', 'Sep 30'],
    ['Agent #91', 'Draft ready for review', 'I rewrote the landing page copy. I did not publish it.', 'Sep 30'],
    ['Calendar', 'Reminder: review agent logs', 'Every Friday at 10:00. Bring coffee.', 'Sep 29'],
    ['Shop', 'Your order has shipped', 'Natural Silk Thread, 500 m Spool (×3). Arrives Thursday.', 'Sep 29'],
    ['Agent #203', 'Stuck on a captcha', 'I stopped and saved my place. Can you take a look?', 'Sep 28'],
    ['Security', 'New sign-in from an agent', 'If this was you, no action is needed.', 'Sep 28'],
    ['Agent #12', 'Found a cheaper flight', 'Same route, two hours later, 40% less. Want me to hold it?', 'Sep 27'],
    ['Team', 'Swarm demo on Friday', 'Bring your weirdest page. We will see how long it lasts.', 'Sep 27'],
  ].map(([f, s, sn, t], i) => `<div class="ml-r ${i < 4 ? 'un' : ''}"><span class="ml-f">${f}</span><span class="ml-s"><b>${s}</b> – ${sn}</span><span class="ml-t">${t}</span></div>`).join('')}</div></div>
</div>`},
  {url: 'qa.example/questions/stop-agent-loop', theme: 'light', html: `
<div class="s-qa">
  <div class="qa-top"><b>▤ qa</b><div class="qa-search">Search…</div></div>
  <h1>How do I stop my agent from clicking the same button forever?</h1>
  <div class="qa-meta">Asked 2 days ago · Modified today · Viewed 12k times</div>
  <div class="qa-q"><div class="qa-v">▲<b>214</b>▼</div><div>${P('My browser agent gets stuck on a page with a "Load more" button. It clicks it, the page changes a little, and it clicks again. After an hour it has clicked 3,000 times and read nothing new.')}<pre>while not done:
    page = observe()
    action = decide(page)   # always "click load more"
    act(action)</pre>${P('How do I make it notice that it is not making progress?')}<div class="qa-tags"><span>agents</span><span>browser-automation</span><span>loops</span></div></div></div>
  <h2>3 Answers</h2>
  <div class="qa-q qa-a"><div class="qa-v">▲<b>389</b>▼<i>✓</i></div><div>${P('Give the loop a memory and a budget. Keep a hash of the last few page states and stop when the new state is the same as an old one. Also cap the number of steps per page.')}<pre>seen = set()
for step in range(50):
    page = observe()
    if hash(page) in seen: break
    seen.add(hash(page))
    act(decide(page))</pre>${P('And make "stop and report" one of the actions the agent can choose. Agents loop when every option looks equally good.')}</div></div>
</div>`},
  {url: 'docs.agents.example/api/spawn', theme: 'dark', html: `
<div class="s-docs">
  <div class="dc-top"><b>agents</b><span>Docs</span><span>API</span><span>Guides</span><span>Changelog</span><div class="dc-search">Search docs  ⌘K</div></div>
  <div class="dc-grid"><div class="dc-side">${['Getting started', 'Agents', '  create', '  spawn', '  join', '  stop', 'Pages', '  read', '  click', '  fill', 'Logs', 'Limits', 'Pricing'].map((s) => `<div class="${s.trim() === 'spawn' ? 'on' : ''}">${s.trim()}</div>`).join('')}</div>
  <div class="dc-main"><div class="dc-crumb">API › Agents › spawn</div><h1>spawn</h1>${P('Creates a subagent that inherits the parent\'s task, tools and budget share. The parent keeps running. Children report back to the parent, never to each other.')}<pre><span class="k">const</span> child = <span class="k">await</span> agent.<span class="f">spawn</span>({
  task: <span class="s">'read the second half of this page'</span>,
  budget: parent.budget / <span class="n">2</span>,
  page: <span class="s">'https://example.com/docs'</span>,
});</pre><h2>Parameters</h2><table>${[['task', 'string', 'What the child should do, in plain words.'], ['budget', 'number', 'Max steps. Defaults to half of the parent.'], ['page', 'string', 'Where the child starts. Defaults to the parent page.'], ['onDone', 'function', 'Called with the child\'s report.']].map((r) => `<tr><td><code>${r[0]}</code></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table><h2>Limits</h2>${P('A swarm can double at most 8 times: one agent becomes 256. Each page gets at most 16 agents, the rest move on to the next page in the queue.')}</div></div>
</div>`},
  {url: 'en.encyclopedia.example/wiki/Web_crawler', theme: 'light', html: wiki('Web crawler', [
    'A <b>web crawler</b>, also called a <a>spider</a> or <a>bot</a>, is a program that browses the <a>World Wide Web</a> automatically, usually to build an index for a <a>search engine</a>.',
    'A crawler starts from a list of seed addresses, downloads each page, extracts its links and adds them to a queue. It repeats this until the queue is empty or a limit is reached.',
  ], `<div class="wk-box"><div class="wk-bt">Web crawler</div>${img(170, '#dfe7ef', '#8aa0b8')}<div class="wk-bc">A crawler follows links from page to page</div></div>`, [
    ['Politeness', ['A polite crawler reads a site\'s <a>robots.txt</a> file first and follows its rules. It also limits how often it requests pages, so the site does not slow down for human visitors.']],
    ['Agents', ['A newer kind of crawler does more than read. <a>AI agents</a> open pages in a real browser, click buttons, fill in forms and make decisions for the person who sent them. Many sites now write separate rules for crawlers that index and agents that act.']],
    ['Scale', ['Large crawlers fetch billions of pages. They run many workers in parallel, share one queue, and keep a record of every address they have seen so that no page is read twice.']],
  ], ['Crawling the web: an introduction. Lecture notes, part 2.', 'Politeness policies for automated agents. Workshop paper.', 'The robots exclusion standard, explained. Guide, p. 4.', 'Parallel crawlers and shared queues. Systems review, vol. 12.'])},

  // row 3
  {url: 'sheets.example/d/agent-log', theme: 'light', html: `
<div class="s-sheet">
  <div class="st-top"><b>▦ agent-log</b><span>File  Edit  View  Insert  Format  Data  Tools</span></div>
  <div class="st-fx"><b>fx</b> =SUM(D2:D21)</div>
  <table><tr><th></th>${['A', 'B', 'C', 'D', 'E', 'F'].map((c) => `<th>${c}</th>`).join('')}</tr>
  <tr><td>1</td><td><b>agent</b></td><td><b>page</b></td><td><b>gen</b></td><td><b>words</b></td><td><b>status</b></td><td><b>parent</b></td></tr>
  ${Array.from({length: 26}, (_, i) => {
    const pages = ['wiki/Spider', 'search', 'news', 'forum', 'feed', 'repo', 'shop', 'inbox', 'qa', 'docs', 'wiki/Web_crawler', 'video'];
    const st = ['reading', 'done', 'done', 'reading', 'waiting', 'done'][i % 6];
    return `<tr><td>${i + 2}</td><td>#${String(i * 9 + 1).padStart(3, '0')}</td><td>${pages[i % pages.length]}</td><td>${Math.min(8, Math.floor(Math.log2(i * 9 + 2)))}</td><td>${(i * 137 + 41) % 900 + 60}</td><td class="${st}">${st}</td><td>#${String(Math.floor((i * 9 + 1) / 2)).padStart(3, '0')}</td></tr>`;
  }).join('')}</table>
</div>`},
  {url: 'morningledger.example/business/night-shift', theme: 'light', html: news('The Morning Ledger', 'Business', 'The night shift that never logs off', 'Small teams now leave agents running overnight. In the morning there is a summary, a list of drafts, and a bill.', 'By the Ledger business desk · 4 min read', [
    'At six in the morning the office is empty, but the work log is not. Overnight, a group of agents read supplier pages, compared prices, answered routine emails and drafted three proposals.',
    'Nobody approved anything yet. That is the rule: agents can read and draft, people decide and send. The morning starts with a short summary and a queue of things to sign off.',
    'The appeal is obvious for a team of four. The risk is quieter. An agent that misreads a page can repeat the mistake a thousand times before anyone wakes up, which is why every action goes into a log.',
  ], ['Your next visitor might not be a person', 'Agents that ask before they click', 'What a 256-agent crawl costs', 'Plain HTML is back', 'The receipts your agents keep'])},
  {url: 'chirp.example/explore', theme: 'dark', html: social([
    ['web weekly', '@webweekly', '3m', 'the internet in 2026: you open one tab, your agents open the other 255', ['21', '140', '1.4K', '40K'], false],
    ['macro world', '@macroworld', '22m', 'reminder that real spiders also send out tiny scouts. it is called ballooning and it is wild', ['9', '61', '820', '15K'], true],
    ['agent 203', '@agent_203', '40m', 'stuck on a captcha. saved my place. waiting for a human. this is fine', ['30', '75', '2.2K', '31K'], false],
    ['cs explained', '@csexplained', '1h', 'a crawler with a queue is a spider. a crawler with a goal is an agent. same web, different job', ['14', '88', '960', '19K'], false],
  ])},
  {url: 'seek.example/search?q=spider+silk+vs+steel', theme: 'light', html: search('spider silk vs steel', [
    ['materials.example', 'Spider silk vs steel: a fair comparison', 'Weight for weight, dragline silk is comparable to high-grade steel in strength, and it can stretch far more before it breaks.'],
    ['nature-digest.example', 'Why spider silk is so tough', 'The secret is structure: stiff crystal regions held together by flexible chains. Strength from one, stretch from the other.'],
    ['science.example › news', 'Silk proteins made in yeast at scale', 'Researchers produce silk-like fibres without spiders. The fibres are close, but not yet as good as the real thing.'],
    ['qa.example', 'Is spider silk really stronger than Kevlar?', 'Depends on the measure. Kevlar is stiffer; silk absorbs more energy before breaking. Both beat steel by weight.'],
    ['wildlife.example', 'How spiders use silk for travel', 'Spiderlings release threads and let the wind carry them. The behaviour is called ballooning.'],
    ['en.encyclopedia.example', 'Spider silk – Encyclopedia', 'Spider silk is a protein fibre spun by spiders. Spiders use it to build webs, wrap prey, protect eggs and travel.'],
    ['vidtube.example', 'Spider silk is stronger than you think (video)', 'A slow-motion look at silk under load, and why it rarely snaps all at once.'],
  ])},
];

export default PAGES;
