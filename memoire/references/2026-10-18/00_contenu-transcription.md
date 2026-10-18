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

---

## 06 et 07 : vidéos IA « prompt + making-of » (@pires.visuals, @keanu.visuals), envoyées le 18/10 vers 12 h

Pas de voix : musique seule (≈118 BPM, tension montante). Tout le fond est dans le texte à l'écran.

### 06_video (@pires.visuals) : « gravity build », un immeuble qui se construit tout seul
Texte à l'écran, relevé tel quel :
> **Animation prompt.** Create a 15-second ultra dynamic continuous FPV "gravity build" construction sequence of one modern Portuguese residential tower.
> The building is a tall, slender, premium Portuguese residential apartment building, inspired by contemporary Lisbon developments such as Infinity in Sete Rios.
> It must feel elegant, realistic, high-end and residential, with light concrete / stone facade, refined balconies, realistic windows, subtle glass, clean vertical lines, no signage, no text, no hotel look.
> *Reference image* (photo de la vraie tour). En haut : « Comment "PROMPT" to get the guide ».

**Méthode expliquée** : 1 photo de référence du bâtiment réel + 1 prompt structuré en 3 blocs (① plan et durée : 15 s, FPV continu, « gravity build » ; ② quoi : le sujet décrit précisément avec une référence réelle ; ③ ressenti + interdits : élégant, réaliste, matériaux, « no signage, no text »). Le générateur vidéo (image→vidéo type Kling / Veo / Higgsfield) fait le reste : un drone FPV traverse le terrain vide, les blocs tombent du ciel, piliers et ferraillage montent, les dalles se posent, la façade se referme, puis la caméra recule sur la tour finie.

### 07_video (@keanu.visuals) : Higgsfield Genjutsu, « Reality manipulation »
Planche de travail affichée en entier :
- **ORIGINAL · BLENDER EXPORT** : une maquette grossière en rose (personnage et Porsche en pâte unie) animée dans Blender, avec le mouvement de caméra voulu.
- **HIGGSFIELD + Blender (GPT-6 Astra)** : la scène 3D est envoyée à Higgsfield Genjutsu.
- **REFERENCES** : 3 images (décor Dubaï, Porsche 911 rouge, personnage).
- **GENJUTSU CLIPS · SAME SHOT, 7 ENVIRONMENTS** : le même plan rendu 7 fois dans 7 décors.
- **FINAL EDIT** : montage des meilleurs morceaux, **SAME CAMERA MOTION** que la maquette.
- CTA : « Comment "EPIC" for the workflow sheet ».

**Méthode expliquée** : on contrôle le mouvement (caméra, personnage) avec une maquette 3D sans détails, et on laisse l'IA habiller le plan à partir d'images de référence. Un seul mouvement donne N variantes (décors, couleurs) qui se raccordent parfaitement au montage.

### Ce que Claude sait maintenant refaire pour Kalo
1. **« Gravity build » Kalo** : prompts prêts dans `06_video.style.md` (magasin Kalo de Kawéni qui se construit, cuisine équipée qui s'assemble, frigo qui se monte pièce par pièce). Il faut 1 photo de référence par prompt (vitrine, packshot) et un générateur image→vidéo : Higgsfield est connecté mais **payant en crédits, rien n'est lancé sans l'accord de yakesh**.
2. **Genjutsu Kalo** : une maquette (même un packshot sur fond uni avec mouvement de caméra Remotion) → 7 ambiances (cuisine mahoraise, salon, plage de Mayotte, studio rose Octobre rose…) avec le même mouvement ; procédure dans `07_video.style.md`. Même règle crédits.
3. **La planche « workflow sheet »** elle-même (cadres fluo, étiquettes, flèches, bande de vignettes, CTA « Commente ») : reproduite gratuitement en Remotion → `kalo/videos/kalo-planche-atelier.mp4`.
