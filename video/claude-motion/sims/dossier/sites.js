// Twelve public pages about one made-up person (@nightwren_88), for the
// osint sim. Every page leaks one detail; the phrase is wrapped in
// <span class="ev" data-f="KEY"> and KEY matches a field in main.js.
// No real people, brands or places: names, towns and domains are invented
// (.example), and phone/email are partly masked like a demo with PII hidden.
// Grid order is row-major on a 4x3 wall; the swarm starts on index 5.

const P = (s) => `<p>${s}</p>`;
const img = (h, a, b, extra = '') => `<div class="s-img" style="height:${h}px;background:linear-gradient(135deg,${a},${b})${extra}"></div>`;
const ev = (k, s) => `<span class="ev" data-f="${k}">${s}</span>`;

const PAGES = [
  // row 0
  {url: 'portvalecourier.example/local/harbour-10k-results', theme: 'light', html: `
<div class="s-news">
  <div class="nw-mast">The Portvale Courier</div>
  <div class="nw-nav"><span>Local</span><span>Sport</span><span>Business</span><span>Weather</span><span>Events</span><span>Opinion</span></div>
  <div class="nw-grid">
    <div class="nw-main">
      <div class="nw-kick">Local sport</div>
      <h1>Record turnout at the Harbour 10K</h1>
      <div class="nw-dek">More than 900 runners lined up on Sunday morning. Full results for every finisher are below.</div>
      <div class="nw-by">By the Courier sport desk · 3 min read</div>
      ${img(250, '#c9d6e2', '#7d93a8')}
      <div class="nw-cap">Runners pass the harbour wall at the 6 km mark.</div>
      ${P('The course ran along the harbour, up through the old town and back down to the finish by the ferry terminal. Conditions were cool and dry.')}
      <table class="nw-res"><tr><th>#</th><th>Name</th><th>Club</th><th>Time</th></tr>
      ${[['212', 'T. Okafor', 'Harbour Harriers', '46:58'], ['213', ev('name', 'Wren Halloway'), 'unattached', '47:12'], ['214', 'M. Lindqvist', 'Old Town RC', '47:15'], ['215', 'S. Petrova', 'unattached', '47:19'], ['216', 'D. Achebe', 'Harbour Harriers', '47:22'], ['217', 'K. Moreau', 'Portvale Tri', '47:30'], ['218', 'J. Brandt', 'unattached', '47:41'], ['219', 'A. Novak', 'Old Town RC', '47:44']].map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>
      ${P('Organisers thanked the volunteers who handed out water at three stations. Next year the race moves to the first Sunday of the month.')}
    </div>
    <div class="nw-side"><h3>Most read</h3>${['Ferry timetable changes from Monday', 'New bakery opens on the harbour', 'Old town parking: what changes', 'Dog park gets new lights', 'Weekend weather: cool and dry'].map((s, i) => `<div class="nw-mr"><b>${i + 1}</b><span>${s}</span></div>`).join('')}</div>
  </div>
</div>`},
  {url: 'snapshots.example/nightwren_88', theme: 'light', html: `
<div class="s-pics">
  <div class="pc-top"><b>snapshots</b><span>Explore</span><span>Upload</span><span class="pc-me">nightwren_88</span></div>
  <div class="pc-head"><div class="pc-av"></div><div><div class="pc-name">nightwren_88</div><div class="pc-meta">214 photos · 388 followers · 401 following</div><div class="pc-bio">little moments. mostly the dog</div></div></div>
  <div class="pc-grid">${[
    ['#f2c6a0', '#c0703a', 'sunday at the harbour'],
    ['#d7e3c4', '#6f8f4a', 'new running shoes, same old route'],
    ['#f0d8e0', '#b06080', `birthday dinner, ${ev('bday', '14 March')}. another year older`],
    ['#cfe0f0', '#4a78a8', 'ferry back from work'],
    ['#efe1c2', '#a8823a', 'the loudest beagle on the block'],
    ['#e2d6f0', '#7a5aa8', 'gym selfie, 6:40 am, regret'],
    ['#d0ece8', '#3a8f86', 'parcel mountain at the depot'],
    ['#f5d5c5', '#c4583a', 'race day, 47:12, new best'],
    ['#dde3ea', '#6a7a8c', 'first night in the new flat'],
  ].map(([a, b, c]) => `<div class="pc-c">${img(270, a, b, ';border-radius:10px')}<div class="pc-cap">${c}</div></div>`).join('')}</div>
</div>`},
  {url: 'codehost.example/nightwren', theme: 'dark', html: `
<div class="s-repo">
  <div class="rp-top"><b>⌂</b><span><b>nightwren</b></span><em>Profile</em></div>
  <div class="rp-tabs"><b>Overview</b><span>Repositories 6</span><span>Projects</span><span>Stars 41</span></div>
  <div class="rp-prof"><div class="rp-av"></div><div><div class="rp-pn">nightwren</div><div class="rp-pb">ships parcels by day, scripts by night</div><div class="rp-pl">Portvale · joined 2019</div></div></div>
  <div class="rp-files">
    <div class="rp-h"><b>parcel-route-helper</b> <i>· last commit 2 days ago</i></div>
    ${[['a91f2c0', 'fix: depot opens at 5:30 not 6'], ['7c03e1d', 'add tue/thu gym reminder lol'], ['e55b9a4', 'route: skip harbour bridge on sundays'], ['0b6d2f8', 'readme: how to run']].map(([h, m]) => `<div class="rp-f"><span class="rp-fn">● ${h}</span><span class="rp-fm">${m}</span><span class="rp-ft">2d</span></div>`).join('')}
  </div>
  <div class="rp-readme"><div class="rp-rh">commit a91f2c0</div><pre>commit a91f2c0e7d
Author: nightwren &lt;${ev('email', 'w.halloway@mail.example')}&gt;
Date:   Thu Oct 1 06:12:44

    fix: depot opens at 5:30 not 6</pre>${P('A tiny helper that plans the morning parcel route around the harbour and the old town. Nothing fancy, it just saves me ten minutes a day.')}</div>
</div>`},
  {url: 'board.portvale.example/t/new-here-running-group', theme: 'light', html: `
<div class="s-forum">
  <div class="fm-top"><b>▲ portvale board</b><span>local | events | for sale | jobs | ask</span><span class="fm-login">login</span></div>
  <div class="fm-thread">
    <div class="fm-title">new here, looking for a running group</div>
    <div class="fm-m">posted by nightwren_88 · 3 weeks ago · 14 replies</div>
    <div class="fm-body">${P(`hi all, ${ev('city', 'just moved to Portvale')} for work. I run most mornings before my shift and I'd love some company on weekends. 5k to 10k, not fast. also, any vets you'd recommend for a beagle?`)}</div>
    ${[['harbour_harriers', 'Saturdays 8am from the ferry terminal. All paces, coffee after.'], ['oldtown_jo', 'Welcome! The vet on Mill Lane is great with loud dogs.'], ['nightwren_88', 'perfect, see you saturday. the dog will judge everyone'], ['k_moreau', 'Tri club does Tuesday track sessions if you want speed work.'], ['pv_dad', 'Watch the cobbles in the old town when it rains.']].map(([u, c]) => `<div class="fm-c"><div class="fm-m">${u} · 3 weeks ago</div>${P(c)}</div>`).join('')}
  </div>
</div>`},

  // row 1
  {url: 'worknet.example/in/wren-h', theme: 'light', html: `
<div class="s-work">
  <div class="wk2-top"><b>worknet</b><div class="wk2-search">Search</div><span>Jobs</span><span>Messages</span></div>
  <div class="wk2-card">${img(150, '#b8c9dc', '#5d7896')}<div class="wk2-av"></div>
    <div class="wk2-name">Wren H.</div>
    <div class="wk2-head">${ev('work', 'Dispatcher at Kestrel Cargo')}</div>
    <div class="wk2-loc">Portvale area · 312 connections</div>
    <div class="wk2-btns"><span class="on">Connect</span><span>Message</span></div>
  </div>
  <div class="wk2-sec"><h2>About</h2>${P('I keep parcels moving. Morning shifts, route planning, and too many spreadsheets. Previously in warehouse operations.')}</div>
  <div class="wk2-sec"><h2>Experience</h2>${[['Dispatcher', 'Kestrel Cargo · Full-time', '2024 – present · Portvale'], ['Warehouse lead', 'a regional logistics firm', '2020 – 2024'], ['Picker', 'a regional logistics firm', '2018 – 2020']].map(([a, b, c]) => `<div class="wk2-x"><div class="wk2-xl"></div><div><b>${a}</b><div>${b}</div><div class="wk2-d">${c}</div></div></div>`).join('')}</div>
  <div class="wk2-sec"><h2>Skills</h2>${P('Route planning · Scheduling · Spreadsheets · Forklift licence')}</div>
</div>`},
  {url: 'chirp.example/nightwren_88', theme: 'dark', html: `
<div class="s-social s-prof">
  ${img(190, '#1b2a44', '#2d5a6a', ';border-radius:0')}
  <div class="pf-av"></div>
  <div class="pf-name">wren</div>
  <div class="pf-handle">@nightwren_88</div>
  <div class="pf-bio">6am gym club. ships parcels for a living. dog parent to ${ev('pet', 'Biscuit, the loudest beagle')} on the block</div>
  <div class="pf-meta">Joined March 2019 · <b>412</b> Following · <b>530</b> Followers</div>
  <div class="so-top"><span class="on">Posts</span><span>Replies</span><span>Media</span><span>Likes</span></div>
  ${[
    ['2h', 'biscuit stole my sandwich again. he shows no remorse', ['4', '1', '38', '610']],
    ['1d', 'leg day. tue/thu or nothing', ['2', '0', '21', '402']],
    ['2d', 'another 5k before the shift. the harbour at 6am is unreal', ['6', '3', '57', '1.1K']],
    ['4d', 'new flat, old problem: the dog has opinions about the neighbours', ['9', '2', '74', '1.4K']],
    ['1w', 'selling my old road bike if anyone local wants it', ['3', '1', '12', '380']],
  ].map(([ago, text, s]) => `<div class="so-post"><div class="so-av" style="background:#3d7bff"></div><div class="so-b"><div class="so-h"><b>wren</b><span>@nightwren_88 · ${ago}</span></div><div class="so-t">${text}</div><div class="so-s"><span>↩ ${s[0]}</span><span>⟲ ${s[1]}</span><span>♡ ${s[2]}</span><span>▥ ${s[3]}</span></div></div></div>`).join('')}
</div>`},
  {url: 'seek.example/search?q=nightwren_88', theme: 'light', html: `
<div class="s-search">
  <div class="sr-top"><span class="sr-logo">seek</span><div class="sr-box">nightwren_88<span>⌕</span></div></div>
  <div class="sr-tabs"><b>All</b><span>Images</span><span>News</span><span>Videos</span><span>Maps</span><span>More</span></div>
  <div class="sr-count">About 1,240 results (0.27 seconds)</div>
  ${[
    ['chirp.example › nightwren_88', 'wren (@nightwren_88) on chirp', '6am gym club. ships parcels for a living. dog parent to Biscuit, the loudest beagle on the block.'],
    ['namecheck.example', 'nightwren_88: username found on 7 sites', `Same avatar and bio on 7 sites. Also active as ${ev('alias', 'wren.h and n_wren')}.`],
    ['snapshots.example › nightwren_88', 'nightwren_88 · 214 photos', 'little moments. mostly the dog. sunday at the harbour, race day, new flat.'],
    ['board.portvale.example', 'new here, looking for a running group', 'posted by nightwren_88: hi all, just moved to Portvale for work. I run most mornings before my shift…'],
    ['codehost.example › nightwren', 'nightwren · 6 repositories', 'ships parcels by day, scripts by night. parcel-route-helper, gym-timer, dog-feeder.'],
    ['runloop.example › athlete › n_wren', 'n_wren · 212 runs', 'Morning Run · 5.2 km · 26:40. Most runs between 05:50 and 06:20.'],
  ].map(([site, title, snip]) => `<div class="sr-r"><div class="sr-site"><i></i>${site}</div><a>${title}</a><p>${snip}</p></div>`).join('')}
</div>`},
  {url: 'localrate.example/biz/ironyard-gym-portvale', theme: 'light', html: `
<div class="s-rev">
  <div class="rv-top"><b>★ localrate</b><div class="rv-search">gyms near Portvale</div></div>
  ${img(200, '#3a3f4a', '#8a919c')}
  <h1>IronYard Gym</h1>
  <div class="rv-st"><span class="rv-stars">★★★★☆</span> 4.4 · 186 reviews · Gym · Open 05:30–22:00</div>
  <div class="rv-tags"><span>Free weights</span><span>Early opening</span><span>Showers</span><span>Parking</span></div>
  ${[
    ['nightwren_88', '★★★★★', `${ev('gym', 'Tue/Thu at 6:40')} for two years now. Never crowded at that hour, the staff know my name and my water bottle.`],
    ['harbour_jo', '★★★★☆', 'Good equipment, small changing rooms. Busy after 17:00.'],
    ['k_moreau', '★★★★★', 'Best early opening in town. Squat racks are always free before 7.'],
    ['pv_dad', '★★★☆☆', 'Fine gym, but the music is loud and the parking is tight.'],
    ['m_lindqvist', '★★★★☆', 'Friendly, clean, fair price for a monthly pass.'],
  ].map(([u, s, t]) => `<div class="rv-r"><div class="rv-u"><i></i><b>${u}</b><span>${s}</span></div>${P(t)}</div>`).join('')}
</div>`},

  // row 2
  {url: 'runloop.example/athlete/n_wren', theme: 'dark', html: `
<div class="s-run">
  <div class="rn-top"><b>runloop</b><span>Dashboard</span><span>Explore</span><span class="rn-me">n_wren</span></div>
  <div class="rn-head"><div class="rn-av"></div><div><div class="rn-n">n_wren</div><div class="rn-m">212 runs · 1,064 km this year</div></div></div>
  <div class="rn-map"><svg viewBox="0 0 1000 420" preserveAspectRatio="none">${Array.from({length: 11}, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100 - 60}" y2="420" stroke="#1f2630" stroke-width="10"/>`).join('')}${Array.from({length: 6}, (_, i) => `<line x1="0" y1="${i * 84}" x2="1000" y2="${i * 84 + 30}" stroke="#1f2630" stroke-width="8"/>`).join('')}<path d="M 220 300 C 300 180, 430 120, 560 150 S 800 260, 760 330 S 520 380, 400 340 S 240 330, 220 300" fill="none" stroke="#ff6a3d" stroke-width="9" stroke-linejoin="round"/><circle cx="220" cy="300" r="15" fill="#4dff9a" stroke="#0f1014" stroke-width="5"/></svg></div>
  <div class="rn-act"><b>Morning Run</b><div class="rn-when">Today at 05:58 · 5.2 km · 26:40 · 5:08 /km</div>${P(`Same loop as always: ${ev('home', 'starts and ends on Alder St')}, out along the harbour and back before the shift.`)}</div>
  ${[['Morning Run', 'Yesterday at 06:04 · 5.1 km'], ['Morning Run', 'Tue at 05:52 · 5.2 km'], ['Long Run', 'Sun at 08:01 · 10.4 km'], ['Morning Run', 'Fri at 05:55 · 5.2 km']].map(([a, b]) => `<div class="rn-row"><b>${a}</b><span>${b}</span></div>`).join('')}
</div>`},
  {url: 'swapsy.example/item/road-bike-54cm', theme: 'light', html: `
<div class="s-shop">
  <div class="sh-top"><b>swapsy</b><div class="sh-search">Search Portvale</div><span>Sell</span><span>Messages</span></div>
  <div class="sh-crumbs">Portvale › Sports › Bikes</div>
  <div class="sh-grid">
    <div>${img(420, '#e3e8ee', '#8b9bb0', ';border-radius:12px')}<div class="sh-th">${[0, 1, 2, 3].map(() => img(80, '#e8ecf0', '#b0bccb', ';border-radius:8px')).join('')}</div></div>
    <div class="sh-info"><h1>Road bike, 54 cm, barely used</h1><div class="sh-pr">$240</div><div class="sh-ship">Pickup only · listed 6 days ago</div><div class="sh-btn">Message seller</div>
    ${P('Bought it for the commute, ended up running instead. New tyres, serviced in spring. Pickup near Alder St, evenings only.')}
    ${P(`Call or text: ${ev('phone', '••• ••• 41 07')}`)}
    <div class="sh-seller"><b>wren h.</b> · on swapsy since 2021 · 9 sales · replies within an hour</div></div>
  </div>
  <h2>More from this seller</h2>
  <div class="sh-th">${['#efe1c2', '#d0ece8', '#f0d8e0', '#dde3ea'].map((c) => img(110, c, '#9aa4b0', ';border-radius:8px')).join('')}</div>
</div>`},
  {url: 'vidtube.example/watch/car-tour', theme: 'dark', html: `
<div class="s-video">
  <div class="vd-top"><b>▶ vidtube</b><div class="vd-search">Search</div></div>
  ${img(470, '#2a2f38', '#6a7480', ';border-radius:16px')}
  <div class="vd-title">first car tour!! (it's not fancy)</div>
  <div class="vd-ch"><i></i><b>n_wren</b><span>48 subscribers</span><em>Subscribe</em></div>
  <div class="vd-desc"><b>1,204 views · 5 months ago</b>${P(`a quick tour of my ${ev('car', 'grey hatchback, plate ends 4K7')}. it smells like dog. it has never been washed. I love it`)}</div>
  <div class="vd-com"><b>23 comments</b>${[['harbour_jo', 'saw this parked by the harbour lol'], ['pv_dad', 'the dog in the back seat is the real star'], ['k_moreau', 'honest review, 10/10']].map(([u, c]) => `<div class="vd-cm"><i></i><div><b>@${u}</b>${P(c)}</div></div>`).join('')}</div>
</div>`},
  {url: 'leakcheck.example/?q=w.halloway%40mail.example', theme: 'dark', html: `
<div class="s-leak">
  <div class="lk-top"><b>leakcheck</b><span>Check</span><span>Notify me</span><span>About</span></div>
  <div class="lk-hero"><div class="lk-q">w.halloway@mail.example</div><div class="lk-big">Oh no: ${ev('leaks', 'found in 3 data breaches')}</div>${P('This address appeared in data leaked from the sites below. Passwords from these leaks may be reused elsewhere.')}</div>
  ${[['a fitness app', '2023', 'email, name, date of birth, workout history'], ['an online shop', '2024', 'email, phone, delivery address'], ['a local forum', '2021', 'email, username, password hash']].map(([a, y, d]) => `<div class="lk-r"><div class="lk-ic"></div><div><b>${a} · ${y}</b>${P(`Compromised data: ${d}`)}</div></div>`).join('')}
  ${P('Change these passwords, turn on two-factor sign-in, and use a password manager so one leak does not unlock the rest.')}
</div>`},
];

export default PAGES;
