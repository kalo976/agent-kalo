import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const produitSchema = z.object({
  fond: z.string(),
  produit: z.string(),
  specs: z.array(z.string()),
  prix: z.string(),
  classe: z.enum(["A", "B", "C", "D", "E", "F", "G"]),
  photo: z.string(),
});
type Produit = z.infer<typeof produitSchema>;

// Charte Kalo (kalo-marque)
const ROUGE = "#E2231A";
const JAUNE = "#FFD700";
const NOIR = "#0E0F0E";
const GRIS = "#6B605B";
const ENERGIE: Record<string, string> = {
  A: "#00A651", B: "#50B848", C: "#BFD730", D: "#FFF200", E: "#FDB913", F: "#F37021", G: "#ED1C24",
};
const POLICE = "'Open Sans Kalo', 'Open Sans', Arial, sans-serif";

// Police chargée en local pour un rendu identique à chaque fois
const chargement = delayRender("Police Open Sans");
new FontFace("Open Sans Kalo", `url(${staticFile("opensans-latin.woff2")}) format('woff2')`, {
  weight: "400 800",
  stretch: "75% 100%",
})
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(chargement);
  })
  .catch(() => continueRender(chargement));

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sortie = Easing.bezier(0.16, 1, 0.3, 1);

// Un mot qui monte depuis un masque, comme dans les vidéos de référence
const Mot: React.FC<{ texte: string; debut: number; style?: React.CSSProperties }> = ({ texte, debut, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - debut, fps, config: { damping: 14, stiffness: 160 } });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 6, ...style }}>
      <span style={{ display: "inline-block", translate: `0 ${interpolate(p, [0, 1], [110, 0])}%` }}>{texte}</span>
    </span>
  );
};

const Coche: React.FC<{ debut: number }> = ({ debut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - debut, fps, config: { damping: 9, stiffness: 200 } });
  const trait = interpolate(frame - debut - 4, [0, 8], [24, 0], clamp);
  return (
    <div style={{ width: 54, height: 54, borderRadius: 27, background: JAUNE, display: "flex", alignItems: "center", justifyContent: "center", scale: String(p), flexShrink: 0 }}>
      <svg width="30" height="30" viewBox="0 0 24 24">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={NOIR} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={trait} />
      </svg>
    </div>
  );
};

const Energie: React.FC<{ classe: string; frame: number }> = ({ classe, frame }) => {
  const largeurs: Record<string, number> = { A: 78, B: 93, C: 108, D: 123, E: 138, F: 153, G: 168 };
  const clignote = interpolate(Math.sin(frame / 4), [-1, 1], [0.55, 1]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 30px 0 26px", height: 210 }}>
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
            {k === classe ? (
              <span style={{ position: "absolute", left: "calc(100% + 6px)", top: -4, borderTop: "15px solid transparent", borderBottom: "15px solid transparent", borderRight: `25px solid rgba(0,0,0,${clignote})` }} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export const NouvelArrivage: React.FC<Produit> = (d) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texte = d.fond.toUpperCase() === JAUNE ? NOIR : "#fff";
  const s = (debut: number, config = { damping: 15, stiffness: 120 }) => spring({ frame: frame - debut, fps, config });

  // 0-1,7 s : titre plein écran, puis il monte en haut
  const monte = interpolate(frame, [48, 70], [0, 1], { ...clamp, easing: sortie });
  const titreY = interpolate(monte, [0, 1], [700, 270]);
  const titreEchelle = interpolate(monte, [0, 1], [1, 0.6]);
  const souligne = interpolate(frame, [20, 36], [0, 1], { ...clamp, easing: sortie });

  // 1,9 s : le produit arrive
  const produitP = s(58, { damping: 13, stiffness: 90 });
  const flotte = Math.sin((frame - 58) / 18) * 10;

  // 2,5-8,5 s : nom du produit et points forts ; ils s'effacent avant le prix
  const efface = interpolate(frame, [258, 272], [1, 0], clamp);
  const lignes = d.produit.split(/<br\s*\/?>/i);

  // 9 s : prix et classe énergie ensemble
  const prixP = s(272, { damping: 11, stiffness: 140 });
  const energieP = s(278, { damping: 15, stiffness: 120 });

  // 12,5 s : fin sur fond blanc avec le logo
  const fin = interpolate(frame, [375, 393], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const logoP = s(386, { damping: 13, stiffness: 110 });

  // Reflet lent sur le fond
  const reflet = interpolate(frame, [0, 450], [-40, 140]);

  return (
    <AbsoluteFill style={{ background: d.fond, fontFamily: POLICE, color: texte, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${reflet - 20}%, rgba(255,255,255,0.16) ${reflet}%, transparent ${reflet + 20}%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.22), transparent 62%)" }} />

      {/* Titre */}
      <div style={{ position: "absolute", left: 0, right: 0, top: titreY, textAlign: "center", scale: String(titreEchelle), transformOrigin: "50% 0" }}>
        <div style={{ fontWeight: 800, fontStretch: "75%", fontSize: 230, lineHeight: 0.86, letterSpacing: -2, textTransform: "uppercase" }}>
          <Mot texte="Nouvel" debut={2} />
          <br />
          <Mot texte="arrivage" debut={9} />
        </div>
        <div style={{ height: 16, width: 520 * souligne, background: JAUNE, margin: "18px auto 0", borderRadius: 8 }} />
      </div>

      {/* Produit */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 572, height: 498, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: interpolate(produitP, [0, 0.3], [0, 1], clamp), translate: `0 ${interpolate(produitP, [0, 1], [380, 0]) + (frame > 58 ? flotte : 0)}px`, scale: String(interpolate(produitP, [0, 1], [0.7, 1]) * interpolate(frame, [80, 375], [1, 1.04], clamp)), transformOrigin: "50% 100%" }}>
        <Img src={staticFile(d.photo)} style={{ maxHeight: 498, maxWidth: 860, filter: "drop-shadow(0 30px 26px rgba(0,0,0,0.32))" }} />
      </div>

      {/* Nom du produit */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1080, textAlign: "center", fontWeight: 800, fontStretch: "75%", fontSize: 82, lineHeight: 0.95, textTransform: "uppercase", opacity: efface }}>
        {lignes.map((l, i) => (
          <div key={i}>
            {l.trim().split(/\s+/).map((m, j) => (
              <Mot key={j} texte={m} debut={78 + i * 8 + j * 4} style={{ marginRight: 18 }} />
            ))}
          </div>
        ))}
      </div>

      {/* Points forts en cases cochées */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1262, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: efface }}>
        {d.specs.map((t, i) => {
          const debut = 118 + i * 22;
          const p = s(debut, { damping: 15, stiffness: 140 });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: "#fff", color: NOIR, borderRadius: 40, height: 74, padding: "0 30px 0 12px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", opacity: interpolate(p, [0, 0.4], [0, 1], clamp), translate: `${interpolate(p, [0, 1], [-120, 0])}px 0`, fontSize: 36, fontWeight: 600 }}>
              <Coche debut={debut + 6} />
              <span style={{ whiteSpace: "nowrap" }}>{t}</span>
            </div>
          );
        })}
      </div>

      {/* Prix */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center", opacity: interpolate(prixP, [0, 0.2], [0, 1], clamp), scale: String(interpolate(prixP, [0, 1], [1.9, 1]) * interpolate(frame, [326, 334, 344], [1, 1.07, 1], clamp)) }}>
        <div style={{ background: "#fff", borderRadius: 30, height: 200, width: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.18)", color: ROUGE, fontWeight: 800, fontStretch: "75%", fontSize: 190, letterSpacing: -3, lineHeight: 1 }}>
          {d.prix}
          <span style={{ fontSize: "0.78em", marginLeft: 16 }}>€</span>
        </div>
      </div>

      {/* Classe énergie, à l'écran en même temps que le prix */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1308, display: "flex", justifyContent: "center", opacity: interpolate(energieP, [0, 0.3], [0, 1], clamp), translate: `${interpolate(energieP, [0, 1], [500, 0])}px 0` }}>
        <div style={{ background: "#fff", borderRadius: 30, width: 600, display: "flex", justifyContent: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }}>
          <Energie classe={d.classe} frame={frame} />
        </div>
      </div>

      {/* Fin : fond blanc, logo, adresse */}
      <AbsoluteFill style={{ background: "#fff", clipPath: `circle(${fin * 120}% at 50% 60%)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", scale: String(interpolate(logoP, [0, 1], [0.6, 1])), opacity: interpolate(logoP, [0, 0.3], [0, 1], clamp) }}>
          <Img src={staticFile("logo-kalo.png")} style={{ width: 720 }} />
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1090, textAlign: "center", color: NOIR }}>
          <div style={{ fontWeight: 800, fontStretch: "75%", fontSize: 76, textTransform: "uppercase" }}>
            <Mot texte="Disponible" debut={398} style={{ marginRight: 18 }} />
            <Mot texte="en" debut={401} style={{ marginRight: 18 }} />
            <Mot texte="magasin" debut={404} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 600, color: GRIS, marginTop: 14, opacity: interpolate(frame, [410, 422], [0, 1], clamp) }}>
            53 rue du Commerce, Mamoudzou
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: ROUGE, marginTop: 26, opacity: interpolate(frame, [416, 428], [0, 1], clamp), scale: String(interpolate(frame, [416, 430], [0.8, 1], { ...clamp, easing: sortie })) }}>
            kalo.yt
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
