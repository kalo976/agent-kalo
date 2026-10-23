import {runSim} from '../kit/runtime.js';
import {clamp01, easeInOutCubic, lerp, rng} from '../kit/util.js';
import SITES from './sites.js';

// "Crawlers": one spider agent on a web page spawns subagents, every
// generation doubles (1 → 256), children fly out on threads to other pages,
// and the camera pulls back from one page to the whole wall. Every word a foot
// lands on lights up in that agent's colour; agents close to each other are
// joined by silk. Text on screen: three counters, nothing else.
//
// The whole run is simulated once at 60 Hz when the page loads (births,
// flights, gait, landings), so render(t) is a pure lookup: frame-exact in
// capture, seekable live. With --music, the doublings snap to the beat grid.
//
// Pages: sites.js, sixteen made-up websites (no real brands, .example domains).

const DEFAULTS = {
  duration: 20,
  fps: 60,
  theme: 'dark',
  hud: {enabled: false, title: 'crawlers', subtitle: ''},
  director: {enabled: false},
  watermark: 'X: @whaleyxbt',
  seed: 5,
  pages: SITES,
  swarm: {
    cols: 4,
    rows: 4,
    first: [1, 1], // page (col, row) where agent #1 starts
    pageH: 1500,
    gap: 90,
    gens: 8, // 2^gens agents at the end
    genStart: 2.4, // first doubling; with music it snaps to the next beat
    genEvery: 1.25, // seconds between doublings without music
    genBeats: 2, // beats between doublings with music (cfg.beats)
    spread: 0.18, // children of one generation are born within this many seconds
    stayGens: 3, // generations that land on their parent's page
    blockGens: 6, // ...then on the 2x2 block around page 1, then anywhere
    endPage: [3, 2], // the camera ends close on this page
    web: 230, // world px: agents closer than this share a thread
    counters: true,
  },
};

const W = 1080;
const DT = 1 / 60;
const PALETTE = ['#ff3db4', '#4dff9a', '#3d7bff', '#ffd23d', '#ff6a3d', '#19c3ff', '#a98bff'];
const RGB = PALETTE.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrapWords(root) {
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walk.nextNode()) texts.push(walk.currentNode);
  for (const tn of texts) {
    if (!tn.textContent.trim() || tn.parentElement.closest('.ln')) continue;
    const frag = document.createDocumentFragment();
    for (const part of tn.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
      else {
        const s = document.createElement('span');
        s.className = 'w';
        s.textContent = part;
        frag.appendChild(s);
      }
    }
    tn.replaceWith(frag);
  }
  return [...root.querySelectorAll('.w')];
}

const angWrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

/** Doubling times: every genEvery s, or every genBeats beats of the music. */
function genTimes(cfg) {
  const S = cfg.swarm;
  const b = cfg.beats && cfg.beats.beats;
  if (b && b.length) {
    const i = Math.max(0, b.findIndex((x) => x >= S.genStart));
    return [...Array(S.gens)].map((_, g) => b[Math.min(b.length - 1, i + g * S.genBeats)]);
  }
  return [...Array(S.gens)].map((_, g) => S.genStart + g * S.genEvery);
}

function simulate(cfg, words, pages) {
  const S = cfg.swarm;
  const R = rng(cfg.seed);
  const N = Math.ceil((cfg.duration + 0.2) / DT) + 1;
  const n = 2 ** S.gens;
  const firstPage = S.first[1] * S.cols + S.first[0];

  // births: generation g doubles the swarm
  const G = genTimes(cfg);
  const ag = [{born: -1, parent: -1, size: 1.35, color: 0, gen: -1}];
  for (let g = 0; g < S.gens; g++) {
    const cur = ag.length;
    for (let i = 0; i < cur; i++)
      ag.push({born: G[g] + R() * S.spread, parent: i, gen: g, size: 0.8 + R() * 0.45, color: 1 + Math.floor(R() * (PALETTE.length - 1))});
  }
  // reveal order: page 1, its 2x2 block, then the rest by distance
  const [fc, fr] = S.first;
  const block = [[fc, fr], [fc + 1, fr], [fc, fr - 1], [fc + 1, fr - 1]].map(([c, r]) => r * S.cols + c);
  const rest = pages.map((_, i) => i).filter((i) => !block.includes(i));
  rest.sort((a, b) => Math.hypot(a % S.cols - fc - 0.5, Math.floor(a / S.cols) - fr + 0.5) - Math.hypot(b % S.cols - fc - 0.5, Math.floor(b / S.cols) - fr + 0.5));
  const reveal = [...block, ...rest];
  const count = new Array(pages.length).fill(0);
  const pageWords = pages.map(() => []);
  words.forEach((w, i) => pageWords[w.page].push(i));

  const GS = 80;
  const grid = new Map();
  words.forEach((w, i) => {
    for (let gx = Math.floor(w.x / GS); gx <= Math.floor((w.x + w.w) / GS); gx++)
      for (let gy = Math.floor(w.y / GS); gy <= Math.floor((w.y + w.h) / GS); gy++) {
        const k = gx * 100000 + gy;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(i);
      }
  });
  const hit = (x, y) => {
    for (const i of grid.get(Math.floor(x / GS) * 100000 + Math.floor(y / GS)) || []) {
      const w = words[i];
      if (x >= w.x - 4 && x <= w.x + w.w + 4 && y >= w.y - 5 && y <= w.y + w.h + 5) return i;
    }
    return -1;
  };
  const wc = (i) => [words[i].x + words[i].w / 2, words[i].y + words[i].h / 2];

  const pos = new Float32Array(N * n * 3).fill(NaN); // x, y, angle per frame per agent
  const feet = new Float32Array(N * n * 16);
  const lift = new Uint8Array(N * n * 8);
  const hits = []; // [t, word, colour]
  const flights = []; // {a, t0, t1, x0, y0}

  const TH = [38, 78, 112, 148].map((d) => (d * Math.PI) / 180);
  const RR = [112, 118, 112, 104];
  const st = ag.map(() => null);
  const pickTarget = (s, near) => {
    const list = pageWords[s.page];
    for (let tries = 0; tries < 12; tries++) {
      const i = list[Math.floor(R() * list.length)];
      const [x, y] = wc(i);
      if (!near || Math.hypot(x - s.x, y - s.y) < 430) return [x, y];
    }
    return wc(list[Math.floor(R() * list.length)]);
  };
  const local = (s, lx, ly) => [s.x + Math.cos(s.ang) * lx - Math.sin(s.ang) * ly, s.y + Math.sin(s.ang) * lx + Math.cos(s.ang) * ly];
  const restOf = (s, L) => local(s, Math.cos(TH[L.j]) * RR[L.j] * s.size, L.side * Math.sin(TH[L.j]) * RR[L.j] * s.size);

  for (let f = 0; f < N; f++) {
    const t = f * DT;
    // births
    for (let a = 0; a < n; a++) {
      if (st[a] || ag[a].born > t) continue;
      const A = ag[a];
      const s = {x: 0, y: 0, ang: R() * Math.PI * 2, speed: 0, size: A.size, vmax: 230 + R() * 170, mode: 'walk', until: 0, idle: 0, tx: 0, ty: 0, page: firstPage, fly: null};
      if (A.parent < 0) {
        // start in the middle of the first view
        const pw = pageWords[firstPage];
        const top = Math.min(...pw.map((i) => words[i].y)), cx = Math.min(...pw.map((i) => words[i].x)) + 420;
        const dm = (i) => Math.hypot(words[i].y - top - 560, words[i].x - cx);
        const mid = pw.reduce((b, i) => (dm(i) < dm(b) ? i : b), pw[0]);
        [s.x, s.y] = wc(mid);
        s.ang = -0.4;
      } else {
        const p = st[A.parent];
        let page = p.page;
        if (A.gen >= S.stayGens) {
          const open = reveal.slice(0, A.gen < S.blockGens ? 4 : pages.length);
          page = open.reduce((b, i) => (count[i] < count[b] ? i : b), open[0]);
        }
        s.page = page;
        const [x1, y1] = page === p.page ? [p.x + (R() - 0.5) * 260, p.y + (R() - 0.5) * 260] : pickTarget(s, false);
        const d = Math.hypot(x1 - p.x, y1 - p.y);
        s.fly = {t0: t, t1: t + Math.min(0.95, 0.3 + d / 2600), x0: p.x, y0: p.y, x1, y1};
        flights.push({a, t0: t, t1: s.fly.t1, x0: p.x, y0: p.y});
        s.x = p.x;
        s.y = p.y;
      }
      count[s.page]++;
      [s.tx, s.ty] = pickTarget(s, true);
      s.legs = [...Array(8)].map((_, i) => {
        const L = {side: i < 4 ? -1 : 1, j: i % 4, step: false};
        L.group = (L.j + (L.side > 0 ? 1 : 0)) % 2;
        return L;
      });
      for (const L of s.legs) L.f = restOf(s, L);
      st[a] = s;
    }

    for (let a = 0; a < n; a++) {
      const s = st[a];
      if (!s) continue;
      if (s.fly) {
        const q = easeInOutCubic((t - s.fly.t0) / (s.fly.t1 - s.fly.t0));
        s.x = lerp(s.fly.x0, s.fly.x1, q);
        s.y = lerp(s.fly.y0, s.fly.y1, q);
        s.ang += 4 * DT;
        for (const L of s.legs) {
          L.f = restOf(s, L);
          L.step = false;
        }
        if (t >= s.fly.t1) {
          s.fly = null;
          [s.tx, s.ty] = pickTarget(s, true);
        }
      } else {
        const dx = s.tx - s.x, dy = s.ty - s.y;
        const dist = Math.hypot(dx, dy);
        if (s.mode === 'walk') {
          const wander = 0.4 * Math.sin(t * 2.1 + a * 1.3) * clamp01(dist / 260);
          const da = angWrap(Math.atan2(dy, dx) + wander - s.ang);
          s.ang += Math.max(-8 * DT, Math.min(8 * DT, da));
          const vt = Math.max(60, s.vmax * clamp01(dist / 130)) * Math.max(0.3, Math.cos(da));
          s.speed = lerp(s.speed, vt, 1 - Math.exp(-DT * 9));
          if (dist < 22) {
            s.mode = 'dwell';
            s.until = t + 0.12 + R() * 0.45;
          }
        } else {
          s.speed = lerp(s.speed, 0, 1 - Math.exp(-DT * 14));
          if (t >= s.until) {
            s.mode = 'walk';
            [s.tx, s.ty] = pickTarget(s, true);
          }
        }
        s.x += Math.cos(s.ang) * s.speed * DT;
        s.y += Math.sin(s.ang) * s.speed * DT;
        s.idle = s.speed < 30 ? s.idle + DT : 0;
        const busy = [false, false];
        for (const L of s.legs) if (L.step) busy[L.group] = true;
        for (const L of s.legs) {
          if (L.step) {
            const q = (t - L.t0) / L.dur;
            if (q >= 1) {
              L.step = false;
              L.f = L.to;
              const wi = hit(L.f[0], L.f[1]);
              if (wi >= 0) hits.push([t, wi, ag[a].color]);
            } else {
              const e = easeInOutCubic(q);
              L.f = [lerp(L.from[0], L.to[0], e), lerp(L.from[1], L.to[1], e)];
            }
            continue;
          }
          const r = restOf(s, L);
          const d = Math.hypot(L.f[0] - r[0], L.f[1] - r[1]);
          const thr = s.idle > 0.12 ? 14 : 56 * s.size;
          if (d > thr && (!busy[1 - L.group] || d > thr * 2.4)) {
            const lead = 0.07 * s.speed;
            L.from = L.f;
            L.to = [r[0] + Math.cos(s.ang) * lead + (R() - 0.5) * 10, r[1] + Math.sin(s.ang) * lead + (R() - 0.5) * 10];
            L.t0 = t;
            L.dur = s.idle > 0.12 ? 0.1 : 0.075;
            L.step = true;
            busy[L.group] = true;
          }
        }
      }
      const o = (f * n + a) * 3;
      pos[o] = s.x;
      pos[o + 1] = s.y;
      const prev = f ? pos[o - n * 3 + 2] : NaN;
      pos[o + 2] = Number.isNaN(prev) ? s.ang : prev + angWrap(s.ang - prev);
      s.legs.forEach((L, i) => {
        feet[(f * n + a) * 16 + i * 2] = L.f[0];
        feet[(f * n + a) * 16 + i * 2 + 1] = L.f[1];
        lift[(f * n + a) * 8 + i] = L.step ? Math.round(255 * Math.sin(Math.PI * clamp01((t - L.t0) / L.dur))) : 0;
      });
    }
  }
  return {N, n, ag, pos, feet, lift, hits, flights};
}

runSim(DEFAULTS, async ({cfg, canvas}) => {
  await Promise.all([
    document.fonts.load('400 20px "JetBrains Mono"'),
    document.fonts.load('600 20px "JetBrains Mono"'),
    document.fonts.load('700 20px "JetBrains Mono"'),
    document.fonts.load('400 20px Inter'),
    document.fonts.load('700 20px Inter'),
  ]).catch(() => {});
  document.title = 'crawlers';
  const S = cfg.swarm;
  const pagesCfg = cfg.pages.slice(0, S.cols * S.rows);

  const app = document.getElementById('app');
  const stage = document.createElement('div');
  stage.id = 'stage';
  app.appendChild(stage);
  const world = document.createElement('div');
  world.className = 'world';
  stage.appendChild(world);
  stage.appendChild(canvas);

  const pageEls = pagesCfg.map((p, i) => {
    const el = document.createElement('div');
    el.className = `page site ${p.theme}`;
    const c = i % S.cols, r = Math.floor(i / S.cols);
    el.style.left = `${c * (W + S.gap)}px`;
    el.style.top = `${r * (S.pageH + S.gap)}px`;
    el.style.height = `${S.pageH}px`;
    el.innerHTML = `<div class="chrome"><span class="dots"><b></b><b></b><b></b></span><span class="nav">‹ › ↻</span><span class="url">${esc(p.url)}</span></div><div class="content">${p.html}</div>`;
    world.appendChild(el);
    return el;
  });

  const hud = document.createElement('div');
  hud.className = 'counters';
  hud.innerHTML = `<div class="c big"><span>agents</span><b id="cA">1</b></div><div class="c"><span>pages</span><b id="cP">1</b></div><div class="c"><span>words read</span><b id="cW">0</b></div>`;
  if (S.counters) stage.appendChild(hud);
  if (cfg.watermark) {
    const wm = document.createElement('div');
    wm.className = 'wm';
    wm.textContent = cfg.watermark;
    stage.appendChild(wm);
  }

  let s = 1, VH = 1350;
  const layout = () => {
    const iw = innerWidth, ih = innerHeight;
    s = iw / ih <= 1 ? iw / W : ih / 1350;
    VH = ih / s;
    stage.style.left = `${(iw - W * s) / 2}px`;
    stage.style.height = `${VH}px`;
    stage.style.transform = `scale(${s})`;
    const dpr = devicePixelRatio || 1;
    canvas.width = Math.round(W * s * dpr);
    canvas.height = Math.round(VH * s * dpr);
  };
  layout();

  // words in world coordinates (world is untransformed while measuring)
  const wr = world.getBoundingClientRect();
  const words = [];
  pageEls.forEach((pe, pi) => {
    const pr = pe.getBoundingClientRect();
    for (const el of wrapWords(pe.querySelector('.content'))) {
      const r = el.getBoundingClientRect();
      if (r.bottom > pr.bottom - 10 || r.width === 0) continue; // clipped by the page
      words.push({el, page: pi, x: (r.left - wr.left) / s, y: (r.top - wr.top) / s, w: r.width / s, h: r.height / s});
    }
  });

  const sim = simulate(cfg, words, pagesCfg);
  const {n, ag, pos, feet, lift, flights} = sim;
  // per-word hit lists (time-sorted), first-hit times for the counter
  const wh = words.map(() => []);
  for (const h of sim.hits) wh[h[1]].push(h);
  const firsts = wh.filter((l) => l.length).map((l) => l[0][0]).sort((a, b) => a - b);
  const pageOpen = new Array(pagesCfg.length).fill(1e9);
  for (let a = 0; a < n; a++) {
    // which page each agent lives on = the page under it 1.2 s after birth
    const f = Math.min(sim.N - 1, Math.ceil((ag[a].born + 1.2) / DT));
    const x = pos[(f * n + a) * 3], y = pos[(f * n + a) * 3 + 1];
    const c = Math.floor(x / (W + S.gap)), r = Math.floor(y / (S.pageH + S.gap));
    const pi = r * S.cols + c;
    if (pi >= 0 && pi < pageOpen.length) pageOpen[pi] = Math.min(pageOpen[pi], ag[a].born);
  }
  const opens = pageOpen.filter((x) => x < 1e9).sort((a, b) => a - b);
  window.__SWARM = {agents: n, words: words.length, hits: sim.hits.length, wordsRead: firsts.length};

  // camera keyframes
  const P = (c, r) => ({x: c * (W + S.gap), y: r * (S.pageH + S.gap)});
  const [fc, fr] = S.first;
  const p0 = P(fc, fr);
  const gridW = S.cols * W + (S.cols - 1) * S.gap, gridH = S.rows * S.pageH + (S.rows - 1) * S.gap;
  const blockZ = () => Math.min((W * 0.94) / (2 * W + S.gap), (VH * 0.9) / (2 * S.pageH + S.gap));
  const wallZ = () => Math.min((W * 0.96) / gridW, (VH * 0.86) / gridH);
  // page 1 → its 2x2 block → the whole wall → back in on one page
  const GT = genTimes(cfg);
  const keys = () => {
    const pe = P(S.endPage[0], S.endPage[1]);
    const tWall = GT[S.gens - 1] + 1.0;
    const tHold = Math.max(tWall + 3, cfg.duration - 5.5);
    return [
      {t: 0, x: p0.x + W / 2, y: p0.y + VH / 2, z: 1},
      {t: GT[2], x: p0.x + W / 2, y: p0.y + VH / 2 + 220, z: 1},
      {t: GT[3] + 0.6, x: p0.x + W + S.gap / 2, y: p0.y - S.gap / 2, z: blockZ()},
      {t: GT[5] + 0.3, x: p0.x + W + S.gap / 2 + 20, y: p0.y - S.gap / 2 + 30, z: blockZ() * 0.97},
      {t: tWall, x: gridW / 2, y: gridH / 2 + 40, z: wallZ()},
      {t: tHold, x: gridW / 2 + 40, y: gridH / 2 + 30, z: wallZ() * 1.05},
      {t: cfg.duration, x: pe.x + W / 2, y: pe.y + S.pageH * 0.42, z: 0.62},
    ];
  };
  let K = keys();
  const camAt = (t) => {
    let i = 0;
    while (i < K.length - 2 && t > K[i + 1].t) i++;
    const a = K[i], b = K[i + 1];
    const q = easeInOutCubic((t - a.t) / (b.t - a.t));
    const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), q));
    return {x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), z};
  };

  const ctx = canvas.getContext('2d');
  const shown = new Array(words.length).fill('');
  const cA = hud.querySelector('#cA'), cP = hud.querySelector('#cP'), cW = hud.querySelector('#cW');
  const countLE = (arr, t) => {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (arr[m] <= t) lo = m + 1;
      else hi = m;
    }
    return lo;
  };
  const fmt = (x) => x.toLocaleString('en-US');

  return {
    resize() {
      layout();
      K = keys();
    },
    render(t) {
      const cam = camAt(t);
      world.style.transform = `translate(${W / 2 - cam.x * cam.z}px, ${VH / 2 - cam.y * cam.z}px) scale(${cam.z})`;

      // highlights: the latest hit on each word, bright when fresh
      for (let i = 0; i < words.length; i++) {
        const l = wh[i];
        let v = '';
        if (l.length && l[0][0] <= t) {
          let lo = 0, hi = l.length - 1;
          while (lo < hi) {
            const m = (lo + hi + 1) >> 1;
            if (l[m][0] <= t) lo = m;
            else hi = m - 1;
          }
          const [ht, , c] = l[lo];
          const al = Math.round((0.26 + 0.6 * Math.exp(-(t - ht) / 0.25)) * 20) / 20;
          v = `rgba(${RGB[c][0]},${RGB[c][1]},${RGB[c][2]},${al})`;
        }
        if (v !== shown[i]) {
          shown[i] = v;
          words[i].el.style.background = v;
        }
      }

      // canvas
      const fi = Math.max(0, Math.min(sim.N - 1.001, t / DT));
      const f = Math.floor(fi), a = fi - f;
      const dpr = canvas.width / (W * s);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
      ctx.clearRect(0, 0, W, VH);
      ctx.translate(W / 2 - cam.x * cam.z, VH / 2 - cam.y * cam.z);
      ctx.scale(cam.z, cam.z);
      const px = (i) => lerp(pos[(f * n + i) * 3], pos[((f + 1) * n + i) * 3], a);
      const py = (i) => lerp(pos[(f * n + i) * 3 + 1], pos[((f + 1) * n + i) * 3 + 1], a);
      const alive = [];
      for (let i = 0; i < n; i++) if (!Number.isNaN(pos[(f * n + i) * 3]) && !Number.isNaN(pos[((f + 1) * n + i) * 3])) alive.push(i);
      const X = new Float32Array(n), Y = new Float32Array(n);
      for (const i of alive) {
        X[i] = px(i);
        Y[i] = py(i);
      }
      const lw = (w) => Math.max(w, w * 0.45 / cam.z);

      // web between neighbours
      ctx.lineWidth = lw(1.2);
      for (let u = 0; u < alive.length; u++)
        for (let v = u + 1; v < alive.length; v++) {
          const i = alive[u], j = alive[v];
          const d = Math.hypot(X[i] - X[j], Y[i] - Y[j]);
          if (d > S.web) continue;
          ctx.strokeStyle = `rgba(255,61,180,${(0.5 * (1 - d / S.web)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(X[i], Y[i]);
          ctx.lineTo(X[j], Y[j]);
          ctx.stroke();
        }
      // spawn threads
      for (const fl of flights) {
        if (t < fl.t0 || t > fl.t1 + 0.35) continue;
        const fade = t > fl.t1 ? 1 - (t - fl.t1) / 0.35 : 1;
        ctx.strokeStyle = `rgba(255,255,255,${(0.85 * fade).toFixed(3)})`;
        ctx.lineWidth = lw(2);
        ctx.beginPath();
        ctx.moveTo(fl.x0, fl.y0);
        ctx.lineTo(X[fl.a], Y[fl.a]);
        ctx.stroke();
      }
      // spiders
      ctx.lineCap = 'round';
      for (const i of alive) {
        const A = ag[i];
        const ang = lerp(pos[(f * n + i) * 3 + 2], pos[((f + 1) * n + i) * 3 + 2], a);
        const x = X[i], y = Y[i], sz = A.size;
        const born = clamp01((t - A.born) / 0.25);
        const col = PALETTE[A.color], joint = PALETTE[(A.color + 3) % PALETTE.length];
        const ca = Math.cos(ang), sa = Math.sin(ang);
        const L1 = 66 * sz, L2 = 74 * sz;
        ctx.globalAlpha = born;
        ctx.strokeStyle = col;
        ctx.fillStyle = joint;
        for (let l = 0; l < 8; l++) {
          const side = l < 4 ? -1 : 1, j = l % 4;
          const HX = [16, 6, -4, -14][j] * sz;
          const hx = x + ca * HX - sa * side * 6 * sz, hy = y + sa * HX + ca * side * 6 * sz;
          const o = (f * n + i) * 16 + l * 2, o2 = ((f + 1) * n + i) * 16 + l * 2;
          const fX = lerp(feet[o], feet[o2], a), fY = lerp(feet[o + 1], feet[o2 + 1], a);
          const lf = lerp(lift[(f * n + i) * 8 + l], lift[((f + 1) * n + i) * 8 + l], a) / 255;
          const dx = fX - hx, dy = fY - hy;
          const d = Math.max(Math.abs(L1 - L2) + 1, Math.min(L1 + L2 - 1, Math.hypot(dx, dy)));
          const base = Math.atan2(dy, dx);
          const k = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
          let kx = hx + Math.cos(base + k) * L1, ky = hy + Math.sin(base + k) * L1;
          const kx2 = hx + Math.cos(base - k) * L1, ky2 = hy + Math.sin(base - k) * L1;
          if (Math.hypot(kx2 - x, ky2 - y) > Math.hypot(kx - x, ky - y)) {
            kx = kx2;
            ky = ky2;
          }
          const kd = Math.hypot(kx - x, ky - y) || 1;
          kx += ((kx - x) / kd) * lf * 12;
          ky += ((ky - y) / kd) * lf * 12;
          ctx.lineWidth = lw(3.1);
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(kx, ky);
          ctx.lineTo(fX, fY);
          ctx.stroke();
          const r = lw(4.2);
          ctx.beginPath();
          ctx.arc(kx, ky, r, 0, Math.PI * 2);
          ctx.moveTo(fX + r * 1.1, fY);
          ctx.arc(fX, fY, r * 1.1 + lf * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = 'rgba(8,9,13,0.92)';
        ctx.strokeStyle = col;
        ctx.lineWidth = lw(2.6);
        const bl = 48 * sz, bw = 17 * sz;
        ctx.beginPath();
        ctx.rect(-bl / 2, -bw / 2, bl, bw);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ff3db4';
        ctx.beginPath();
        ctx.arc(bl * 0.22, 0, Math.max(5.5 * sz, 2 / cam.z), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // counters
      let agents = 0;
      for (const A of ag) if (A.born <= t) agents++;
      cA.textContent = fmt(agents);
      cP.textContent = `${countLE(opens, t)}/${pagesCfg.length}`;
      cW.textContent = fmt(countLE(firsts, t));
      return {};
    },
  };
});
