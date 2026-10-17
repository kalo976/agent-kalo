import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// L'import charge aussi la police Open Sans (effet de bord du module)
import "./NouvelArrivage";

// « Le cerveau Kalo » (22 s) : démonstration du cerveau commun des agents, au style des
// vidéos de référence du 17/10/2026 (references/2026-10-17) : accroche plein cadre qui sort du flou,
// écran partagé (carte animée en haut, résultat en bas), sous-titres serif mot à mot qui mélangent
// romain et italique avec des lettres pixelisées qui se décodent, liste en escalier,
// une seule couleur d'accent (rouge Kalo) et fin sur voile sombre avec le logo.

const ROUGE = "#E2231A";
const JAUNE = "#FFD700";
const VIOLET = "#752F8A";
const BLEU = "#009BDE";
const NOIR = "#0E0F0E";
const NUIT = "#17173A";
const SERIF = "'Instrument Serif Kalo', 'Instrument Serif', Georgia, serif";
const PIXEL = "'Silkscreen Kalo', monospace";
const SANS = "'Open Sans Kalo', 'Open Sans', Arial, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const doux = Easing.bezier(0.16, 1, 0.3, 1);

const chargement = delayRender("Polices serif et pixel");
Promise.all(
  [
    ["Instrument Serif Kalo", "instrumentserif-latin.woff2", "normal"],
    ["Instrument Serif Kalo", "instrumentserif-italic-latin.woff2", "italic"],
    ["Silkscreen Kalo", "silkscreen-latin.woff2", "normal"],
  ].map(([nom, fichier, style]) =>
    new FontFace(nom, `url(${staticFile(fichier)}) format('woff2')`, { style })
      .load()
      .then((f) => document.fonts.add(f)),
  ),
)
  .then(() => continueRender(chargement))
  .catch(() => continueRender(chargement));

// ---------- Texte : *mot* = italique, lettres pixelisées pendant 6 images ----------

const Texte: React.FC<{ t: string; debut: number; taille: number; couleur?: string; accent?: string }> = ({
  t,
  debut,
  taille,
  couleur = "#fff",
  accent,
}) => {
  const frame = useCurrentFrame();
  const age = frame - debut;
  let italique = false;
  const lettres: React.ReactNode[] = [];
  [...t].forEach((c, i) => {
    if (c === "*") {
      italique = !italique;
      return;
    }
    const pixel = age < 6 && c !== " " && random(`px-${t}-${i}-${Math.floor(age / 2)}`) < 0.45 * (1 - age / 6);
    lettres.push(
      <span
        key={i}
        style={{
          fontFamily: pixel ? PIXEL : SERIF,
          fontStyle: italique && !pixel ? "italic" : "normal",
          fontSize: pixel ? taille * 0.78 : taille,
          color: italique && accent ? accent : couleur,
        }}
      >
        {c}
      </span>,
    );
  });
  return <>{lettres}</>;
};

// Apparition : de petit et flou à net en 4 images
const entree = (age: number) => ({
  transform: `scale(${interpolate(age, [0, 4], [0.86, 1], clamp)})`,
  filter: `blur(${interpolate(age, [0, 4], [10, 0], clamp)}px)`,
  opacity: interpolate(age, [0, 2], [0, 1], clamp),
});

const OMBRE_CLAIRE = "0 0 18px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.9)";

// Sous-titres mot à mot, au-dessus des 400 px du bas (zone de sécurité Reels)
const SOUS_TITRES: [number, number, string][] = [
  [62, 82, "toute la"],
  [82, 106, "*connaissance*"],
  [106, 126, "de Kalo"],
  [126, 150, "au même *endroit*"],
  [240, 270, "et *13 agents*"],
  [270, 300, "branchés *dessus*"],
  [300, 330, "avant d'écrire"],
  [330, 356, "une seule *ligne*"],
  [356, 392, "l'agent *lit* le cerveau"],
  [392, 422, "il trouve le *prix*"],
  [422, 452, "la classe *énergie*"],
  [452, 482, "la *voix* Kalo"],
  [482, 518, "zéro *oubli*"],
  [518, 556, "zéro *invention*"],
  [556, 600, "et le gardien *range tout*"],
];

const SousTitre: React.FC = () => {
  const frame = useCurrentFrame();
  const s = SOUS_TITRES.find(([a, b]) => frame >= a && frame < b);
  if (!s) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 1405,
        textAlign: "center",
        lineHeight: 1,
        textShadow: OMBRE_CLAIRE,
        ...entree(frame - s[0]),
      }}
    >
      <Texte t={s[2]} debut={s[0]} taille={92} couleur={NOIR} />
    </div>
  );
};

// Liste en escalier : chaque élément s'ajoute sur une nouvelle ligne
const LISTE = ["la marque", "*154 produits*", "*les posts*", "les clients", "*les références*"];
const Liste: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 150 || frame >= 240) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 975 }}>
      {LISTE.map((l, i) => {
        const debut = 150 + i * 16;
        if (frame < debut) return null;
        return (
          <div
            key={l}
            style={{
              textAlign: i % 2 ? "right" : "left",
              paddingLeft: i % 2 ? 0 : i * 22,
              paddingRight: i % 2 ? i * 22 : 0,
              lineHeight: 1.02,
              textShadow: OMBRE_CLAIRE,
              ...entree(frame - debut),
            }}
          >
            <Texte t={l} debut={debut} taille={96} couleur={NOIR} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- Fond : mur clair avec taches de couleur floues (rayons du magasin) ----------

const Mur: React.FC = () => {
  const frame = useCurrentFrame();
  const taches = [
    [120, 1250, 260, ROUGE],
    [930, 1100, 300, BLEU],
    [820, 1700, 280, JAUNE],
    [200, 1780, 240, VIOLET],
  ] as const;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F1EEEA 0%, #E3DED7 100%)" }}>
      {taches.map(([x, y, r, c], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - r + Math.sin(frame / 50 + i) * 20,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: c,
            opacity: 0.16,
            filter: "blur(90px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------- Carte du haut : le graphe du cerveau ----------

const W = 960;
const H = 680;
const CX = W / 2;
const CY = H / 2 - 4;
const ILES: [string, string][] = [
  ["Marque", ROUGE],
  ["Produits", BLEU],
  ["Contenus", JAUNE],
  ["Clients", VIOLET],
  ["Calendrier", BLEU],
  ["Références", ROUGE],
];
const AGENTS = [
  "chef-com", "marque", "calendrier", "visuel", "community", "opérations",
  "post-facebook", "vidéo", "stats", "avis", "whatsapp", "fiches", "veille",
];
const CIBLE = 6; // post-facebook, en bas de la carte

const pos = (i: number, n: number, rx: number, ry: number, decalage = -Math.PI / 2) => {
  const a = decalage + (i / n) * Math.PI * 2;
  return [CX + Math.cos(a) * rx, CY + Math.sin(a) * ry] as const;
};

const Graphe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [60, 560], [1, 1.05]);
  const pulse = 1 + Math.sin(frame / 6) * 0.04;
  const [tx, ty] = pos(CIBLE, AGENTS.length, 360, 250);
  return (
    <svg width={W} height={H} style={{ transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
      <defs>
        <radialGradient id="halo">
          <stop offset="0%" stopColor="#FF8FD8" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FF8FD8" stopOpacity={0} />
        </radialGradient>
      </defs>
      {Array.from({ length: 40 }).map((_, i) => (
        <circle
          key={i}
          cx={random(`sx${i}`) * W}
          cy={random(`sy${i}`) * H}
          r={1 + random(`sr${i}`) * 1.5}
          fill="#fff"
          opacity={0.25 + 0.25 * Math.sin(frame / 10 + i)}
        />
      ))}
      {/* liens cerveau → agents */}
      {AGENTS.map((a, i) => {
        const p = spring({ frame: frame - (240 + i * 3), fps, config: { damping: 14 } });
        const [x, y] = pos(i, AGENTS.length, 360, 250);
        const actif = i === CIBLE && frame >= 300 && frame < 560;
        return (
          <line
            key={a}
            x1={CX}
            y1={CY}
            x2={CX + (x - CX) * p}
            y2={CY + (y - CY) * p}
            stroke={actif ? "#FF8FD8" : "#8C8CD8"}
            strokeWidth={actif ? 4 : 1.5}
            opacity={actif ? 0.9 : 0.45}
          />
        );
      })}
      {/* îles du cerveau */}
      {ILES.map(([nom, c], i) => {
        const p = spring({ frame: frame - (90 + i * 10), fps, config: { damping: 11 } });
        const [x, y] = pos(i, ILES.length, 200, 160, -Math.PI / 2 + Math.PI / 6);
        return (
          <g key={nom}>
            <line x1={CX} y1={CY} x2={CX + (x - CX) * p} y2={CY + (y - CY) * p} stroke={c} strokeWidth={2} opacity={0.6} />
            <g transform={`translate(${x} ${y}) scale(${p})`}>
              <rect x={-82} y={-26} width={164} height={52} rx={14} fill={c} />
              <text x={0} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill={c === JAUNE ? NOIR : "#fff"}>
                {nom}
              </text>
            </g>
          </g>
        );
      })}
      {/* cerveau central */}
      <circle cx={CX} cy={CY} r={120 * pulse} fill="url(#halo)" />
      {[0, 1, 2].map((k) => {
        const t = ((frame + k * 20) % 60) / 60;
        return <circle key={k} cx={CX} cy={CY} r={50 + t * 90} fill="none" stroke="#FF8FD8" strokeWidth={2} opacity={(1 - t) * 0.6} />;
      })}
      <circle cx={CX} cy={CY} r={54} fill="#2C1E52" stroke="#FF8FD8" strokeWidth={3} />
      <text x={CX} y={CY + 16} textAnchor="middle" fontSize={46}>
        🧠
      </text>
      <text x={CX} y={CY - 72} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={34} fill="#fff">
        cerveau Kalo
      </text>
      {/* agents */}
      {AGENTS.map((a, i) => {
        const p = spring({ frame: frame - (240 + i * 3), fps, config: { damping: 12 } });
        const [x, y] = pos(i, AGENTS.length, 360, 250);
        const actif = i === CIBLE && frame >= 300 && frame < 560;
        return (
          <g key={a} transform={`translate(${x} ${y}) scale(${p * (actif ? 1.25 : 1)})`}>
            <circle r={actif ? 22 : 16} fill={actif ? ROUGE : "#3B3B7A"} stroke="#fff" strokeWidth={2} />
            <text y={actif ? 48 : 38} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={actif ? 24 : 19} fill="#fff">
              {a}
            </text>
          </g>
        );
      })}
      {/* particules : les données partent du cerveau jusqu'à l'agent */}
      {frame >= 300 &&
        frame < 400 &&
        Array.from({ length: 14 }).map((_, k) => {
          const t = ((frame - 300 + k * 7) % 30) / 30;
          const dev = Math.sin(t * Math.PI) * (random(`dv${k}`) - 0.5) * 60;
          return (
            <circle
              key={k}
              cx={CX + (tx - CX) * t + dev}
              cy={CY + (ty - CY) * t - dev * 0.5}
              r={5}
              fill={k % 2 ? "#FF8FD8" : JAUNE}
              opacity={Math.sin(t * Math.PI)}
            />
          );
        })}
    </svg>
  );
};

const Carte: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 60 || frame >= 580) return null;
  // entrée en zoom avec flou, sortie en se réduisant
  const e = interpolate(frame, [60, 68], [0, 1], { ...clamp, easing: doux });
  const s = interpolate(frame, [560, 576], [0, 1], { ...clamp, easing: doux });
  const echelle = interpolate(e, [0, 1], [1.7, 1]) * interpolate(s, [0, 1], [1, 0.82]);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 230,
        width: W,
        height: H,
        borderRadius: 28,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 45%, #2A2A62 0%, ${NUIT} 75%)`,
        boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        transform: `scale(${echelle})`,
        filter: `blur(${interpolate(e, [0, 1], [16, 0]) + s * 12}px)`,
        opacity: interpolate(e, [0, 0.3], [0, 1], clamp) * (1 - s),
      }}
    >
      <Graphe />
      <div style={{ position: "absolute", left: 28, top: 22, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,0.75)" }}>
        kalo/cerveau · 42 notes reliées
      </div>
    </div>
  );
};

// ---------- Bas : le post écrit par l'agent, avec ce qu'il a lu dans le cerveau ----------

const POST = "Nouveau chez Kalo : le lave-linge Hisense 7 kg. Le linge d'une famille de 4 en une seule fois. 379 € · classe E.";
const PREUVES: [number, string][] = [
  [392, "Prix : catalogue kalo.yt"],
  [422, "Classe énergie : fiche produit"],
  [452, "Voix : identité Kalo"],
];

const Post: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < 372 || frame >= 576) return null;
  const p = spring({ frame: frame - 372, fps, config: { damping: 16 } });
  const n = Math.floor(interpolate(frame, [380, 470], [0, POST.length], clamp));
  const sortie = interpolate(frame, [560, 576], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 960, transform: `translateY(${(1 - p) * 120}px)`, opacity: p * sortie }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "24px 28px", boxShadow: "0 20px 50px rgba(0,0,0,0.18)", display: "flex", gap: 22 }}>
        <Img src={staticFile("packshots/hisense-WF1I7022BWJ.png")} style={{ width: 140, height: 170, objectFit: "contain" }} />
        <div style={{ flex: 1, fontFamily: SANS }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Img src={staticFile("logo-kalo.png")} style={{ height: 30 }} />
            <span style={{ fontWeight: 700, fontSize: 22, color: "#555" }}>Kalo.976 · agent post-facebook</span>
          </div>
          <div style={{ fontSize: 27, lineHeight: 1.3, color: NOIR, minHeight: 140 }}>
            {POST.slice(0, n)}
            <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18, justifyContent: "center" }}>
        {PREUVES.map(([debut, t]) => {
          const q = spring({ frame: frame - debut, fps, config: { damping: 12 } });
          return (
            <div
              key={t}
              style={{ transform: `scale(${q})`, background: NUIT, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 22, padding: "10px 16px", borderRadius: 40 }}
            >
              <span style={{ color: JAUNE }}>✓</span> {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Titres plein cadre (respirations) ----------

const Titre: React.FC<{ debut: number; fin: number; lignes: string[]; top: number; accent?: string }> = ({ debut, fin, lignes, top, accent }) => {
  const frame = useCurrentFrame();
  if (frame < debut || frame >= fin) return null;
  const sortie = interpolate(frame, [fin - 6, fin], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", opacity: sortie }}>
      {lignes.map((l, i) => (
        <div key={l} style={{ lineHeight: 1, textShadow: OMBRE_CLAIRE, ...entree(frame - debut - i * 5) }}>
          <Texte t={l} debut={debut + i * 5} taille={150} couleur={NOIR} accent={accent} />
        </div>
      ))}
    </div>
  );
};

// ---------- Fin : voile sombre et logo ----------

const Fin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < 610) return null;
  const voile = interpolate(frame, [610, 622], [0, 0.78], clamp);
  const p = spring({ frame: frame - 616, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: `rgba(10,10,12,${voile})`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
        <div style={{ background: "#fff", borderRadius: 30, padding: "26px 40px", display: "inline-block" }}>
          <Img src={staticFile("logo-kalo.png")} style={{ height: 120 }} />
        </div>
        <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: "#fff" }}>
          LA QUALITÉ POUR VOTRE MAISON
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CerveauKalo: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Mur />
      <Titre debut={0} fin={62} lignes={["Je *te* présente", "le *cerveau* Kalo"]} top={560} />
      <Carte />
      <Liste />
      <Post />
      <SousTitre />
      <Titre debut={576} fin={616} lignes={["Le cerveau", "*Kalo*"]} top={540} accent={ROUGE} />
      <Fin />
    </AbsoluteFill>
  );
};
