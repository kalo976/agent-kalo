---
tags: [références]
---
Source : `references/2026-10-18/00_contenu-transcription.md`

# Contenu : vidéo « Websites in 2026 » (18/10/2026)

**Transcription** : aucune voix (musique seule, vérifié avec faster-whisper).

**Ce que la vidéo montre** : deux sites « immersifs » qui racontent un lieu au scroll au lieu de l'afficher en pages classiques.
1. Belgrade Arbor (belgradearbor.rs) : un dessin d'architecte devient le bâtiment réel quand on fait défiler.
2. ICG Galleries (icggallery.irisceramicagroup.com) : on « marche » dans le showroom en 3D en faisant défiler.

**La méthode à retenir** : le scroll pilote une transformation (dessin → réel, ou caméra qui avance). Outils : GSAP ScrollTrigger + Lenis, et Three.js pour la 3D.

**Ce que Claude sait maintenant faire** : un site d'une page dans ce style (skill `site-immersif`, modèle `modele-site-esquisse/`), démo Kalo publiée : https://claude.ai/artifact/7j3PPfsPE21YYvHb2zDyyV

**Ce qui manque** : pour la visite 3D façon ICG, un modèle 3D ou au moins une vidéo de visite du magasin filmée en continu.

---
# Contenu : horizonx.so (18/10/2026)
Pas de voix (site web). Ce que le site enseigne : une marque se distingue par des **traitements d'image et des fonds animés** reconnaissables (trames, glyphes, soie colorée), posés sur une interface très sobre (blanc, Inter, cartes grises).
Claude sait maintenant faire : les 4 textures et le shader aux couleurs Kalo, en direct dans une page et en export photo/vidéo (`/mnt/project-files/kalo/labo/`).
Manque : pour les héros 3D (WebGL, séquences d'images), des photos ou vidéos 360° des produits prises en magasin.

---
# Contenu : vidéos Getlayers (@textura.eu) et pub HorizonX (@marcelodesignxh) (18/10/2026)
**Transcription 03_video.mov** (anglais, faster-whisper) : « How I build websites like these in 5 minutes with Claude. First you'll need this tool for creating cinematic AI websites. It comes with a huge library of websites and layouts. »
**04_ecran.mp4** : pas de voix (musique « Liberty »), texte « Stop using Claude without this library », « Claude + Horizonx = 🤯 », « Comment "library" to get link library ».

**Ce qu'ils expliquent (le fond)** : on ne demande pas à Claude un design « de zéro » ; on lui donne un **modèle de référence précis** tiré d'une bibliothèque (Getlayers ou HorizonX), sous forme de *prompt structuré* ou par connexion MCP, et Claude reconstruit le site en quelques minutes. La DA vient de la bibliothèque, Claude fait l'exécution.
- **Getlayers** (getlayers.ai) : modèles de sites complets (Relay, Creative Director, Vesper, Kumo…), scènes 3D, dégradés interactifs, sections (carrousels, cartes), fonds animés, outils (texte animé, orbe, shaders). Prompt à copier gratuit, code source Next.js et serveur MCP sur abonnement, plugin Figma.
- **HorizonX** : même idée (déjà archivé dans `02_horizonx/`).

**Ce que Claude sait maintenant faire pour Kalo** : la même méthode avec **notre propre bibliothèque** au lieu d'un abonnement : les fiches `references/` + modèles (`modele-site-esquisse/`, `02_horizonx/modele-kalo-labo/`, affiche validée, vidéos Remotion) jouent le rôle des « layers ». Et le format vidéo publicitaire lui-même : modèle Remotion `VitrineEcran` → `kalo/videos/kalo-vitrine-ecran.mp4` (15 s : portable devant mur coloré bleu → violet → rouge, page sombre « La qualité *pour votre maison.* », page claire « NOS FAVORIS DU MOMENT » avec 4 lave-linge et prix, mur flou d'affiches, pastille jaune « Kalo.976 »).

**Ce qui manque** : pour une vraie vidéo filmée comme @textura.eu, un portable et une bande LED colorée contre un mur au magasin (5 min de tournage). Getlayers ne s'utilise qu'avec un abonnement : à décider par yakesh, pas nécessaire pour l'instant.

## 06–07 (18/10 midi) : vidéos IA « prompt + making-of »
- **Gravity build** (@pires.visuals) : 1 photo réelle + prompt en 3 blocs (plan/durée, sujet précis, ressenti + interdits) → un bâtiment qui se construit en FPV. Prompts Kalo : references/2026-10-18/06_video.style.md.
- **Genjutsu** (@keanu.visuals) : maquette 3D qui fixe le mouvement → même plan dans 7 décors. Planche making-of reproduite en Remotion : kalo/videos/kalo-planche-atelier.mp4.
- Génération Higgsfield payante : toujours demander à yakesh. Logo, prix et texte toujours incrustés par nous, jamais par l'IA.
