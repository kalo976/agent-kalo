import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
// L'import charge aussi la police Open Sans (effet de bord du module)
import "./NouvelArrivage";

// Modèle « Vitrine écran » (#enregistre du 18/10/2026, vidéo @textura.eu / Getlayers) :
// un ordinateur portable filmé devant un mur crépi éclairé par une lumière colorée qui change,
// texte blanc fin en haut, l'écran fait défiler deux pages au style « site cinéma »,
// puis un mur flou d'affiches et une pastille jaune au nom de la page Facebook.

// Polices chargées en local (Instrument Serif italique, JetBrains Mono) pour un rendu identique à chaque fois
const SERIF = "'Instrument Serif Kalo', Georgia, serif";
const MONO = "'JetBrains Mono Kalo', 'DejaVu Sans Mono', monospace";
const chargement = delayRender("Polices vitrine");
Promise.all([
  new FontFace("Instrument Serif Kalo", `url(${staticFile("instrumentserif-italic-latin.woff2")}) format('woff2')`, { style: "italic" }).load(),
  new FontFace("JetBrains Mono Kalo", `url(${staticFile("jetbrainsmono-latin.woff2")}) format('woff2')`, { weight: "100 800" }).load(),
])
  .then((polices) => {
    polices.forEach((f) => document.fonts.add(f));
    continueRender(chargement);
  })
  .catch(() => continueRender(chargement));
const POLICE = "'Open Sans Kalo', 'Open Sans', Arial, sans-serif";

const ROUGE = "#E2231A";
const JAUNE = "#FFD700";
const VIOLET = "#752F8A";
const BLEU = "#009BDE";
const NOIR = "#0E0F0E";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const doux = Easing.bezier(0.16, 1, 0.3, 1);
const inout = Easing.bezier(0.65, 0, 0.35, 1);

const PRODUITS = [
  { photo: "packshots/hisense-WF1I6022BT.png", nom: "Hisense 6 kg", prix: "319" },
  { photo: "packshots/hisense-WF1I7022BWJ.png", nom: "Hisense 7 kg", prix: "379" },
  { photo: "packshots/hyundai-HYWM-1040E.png", nom: "Hyundai 10 kg", prix: "499" },
  { photo: "packshots/lg-F14X71WHST.png", nom: "LG 11 kg", prix: "899" },
];
const AFFICHES = [
  "affiches/a-hisense-7kg-blanc.jpg",
  "affiches/a-2026-10-16_P04_lavage_gamme_1080x1080.jpg",
  "affiches/a-hyundai-10kg.jpg",
  "affiches/a-hisense-6kg-noir.jpg",
  "affiches/a-hisense-7kg-titane.jpg",
];

// interpolateColors rend « rgba(r, g, b, a) » : on en tire la même couleur avec une autre opacité
const alpha = (c: string, a: number) => c.replace(/rgba?\(([^,]+),([^,]+),([^,)]+)(,[^)]+)?\)/, `rgba($1,$2,$3,${a})`);

// ---------- Mur crépi éclairé ----------
const Mur: React.FC<{ couleur: string }> = ({ couleur }) => (
  <AbsoluteFill style={{ background: "#050505" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 70% at 50% 18%, ${couleur} 0%, ${alpha(couleur, 0.6)} 35%, #000 85%)` }} />
    {/* relief du crépi : bruit fractal en lumière rasante */}
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.55 }}>
      <svg width="100%" height="100%">
        <filter id="crepi">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={5} seed={7} />
          <feDiffuseLighting lightingColor="#fff" surfaceScale={3}>
            <feDistantLight azimuth={235} elevation={38} />
          </feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter="url(#crepi)" />
      </svg>
    </AbsoluteFill>
    {/* plateau de table sombre */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1450, bottom: 0, background: `linear-gradient(180deg, ${alpha(couleur, 0.2)}, #050505 40%)` }} />
  </AbsoluteFill>
);

// ---------- Page 1 : héros sombre avec rubans de lumière (façon « Relay ») ----------
const PageSombre: React.FC<{ t: number }> = ({ t }) => {
  const p = interpolate(t, [0, 20], [0, 1], { ...clamp, easing: doux });
  return (
    <AbsoluteFill style={{ background: "#07080a", overflow: "hidden" }}>
      {/* rubans de lumière rouge et jaune qui ondulent */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 360 + i * 30, top: -200, width: 120 - i * 18, height: 1100, borderRadius: 200, background: `linear-gradient(180deg, transparent, ${i % 2 ? JAUNE : ROUGE}, transparent)`, filter: `blur(${18 + i * 8}px)`, opacity: 0.55 - i * 0.08, transform: `rotate(${32 + Math.sin((t + i * 20) / 22) * 9}deg) translateX(${Math.sin((t + i * 9) / 17) * 40}px)` }} />
      ))}
      <div style={{ position: "absolute", top: 24, left: 34, right: 34, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 13, color: "#cfcfcf" }}>
        <Img src={staticFile("logo-kalo.png")} style={{ height: 26 }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 30 }}>
          <span>Lavage</span><span>Froid</span><span>TV &amp; Son</span><span>Clim</span>
        </div>
        <span style={{ background: JAUNE, color: NOIR, padding: "6px 14px", borderRadius: 20 }}>Nous trouver</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 150, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 12, color: JAUNE, letterSpacing: 1, marginBottom: 14 }}>● MAGASIN OUVERT · MAMOUDZOU</div>
        <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 64, lineHeight: 1, color: "#f4f4f4", letterSpacing: -2 }}>La qualité</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, lineHeight: 1.05, color: "#f4f4f4" }}>pour votre maison.</div>
        <div style={{ fontFamily: MONO, fontSize: 13, color: "#9a9a9a", marginTop: 18, width: 340, lineHeight: 1.5 }}>Électroménager, TV et climatisation. Livré chez vous et suivi par notre SAV à Mayotte.</div>
      </div>
      {/* carte d'interface en verre, à droite */}
      <div style={{ position: "absolute", right: 46, top: 250, width: 300, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: MONO, fontSize: 13, color: "#ddd", opacity: interpolate(t, [18, 34], [0, 1], clamp) }}>
        {["Conseil en magasin", "Livraison à domicile", "SAV sur place"].map((l, i) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <span>{l}</span>
            <span style={{ color: JAUNE, opacity: interpolate(t, [30 + i * 8, 36 + i * 8], [0, 1], clamp) }}>✓</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Page 2 : vitrine claire en gros caractères (façon « brewns ») ----------
const PageClaire: React.FC<{ t: number }> = ({ t }) => {
  const defile = interpolate(t, [10, 70], [0, -40], { ...clamp, easing: inout });
  return (
    <AbsoluteFill style={{ background: "#f3f3f1", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 22, left: 34, right: 34, display: "flex", fontFamily: MONO, fontSize: 12, color: "#333", gap: 26 }}>
        <span>BOUTIQUE</span><span>GAMMES</span><span>MAGASIN</span>
        <span style={{ flex: 1, textAlign: "center", fontFamily: POLICE, fontWeight: 800, fontSize: 18, color: ROUGE }}>kalo</span>
        <span>KALO.YT</span>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${defile}px)` }}>
        <div style={{ position: "absolute", left: 40, top: 90, fontFamily: MONO, fontSize: 12, color: "#555" }}>// LAVAGE</div>
        <div style={{ position: "absolute", left: 38, top: 112, fontFamily: POLICE, fontWeight: 800, fontStretch: "75%", fontSize: 76, lineHeight: 0.92, color: NOIR, letterSpacing: -2, textTransform: "uppercase" }}>
          {["Nos favoris", "du moment"].map((l, i) => (
            <div key={l} style={{ opacity: interpolate(t, [i * 5, i * 5 + 12], [0, 1], clamp), transform: `translateY(${interpolate(t, [i * 5, i * 5 + 12], [26, 0], { ...clamp, easing: doux })}px)` }}>{l}</div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 560, top: 150, width: 240, fontFamily: MONO, fontSize: 11, color: "#333", lineHeight: 1.5, textTransform: "uppercase" }}>Lave-linge choisis pour le climat de Mayotte. Livrés et installés.</div>
        <div style={{ position: "absolute", left: 34, right: 34, top: 300, display: "flex", gap: 14 }}>
          {PRODUITS.map((pr, i) => {
            const a = interpolate(t, [14 + i * 5, 28 + i * 5], [0, 1], { ...clamp, easing: doux });
            return (
              <div key={pr.photo} style={{ flex: 1, height: 250, border: "1px solid #cfcfcb", background: "#fff", position: "relative", opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
                <div style={{ position: "absolute", top: 8, left: 10, fontFamily: MONO, fontSize: 10, color: "#888" }}>0{i + 1}</div>
                <Img src={staticFile(pr.photo)} style={{ position: "absolute", left: "50%", top: 30, height: 160, transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: NOIR, textTransform: "uppercase" }}>
                  <span>{pr.nom}</span><span style={{ color: ROUGE, fontWeight: 500 }}>{pr.prix} €</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Ordinateur portable en 3/4 ----------
const Portable: React.FC<{ frame: number; couleur: string }> = ({ frame, couleur }) => {
  const W = 900, H = 570;
  const page = frame < 30 ? 0 : frame < 140 ? 1 : 2;
  // léger mouvement de caméra à la main + poussée lente
  const zoom = interpolate(frame, [0, 300], [1, 1.06], clamp);
  const derive = Math.sin(frame / 40) * 6;
  return (
    <div style={{ position: "absolute", left: 545, top: 1130, transform: `translate(-50%, -50%) scale(${zoom * 0.92}) translateX(${derive}px)`, perspective: 1800 }}>
      <div style={{ transform: "rotateX(9deg) rotateY(-14deg) rotateZ(-1deg)", transformStyle: "preserve-3d" }}>
        {/* écran */}
        <div style={{ width: W + 30, height: H + 34, padding: "16px 15px 18px", boxSizing: "border-box", background: "#111", borderRadius: "22px 22px 6px 6px", boxShadow: `0 0 0 2px #2a2a2a, 0 40px 120px ${alpha(couleur, 0.4)}`, position: "relative" }}>
          <div style={{ width: W, height: H, overflow: "hidden", position: "relative", borderRadius: 4 }}>
            {page === 0 && (
              <AbsoluteFill style={{ background: JAUNE, alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: NOIR, color: JAUNE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 18, transform: `scale(${1 + Math.sin(frame / 4) * 0.08})` }}>»</div>
              </AbsoluteFill>
            )}
            {page === 1 && <PageSombre t={frame - 30} />}
            {page === 2 && <PageClaire t={frame - 140} />}
            {/* reflet de la vitre */}
            <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, transparent 35%)", pointerEvents: "none" }} />
          </div>
        </div>
        {/* clavier */}
        <div style={{ width: W + 30, height: 260, marginTop: -2, background: "linear-gradient(180deg, #4a4a52, #26262b)", transform: "rotateX(64deg)", transformOrigin: "top", borderRadius: "4px 4px 26px 26px", boxShadow: "0 30px 60px rgba(0,0,0,0.8)", position: "relative" }}>
          <div style={{ position: "absolute", inset: "22px 60px 90px", background: "repeating-linear-gradient(90deg, #0d0d10 0 52px, transparent 52px 58px), repeating-linear-gradient(0deg, #0d0d10 0 22px, transparent 22px 28px)", opacity: 0.9, borderRadius: 6 }} />
          <div style={{ position: "absolute", left: "33%", right: "33%", bottom: 14, height: 62, borderRadius: 10, background: "#232327" }} />
        </div>
      </div>
    </div>
  );
};

// ---------- Fin : mur flou d'affiches et pastille ----------
const Fin: React.FC = () => {
  const t = useCurrentFrame();
  const entree = interpolate(t, [0, 18], [0, 1], { ...clamp, easing: doux });
  const pastille = interpolate(t, [14, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const tuiles = Array.from({ length: 15 }, (_, i) => AFFICHES[i % AFFICHES.length]);
  return (
    <AbsoluteFill style={{ background: "#0b0a12", opacity: entree }}>
      {/* grand mur flou derrière */}
      <AbsoluteFill style={{ filter: "blur(26px) brightness(0.3)", transform: `scale(1.3) translateY(${-t * 1.2}px)` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: 20 }}>
          {tuiles.map((a, i) => <Img key={i} src={staticFile(a)} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />)}
        </div>
      </AbsoluteFill>
      {/* bande nette de vignettes, comme la bibliothèque de modèles */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 560, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, transform: `translateY(${-t * 2.2}px) scale(${interpolate(t, [0, 30], [1.15, 1], { ...clamp, easing: doux })})` }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i}>
              <Img src={staticFile(AFFICHES[(i * 3) % AFFICHES.length])} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <div style={{ fontFamily: MONO, fontSize: 15, color: "#bbb", padding: "6px 4px 10px", display: "flex", justifyContent: "space-between" }}>
                <span>Lavage</span><span style={{ color: "#777" }}>Kalo.976</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* pastille jaune avec tuile d'application */}
      <div style={{ position: "absolute", left: 540, top: 1210, transform: `translate(-50%, -50%) scale(${pastille})`, display: "flex", alignItems: "center", gap: 34, background: JAUNE, borderRadius: 34, padding: "18px 64px 18px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 118, height: 118, borderRadius: 26, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("logo-kalo.png")} style={{ width: 96 }} />
        </div>
        <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 92, color: NOIR, letterSpacing: -2, whiteSpace: "nowrap" }}>Kalo.976</div>
      </div>
      <div style={{ position: "absolute", top: 1360, width: "100%", textAlign: "center", fontFamily: POLICE, fontSize: 40, color: "#fff", opacity: interpolate(t, [34, 48], [0, 1], clamp) }}>53 rue du Commerce, Mamoudzou</div>
    </AbsoluteFill>
  );
};

export const VitrineEcran: React.FC = () => {
  const frame = useCurrentFrame();
  // la lumière du mur passe du bleu au violet puis au rouge Kalo (vert → jaune → orange dans la référence)
  const couleur = interpolateColors(frame, [0, 120, 180, 300], [BLEU, BLEU, VIOLET, ROUGE]);
  const finScene = interpolate(frame, [296, 316], [0, 1], clamp);
  const premiere = frame < 120;
  const legende = premiere ? "Nos nouveautés,\nà voir sur notre page" : "Regardez jusqu'au bout";
  const fondu = premiere ? interpolate(frame, [0, 12], [0, 1], clamp) : interpolate(frame, [120, 132], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: `blur(${finScene * 30}px)`, transform: `scale(${1 + finScene * 0.15})` }}>
        <Mur couleur={couleur} />
        <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", whiteSpace: "pre-line", fontFamily: POLICE, fontWeight: 400, fontSize: 56, lineHeight: 1.18, color: "#fff", letterSpacing: -0.5, textShadow: "0 2px 18px rgba(0,0,0,0.35)", opacity: fondu }}>{legende}</div>
        <div style={{ position: "absolute", top: 410, right: 70, textAlign: "right", color: "#fff" }}>
          <div style={{ display: "inline-flex", width: 54, height: 54, borderRadius: 14, background: "#1877F2", alignItems: "center", justifyContent: "center", fontFamily: POLICE, fontWeight: 800, fontSize: 40 }}>f</div>
          <div style={{ fontFamily: POLICE, fontWeight: 700, fontStretch: "75%", fontSize: 26, marginTop: 8, letterSpacing: 0.5 }}>KALO.976</div>
        </div>
        <Portable frame={frame} couleur={couleur} />
      </AbsoluteFill>
      <Sequence from={300}><Fin /></Sequence>
      <Sequence from={28} durationInFrames={20}><Audio src={staticFile("sons/whoosh.wav")} volume={0.5} /></Sequence>
      <Sequence from={138} durationInFrames={20}><Audio src={staticFile("sons/whoosh.wav")} volume={0.5} /></Sequence>
      <Sequence from={296}><Audio src={staticFile("sons/montee.wav")} volume={0.45} /></Sequence>
      <Sequence from={316} durationInFrames={30}><Audio src={staticFile("sons/impact.wav")} volume={0.6} /></Sequence>
      <Audio src={staticFile("sons/nappe.wav")} volume={0.25} />
    </AbsoluteFill>
  );
};
