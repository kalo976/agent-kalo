import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// L'import charge aussi la police Open Sans (effet de bord du module)
import { produitSchema } from "./NouvelArrivage";

// Version « cinéma » du modèle Nouvel arrivage, inspirée des 4 vidéos de référence :
// étincelles et texte lumineux, mur d'images en profondeur, plateau studio avec reflet,
// montage rapide avec flashs de lumière, cartes d'interface cochées, prix qui claque, fin sur le logo.

export const cinemaSchema = produitSchema.extend({
  galerie: z.array(z.string()).optional(),
});
type Props = z.infer<typeof cinemaSchema>;

const ROUGE = "#E2231A";
const JAUNE = "#FFD700";
const NOIR = "#0E0F0E";
const ENERGIE: Record<string, string> = {
  A: "#00A651", B: "#50B848", C: "#BFD730", D: "#FFF200", E: "#FDB913", F: "#F37021", G: "#ED1C24",
};
const TUILES = ["#E2231A", "#FFD700", "#752F8A", "#009BDE"];
const POLICE = "'Open Sans Kalo', 'Open Sans', Arial, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const doux = Easing.bezier(0.16, 1, 0.3, 1);
const inout = Easing.bezier(0.65, 0, 0.35, 1);

// ---------- Éléments communs ----------

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 30} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{ force?: number }> = ({ force = 0.75 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,${force}) 100%)`, pointerEvents: "none" }} />
);

// Fuite de lumière orange et rose sur les coupes (vidéo Monaco)
const Fuite: React.FC<{ a: number }> = ({ a }) => (
  <AbsoluteFill style={{ opacity: a, mixBlendMode: "screen", pointerEvents: "none", background: "radial-gradient(ellipse at 15% 30%, rgba(255,120,40,0.95), transparent 55%), radial-gradient(ellipse at 90% 70%, rgba(255,60,140,0.8), transparent 50%), linear-gradient(100deg, rgba(255,255,255,0.35), transparent 60%)" }} />
);

// Texte qui sort du flou avec une lueur (vidéo Amazon)
const TexteLumiere: React.FC<{ texte: string; debut: number; couleur?: string; taille: number; style?: React.CSSProperties }> = ({ texte, debut, couleur = "#fff", taille, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - debut, [0, 16], [0, 1], { ...clamp, easing: doux });
  return (
    <div style={{ fontFamily: POLICE, fontWeight: 800, fontStretch: "75%", fontSize: taille, lineHeight: 0.95, color: couleur, textTransform: "uppercase", letterSpacing: interpolate(p, [0, 1], [24, -1]), filter: `blur(${interpolate(p, [0, 1], [18, 0])}px)`, opacity: p, textShadow: `0 0 ${interpolate(p, [0, 1], [60, 24])}px ${couleur === "#fff" ? "rgba(255,255,255,0.45)" : "rgba(255,215,0,0.55)"}`, ...style }}>
      {texte}
    </div>
  );
};

// Trait jaune qui se dessine sous un mot, avec une lueur
const TraitLumiere: React.FC<{ debut: number; largeur: number }> = ({ debut, largeur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - debut, [0, 14], [0, 1], { ...clamp, easing: doux });
  const L = largeur + 40;
  return (
    <svg width={L} height={60} style={{ display: "block", margin: "6px auto 0", overflow: "visible" }}>
      <defs>
        <filter id="lueur" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={`M20 34 Q ${L / 2} 10 ${L - 20} 30`} stroke={JAUNE} strokeWidth={12} strokeLinecap="round" fill="none" filter="url(#lueur)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// ---------- Scène 1 : comète, étincelles et titre lumineux ----------

const Etincelles: React.FC = () => {
  const frame = useCurrentFrame();
  const pos = (t: number) => ({
    x: interpolate(t, [0, 1], [-200, 540]),
    y: interpolate(t, [0, 1], [1400, 960]) - Math.sin(t * Math.PI) * 220,
  });
  const comete = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: inout });
  const c = pos(comete);
  const eclat = interpolate(frame, [12, 18, 60], [0, 1, 0.3], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(226,35,26,${0.15 + eclat * 0.4}), #070707 62%)` }} />
      {frame < 17 && new Array(16).fill(0).map((_, i) => {
        const p = pos(Math.max(0, comete - i * 0.022));
        return <div key={i} style={{ position: "absolute", left: p.x - 10, top: p.y - 10, width: 20, height: 20, borderRadius: 10, background: JAUNE, opacity: (1 - i / 16) * 0.9, filter: "blur(4px)", boxShadow: "0 0 30px #FF8A00" }} />;
      })}
      {frame < 17 && <div style={{ position: "absolute", left: c.x - 45, top: c.y - 45, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle, #fff, rgba(255,200,0,0.9) 30%, transparent 70%)" }} />}
      {frame >= 14 && new Array(50).fill(0).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const vit = 8 + random(`v${i}`) * 26;
        const t = frame - 14;
        const vie = interpolate(t, [0, 18 + random(`l${i}`) * 22], [1, 0], clamp);
        if (vie <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * vit * t, top: 960 + Math.sin(ang) * vit * t + 0.6 * t * t, width: 26 * vie + 4, height: 4, borderRadius: 2, background: i % 3 ? "#FFC400" : "#fff", rotate: `${ang}rad`, opacity: vie, boxShadow: "0 0 12px #FF8A00" }} />;
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <TexteLumiere texte="Nouvel" debut={14} taille={200} />
        <TexteLumiere texte="arrivage" debut={19} taille={200} couleur={JAUNE} />
        <TraitLumiere debut={26} largeur={560} />
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- Scène 2 : mur d'images en profondeur, la caméra le traverse ----------

const Mur: React.FC<{ galerie: string[]; heros: string }> = ({ galerie, heros }) => {
  const frame = useCurrentFrame();
  const avance = interpolate(frame, [0, 60], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.1, 0.8, 0.2) });
  return (
    <AbsoluteFill style={{ background: "#08090B", perspective: 1100, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,155,222,0.25), transparent 60%)" }} />
      <div style={{ position: "absolute", left: 540, top: 960, transformStyle: "preserve-3d", transform: `translateZ(${interpolate(avance, [0, 1], [-1100, 980])}px) rotateY(${interpolate(frame, [0, 60], [-18, 0])}deg) rotateZ(${interpolate(frame, [0, 60], [-4, 0])}deg)` }}>
        {new Array(35).fill(0).map((_, i) => {
          const col = (i % 5) - 2;
          const lig = Math.floor(i / 5) - 3;
          const centre = col === 0 && lig === 0;
          const z = centre ? 0 : -150 - random(`z${i}`) * 700;
          const couleur = !centre && i % 4 === 1;
          return (
            <div key={i} style={{ position: "absolute", width: 300, height: 380, left: col * 330 - 150, top: lig * 410 - 190, transform: `translateZ(${z}px)`, borderRadius: 26, background: couleur ? TUILES[Math.floor(i / 4) % 4] : "#fff", filter: centre ? "none" : `blur(${3 + Math.abs(z) / 80}px) brightness(0.55)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: centre ? "0 0 80px rgba(255,255,255,0.35)" : "none" }}>
              {couleur ? null : <Img src={staticFile(centre ? heros : galerie[i % galerie.length])} style={{ maxWidth: 250, maxHeight: 330 }} />}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [50, 60], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};

// ---------- Scène 3 : plateau studio, reflet au sol, balayage de lumière, texte cinétique ----------

const Studio: React.FC<{ d: Props }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = spring({ frame, fps, config: { damping: 16, stiffness: 70 } });
  const pousse = interpolate(frame, [0, 100], [1, 1.16]);
  const balaye = interpolate(frame, [18, 50], [-40, 140], clamp);
  const lignes = d.produit.split(/<br\s*\/?>/i).map((l) => l.trim());
  return (
    <AbsoluteFill style={{ background: "#060708", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 34% at 50% 58%, ${d.fond}bb, transparent 70%)`, opacity: interpolate(frame, [0, 30], [0.3, 1], clamp) }} />
      <div style={{ position: "absolute", left: 140, top: -200, width: 800, height: 1600, background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent 80%)", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(30px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, bottom: 0, background: "linear-gradient(180deg, #16181c, #060708 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", flexDirection: "column", alignItems: "center", scale: String(pousse * interpolate(entree, [0, 1], [0.85, 1])), opacity: entree, transformOrigin: "50% 620px" }}>
        <div style={{ position: "relative", height: 620, display: "flex", alignItems: "flex-end" }}>
          <Img src={staticFile(d.photo)} style={{ maxHeight: 620, maxWidth: 760, filter: "drop-shadow(0 0 50px rgba(255,255,255,0.18))" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile(d.photo)})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "bottom center", background: `linear-gradient(105deg, transparent ${balaye - 15}%, rgba(255,255,255,0.8) ${balaye}%, transparent ${balaye + 15}%)` }} />
        </div>
        <div style={{ height: 260, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 75%)" }}>
          <Img src={staticFile(d.photo)} style={{ maxHeight: 620, maxWidth: 760, transform: "scaleY(-1)", filter: "blur(2px)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 280, textAlign: "center" }}>
        <TexteLumiere texte={lignes[0] || ""} debut={10} taille={88} />
        <TexteLumiere texte={lignes[1] || ""} debut={18} taille={150} couleur={JAUNE} style={{ marginTop: 8 }} />
        <TraitLumiere debut={28} largeur={340} />
      </div>
      <Vignette force={0.85} />
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 8], [1, 0], clamp), background: "#fff" }} />
    </AbsoluteFill>
  );
};

// ---------- Scène 4 : montage rapide de détails, flashs de lumière, interface caméra, écran partagé ----------

const PLANS = [
  { x: 50, y: 62, z: 2.3 },
  { x: 80, y: 12, z: 3.0 },
  { x: 22, y: 10, z: 3.2 },
  { x: 50, y: 50, z: 1.1 },
  { x: 85, y: 55, z: 2.2 },
];

const Recadrage: React.FC<{ src: string; x: number; y: number; z: number; fond: string; punch: number }> = ({ src, x, y, z, fond, punch }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${fond}, #050505 85%)`, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
    <Img src={staticFile(src)} style={{ height: 1300, scale: String(z * punch), transformOrigin: `${x}% ${y}%` }} />
  </AbsoluteFill>
);

const Montage: React.FC<{ d: Props }> = ({ d }) => {
  const frame = useCurrentFrame();
  const duree = 13;
  const i = Math.min(PLANS.length - 1, Math.floor(frame / duree));
  const local = frame - i * duree;
  const grille = frame >= PLANS.length * duree;
  const g = frame - PLANS.length * duree;
  const punch = interpolate(local, [0, duree], [1.12, 1], { ...clamp, easing: doux });
  const fouet = grille ? 0 : interpolate(local, [0, 4], [1, 0], clamp);
  const rec = Math.floor(frame / 8) % 2 === 0;
  const coin = (h: "left" | "right", v: "top" | "bottom"): React.CSSProperties => ({
    position: "absolute", [h]: 70, [v]: v === "top" ? 290 : 440, width: 60, height: 60,
    [v === "top" ? "borderTop" : "borderBottom"]: "4px solid rgba(255,255,255,0.9)",
    [h === "left" ? "borderLeft" : "borderRight"]: "4px solid rgba(255,255,255,0.9)",
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {!grille ? (
        <AbsoluteFill style={{ filter: `blur(${fouet * 14}px)`, translate: `${fouet * (i % 2 ? -90 : 90)}px 0` }}>
          <Recadrage src={d.photo} {...PLANS[i]} fond={d.fond} punch={punch} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10, padding: 10, background: "#fff" }}>
          {[0, 1, 2, 4].map((k, n) => (
            <div key={k} style={{ position: "relative", borderRadius: 18, overflow: "hidden", opacity: interpolate(g - n * 3, [0, 5], [0, 1], clamp), scale: String(interpolate(g - n * 3, [0, 8], [1.15, 1], { ...clamp, easing: doux })) }}>
              <Recadrage src={d.photo} {...PLANS[k]} z={PLANS[k].z * 0.7} fond={d.fond} punch={1} />
            </div>
          ))}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ pointerEvents: "none", fontFamily: POLICE, color: "#fff" }}>
        <div style={coin("left", "top")} />
        <div style={coin("right", "top")} />
        <div style={coin("left", "bottom")} />
        <div style={coin("right", "bottom")} />
        <div style={{ position: "absolute", left: 160, top: 300, fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: ROUGE, opacity: rec ? 1 : 0.2 }} /> REC
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontWeight: 800, fontStretch: "75%", textShadow: "0 4px 30px rgba(0,0,0,0.7)", opacity: grille ? 0 : 1 }}>
          <div style={{ fontSize: 40, letterSpacing: 8 }}>MAMOUDZOU</div>
          <div style={{ fontSize: 150, lineHeight: 0.9 }}>KALO</div>
        </div>
      </AbsoluteFill>
      <Fuite a={grille ? interpolate(g, [0, 3, 10], [0.8, 0.6, 0], clamp) : interpolate(local, [0, 2, 7], [0.85, 0.6, 0], clamp)} />
    </AbsoluteFill>
  );
};

// ---------- Scène 5 : cartes d'interface cochées sous le produit ----------

const Cartes: React.FC<{ d: Props }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 33%, ${d.fond}, #07080A 72%)`, perspective: 1400, fontFamily: POLICE }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", transform: `rotateY(${interpolate(frame, [0, 100], [-16, 10])}deg)`, translate: `0 ${Math.sin(frame / 14) * 8}px` }}>
        <Img src={staticFile(d.photo)} style={{ maxHeight: 560, maxWidth: 640, filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.55))" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center" }}>
        <div style={{ background: JAUNE, color: NOIR, fontWeight: 800, fontStretch: "75%", fontSize: 46, padding: "6px 24px", borderRadius: 10, scale: String(spring({ frame: frame - 4, fps, config: { damping: 12 } })) }}>POINTS FORTS</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1020, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        {d.specs.map((t, i) => {
          const debut = 10 + i * 14;
          const p = spring({ frame: frame - debut, fps, config: { damping: 14, stiffness: 120 } });
          const coche = spring({ frame: frame - debut - 7, fps, config: { damping: 9, stiffness: 220 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.94)", color: NOIR, borderRadius: 26, height: 96, padding: "0 34px 0 20px", fontSize: 40, fontWeight: 700, boxShadow: "0 20px 40px rgba(0,0,0,0.35)", opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `rotateX(${interpolate(p, [0, 1], [70, 0])}deg)`, translate: `0 ${interpolate(p, [0, 1], [60, 0])}px` }}>
              <div style={{ width: 58, height: 58, borderRadius: 29, background: JAUNE, display: "flex", alignItems: "center", justifyContent: "center", scale: String(coche), boxShadow: "0 0 24px rgba(255,215,0,0.8)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={NOIR} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ whiteSpace: "nowrap" }}>{t}</span>
            </div>
          );
        })}
      </div>
      <Vignette force={0.6} />
    </AbsoluteFill>
  );
};

// ---------- Scène 6 : le prix claque, la classe énergie arrive en même temps ----------

const Energie: React.FC<{ classe: string }> = ({ classe }) => {
  const largeurs: Record<string, number> = { A: 78, B: 93, C: 108, D: 123, E: 138, F: 153, G: 168 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 30px 0 26px", height: 210, fontFamily: POLICE }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#000", fontWeight: 800, fontStretch: "75%", lineHeight: 1 }}>
        <span style={{ fontSize: 40 }}>CLASSE</span>
        <span style={{ fontSize: 104, margin: "4px 0 2px" }}>{classe}</span>
        <span style={{ fontSize: 32, letterSpacing: 1 }}>A à G</span>
      </div>
      <div style={{ width: 3, alignSelf: "stretch", margin: "22px 0", background: "#222" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingRight: 34 }}>
        {Object.keys(ENERGIE).map((k) => (
          <div key={k} style={{ position: "relative", height: 23, width: largeurs[k] }}>
            <span style={{ display: "block", height: 23, paddingLeft: 7, background: ENERGIE[k], color: "#fff", fontWeight: 800, fontSize: 20, lineHeight: "23px", clipPath: "polygon(0 0,calc(100% - 13px) 0,100% 50%,calc(100% - 13px) 100%,0 100%)" }}>{k}</span>
            {k === classe ? <span style={{ position: "absolute", left: "calc(100% + 6px)", top: -4, borderTop: "15px solid transparent", borderBottom: "15px solid transparent", borderRight: "25px solid #000" }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const Prix: React.FC<{ d: Props }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const choc = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 170 } });
  const tremble = frame >= 8 && frame < 20 ? Math.sin(frame * 3.1) * interpolate(frame, [8, 20], [14, 0]) : 0;
  const onde = interpolate(frame, [8, 30], [0, 1], clamp);
  const energie = spring({ frame: frame - 12, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ background: "#050505", fontFamily: POLICE, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${tremble}px ${tremble * 0.5}px` }}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [6, 14], [0, 1], clamp), background: `repeating-conic-gradient(from ${frame * 0.6}deg at 50% 50%, rgba(226,35,26,0.5) 0deg 6deg, transparent 6deg 18deg)`, WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 10%, transparent 62%)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,90,40,${0.5 * choc}), transparent 45%)` }} />
        <div style={{ position: "absolute", left: 540 - 650 * onde, top: 975 - 650 * onde, width: 1300 * onde, height: 1300 * onde, borderRadius: "50%", border: `${12 * (1 - onde)}px solid rgba(255,255,255,${1 - onde})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
          <Img src={staticFile(d.photo)} style={{ maxHeight: 520, maxWidth: 560, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.6))" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: interpolate(choc, [0, 0.2], [0, 1], clamp), scale: String(interpolate(choc, [0, 1], [3, 1])) }}>
          <div style={{ background: "#fff", borderRadius: 30, width: 640, height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: ROUGE, fontWeight: 800, fontStretch: "75%", fontSize: 220, letterSpacing: -3, lineHeight: 1, boxShadow: "0 0 90px rgba(255,120,60,0.55)" }}>
            {d.prix}
            <span style={{ fontSize: "0.78em", marginLeft: 16 }}>€</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1112, display: "flex", justifyContent: "center", opacity: interpolate(energie, [0, 0.3], [0, 1], clamp), translate: `${interpolate(energie, [0, 1], [700, 0])}px 0` }}>
          <div style={{ background: "#fff", borderRadius: 30, width: 640, display: "flex", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <Energie classe={d.classe} />
          </div>
        </div>
      </AbsoluteFill>
      <Vignette force={0.7} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [6, 8, 14], [0, 0.9, 0], clamp) }} />
    </AbsoluteFill>
  );
};

// ---------- Scène 7 : fin sur le logo ----------

const Fin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 100 } });
  const lueur = interpolate(frame, [0, 30], [0, 1], clamp);
  const raie = interpolate(frame, [0, 12], [-0.2, 1.2], { ...clamp, easing: inout });
  return (
    <AbsoluteFill style={{ background: "#070707", fontFamily: POLICE, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, rgba(226,35,26,${0.45 * lueur}), transparent 55%)` }} />
      <div style={{ position: "absolute", top: 720, left: `${raie * 100}%`, width: 900, height: 8, marginLeft: -900, background: "linear-gradient(90deg, transparent, #FFD700, #fff)", boxShadow: "0 0 40px #FFD700", borderRadius: 4, opacity: frame < 16 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", scale: String(interpolate(logo, [0, 1], [0.7, 1])), opacity: logo, filter: `blur(${interpolate(logo, [0, 1], [14, 0])}px)` }}>
        <div style={{ background: "#fff", borderRadius: 40, padding: "30px 40px", boxShadow: `0 0 ${120 * lueur}px rgba(255,255,255,0.35)` }}>
          <Img src={staticFile("logo-kalo.png")} style={{ width: 640, display: "block" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1000, textAlign: "center", color: "#fff" }}>
        <TexteLumiere texte="Disponible en magasin" debut={14} taille={80} />
        <div style={{ fontSize: 42, fontWeight: 600, color: "#d0d0d0", marginTop: 18, opacity: interpolate(frame, [22, 32], [0, 1], clamp) }}>53 rue du Commerce, Mamoudzou</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 40, opacity: interpolate(frame, [28, 38], [0, 1], clamp) }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, fontFamily: "Arial, sans-serif", color: "#fff" }}>f</div>
          <span style={{ fontSize: 46, fontWeight: 800 }}>Kalo.976</span>
          <span style={{ fontSize: 46, fontWeight: 800, color: JAUNE, marginLeft: 22 }}>kalo.yt</span>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [68, 80], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};

// ---------- Assemblage (20 s) ----------

export const NouvelArrivageCinema: React.FC<Props> = (d) => {
  const galerie = d.galerie && d.galerie.length ? d.galerie : [d.photo];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={70}><Etincelles /></Sequence>
      <Sequence from={70} durationInFrames={60}><Mur galerie={galerie} heros={d.photo} /></Sequence>
      <Sequence from={130} durationInFrames={100}><Studio d={d} /></Sequence>
      <Sequence from={230} durationInFrames={90}><Montage d={d} /></Sequence>
      <Sequence from={320} durationInFrames={100}><Cartes d={d} /></Sequence>
      <Sequence from={420} durationInFrames={100}><Prix d={d} /></Sequence>
      <Sequence from={520} durationInFrames={80}><Fin /></Sequence>
      <Grain />

      {/* Bruitages maison libres de droits ; la musique s'ajoute sur la plateforme */}
      <Audio src={staticFile("sons/nappe.wav")} volume={0.5} />
      <Sequence from={0}><Audio src={staticFile("sons/whoosh.wav")} volume={0.7} /></Sequence>
      <Sequence from={12}><Audio src={staticFile("sons/impact.wav")} volume={0.8} /></Sequence>
      <Sequence from={70}><Audio src={staticFile("sons/montee.wav")} volume={0.6} /></Sequence>
      <Sequence from={128}><Audio src={staticFile("sons/impact.wav")} volume={0.6} /></Sequence>
      {[230, 243, 256, 269, 282, 295].map((f) => (
        <Sequence key={f} from={f}><Audio src={staticFile("sons/whoosh.wav")} volume={0.45} /></Sequence>
      ))}
      {[337, 351, 365, 379].map((f) => (
        <Sequence key={f} from={f}><Audio src={staticFile("sons/tic.wav")} /></Sequence>
      ))}
      <Sequence from={402}><Audio src={staticFile("sons/montee.wav")} volume={0.5} /></Sequence>
      <Sequence from={428}><Audio src={staticFile("sons/impact.wav")} volume={1} /></Sequence>
      <Sequence from={520}><Audio src={staticFile("sons/whoosh.wav")} volume={0.6} /></Sequence>
      <Sequence from={524}><Audio src={staticFile("sons/impact.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
