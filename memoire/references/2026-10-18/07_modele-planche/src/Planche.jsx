import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// Planche « atelier » inspirée de 07_video (@keanu.visuals), aux couleurs Kalo.
// Dessinée sur une grille 1500×2667, réduite à 1080×1920.
const C = {fond: '#0E0F0E', rouge: '#E2231A', jaune: '#FFD700', bleu: '#009BDE', violet: '#752F8A'};
const F = 'Inter Display, Inter, sans-serif';

const PRODUITS = [
  {img: 'lg-GSGV80EPLD.png', nom: 'Frigo américain LG', amb: ['#0B5E8C', '#009BDE'], w: 0.5},
  {img: 'hisense-WF1I7022BT.png', nom: 'Lave-linge Hisense 7 kg', amb: ['#4A1B5A', '#752F8A'], w: 0.68},
  {img: 'hyundai-HYRF-DCB460EB.png', nom: 'Réfrigérateur Hyundai', amb: ['#8F120C', '#E2231A'], w: 0.42},
  {img: 'hyundai-HYMW-E42C1GB.png', nom: 'Micro-ondes Hyundai', amb: ['#8A6F00', '#E6BE00'], w: 0.86},
  {img: 'moulinex-FP542111.png', nom: 'Robot Moulinex', amb: ['#1E5B3A', '#3FAE6A'], w: 0.62},
  {img: 'seb-P05306.png', nom: 'Cocotte SEB', amb: ['#7A3B12', '#E07A2E'], w: 0.66},
  {img: 'calor-SV6212C0.png', nom: 'Centrale vapeur Calor', amb: ['#123A63', '#3C7BD0'], w: 0.6},
];
const DEBUT = 30, SEG = 60, FIN = DEBUT + SEG * 7; // 30 → 450, outro jusqu'à 540
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const Pastille = ({x, y, fond, couleur = '#000', children, taille = 22, style}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', background: fond, color: couleur,
    fontFamily: F, fontWeight: 900, fontSize: taille, letterSpacing: 0.5, padding: '7px 16px', borderRadius: 5, whiteSpace: 'nowrap', textTransform: 'uppercase', ...style}}>
    {children}
  </div>
);

const Scene = ({p, t, brut}) => {
  // même mouvement de caméra dans les deux cadres
  const s = interpolate(t, [0, SEG], [0.92, 1.06]);
  const dx = interpolate(t, [0, SEG], [-14, 14]);
  const rot = interpolate(t, [0, SEG], [-2, 1.5]);
  return (
    <AbsoluteFill style={{background: brut ? '#E6E6E9' : `radial-gradient(120% 80% at 50% 30%, ${p.amb[1]} 0%, ${p.amb[0]} 70%)`, overflow: 'hidden'}}>
      {!brut && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', background: 'linear-gradient(transparent, rgba(0,0,0,.45))'}} />}
      {!brut && <div style={{position: 'absolute', inset: '-10%', background: 'repeating-linear-gradient(115deg, rgba(255,255,255,.06) 0 2px, transparent 2px 70px)', transform: `translateX(${t * 1.5}px)`}} />}
      <div style={{position: 'absolute', left: '50%', bottom: '15%', width: `${p.w * 100}%`, transform: `translateX(-50%) translateX(${dx}px) scale(${s}) rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
        <div style={{position: 'absolute', left: '8%', right: '8%', bottom: -14, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,.45)', filter: 'blur(10px)'}} />
        <Img src={staticFile(p.img)} style={{width: '100%', display: 'block', filter: brut ? 'none' : 'drop-shadow(0 20px 30px rgba(0,0,0,.35))'}} />
      </div>
    </AbsoluteFill>
  );
};

// transition en bandes diagonales (comme le Final edit de 07_video)
const Bandes = ({t, couleurs}) => {
  if (t > 11) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {[0, 1, 2].map((i) => {
        const x = interpolate(t, [i * 1.2, 9 + i], [-70, 150], {...clamp, easing: Easing.inOut(Easing.cubic)});
        return <div key={i} style={{position: 'absolute', top: '-30%', height: '160%', left: `${x - i * 22}%`, width: `${26 - i * 6}%`,
          background: [couleurs[1], '#fff', couleurs[0]][i], transform: 'skewX(-24deg)'}} />;
      })}
    </AbsoluteFill>
  );
};

const Cadre = ({x, y, w, h, bord, children, entree}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 10, overflow: 'hidden',
    border: `3px solid ${bord}`, boxShadow: `0 0 26px ${bord}40`, opacity: entree, transform: `translateY(${(1 - entree) * 40}px)`}}>
    {children}
  </div>
);

const LIENS = [
  {d: 'M 1465 2107 L 1490 2107 L 1490 357 L 1470 357', c: C.rouge, m: 'r'},
  {d: 'M 1465 2410 L 1478 2410 L 1478 640 L 1470 640', c: C.bleu, m: 'b'},
  {d: 'M 155 900 L 118 900 L 118 1785 L 150 1785', c: C.jaune, m: 'j'},
];

export const Planche = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ent = (d) => spring({frame: f - d, fps, config: {damping: 18}});
  const idx = Math.min(6, Math.max(0, Math.floor((f - DEBUT) / SEG)));
  const t = f < DEBUT ? 0 : f - DEBUT - idx * SEG;
  const p = PRODUITS[idx];
  const voile = interpolate(f, [FIN, FIN + 15], [0, 0.84], clamp);
  const logo = spring({frame: f - FIN - 8, fps, config: {damping: 12}});
  const trait = interpolate(f, [12, 42], [1, 0], clamp);

  return (
    <AbsoluteFill style={{background: C.fond, fontFamily: F}}>
      <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 30% 20%, #1d1e1d, transparent)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1500, height: 2667, transform: 'translate(-34px, 40px) scale(0.72)', transformOrigin: '0 0'}}>

        {/* liaisons à angle droit */}
        <svg width={1500} height={2667} style={{position: 'absolute', inset: 0}}>
          <defs>{LIENS.map((l) => <marker key={l.m} id={l.m} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 z" fill={l.c} /></marker>)}</defs>
          {LIENS.map((l) => <path key={l.m} d={l.d} fill="none" stroke={l.c} strokeWidth={3} markerEnd={`url(#${l.m})`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={trait} />)}
        </svg>

        {/* RÉSULTAT FINAL */}
        <Cadre x={155} y={280} w={735} h={1300} bord={C.jaune} entree={ent(0)}>
          <Scene p={p} t={t} />
          {idx > 0 && <Bandes t={t} couleurs={p.amb} />}
          <div style={{position: 'absolute', left: 30, bottom: 36, color: '#fff', fontWeight: 900, fontSize: 46, lineHeight: 1.05, textTransform: 'uppercase', textShadow: '0 3px 12px rgba(0,0,0,.45)', opacity: interpolate(t, [8, 16], [0, 1], clamp)}}>
            {p.nom}
            <div style={{fontSize: 26, fontWeight: 700, marginTop: 8, color: C.jaune, textTransform: 'none'}}>Disponible chez Kalo</div>
          </div>
        </Cadre>
        <Pastille x={522} y={280} fond={C.jaune} taille={26} style={{opacity: ent(4)}}>Résultat final</Pastille>

        {/* cartouche titre */}
        <div style={{position: 'absolute', left: 920, top: 280, width: 545, height: 155, borderRadius: 10, border: '2px solid #2b2c2b', background: '#151615', opacity: ent(6), padding: '26px 30px', boxSizing: 'border-box'}}>
          <div style={{color: C.rouge, fontWeight: 900, fontSize: 42, textTransform: 'uppercase', letterSpacing: 1}}>◀ Atelier Kalo</div>
          <div style={{color: '#B9B3AE', fontSize: 27, marginTop: 6}}>Du packshot à la vidéo</div>
        </div>

        {/* ORIGINAL */}
        <Cadre x={920} y={458} w={545} h={965} bord={C.bleu} entree={ent(10)}>
          <Scene p={p} t={t} brut />
          <Pastille x={270} y={912} fond={C.bleu} couleur="#fff" taille={21}>Original · packshot</Pastille>
        </Cadre>
        <Pastille x={905} y={740} fond="#111" couleur={C.jaune} taille={19} style={{border: `2px solid ${C.jaune}`, opacity: ent(14)}}>Même mouvement</Pastille>

        {/* appel à l'action */}
        <div style={{position: 'absolute', left: 920, top: 1445, width: 545, height: 135, border: '2px dashed #3a3b3a', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', boxSizing: 'border-box', opacity: ent(18)}}>
          <svg width="70" height="62" viewBox="0 0 70 62"><path d="M35 4C17 4 4 15 4 29c0 7 3 13 9 17l-3 12 13-7c4 1 8 2 12 2 18 0 31-11 31-24S53 4 35 4z" fill="none" stroke={C.jaune} strokeWidth="5" /><circle cx="22" cy="29" r="4" fill={C.jaune} /><circle cx="35" cy="29" r="4" fill={C.jaune} /><circle cx="48" cy="29" r="4" fill={C.jaune} /></svg>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 30, lineHeight: 1, textTransform: 'uppercase'}}>Commente<div style={{fontSize: 44, color: C.jaune}}>« Kalo »</div></div>
          <div style={{color: '#9a948f', fontSize: 22, lineHeight: 1.2}}>pour recevoir<br />les prix</div>
        </div>

        {/* bande de 7 vignettes */}
        {PRODUITS.map((q, i) => {
          const actif = i === idx && f >= DEBUT && f < FIN;
          return (
            <div key={i} style={{position: 'absolute', left: 155 + i * 187, top: 1650, width: 175, height: 270, borderRadius: 8, overflow: 'hidden',
              border: `3px solid ${actif ? C.jaune : '#2a2b2a'}`, opacity: ent(22 + i * 2) * (actif ? 1 : 0.5)}}>
              <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, ${q.amb[1]}, ${q.amb[0]})`}} />
              <Img src={staticFile(q.img)} style={{position: 'absolute', left: '50%', bottom: 24, width: `${q.w * 80}%`, transform: 'translateX(-50%)'}} />
              <div style={{position: 'absolute', left: 10, top: 8, color: '#fff', fontWeight: 900, fontSize: 26, textShadow: '0 2px 6px #000'}}>{String(i + 1).padStart(2, '0')}</div>
            </div>
          );
        })}
        <Pastille x={810} y={1622} fond={C.jaune} taille={21} style={{opacity: ent(20)}}>7 produits · même mouvement · 7 ambiances</Pastille>

        {/* références */}
        <div style={{position: 'absolute', left: 155, top: 1985, width: 1310, height: 245, border: `3px dashed ${C.rouge}`, borderRadius: 10, boxSizing: 'border-box', opacity: ent(30)}} />
        <div style={{position: 'absolute', left: 186, top: 2015, display: 'flex', gap: 24, opacity: ent(32)}}>
          <div style={{width: 400, height: 185, background: '#fff', borderRadius: 8, border: `2px solid ${C.rouge}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('logo-kalo.png')} style={{height: 165}} /></div>
          <div style={{width: 400, height: 185, borderRadius: 8, border: `2px solid ${C.rouge}`, display: 'flex', overflow: 'hidden'}}>
            {[C.rouge, C.jaune, C.violet, C.bleu, '#0E0F0E', '#6B605B'].map((c) => <div key={c} style={{flex: 1, background: c}} />)}
          </div>
          <div style={{width: 400, height: 185, borderRadius: 8, border: `2px solid ${C.rouge}`, overflow: 'hidden'}}><Img src={staticFile('planche-packshots.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
        </div>
        <Pastille x={810} y={1985} fond={C.rouge} couleur="#fff" taille={22} style={{opacity: ent(30)}}>Références</Pastille>

        {/* barre de montage */}
        <div style={{position: 'absolute', left: 155, top: 2290, width: 1310, height: 240, borderRadius: 10, border: `3px solid ${C.bleu}`, background: '#141a20', boxSizing: 'border-box', opacity: ent(36), overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 40, right: 40, top: 66, height: 38, display: 'flex', gap: 6}}>
            {PRODUITS.map((q) => <div key={q.img} style={{flex: 1, borderRadius: 5, background: `linear-gradient(90deg, ${q.amb[0]}, ${q.amb[1]})`}} />)}
          </div>
          <div style={{position: 'absolute', left: 40, right: 40, top: 118, height: 26, display: 'flex', gap: 3, alignItems: 'center'}}>
            {Array.from({length: 56}).map((_, i) => <div key={i} style={{flex: 1, background: '#2c3946', height: 6 + ((i * 37) % 18), borderRadius: 2}} />)}
          </div>
          <div style={{position: 'absolute', top: 48, height: 110, width: 4, background: C.jaune, left: 40 + interpolate(f, [DEBUT, FIN], [0, 1220], clamp)}} />
          <div style={{position: 'absolute', left: 40, top: 172, color: '#6f8396', fontSize: 23}}>00:{String(Math.floor(f / 30)).padStart(2, '0')}:{String(f % 30).padStart(2, '0')} · 1080×1920 · 30 i/s</div>
        </div>
        <Pastille x={810} y={2290} fond={C.bleu} couleur="#fff" taille={21} style={{opacity: ent(36)}}>Remotion + Kalo</Pastille>
      </div>

      {/* outro */}
      <AbsoluteFill style={{background: `rgba(10,10,10,${voile})`}} />
      {f >= FIN && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30}}>
          <div style={{background: '#fff', borderRadius: 24, padding: '30px 40px', transform: `scale(${logo})`}}><Img src={staticFile('logo-kalo.png')} style={{width: 560, display: 'block'}} /></div>
          <div style={{color: '#fff', fontWeight: 800, fontSize: 48, opacity: logo}}>kalo.yt</div>
          <div style={{color: '#cfc9c4', fontSize: 32, opacity: logo}}>6 magasins à Mayotte · Kawéni</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
