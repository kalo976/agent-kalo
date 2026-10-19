# Active Theory (activetheory.net) : décortiqué

Site du studio américain Active Theory (Los Angeles / Amsterdam, fondé en 2012), l'un des studios WebGL les plus primés au monde (Google Paper Planes, Spotify Wrapped, Porter Robinson Nurture…). Vu dans la vidéo @w.wearebrand de 14 à 17 s. Capturé le 18/10/2026.

## Ce qu'on voit
1. **Chargement** : un « @ » (logo) en **verre** qui tourne dans le noir, une goutte de lumière rouge qui coule, puis une explosion de **particules** colorées.
2. **Accueil** : « CREATIVE DIGITAL EXPERIENCES » en police **pixel/mono** blanche (NB Architekt) qui scintille, anneau de verre qui traverse le texte. À droite : « Founded in 2012. We blend story, art & technology… ».
3. **Work** : une **colonne vertébrale 3D** en verre irisé entourée de fleurs en particules ; les **projets sont des cartes de verre** qui flottent autour, chacune joue la vidéo du projet en transparence (Kandinsky, Harmonic State, Secret Sky, Paper Planes…). À gauche, un menu « WHAT ARE YOU LOOKING FOR? → Websites / Installations / VR-AR-AI / Multiplayer / Games ».
4. **Lab / salle de l'arbre** : une pièce sombre avec un **arbre rose en particules** sous une structure métallique, câbles, sol rocheux, lumière volumétrique rouge.
5. Pilule de navigation en haut à droite « WORK ~~~ CONTACT » avec une onde audio animée, lecteur de musique « << Song — Artist >> ».

## Comment c'est fabriqué (vérifié dans le code)
| Brique | Outil |
|---|---|
| Moteur | **Hydra**, leur propre moteur WebGL maison (pas Three.js, pas de framework web). Tout est dans `assets/js/app.<version>.js` (1,8 Mo) + un fil de calcul `hydra-thread.js`. |
| Contenu | CMS en JSON sur Google Cloud Storage (`projets-cms.json` : 65 projets avec titre, description, vidéo, couleur, tags). |
| 3D | Géométries binaires maison (`assets/geometry/*.bin`), textures **KTX2/Basis**, maillages **Draco** ; éclairage cuit dans **Blender Cycles** (`*_CyclesBake_COMBINED.ktx2`) + PBR. |
| Shaders | **174 shaders nommés** (`analyse/shaders/`) : verre (`GlassReflection`, `CleanRoomGlass`), cartes projet (`WorkItemShader`), colonne (`SpineShader`), particules (`FlowerParticleShader`, `TreeParticleShader`, `SplineParticle*`), **fluide à la souris** (`curlShader`, `divergenceShader`, `pressureShader`, `splatShader`, `vorticityShader` : simulation de fluide temps réel), bloom, reflets de lentille, lumière volumétrique. |
| Animation | **Theatre.js** (timeline d'animation éditable) + tweens maison. |
| Son | musique d'ambiance + bouton son, onde audio dans la nav. |
| Extras | assistant IA vocal intégré (OpenAI + ElevenLabs + reconnaissance vocale Vosk) dans le code. |

### Les 5 astuces qui font l'effet
1. **Cartes de verre qui jouent une vidéo** (`WorkItemShader.glsl`) : un plan qui ondule (`sin(time + x)`), penche vers la souris, et mélange la vidéo du projet (`tVideo`) avec une **réfraction** de la scène derrière (`tRefraction`) + effet **Fresnel** sur les bords. Résultat : des vitres vivantes.
2. **Particules sur des formes** : les fleurs, l'arbre, la forêt sont des **nuages de points** (`flower_spine-512.bin`, `forest-1024.bin`) animés sur GPU (positions stockées dans des textures, calculées à chaque image).
3. **Fluide qui suit la souris** : vraie simulation Navier-Stokes simplifiée en shaders (advection, divergence, pression). La vitesse du fluide déplace les particules et déforme l'image.
4. **Post-traitement cinéma** (`HomeComposite.fs`, `HydraBloom`, `LensFlare*`, `VolumetricLight.fs`) : contraste, halo lumineux, reflets d'objectif, rayons de lumière. C'est ce qui donne le côté « film ».
5. **Typo pixel qui scintille** + texte rendu dans la 3D (`msdf.glsl`, `Text3D.glsl`) : le texte vit dans la scène au lieu d'être posé dessus.

## Fichiers archivés ici
- `scroll-activetheory.mp4` (16 min, rendu logiciel lent) et `scroll-activetheory-accelere.mp4` (70 s, à regarder en premier).
- `captures/` : 14 images clés.
- `analyse/shaders/` : les 174 shaders du studio, un fichier par shader, avec leurs vrais noms.
- `code-source/activetheory.net/` : moteur, géométries, textures, polices ; `code-source/projets-cms.json`.
- `videos-projets/` : les vidéos de leurs projets (recompressées en 540p), une par projet.

## Pour Kalo / Meubles & Déco
- Hydra est privé : on ne le réutilise pas. On refait les mêmes effets avec **Three.js** (verre = `MeshPhysicalMaterial` avec `transmission`, particules = `Points` + shader, fluide = exemples « fluid simulation » libres, post-traitement = `EffectComposer` + `UnrealBloomPass`).
- Idée Kalo : les **produits sur des cartes de verre** qui jouent leur vidéo (démo clim, frigo), qu'on fait défiler. Idée Meubles & Déco : un meuble Gautier entouré de particules qui prennent la forme de la pièce.
- Étude seulement : code, modèles et vidéos appartiennent à Active Theory et à leurs clients.
