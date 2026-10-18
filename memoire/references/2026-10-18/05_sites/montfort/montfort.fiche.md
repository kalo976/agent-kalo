# Montfort (mont-fort.com) : décortiqué

Site du groupe de négoce d'énergie Montfort (Genève, Dubaï, Singapour), vu dans la vidéo @w.wearebrand « Websites in 2026 » de 0 à 9 s. Primé sur Awwwards (Site of the Day). Capturé le 18/10/2026.

## Ce qu'on voit, dans l'ordre du scroll
1. **Montagne enneigée dans la brume** (vrai modèle 3D `mountains.glb`) + logo MONTFORT en capitales très espacées. Mode nuit bleue / mode jour blanc.
2. Le texte de présentation s'écrit en capitales fines pendant que **les nuages défilent** autour de la caméra.
3. **4 chapitres** (Trading, Capital, Maritime, Fort Energy), chacun : petit numéro, titre en capitales, bouton rond blanc « MONTFORT TRADING ● ». Le **pétrolier** (`boat.glb`) traverse une mer de nuages.
4. **Globe terrestre** (`earth-min.glb`) avec les 12 bureaux marqués, texte « Established in the world's major trade hubs… » avec effet de **dédoublement/glitch** des lettres.
5. **Forêt vue du ciel** (Sustainability) avec rayons de lumière, puis pied de page blanc.
- Partout : un **halo qui suit la souris** et déforme les nuages, l'herbe, les montagnes. Petits cercles et losanges fins comme repères de navigation.

## Comment c'est fabriqué (vérifié dans le code)
| Brique | Outil |
|---|---|
| Site | **Astro** (pages statiques, `_astro/`), routeur de transitions maison |
| 3D | **Three.js r169**, un seul `<canvas>` plein écran derrière le HTML |
| Scroll | **Lenis** (scroll doux) + **GSAP ScrollTrigger** (chaque section pilote `uChapter` / `uScrollProgress`) |
| Texte | **GSAP SplitText** (lettres et lignes qui apparaissent) |
| Modèles | GLB compressés **Draco / Meshopt**, textures **KTX2/Basis** (`libs/basis/`), instanciation GPU (`EXT_mesh_gpu_instancing`) pour les nuages |
| Lumière | lightmaps cuites dans Blender (`*-lightmap.webp`), carte d'environnement `envmap-min.exr` |
| Son | `sound.mp3` en ambiance (bouton son) |
| Polices | **Century Gothic** (titres) + **Josefin Sans** fine (textes) |

### Les 4 astuces qui font l'effet « cinéma »
1. **Nuages = plans 2D texturés + bruit** (shader `analyse/shaders/021_frag.glsl`) : on déforme les UV avec 2 textures de bruit qui glissent dans le temps, `smoothstep` pour le bord flou. Pas de volumétrie coûteuse.
2. **Nuages qui avancent au scroll** (`042_vert.glsl`) : chaque nuage instancié a sa profondeur `z` recalculée avec `fract(z + uScrollProgress*2.5)` : ils bouclent à l'infini quand on descend. Le vent = `sin/cos` sur la position.
3. **Trace de souris persistante** (`060_frag.glsl`) : rendu « ping-pong » dans une texture (`tLast`) : on dessine un cercle à la souris et on garde 99 % de l'image précédente, décalée par du bruit. Cette texture `tMouseComputation` est ensuite lue par tous les autres shaders (herbe, nuages, globe) pour réagir à la souris.
4. **Un seul monde 3D, des chapitres** : la caméra et `uChapter` (0 → 4) changent selon la section ; les shaders font des fondus avec `smoothstep(1., 1.3, uChapter)` au lieu de recharger des scènes.

## Fichiers archivés ici
- `scroll-montfort.mp4` : le scroll complet filmé (rendu logiciel, donc lent : 6 min).
- `captures/` : 16 images clés du scroll.
- `analyse/librairies.txt`, `analyse/modeles-3d.txt`, `analyse/shaders/` (78 shaders ; les 021 à 078 sont ceux du studio, les autres viennent de Three.js).
- `code-source/mont-fort.com/` : HTML, JS, CSS, polices, **tous les modèles 3D** (montagnes, bateau, globe, forêt, chapitres), textures, son.

## Pour Kalo / Meubles & Déco
- Reprendre la **méthode**, pas les fichiers (modèles et code appartiennent à Montfort, étude seulement).
- Idée Kalo : la mer du lagon de Mayotte à la place des nuages, et un produit phare (frigo, clim) qui apparaît dans la brume comme la montagne. Idée Meubles & Déco : un salon Gautier en 3D qui se dévoile chapitre par chapitre.
- Voir `../METHODE-sites-3D.md` pour la recette pas à pas.
